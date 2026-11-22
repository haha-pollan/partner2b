import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
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
      <div style={{ overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px clamp(36px,9vw,120px)" }}>
            <h1 className="h1big">Blog</h1>
            <p style={{ margin: "24px 0 0", maxWidth: 620, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>
              Practical articles on B2B partner programs, ecosystems and co-selling
            </p>
          </div>
        </div>
      </div>
      <section style={{ padding: "clamp(36px,9vw,90px) 0 clamp(36px,9vw,120px)" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 36 }}>
          {all.map((a, i) => (
            <Link key={a.slug} href={`/post/${a.slug}`} style={{ flex: "1 1 340px", maxWidth: 420, display: "flex", flexDirection: "column", gap: 18 }}>
              <Cover slug={a.slug} title={a.title} i={i} />
              <div style={{ fontSize: 14, fontWeight: 400, color: "#85868B" }}>{dateLabel(a.published_at)}</div>
              <h2 style={{ fontWeight: 400, fontSize: 19, letterSpacing: 0, lineHeight: 1.3 }}>{a.title}</h2>
            </Link>
          ))}
        </div>
      </section>
      <BuilderCta />
      <Footer />
    </div>
  );
}
