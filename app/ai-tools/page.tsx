import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { assessIsNew, builderIsNew, calcIsNew } from "@/lib/launch";
import { AUDIENCE, COMING, FAQ, LEVERS, RELATED, SHORT_ANSWER, TOOLS, TOGETHER, TRUST, UPDATED_ISO, UPDATED_LABEL, WHAT_IS } from "@/lib/aitools/seo";

const TITLE = "Free partner program tools for B2B tech | Partner2B";
const DESC = "Free partner program tools for B2B tech and AI companies: build a partner program strategy, find how many partners to reach out to, and fix a program that is not performing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/ai-tools" },
  openGraph: { title: TITLE, description: DESC, url: "/ai-tools", type: "website" },
};

const URL_ = `${SITE}/ai-tools`;
const TONES = [
  { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", ar: "#0A0A0B", arf: "#A8FF5C" },
  { bg: "#A8FF5C", fg: "#0A0A0B", sub: "#1C1D20", ar: "#0A0A0B", arf: "#A8FF5C" },
  { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", ar: "#A8FF5C", arf: "#0A0A0B" },
];
const ROT = [-1.6, 1.2, -0.8, 1.4, -1.2, 1.6];
const GRID: React.CSSProperties = { marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 26 };
const h2: React.CSSProperties = { margin: "52px 0 0", fontWeight: 400, fontSize: 24, letterSpacing: 0, color: "#A8FF5C" };
const h3: React.CSSProperties = { fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.35 };
const p: React.CSSProperties = { margin: "10px 0 0", fontSize: 18, lineHeight: 1.65, color: "#ECECEE" };
const bar = (w: string, h: number): React.CSSProperties => ({ width: w, height: h, borderRadius: 999, background: "currentColor", opacity: 0.55, marginTop: 12 });

export default function Page() {
  const isNew: Record<string, boolean> = { "/program-builder": builderIsNew(), "/partner-pipeline-calculator": calcIsNew(), "/partner-program-assessment": assessIsNew() };
  const soon = [["58%", "92%", "70%"], ["64%", "86%", "56%"], ["52%", "94%", "74%"], ["60%", "88%", "66%"], ["68%", "82%", "54%"], ["56%", "90%", "72%"]];

  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", "@id": `${URL_}#webpage`, url: URL_, name: TITLE, description: DESC, inLanguage: "en", dateModified: UPDATED_ISO, about: "Free tools for planning, sizing and fixing a B2B partner program", author: { "@type": "Person", name: "Elena Zap", jobTitle: "Founder, Partner2B" }, publisher: ORG, mainEntity: { "@id": `${URL_}#tools` } },
          { "@type": "ItemList", "@id": `${URL_}#tools`, name: "Partner2B free partner program tools", itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "WebApplication", name: `Partner2B ${t.name}`, url: `${SITE}${t.href}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: t.promise, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG } })) },
          { "@type": "FAQPage", "@id": `${URL_}#faq`, mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          crumbs([["Partner2B", SITE], ["Free tools", URL_]]),
        ],
      }} />
      <div style={{ overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,64px)" }}>
          <h1 className="h1big">Free partner program tools</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 900, fontSize: 20, lineHeight: 1.5, color: "#ECECEE" }}>
            Free tools that help B2B tech and AI companies make their partner program more efficient, from the first plan to the next fix. Each one answers a single question and takes minutes.
          </p>
        </div>
      </div>

      <section style={{ padding: "clamp(36px,9vw,72px) 0 clamp(36px,9vw,72px)", overflow: "hidden" }}>
        <div className="wrap">
          <span className="pill">Live tools</span>
          <div style={GRID}>
            {TOOLS.map((t, i) => {
              const T = TONES[i % 3];
              return (
                <Link key={t.href} href={t.href} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT[i % 6]}deg)`, padding: "24px 26px 30px", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.25, minHeight: 44 }}>{t.name}</h3>
                  <div style={{ display: "flex", gap: 8, minHeight: 26, marginTop: 8, flexWrap: "wrap" }}>
                    {isNew[t.href] && <span className="newbadge" suppressHydrationWarning style={{ marginLeft: 0 }}>New</span>}
                    {t.ai && <span className="pill" style={{ background: "#7C5CFF", color: "#fff" }}>Uses AI</span>}
                  </div>
                  <p style={{ margin: "8px 0 0", minHeight: 72, fontSize: 15, lineHeight: 1.5, color: T.sub }}>{t.promise}</p>
                  <span style={{ marginTop: 18, alignSelf: "flex-start", width: 40, height: 40, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 400 }} aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>

          <section style={{ marginTop: 72 }}>
            <span className="pill">Coming soon</span>
            <div style={GRID} aria-hidden="true">
              {soon.map((w, i) => {
                const T = TONES[(i + 1 + Math.floor(i / 3)) % 3];
                return (
                  <div key={i} className="cut gcard" style={{ position: "relative", background: T.bg, color: T.fg, transform: `rotate(${ROT[(i + 3) % 6]}deg)`, padding: "24px 26px 30px", display: "flex", flexDirection: "column", overflow: "hidden", userSelect: "none" }}>
                    <div style={{ filter: "blur(9px)" }}>
                      <div style={{ ...bar("62%", 18), marginTop: 4 }} />
                      <div style={{ minHeight: 78, paddingTop: 22 }}>{w.map((x, j) => <div key={j} style={bar(x, 11)} />)}</div>
                      <span style={{ marginTop: 18, display: "block", width: 40, height: 40, borderRadius: "50%", background: T.ar }} />
                    </div>
                    <span className="pill" style={{ position: "absolute", top: 22, right: 22, background: "#0A0A0B", color: "#fff" }}>Coming soon</span>
                  </div>
                );
              })}
            </div>
            <p style={{ margin: "34px 0 0", maxWidth: 760, fontSize: 18, lineHeight: 1.6, color: "#ECECEE" }}>{COMING} <Link href="/contact" style={{ textDecoration: "underline" }}>Tell us what you need</Link></p>
          </section>
        </div>
      </section>

      <main className="wrap" style={{ padding: "clamp(8px,3vw,24px) var(--margin) clamp(36px,9vw,80px)" }}>
        <div style={{ maxWidth: 760 }}>
          <div className="cut" style={{ background: "#2A2B30", padding: "28px 32px 36px" }}>
            <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 12, color: "#A8FF5C" }}>Short answer</div>
            <p style={{ margin: "14px 0 0", fontSize: 20, lineHeight: 1.55 }}>{SHORT_ANSWER}</p>
            <p style={{ margin: "18px 0 0", fontSize: 15, color: "#B9BABD" }}>Elena Zap, founder of Partner2B. Updated {UPDATED_LABEL}</p>
          </div>

          <h2 style={h2}>What are partner program tools?</h2>
          {WHAT_IS.map((t) => <p key={t} style={{ ...p, marginTop: 18 }}>{t}</p>)}

          <h2 style={h2}>Which partner program tool do you need?</h2>
          {TOOLS.map((t) => (
            <div key={t.href} style={{ marginTop: 24 }}>
              <h3 style={h3}>{t.best}</h3>
              <p style={p}>Use the <Link href={t.href} style={{ textDecoration: "underline" }}>{t.name.toLowerCase()}</Link>. You enter: {t.enter.charAt(0).toLowerCase() + t.enter.slice(1)}. You get: {t.get.charAt(0).toLowerCase() + t.get.slice(1)}.</p>
            </div>
          ))}

          <h2 style={h2}>How to use the tools together</h2>
          {TOGETHER.map((x) => (
            <div key={x.t} style={{ marginTop: 24 }}>
              <h3 style={h3}>{x.t}</h3>
              <p style={p}>{x.d}</p>
            </div>
          ))}

          <h2 style={h2}>What makes a partner program efficient</h2>
          <p style={{ ...p, marginTop: 18 }}>Five places where most programs win or lose revenue. The tools are built around them.</p>
          {LEVERS.map((l) => (
            <div key={l.t} style={{ marginTop: 24 }}>
              <h3 style={h3}>{l.t}</h3>
              <p style={p}>{l.d}</p>
              <p style={{ margin: "12px 0 0" }}><Link href={l.link.href} className="gloss">{l.link.label}</Link></p>
            </div>
          ))}

          <h2 style={h2}>Who the tools are for</h2>
          <p style={{ ...p, marginTop: 18 }}>B2B tech and AI companies that want to grow through partners and are not sure what to start with.</p>
          {AUDIENCE.map((a) => (
            <div key={a.t} style={{ marginTop: 24 }}>
              <h3 style={h3}>{a.t}</h3>
              <p style={p}>{a.d}</p>
            </div>
          ))}

          <h2 style={h2}>Free, private and clear about AI</h2>
          {TRUST.map((t) => <p key={t} style={{ ...p, marginTop: 18 }}>{t}</p>)}
          <p style={{ ...p, marginTop: 18 }}>Read the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link>.</p>

          <h2 style={h2}>Common questions</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ marginTop: 24 }}>
              <h3 style={h3}>{f.q}</h3>
              <p style={p}>{f.a}</p>
            </div>
          ))}

          <h2 style={h2}>Related</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
            {RELATED.map((r) => (<Link key={r.href} href={r.href} className="gloss">{r.label}</Link>))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
