import { siteKeywords, type Site } from "./engine";

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const meta = (html: string, key: string) => {
  const a = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]*content=["']([^"']*)["']`, "i"));
  const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${key}["']`, "i"));
  return decode((a?.[1] ?? b?.[1] ?? ""));
};

export async function fetchSite(url: string): Promise<Site> {
  const u = new globalThis.URL(url);
  const domain = u.hostname.replace(/^www\./, "");
  const fallbackName = domain.split(".")[0].replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let name = "", description = "";
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 5000);
    const res = await fetch(u.toString(), { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": "Partner2BBot/1.0 (+https://partner2b.com)", Accept: "text/html" }, cache: "no-store" });
    clearTimeout(t);
    const final = new globalThis.URL(res.url);
    if (res.ok && /^https?:$/.test(final.protocol) && !/^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(final.hostname)) {
      const html = (await res.text()).slice(0, 200000);
      const site = meta(html, "og:site_name");
      const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "");
      name = site || (title.split(/\s[|\-:]\s|\s[–—]\s/)[0] ?? "").slice(0, 60);
      description = (meta(html, "description") || meta(html, "og:description")).slice(0, 300);
    }
  } catch { /* fall back to the domain */ }
  if (!name || name.length < 2) name = fallbackName;
  description = description.replace(/—|–/g, ", ").replace(/!/g, ".");
  return { domain, name: name.replace(/—|–/g, ",").replace(/!/g, ""), description, keywords: siteKeywords(name, description) };
}
