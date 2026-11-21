// Reads a company's public homepage for a brand colour and a logo. Everything falls back safely.
const BAD_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.)/;

export function hexOk(c: string) { return /^#[0-9a-f]{6}$/i.test(c); }
export function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
const norm = (c: string) => { const t = c.trim().toLowerCase(); if (/^#[0-9a-f]{3}$/.test(t)) return "#" + t.slice(1).split("").map((x) => x + x).join(""); return hexOk(t) ? t : ""; };
// A usable accent is neither near-white nor near-black, so it works as a fill with white text.
export function usable(c: string) { const l = lum(c); return l > 0.02 && l < 0.55; }

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1] ?? "";

async function getImage(url: string): Promise<string> {
  try {
    const u = new globalThis.URL(url);
    if (!/^https?:$/.test(u.protocol) || BAD_HOST.test(u.hostname)) return "";
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
    const res = await fetch(u.toString(), { signal: ctl.signal, redirect: "follow", cache: "no-store", headers: { "User-Agent": "Partner2BBot/1.0 (+https://partner2b.com)" } });
    clearTimeout(t);
    if (!res.ok) return "";
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100 || buf.length > 400_000) return "";
    const png = buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    const jpg = buf[0] === 0xff && buf[1] === 0xd8;
    if (!png && !jpg) return "";
    return `data:image/${png ? "png" : "jpeg"};base64,${buf.toString("base64")}`;
  } catch { return ""; }
}

export async function fetchBrand(website: string): Promise<{ color: string; logo: string }> {
  let color = "", logo = "";
  try {
    const u = new globalThis.URL(website);
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 5000);
    const res = await fetch(u.toString(), { signal: ctl.signal, redirect: "follow", cache: "no-store", headers: { "User-Agent": "Partner2BBot/1.0 (+https://partner2b.com)", Accept: "text/html" } });
    clearTimeout(t);
    const final = new globalThis.URL(res.url);
    if (res.ok && !BAD_HOST.test(final.hostname)) {
      const html = (await res.text()).slice(0, 200000);
      const metas = html.match(/<meta[^>]*>/gi) ?? [];
      for (const m of metas) {
        const n = attr(m, "name").toLowerCase();
        if (n === "theme-color" || n === "msapplication-tilecolor") { const c = norm(attr(m, "content")); if (c && usable(c)) { color = c; break; } }
      }
      const links = (html.match(/<link[^>]*>/gi) ?? []).filter((l) => /rel=["'][^"']*icon/i.test(l));
      const cand = links.map((l) => ({ href: attr(l, "href"), apple: /apple-touch/i.test(l), size: parseInt((attr(l, "sizes").split("x")[0]) || "0", 10) || 0 }))
        .filter((c) => c.href && !/\.svg(\?|$)/i.test(c.href) && !/\.ico(\?|$)/i.test(c.href))
        .sort((a, b) => Number(b.apple) - Number(a.apple) || b.size - a.size);
      for (const c of cand.slice(0, 3)) { try { logo = await getImage(new globalThis.URL(c.href, final).toString()); } catch { logo = ""; } if (logo) break; }
    }
    if (!logo) logo = await getImage(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`);
  } catch { /* fall back to defaults */ }
  return { color, logo };
}

export function cleanBrand(raw: { color?: unknown; logo?: unknown }): { color: string; logo: string } {
  const c = norm(String(raw.color ?? ""));
  const color = c && usable(c) ? c : "";
  const l = String(raw.logo ?? "");
  const logo = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(l) && l.length < 560_000 ? l : "";
  return { color, logo };
}
