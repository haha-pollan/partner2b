import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TERMS, GROUPS, termHref } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "B2B partner program glossary | Partner2B",
  description: "Plain-language definitions of B2B partner program terms, from MDF and deal registration to co-selling, channel sales, AI agents and agentic partnerships.",
  alternates: { canonical: "/glossary" },
};

export default function Page() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "B2B partner program glossary",
    url: "https://partner2b.com/glossary",
    hasDefinedTerm: TERMS.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.short, url: `https://partner2b.com${termHref(t.slug)}` })),
  };
  return (
    <div style={{ background: "#fff" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 220% no-repeat", overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px 40px clamp(36px,9vw,64px)" }}>
          <h1 style={{ fontWeight: 400, fontSize: "clamp(32px,4.2vw,56px)", lineHeight: 1.05, letterSpacing: 0, color: "#0A0A0B" }}>Partner program glossary</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 720, fontSize: 20, lineHeight: 1.5, color: "#1C1D20" }}>
            {TERMS.length} clear definitions of the terms used in B2B partner programs, channel sales and AI partnerships, each with examples and common questions answered.
          </p>
        </div>
      </div>
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) 40px clamp(36px,9vw,96px)" }}>
        {GROUPS.map((g) => {
          const list = TERMS.filter((t) => t.group === g).sort((a, b) => a.term.localeCompare(b.term));
          return (
            <section key={g} style={{ marginTop: 44 }}>
              <h2 style={{ fontWeight: 400, fontSize: 22, letterSpacing: 0, color: g === "AI and agents" ? "#5B3FE0" : "#0A0A0B" }}>{g}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
                {list.map((t) => (
                  <Link key={t.slug} href={termHref(t.slug)} className="gloss">{t.term}</Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
