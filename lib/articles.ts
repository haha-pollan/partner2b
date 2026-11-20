import { URL, KEY } from "./programs";

export type Article = {
  slug: string;
  title: string;
  published_at: string;
  description: string | null;
  content_html?: string | null;
};

export async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${URL}/rest/v1/articles?select=slug,title,published_at,description&published=eq.true&order=published_at.desc&limit=500`, {
      headers: { apikey: KEY },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${URL}/rest/v1/articles?select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`, {
      headers: { apikey: KEY },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export const dateLabel = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// Cover design: one of six palettes and glyph kinds, chosen from the slug so it stays stable
const PALETTES: { bg: string; fg: string; accent: string; kind: string }[] = [
  { bg: "#A8FF5C", fg: "#0A0A0B", accent: "#0A0A0B", kind: "diamond" },
  { bg: "#0A0A0B", fg: "#ECECEE", accent: "#A8FF5C", kind: "bars" },
  { bg: "#ECECEE", fg: "#0A0A0B", accent: "#0A0A0B", kind: "grid" },
  { bg: "#1C1D20", fg: "#ECECEE", accent: "#A8FF5C", kind: "slants" },
  { bg: "#A8FF5C", fg: "#0A0A0B", accent: "#0A0A0B", kind: "hex" },
  { bg: "#3A3B40", fg: "#ECECEE", accent: "#A8FF5C", kind: "stairs" },
];
export function coverFor(slug: string, i?: number) {
  if (i !== undefined) return PALETTES[i % PALETTES.length];
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTES[h % PALETTES.length];
}
