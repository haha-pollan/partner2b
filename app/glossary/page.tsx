import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { TERMS, GROUPS, termHref } from "@/lib/glossary";
import { BLURBS } from "@/lib/glossary/blurbs";

const TONES = [
  { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", ar: "#0A0A0B", arf: "#A8FF5C" },
  { bg: "#A8FF5C", fg: "#0A0A0B", sub: "#1C1D20", ar: "#0A0A0B", arf: "#A8FF5C" },
  { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", ar: "#A8FF5C", arf: "#0A0A0B" },
];
const AI_TONES = [
  { bg: "#7C5CFF", fg: "#fff", sub: "#F1EEFF", ar: "#fff", arf: "#5B3FE0" },
  { bg: "#F1EEFF", fg: "#0A0A0B", sub: "#3A3B40", ar: "#5B3FE0", arf: "#fff" },
  { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", ar: "#C9BDFF", arf: "#0A0A0B" },
];
const ROT = [-1.6, 1.2, -0.8, 1.4, -1.2, 1.6];

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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,64px)" }}>
          <h1 className="h1big">Partner program glossary</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 900, fontSize: 20, lineHeight: 1.5, color: "#ECECEE" }}>
            Clear definitions of the terms used in B2B partner programs, channel sales and AI partnerships, each with examples and common questions answered.
          </p>
        </div>
      </div>
      <section style={{ padding: "clamp(36px,9vw,72px) 0 clamp(36px,9vw,110px)", overflow: "hidden" }}>
        <div className="wrap">
          {GROUPS.map((g, gi) => {
            const ai = g === "AI and agents";
            const list = TERMS.filter((t) => t.group === g).sort((a, b) => a.term.localeCompare(b.term));
            const tones = ai ? AI_TONES : TONES;
            return (
              <section key={g} style={{ marginTop: gi === 0 ? 0 : 72 }}>
                <span className="pill" style={{ background: ai ? "#7C5CFF" : "#A8FF5C", color: ai ? "#fff" : "#0A0A0B" }}>{g}</span>
                <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 26 }}>
                  {list.map((t, i) => {
                    const T = tones[(i + Math.floor(i / 3)) % 3];
                    return (
                      <Link key={t.slug} href={termHref(t.slug)} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT[i % 6]}deg)`, padding: "24px 26px 30px", display: "flex", flexDirection: "column" }}>
                        <h3 style={{ fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.25, minHeight: 44 }}>{t.term}</h3>
                        <p style={{ margin: "12px 0 0", minHeight: 72, fontSize: 15, lineHeight: 1.5, color: T.sub }}>{BLURBS[t.slug]}</p>
                        <span style={{ marginTop: 18, alignSelf: "flex-start", width: 40, height: 40, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 400 }} aria-hidden="true">→</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      <BuilderCta />
      <Footer />
    </div>
  );
}
