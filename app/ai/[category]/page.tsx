import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { AiRow } from "@/components/AiRow";
import { getPrograms } from "@/lib/programs";
import { AI_CATEGORIES, catBySlug, inCat, facts, faqs } from "@/lib/ai";

export const revalidate = 600;
export const dynamicParams = false;
export function generateStaticParams() { return AI_CATEGORIES.map((c) => ({ category: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = catBySlug((await params).category);
  if (!c) return {};
  return {
    title: `${c.name} partner programs | Partner2B`,
    description: `${c.short}. Official partner programs from ${c.what}, with types, commission and tiers as published.`,
    alternates: { canonical: `/ai/${c.slug}` },
  };
}

export default async function AiCategory({ params }: { params: Promise<{ category: string }> }) {
  const c = catBySlug((await params).category);
  if (!c) notFound();
  const all = await getPrograms();
  const list = inCat(all, c);
  const f = facts(list, c);
  const qa = faqs(list, c);
  const ld = [
    {
      "@context": "https://schema.org", "@type": "ItemList", name: `${c.name} partner programs`,
      itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.company, url: `https://partner2b.com/directory/${p.slug}` })),
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
    },
  ];
  return (
    <div style={{ overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ position: "relative" }}>
        <Nav />
        <div className="wrap" style={{ padding: "8px var(--margin) clamp(36px,9vw,80px)" }}>
          <div style={{ fontSize: 15, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/ai" style={{ textDecoration: "underline" }}>AI partner programs</Link><span>/</span><span>{c.name}</span>
          </div>
          <h1 className="h1big" style={{ marginTop: 24 }}>{c.name} partner programs</h1>
          <p style={{ margin: "24px 0 0", maxWidth: 760, fontSize: 21, lineHeight: 1.5, fontWeight: 400 }}>{c.intro}</p>
        </div>
      </div>
      <div style={{ position: "relative", padding: "clamp(36px,9vw,80px) 0 clamp(36px,9vw,96px)" }}>
        <div className="wrap">
          {f.n > 0 && (
            <section style={{ marginBottom: 56, maxWidth: 820 }}>
              <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>At a glance</h2>
              <ul style={{ margin: "20px 0 0", paddingLeft: 22, fontSize: 20, lineHeight: 1.7, fontWeight: 400 }}>
                {f.lines.map((l) => (<li key={l}>{l}</li>))}
              </ul>
            </section>
          )}
          <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>{f.n} programs</h2>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {list.map((p) => (<AiRow key={p.id} p={p} />))}
          </div>
          <section style={{ marginTop: 72, maxWidth: 820 }}>
            <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>Frequently asked questions</h2>
            {qa.map((x) => (
              <div key={x.q} style={{ marginTop: 28 }}>
                <h3 style={{ fontWeight: 400, fontSize: 21, lineHeight: 1.3 }}>{x.q}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 19, lineHeight: 1.6, fontWeight: 400 }}>{x.a}</p>
              </div>
            ))}
          </section>
          <section style={{ marginTop: 56 }}>
            <h2 style={{ fontWeight: 400, fontSize: 26, letterSpacing: 0 }}>More AI categories</h2>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {AI_CATEGORIES.filter((x) => x.slug !== c.slug).map((x) => (<Link key={x.slug} href={`/ai/${x.slug}`} className="chip">{x.name}</Link>))}
            </div>
          </section>
        </div>
      </div>
      <BuilderCta images={false} />
      <Footer />
    </div>
  );
}
