import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { assessIsNew, builderIsNew, calcIsNew } from "@/lib/launch";
import { AUDIENCE, COMING, FAQ, LEVERS, RELATED, SHORT_ANSWER, TOOLS, TOGETHER, TRUST, UPDATED_ISO, UPDATED_LABEL, WANTS, WHAT_IS } from "@/lib/aitools/seo";

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
const STRAPS = [
  { bg: "#fff", fg: "#0A0A0B", rot: -1.4, ml: 0 },
  { bg: "#A8FF5C", fg: "#0A0A0B", rot: 1.1, ml: "clamp(18px,5vw,64px)" },
  { bg: "#7C5CFF", fg: "#fff", rot: -0.9, ml: "clamp(6px,2vw,24px)" },
];
const VS = [
  { t: "Partner program tools", d: "Decide, size and diagnose" },
  { t: "PRM software", d: "Run, track and pay" },
];
const ROT = [-1.6, 1.2, -0.8, 1.4, -1.2, 1.6];
const michroma: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, WebkitTextStroke: "1px currentColor" };
const section: React.CSSProperties = { marginTop: "clamp(64px,8vw,110px)" };
const lead: React.CSSProperties = { margin: "14px 0 0", fontSize: 19, lineHeight: 1.6, color: "rgba(255,255,255,.88)" };
const balance = { textWrap: "balance" as React.CSSProperties["textWrap"] };
const GRID: React.CSSProperties = { marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 };
const bar = (w: string, h: number): React.CSSProperties => ({ width: w, height: h, borderRadius: 999, background: "currentColor", opacity: 0.55, marginTop: 12 });

