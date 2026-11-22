import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { Cover } from "@/components/Cover";
import { getArticle, getArticles, dateLabel } from "@/lib/articles";
import { enhance } from "@/lib/enhance";

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
  const list = await getArticles();
  const idx = list.findIndex((x) => x.slug === a.slug);
  const more = list.map((x, i) => ({ ...x, i })).filter((x) => x.slug !== a.slug).slice(0, 3);
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
    <div style={{ overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px clamp(36px,9vw,80px)", display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 520px", maxWidth: 760 }}>
              <Link href="/post" className="pill">All articles</Link>
              <h1 style={{ margin: "20px 0 0", fontWeight: 400, fontSize: "clamp(23px,2.9vw,40px)", letterSpacing: 0, lineHeight: 1.05 }}>{a.title}</h1>
              <p style={{ margin: "18px 0 0", fontSize: 16, fontWeight: 500 }}>{dateLabel(a.published_at)}</p>
            </div>
            <div style={{ flex: "0 0 380px", maxWidth: "100%", transform: "rotate(2deg)", marginTop: 16 }}>
              <Cover slug={a.slug} title={a.title} i={idx < 0 ? 0 : idx} />
            </div>
          </div>
        </div>
      </div>
      <section style={{ padding: "clamp(36px,9vw,80px) 0 clamp(36px,9vw,100px)" }}>
        <article className="wrap prose" dangerouslySetInnerHTML={{ __html: enhance(a.content_html ?? "") }} />
      </section>
      <section style={{ padding: "clamp(36px,9vw,90px) 0", color: "#ECECEE" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 31, letterSpacing: 0 }}>More articles</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 36 }}>
            {more.map((m) => (
              <Link key={m.slug} href={`/post/${m.slug}`} style={{ flex: "1 1 300px", maxWidth: 400, display: "flex", flexDirection: "column", gap: 14 }}>
                <Cover slug={m.slug} title={m.title} i={m.i} />
                <h3 style={{ fontWeight: 400, fontSize: 16, letterSpacing: 0, lineHeight: 1.2 }}>{m.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "#A8FF5C", color: "#0A0A0B", padding: "clamp(36px,9vw,80px) 0" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <h2 style={{ flex: "1 1 420px", fontWeight: 400, fontSize: "clamp(23px,3.1vw,38px)", letterSpacing: 0, lineHeight: 1.05 }}>Want to grow through partners?</h2>
          <Link href="/services" className="btn btn-s">See our services</Link>
        </div>
      </section>
      <BuilderCta images={false} />
      <Footer />
    </div>
  );
}
