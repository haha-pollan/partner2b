import type { MetadataRoute } from "next";
import { getPrograms } from "@/lib/programs";
import { getArticles } from "@/lib/articles";
import { AI_CATEGORIES } from "@/lib/ai";
import { TERMS } from "@/lib/glossary";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const all = await getPrograms();
  const posts = await getArticles();
  return [
    { url: "https://partner2b.com/directory" },
    { url: "https://partner2b.com/ai-tools" },
    { url: "https://partner2b.com/program-builder" },
    { url: "https://partner2b.com/partner-pipeline-calculator" },
    { url: "https://partner2b.com/partner-program-assessment" },
    { url: "https://partner2b.com/ai" },
    ...AI_CATEGORIES.map((c) => ({ url: `https://partner2b.com/ai/${c.slug}` })),
    { url: "https://partner2b.com/services" },
    { url: "https://partner2b.com/glossary" },
    ...TERMS.map((t) => ({ url: `https://partner2b.com/glossary/${t.slug}` })),
    { url: "https://partner2b.com/about-us" },
    { url: "https://partner2b.com/contact" },
    { url: "https://partner2b.com/playbook" },
    { url: "https://partner2b.com/post" },
    { url: "https://partner2b.com/privacy" },
    { url: "https://partner2b.com/submit" },
    { url: "https://partner2b.com/claim" },
    { url: "https://partner2b.com/terms" },
    ...posts.map((a) => ({ url: `https://partner2b.com/post/${a.slug}`, lastModified: a.published_at })),
    ...all.map((p) => ({ url: `https://partner2b.com/directory/${p.slug}` })),
  ];
}
