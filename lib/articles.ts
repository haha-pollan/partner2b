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
