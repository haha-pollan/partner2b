import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Cover } from "@/components/Cover";
import { getArticle, getArticles, dateLabel } from "@/lib/articles";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return {
    title: `${a.title} | Partner2B`,
    description: a.description ?? undefined,
    alternates: { canonical: `/post/${a.slug}` },
    openGraph: { title: a.title, description: a.description ?? undefined, type: "article", publishedTime: a.published_at },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const more = (await getArticles()).filter((x) => x.slug !== a.slug).slice(0, 3);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.published_at,
    description: a.description,
    author: { "@type": "Organization", name: "Partner2B" },
    publisher: { "@type": "Organization", name: "Partner2B" },
    mainEntityOfPage: `https://partner2b.com/post/${a.slug}`,
  };
  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 130% no-repeat" }}>
        <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
          <div className="limepanel" />
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px 80px", display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 520px", maxWidth: 760 }}>
              <Link href="/post" className="pill">All articles</Link>
              <h1 style={{ margin: "20px 0 0", fontWeight: 800, fontSize: "clamp(30px,3.6vw,52px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>{a.title}</h1>
              <p style={{ margin: "18px 0 0", fontSize: 16, fontWeight: 700 }}>{dateLabel(a.published_at)}</p>
            </div>
            <div style={{ flex: "0 0 380px", maxWidth: "100%", transform: "rotate(3deg)", marginTop: 16 }}>
              <Cover slug={a.slug} title={a.title} />
            </div>
          </div>
        </div>
      </div>
      <section style={{ background: "#131416", color: "#ECECEE", padding: "80px 0 100px" }}>
        <article className="wrap prose" dangerouslySetInnerHTML={{ __html: a.content_html ?? "" }} />
      </section>
      <section style={{ padding: "90px 0", color: "#ECECEE" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 800, fontSize: 40, letterSpacing: "-0.04em" }}>More articles</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 36 }}>
            {more.map((m) => (
              <Link key={m.slug} href={`/post/${m.slug}`} style={{ flex: "1 1 300px", maxWidth: 400, display: "flex", flexDirection: "column", gap: 14 }}>
                <Cover slug={m.slug} title={m.title} />
                <h3 style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", lineHeight: 1.2 }}>{m.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "#A8FF5C", color: "#0A0A0B", padding: "80px 0" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <h2 style={{ flex: "1 1 420px", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>Want to grow through partners?</h2>
          <Link href="/services" style={{ background: "#0A0A0B", color: "#A8FF5C", fontWeight: 800, padding: "16px 30px", borderRadius: 12, fontSize: 16 }}>See our services</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
