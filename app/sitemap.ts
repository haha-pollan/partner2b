import type { MetadataRoute } from "next";
import { getPrograms } from "@/lib/programs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const all = await getPrograms();
  return [
    { url: "https://partner2b.com/directory" },
    { url: "https://partner2b.com/privacy" },
    { url: "https://partner2b.com/submit" },
    { url: "https://partner2b.com/claim" },
    { url: "https://partner2b.com/report" },
    { url: "https://partner2b.com/terms" },
    ...all.map((p) => ({ url: `https://partner2b.com/directory/${p.slug}` })),
  ];
}