export default function Page() {
  const isNew: Record<string, boolean> = { "/program-builder": builderIsNew(), "/partner-pipeline-calculator": calcIsNew(), "/partner-program-assessment": assessIsNew() };
  const soon = [["58%", "92%", "70%"], ["64%", "86%", "56%"], ["52%", "94%", "74%"], ["60%", "88%", "66%"], ["68%", "82%", "54%"], ["56%", "90%", "72%"]];
  const textCard = (t: string, d: string, i: number, n?: string) => {
    const T = TONES[(i + Math.floor(i / 3)) % 3];
    return (
      <div key={t} className="cut" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT[i % 6]}deg)`, padding: "26px 28px 36px" }}>
        {n && <span style={{ ...michroma, fontSize: 26, lineHeight: 1 }}>{n}</span>}
        <h3 style={{ ...michroma, fontSize: 18, lineHeight: 1.4, margin: n ? "18px 0 0" : 0, ...balance }}>{t}</h3>
        <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55, color: T.sub }}>{d}</p>
      </div>
    );
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", "@id": `${URL_}#webpage`, url: URL_, name: TITLE, description: DESC, inLanguage: "en", dateModified: UPDATED_ISO, about: "Free tools for planning, sizing and fixing a B2B partner program", author: { "@type": "Person", name: "Elena Zap", jobTitle: "Founder, Partner2B" }, publisher: ORG, mainEntity: { "@id": `${URL_}#tools` } },
          { "@type": "ItemList", "@id": `${URL_}#tools`, name: "Partner2B free partner program tools", itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "WebApplication", name: `Partner2B ${t.name}`, url: `${SITE}${t.href}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: t.promise, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG } })) },
          { "@type": "FAQPage", "@id": `${URL_}#faq`, mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          crumbs([["Partner2B", SITE], ["Free tools", URL_]]),
        ],
      }} />

      <div className="hero">
        <Nav />
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Free partner program tools</span>
              <span className="pt pt2">Built for B2B tech and AI</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>Free tools that help B2B tech and AI companies make their partner program more efficient, from the first plan to the next fix</p>
            <div className="herobtns"><a href="#tools" className="btn btn-p">Explore the tools ↓</a></div>
          </div>
          <div className="herotoby" aria-hidden="true">
            <Toby height={580} rows={38} glasses style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="cut freecard">
            <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 40, lineHeight: 1, WebkitTextStroke: "1.5px currentColor" }}>Free</div>
            <div style={{ marginTop: 8, fontSize: 18 }}>to start, no card</div>
          </div>
        </div>
      </div>

      <main className="wrap" style={{ padding: "clamp(48px,7vw,84px) var(--margin) clamp(36px,9vw,120px)" }}>
        {/* Tools */}
        <section id="tools" aria-labelledby="pick" style={{ scrollMarginTop: 24 }}>
          <h2 id="pick" className="sectitle">Pick a partner program tool</h2>
          <p style={lead}>Each tool answers one question and takes minutes. Start with the one that matches where you are</p>
          <div style={GRID}>
            {TOOLS.map((t, i) => {
              const T = TONES[i % 3];
              return (
                <Link key={t.href} href={t.href} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT[i % 6]}deg)`, padding: "26px 28px 32px", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ ...michroma, fontSize: 18, lineHeight: 1.35, minHeight: 50, ...balance }}>{t.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 30, marginTop: 6, flexWrap: "wrap" }}>
                    {isNew[t.href] && <span className="pill" suppressHydrationWarning style={{ background: "#7C5CFF", color: "#fff" }}>New</span>}
                    {t.ai && <span className="pill" style={{ background: "#7C5CFF", color: "#fff" }}>Uses AI</span>}
                  </div>
                  <p style={{ margin: "10px 0 0", minHeight: 78, fontSize: 16, lineHeight: 1.5, color: T.sub }}>{t.promise}</p>
                  <span style={{ marginTop: 20, alignSelf: "flex-start", width: 44, height: 44, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 400 }} aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>

          <h3 style={{ ...michroma, fontSize: 20, lineHeight: 1.4, margin: "64px 0 0" }}>Coming soon</h3>
          <div style={GRID} aria-hidden="true">
            {soon.map((w, i) => {
              const T = TONES[(i + 1 + Math.floor(i / 3)) % 3];
              return (
                <div key={i} className="cut gcard" style={{ position: "relative", background: T.bg, color: T.fg, transform: `rotate(${ROT[(i + 3) % 6]}deg)`, padding: "26px 28px 32px", display: "flex", flexDirection: "column", overflow: "hidden", userSelect: "none" }}>
                  <div style={{ filter: "blur(9px)" }}>
                    <div style={{ ...bar("62%", 18), marginTop: 4 }} />
                    <div style={{ minHeight: 100, paddingTop: 26 }}>{w.map((x, j) => <div key={j} style={bar(x, 11)} />)}</div>
                    <span style={{ marginTop: 20, display: "block", width: 44, height: 44, borderRadius: "50%", background: T.ar }} />
                  </div>
                  <span className="pill" style={{ position: "absolute", top: 22, right: 22, background: "#0A0A0B", color: "#fff" }}>Coming soon</span>
                </div>
              );
            })}
          </div>
          <p style={{ ...lead, marginTop: 36 }}>{COMING} <Link href="/contact" style={{ textDecoration: "underline" }}>Tell us what you need</Link></p>
        </section>

        {/* In short, with straps */}
        <section aria-labelledby="short" style={{ ...section, display: "flex", gap: "clamp(32px,5vw,72px)", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 460px", minWidth: 0 }}>
            <h2 id="short" className="sectitle">Free partner program tools in short</h2>
            <p style={{ margin: "22px 0 0", fontSize: 21, lineHeight: 1.6, color: "#fff" }}>{SHORT_ANSWER}</p>
            <p style={{ margin: "20px 0 0", fontSize: 15, color: "rgba(255,255,255,.6)" }}>By Elena Zap, founder of Partner2B. Updated {UPDATED_LABEL}</p>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 0, padding: "10px 0" }}>
            {WANTS.map((w, i) => {
              const S = STRAPS[i];
              return (
                <Link key={w.href} href={w.href} style={{ display: "block", width: "fit-content", maxWidth: "100%", background: S.bg, color: S.fg, padding: "22px 34px 22px 28px", transform: `rotate(${S.rot}deg)`, transformOrigin: "left center", marginTop: i === 0 ? 0 : -6, marginLeft: S.ml, position: "relative", zIndex: 3 - i, textDecoration: "none" }}>
                  <span style={{ display: "block", fontSize: 17, opacity: 0.85 }}>{w.label}</span>
                  <span style={{ ...michroma, display: "block", fontSize: 21, lineHeight: 1.35, marginTop: 8 }}>{w.tool} →</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* What are */}
        <section aria-labelledby="what" style={{ ...section, display: "flex", gap: "clamp(32px,5vw,72px)", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 460px", minWidth: 0 }}>
            <h2 id="what" className="sectitle">What are partner program tools?</h2>
            {WHAT_IS.map((t) => <p key={t} style={{ ...lead, marginTop: 20 }}>{t}</p>)}
          </div>
          <div style={{ flex: "1 1 360px", minWidth: 0, padding: "10px 0" }}>
            {VS.map((v, i) => (
              <div key={v.t} style={{ width: "fit-content", maxWidth: "100%", background: i === 0 ? "#A8FF5C" : "#fff", color: "#0A0A0B", padding: "22px 34px 24px 28px", transform: `rotate(${i === 0 ? -1.2 : 1}deg)`, transformOrigin: "left center", marginTop: i === 0 ? 0 : -6, marginLeft: i === 0 ? 0 : "clamp(18px,5vw,64px)", position: "relative", zIndex: 2 - i }}>
                <span style={{ ...michroma, display: "block", fontSize: 19, lineHeight: 1.35 }}>{v.t}</span>
                <span style={{ display: "block", fontSize: 17, marginTop: 8 }}>{v.d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Together */}
        <section aria-labelledby="together" style={section}>
          <h2 id="together" className="sectitle">How to use the tools together</h2>
          <p style={lead}>The right order depends on where your partner program is today</p>
          <div style={GRID}>{TOGETHER.map((x, i) => textCard(x.t, x.d, i, String(i + 1).padStart(2, "0")))}</div>
        </section>

        {/* Levers as straps */}
        <section aria-labelledby="levers" style={section}>
          <h2 id="levers" className="sectitle">What makes a partner program efficient</h2>
          <p style={lead}>Five places where most programs win or lose revenue. The tools are built around them</p>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 46 }}>
            {LEVERS.map((l, i) => {
              const white = i % 2 === 0;
              return (
                <div key={l.t} style={{ display: "flex", gap: "clamp(20px,4vw,56px)", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: white ? "#fff" : "#A8FF5C", color: "#0A0A0B", padding: "16px 28px 16px 22px", transform: `rotate(${white ? -1.2 : 1}deg)`, transformOrigin: "left center", maxWidth: "100%" }}>
                      <span style={{ ...michroma, fontSize: 24, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                      <h3 style={{ ...michroma, fontSize: 18, lineHeight: 1.35, margin: 0, ...balance }}>{l.t}</h3>
                    </div>
                  </div>
                  <div style={{ flex: "2 1 460px", minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.9)" }}>{l.d}</p>
                    <Link href={l.link.href} className="kick" style={{ marginTop: 16 }}>{l.link.label}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Who */}
        <section aria-labelledby="who" style={section}>
          <h2 id="who" className="sectitle">Who the tools are for</h2>
          <p style={lead}>B2B tech and AI companies that want to grow through partners and are not sure what to start with</p>
          <div style={GRID}>{AUDIENCE.map((a, i) => textCard(a.t, a.d, i + 1))}</div>
        </section>

        {/* Trust */}
        <section aria-labelledby="trust" style={section}>
          <h2 id="trust" className="sectitle">Free, private and clear about AI</h2>
          <div style={GRID}>{TRUST.map((a, i) => textCard(a.t, a.d, i + 2))}</div>
          <p style={{ ...lead, marginTop: 30 }}>Read the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link></p>
        </section>

        {/* Toby band */}
        <section aria-labelledby="start" style={section}>
          <div className="cut" style={{ background: "#ECECEE", color: "#0A0A0B", padding: "clamp(28px,4vw,44px) clamp(26px,4vw,52px) clamp(34px,4vw,52px)", display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center", ["--c" as string]: "28px", border: "0" }}>
            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              <h2 id="start" style={{ ...michroma, fontSize: "clamp(22px,2.6vw,30px)", lineHeight: 1.3, ...balance }}>Not sure where to start?</h2>
              <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.55, maxWidth: 520 }}>If you already have a program, start with the assessment. If you do not, start with the program builder. Both take minutes</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
                <Link href="/partner-program-assessment" className="btn btn-s">Take the assessment</Link>
                <Link href="/program-builder" className="btn btn-s">Open the program builder</Link>
              </div>
            </div>
            <div aria-hidden="true" style={{ flex: "0 0 auto", width: 250, height: 300, margin: "0 auto" }}>
              <Toby height={300} rows={38} glasses style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" style={section}>
          <h2 id="faq" className="sectitle">Questions about partner program tools</h2>
          <div style={{ marginTop: 32, columnWidth: 440, columnGap: 64 }}>
            {FAQ.map((f, fi) => (
              <div key={f.q} style={{ breakInside: "avoid", paddingBottom: 28, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,.18)" }}>
                <h3 style={{ ...michroma, fontSize: 18, lineHeight: 1.45, margin: 0, color: "#fff", WebkitTextStroke: "0.8px currentColor", ...balance }}><span style={{ color: "#A8FF5C", marginRight: 12 }}>{String(fi + 1).padStart(2, "0")}</span>{f.q}</h3>
                <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.88)" }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <nav aria-label="Related" style={{ ...section, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 17, marginRight: 8 }}>Keep reading</span>
          {RELATED.map((r) => <Link key={r.href} href={r.href} className="kick">{r.label}</Link>)}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
