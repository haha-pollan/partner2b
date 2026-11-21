import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TERMS, termBySlug, termHref } from "@/lib/glossary";

export const dynamicParams = false;

export function generateStaticParams() {
  return TERMS.map((t) => ({ slug: t.slug }));
}

const trim = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:]$/, "") + ".");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = termBySlug(slug);
  if (!t) return {};
  return {
    title: `${t.term}: definition and how it works | Partner2B`,
    description: trim(t.short),
    alternates: { canonical: termHref(t.slug) },
    openGraph: { title: `${t.term}: definition and how it works`, description: trim(t.short), type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = termBySlug(slug);
  if (!t) notFound();
  const ai = t.group === "AI and agents";
  const rel = t.related.map((r) => TERMS.find((x) => x.slug === r)).filter(Boolean) as typeof TERMS;
  const url = `https://partner2b.com${termHref(t.slug)}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: t.term,
      description: t.short,
      url,
      inDefinedTermSet: "https://partner2b.com/glossary",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Partner2B", item: "https://partner2b.com" },
        { "@type": "ListItem", position: 2, name: "Glossary", item: "https://partner2b.com/glossary" },
        { "@type": "ListItem", position: 3, name: t.term, item: url },
      ],
    },
  ];
  const accent = ai ? "#5B3FE0" : "#0A0A0B";
  return (
    <div style={{ background: "#fff" }}>
      {ld.map((o, i) => (<script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />))}
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 220% no-repeat", overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "32px 40px clamp(36px,9vw,56px)" }}>
          <Link href="/glossary" className="pill" style={ai ? { background: "#5B3FE0", color: "#fff" } : undefined}>Glossary</Link>
          <h1 style={{ margin: "20px 0 0", fontWeight: 400, fontSize: "clamp(28px,3.6vw,48px)", lineHeight: 1.08, letterSpacing: 0, color: "#0A0A0B", maxWidth: 900 }}>{t.term}</h1>
        </div>
      </div>
      <main className="wrap" style={{ padding: "clamp(28px,6vw,48px) 40px clamp(36px,9vw,80px)" }}>
        <div style={{ maxWidth: 760 }}>
          <div className="cut" style={{ background: "#0A0A0B", color: "#ECECEE", padding: "28px 32px 36px" }}>
            <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 12, color: ai ? "#C9BDFF" : "#A8FF5C" }}>Short answer</div>
            <p style={{ margin: "14px 0 0", fontSize: 20, lineHeight: 1.55 }}>{t.short}</p>
          </div>
          {t.body.map((p, i) => (
            <p key={i} style={{ margin: "26px 0 0", fontSize: 18, lineHeight: 1.65, color: "#2A2B2F" }}>{p}</p>
          ))}
          {t.link && (
            <p style={{ margin: "30px 0 0" }}>
              <Link href={t.link.href} style={{ display: "inline-block", background: ai ? "#5B3FE0" : "#0A0A0B", color: ai ? "#fff" : "#A8FF5C", fontFamily: "'Michroma',sans-serif", fontSize: 14, padding: "14px 26px", borderRadius: 12 }}>{t.link.label}</Link>
            </p>
          )}
          <h2 style={{ margin: "52px 0 0", fontWeight: 400, fontSize: 24, letterSpacing: 0, color: accent }}>Common questions</h2>
          {t.faqs.map(([q, a]) => (
            <div key={q} style={{ marginTop: 24 }}>
              <h3 style={{ fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.35 }}>{q}</h3>
              <p style={{ margin: "10px 0 0", fontSize: 18, lineHeight: 1.65, color: "#2A2B2F" }}>{a}</p>
            </div>
          ))}
          {rel.length > 0 && (
            <>
              <h2 style={{ margin: "52px 0 0", fontWeight: 400, fontSize: 24, letterSpacing: 0, color: accent }}>Related terms</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
                {rel.map((r) => (<Link key={r.slug} href={termHref(r.slug)} className="gloss">{r.term}</Link>))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
