import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Cover } from "@/components/Cover";
import { getArticles, dateLabel } from "@/lib/articles";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Partner Marketing Blog | Partner Program Insights | Partner2B",
  description: "Articles on B2B partner programs, partner ecosystems, co-selling and channel growth from Partner2B.",
  alternates: { canonical: "/post" },
};

export default async function PostIndex() {
  const all = await getArticles();
  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 130% no-repeat" }}>
        <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
          <div className="limepanel" />
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px 120px" }}>
            <h1 className="h1big">Blog</h1>
            <p style={{ margin: "24px 0 0", maxWidth: 620, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>
              Practical articles on B2B partner programs, ecosystems and co-selling
            </p>
          </div>
        </div>
      </div>
      <section style={{ background: "#131416", color: "#ECECEE", padding: "90px 0 120px" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 36 }}>
          {all.map((a, i) => (
            <Link key={a.slug} href={`/post/${a.slug}`} style={{ flex: "1 1 340px", maxWidth: 420, display: "flex", flexDirection: "column", gap: 18 }}>
              <Cover slug={a.slug} title={a.title} i={i} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#85868B" }}>{dateLabel(a.published_at)}</div>
              <h2 style={{ fontWeight: 400, fontSize: 13, letterSpacing: 0, lineHeight: 1.2 }}>{a.title}</h2>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
