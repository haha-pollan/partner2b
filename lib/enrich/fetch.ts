import dns from "node:dns/promises";
import net from "node:net";

// Polite, safe fetching of public web pages for the enrichment job.
// It refuses private addresses, follows only a few redirects, caps the size, and respects robots.txt.
export const BOT_UA = "Partner2BBot/1.0 (+https://partner2b.com)";

function privateV4(ip: string) {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n))) return true;
  const [a, b] = p;
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}
function privateIp(ip: string) {
  if (net.isIPv4(ip)) return privateV4(ip);
  const l = ip.toLowerCase();
  if (l === "::1" || l === "::" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe8") || l.startsWith("fe9") || l.startsWith("fea") || l.startsWith("feb")) return true;
  const m = l.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? privateV4(m[1]) : false;
}
async function publicHost(host: string) {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return false;
  if (net.isIP(h)) return !privateIp(h);
  try {
    const addrs = await dns.lookup(h, { all: true });
    return addrs.length > 0 && addrs.every((a) => !privateIp(a.address));
  } catch { return false; }
}

export type Page = { ok: boolean; status: number; url: string; html: string; error?: string };

export async function safeGet(url: string, opts: { maxBytes?: number; timeoutMs?: number; accept?: string } = {}): Promise<Page> {
  const maxBytes = opts.maxBytes ?? 1_500_000;
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    let u: URL;
    try { u = new URL(current); } catch { return { ok: false, status: 0, url: current, html: "", error: "bad url" }; }
    if (!/^https?:$/.test(u.protocol) || (u.port && u.port !== "80" && u.port !== "443")) return { ok: false, status: 0, url: current, html: "", error: "blocked url" };
    if (!(await publicHost(u.hostname))) return { ok: false, status: 0, url: current, html: "", error: "blocked host" };
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), opts.timeoutMs ?? 12_000);
    try {
      const res = await fetch(u, { redirect: "manual", signal: ctl.signal, headers: { "User-Agent": BOT_UA, Accept: opts.accept ?? "text/html,application/xhtml+xml,text/plain" } });
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) { current = new URL(res.headers.get("location")!, u).toString(); continue; }
      const type = res.headers.get("content-type") || "";
      if (!res.ok) return { ok: false, status: res.status, url: current, html: "", error: `http ${res.status}` };
      if (type && !/text\/|xml/.test(type)) return { ok: false, status: res.status, url: current, html: "", error: "not a web page" };
      const reader = res.body?.getReader(); const dec = new TextDecoder(); let html = ""; let bytes = 0;
      if (!reader) return { ok: false, status: res.status, url: current, html: "", error: "empty" };
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.length; html += dec.decode(value, { stream: true });
        if (bytes >= maxBytes) { await reader.cancel(); break; }
      }
      return { ok: true, status: res.status, url: current, html };
    } catch (e) {
      return { ok: false, status: 0, url: current, html: "", error: e instanceof Error && e.name === "AbortError" ? "timeout" : "fetch failed" };
    } finally { clearTimeout(timer); }
  }
  return { ok: false, status: 0, url: current, html: "", error: "too many redirects" };
}

// robots.txt: honour Disallow for our bot name or for everyone. Longest matching rule wins, Allow beats Disallow on a tie.
const robotsCache = new Map<string, { allow: string[]; disallow: string[]; blockAll: boolean }>();
export function parseRobots(txt: string) {
  const groups: { agents: string[]; allow: string[]; disallow: string[] }[] = [];
  let cur: { agents: string[]; allow: string[]; disallow: string[] } | null = null; let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim(); const i = line.indexOf(":");
    if (i < 0) continue;
    const k = line.slice(0, i).trim().toLowerCase(); const v = line.slice(i + 1).trim();
    if (k === "user-agent") { if (!cur || !lastWasAgent) { cur = { agents: [], allow: [], disallow: [] }; groups.push(cur); } cur.agents.push(v.toLowerCase()); lastWasAgent = true; continue; }
    lastWasAgent = false;
    if (!cur) continue;
    if (k === "disallow" && v) cur.disallow.push(v);
    if (k === "allow" && v) cur.allow.push(v);
  }
  const mine = groups.find((g) => g.agents.some((a) => a.includes("partner2bbot"))) ?? groups.find((g) => g.agents.includes("*"));
  return { allow: mine?.allow ?? [], disallow: mine?.disallow ?? [], blockAll: false };
}
const ruleHit = (rule: string, path: string) => {
  const re = new RegExp("^" + rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
  return re.test(path);
};
export async function allowedByRobots(url: string): Promise<boolean> {
  let u: URL; try { u = new URL(url); } catch { return false; }
  let r = robotsCache.get(u.origin);
  if (!r) {
    const res = await safeGet(`${u.origin}/robots.txt`, { maxBytes: 200_000, timeoutMs: 6000, accept: "text/plain" });
    r = res.ok ? parseRobots(res.html) : { allow: [], disallow: [], blockAll: res.status >= 500 };
    robotsCache.set(u.origin, r);
  }
  if (r.blockAll) return false;
  const path = u.pathname + u.search;
  const best = (rules: string[]) => rules.filter((x) => ruleHit(x, path)).reduce((m, x) => Math.max(m, x.length), -1);
  const d = best(r.disallow), a = best(r.allow);
  return d < 0 || a >= d;
}

const ENT: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&nbsp;": " " };
const decode = (s: string) => s.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => ENT[m] ?? m);

export type Extracted = { title: string; description: string; text: string; links: { text: string; href: string }[] };
export function extract(html: string, base: string, maxText = 6000): Extracted {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim()).slice(0, 200);
  const description = decode((html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] ?? "").trim()).slice(0, 400);
  const links: { text: string; href: string }[] = []; const seen = new Set<string>();
  for (const m of html.matchAll(/<a\s[^>]*href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    if (links.length >= 400) break;
    const href = m[1].trim(); if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    let abs: string; try { const au = new URL(decode(href), base); au.hash = ""; abs = au.toString(); } catch { continue; }
    if (!/^https?:/.test(abs) || seen.has(abs)) continue;
    const text = decode(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 80) || (m[2].match(/alt=["']([^"']+)["']/i)?.[1] ?? "").slice(0, 80);
    seen.add(abs); links.push({ text, href: abs });
  }
  const text = decode(html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<(script|style|noscript|svg|template|iframe)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, maxText);
  return { title, description, text, links };
}

export const hostOf = (url: string) => { try { return new URL(url).host.toLowerCase().replace(/^www\./, ""); } catch { return ""; } };

// Domains that are never a company's own site for our purposes.
export const SKIP_HOSTS = ["linkedin.com", "facebook.com", "twitter.com", "x.com", "instagram.com", "youtube.com", "youtu.be", "github.com", "google.com", "goo.gl", "wikipedia.org", "medium.com", "crunchbase.com", "g2.com", "capterra.com", "clutch.co", "apple.com", "play.google.com", "bit.ly", "t.co", "wa.me", "tiktok.com", "reddit.com", "calendly.com"];
export const skipHost = (h: string) => !h || SKIP_HOSTS.some((s) => h === s || h.endsWith("." + s));
