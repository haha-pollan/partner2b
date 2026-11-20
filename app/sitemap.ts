import type { MetadataRoute } from "next";
import { getPrograms } from "@/lib/programs";
import { getArticles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const all = await getPrograms();
  const posts = await getArticles();
  return [
    { url: "https://partner2b.com/directory" },
    { url: "https://partner2b.com/services" },
    { url: "https://partner2b.com/post" },
    { url: "https://partner2b.com/privacy" },
    { url: "https://partner2b.com/submit" },
    { url: "https://partner2b.com/claim" },
    { url: "https://partner2b.com/report" },
    { url: "https://partner2b.com/terms" },
    ...posts.map((a) => ({ url: `https://partner2b.com/post/${a.slug}`, lastModified: a.published_at })),
    ...all.map((p) => ({ url: `https://partner2b.com/directory/${p.slug}` })),
  ];
}
