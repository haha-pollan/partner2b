import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { Cover } from "@/components/Cover";
import { getArticles, dateLabel } from "@/lib/articles";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Partner Marketing Blog | Partner Program Insights | Partner2B",
  description: "Partner marketing blog: B2B partner programs, partner ecosystems, co-marketing, co-selling, marketplaces and channel growth strategy.",
  alternates: { canonical: "/post" },
};

export default async function PostIndex() {
  const all = await getArticles();
  return (
    <div style={{ overflow: "hidden" }}>
      <PageHero layout="banner" title="Blog" accent="" sub="Practical articles on B2B partner programs, ecosystems and co-selling" />
      <section style={{ padding: "clamp(36px,9vw,90px) 0 clamp(36px,9vw,120px)" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 36 }}>
          {all.map((a, i) => (
            <Link key={a.slug} href={`/post/${a.slug}`} style={{ flex: "1 1 340px", maxWidth: 420, display: "flex", flexDirection: "column", gap: 20 }}>
              <Cover slug={a.slug} title={a.title} i={i} />
              <div style={{ fontSize: 14, fontWeight: 400, color: "#85868B" }}>{dateLabel(a.published_at)}</div>
              <h2 className="cardtitle">{a.title}</h2>
            </Link>
          ))}
        </div>
      </section>
      <BuilderCta />
      <Footer />
    </div>
  );
}
