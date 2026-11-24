import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { assessIsNew, builderIsNew, calcIsNew } from "@/lib/launch";
import { AUDIENCE, COMING, FAQ, LEVERS, RELATED, SHORT_ANSWER, STATS, TOOLS, TOGETHER, TRUST, UPDATED_ISO, UPDATED_LABEL, WHAT_IS, WHEN } from "@/lib/aitools/seo";

const TITLE = "Free partner program tools for B2B tech | Partner2B";
const DESC = "Free partner program tools for B2B tech and AI companies: build a partner program strategy, find how many partners to reach out to, and fix a program that is not performing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/ai-tools" },
  openGraph: { title: TITLE, description: DESC, url: "/ai-tools", type: "website" },
};

const URL_ = `${SITE}/ai-tools`;
const TINTS = ["#fff", "var(--lav)", "#ECECEE"];
const michroma: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, WebkitTextStroke: "1px currentColor" };
const section: React.CSSProperties = { marginTop: "clamp(60px,8vw,104px)" };
const lead: React.CSSProperties = { margin: "14px 0 0", fontSize: 19, lineHeight: 1.55, maxWidth: 760, color: "rgba(255,255,255,.85)" };
const balance = { textWrap: "balance" as React.CSSProperties["textWrap"] };
const bar = (w: string, h = 12, o = 0.9): React.CSSProperties => ({ width: w, height: h, borderRadius: 999, background: `rgba(10,10,11,${o})`, marginTop: 12 });

export default function Page() {
  const isNew = [builderIsNew(), calcIsNew(), assessIsNew()];
  const widths = [["62%", "88%", "74%"], ["54%", "92%", "68%"], ["70%", "80%", "58%"], ["58%", "90%", "76%"], ["66%", "84%", "52%"], ["60%", "94%", "72%"]];
  const NEW_FLAGS: Record<string, boolean> = { "/program-builder": isNew[0], "/partner-pipeline-calculator": isNew[1], "/partner-program-assessment": isNew[2] };

  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", "@id": `${URL_}#webpage`, url: URL_, name: TITLE, description: DESC, inLanguage: "en", dateModified: UPDATED_ISO, about: "Free tools for planning, sizing and fixing a B2B partner program", author: { "@type": "Person", name: "Elena Zap", jobTitle: "Founder, Partner2B" }, publisher: ORG, mainEntity: { "@id": `${URL_}#tools` } },
          { "@type": "ItemList", "@id": `${URL_}#tools`, name: "Partner2B free partner program tools", itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "WebApplication", name: `Partner2B ${t.name}`, url: `${SITE}${t.href}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: t.promise, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG } })) },
          { "@type": "FAQPage", "@id": `${URL_}#faq`, mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          crumbs([["Partner2B", SITE], ["AI partner tools", URL_]]),
        ],
      }} />
      <div className="hero">
        <Nav />
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">AI partner tools</span>
              <span className="pt pt2">Free for B2B tech</span>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, marginTop: 36 }}>
            {TOOLS.map((t, i) => (
              <Link key={t.href} href={t.href} className="cut" style={{ background: TINTS[i % 3], color: "#0A0A0B", padding: "28px 30px 38px", ["--c" as string]: "24px", display: "flex", flexDirection: "column", textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ ...michroma, fontSize: 26, lineHeight: 1 }}>{t.n}</span>
                  {t.ai && <span style={{ border: "2px solid #0A0A0B", borderRadius: 999, padding: "3px 13px", fontSize: 15, whiteSpace: "nowrap" }}>Uses AI</span>}
                  {NEW_FLAGS[t.href] && <span className="newbadge" suppressHydrationWarning>New</span>}
                </div>
                <h3 style={{ ...michroma, fontSize: 19, lineHeight: 1.4, margin: "20px 0 0", ...balance }}>{t.name}</h3>
                <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55, minHeight: 78 }}>{t.promise}</p>
                <span className="btn btn-p btn-sm" style={{ marginTop: 22, alignSelf: "flex-start" }}>{t.cta} →</span>
              </Link>
            ))}
          </div>

          <h3 style={{ ...michroma, fontSize: 20, lineHeight: 1.4, margin: "56px 0 0" }}>Coming soon</h3>
          <p style={{ ...lead, marginTop: 10 }}>{COMING} <Link href="/contact" style={{ textDecoration: "underline" }}>Tell us what you need</Link></p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22, marginTop: 28 }} aria-hidden="true">
            {widths.map((w, i) => (
              <div key={i} className="cut" style={{ position: "relative", background: TINTS[(i + 1) % 3], color: "#0A0A0B", padding: "28px 30px 38px", ["--c" as string]: "22px", overflow: "hidden", userSelect: "none" }}>
                <div style={{ filter: "blur(9px)", opacity: 0.85 }}>
                  <div style={{ ...michroma, fontSize: 26, lineHeight: 1 }}>{String(i + 4).padStart(2, "0")}</div>
                  <div style={bar("46%", 20, 1)} />
                  {w.map((x, j) => <div key={j} style={bar(x)} />)}
                  <div style={{ ...bar("38%", 34, 0.9), marginTop: 24 }} />
                </div>
                <span style={{ position: "absolute", top: 24, right: 24, background: "#0A0A0B", color: "#fff", fontSize: 14, padding: "4px 13px", borderRadius: 999 }}>Coming soon</span>
              </div>
            ))}
          </div>
        </section>

        {/* Short answer and numbers */}
        <section aria-labelledby="short-answer" style={{ ...section, display: "flex", gap: 36, flexWrap: "wrap", alignItems: "flex-start" }}>
          <figure className="cut" style={{ flex: "1 1 520px", minWidth: 0, margin: 0, background: "#A8FF5C", color: "#0A0A0B", padding: "30px 40px 40px", ["--c" as string]: "26px" }}>
            <h2 id="short-answer" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>Short answer</h2>
            <div aria-hidden="true" style={{ ...michroma, fontSize: 96, lineHeight: 0.8, height: 56, WebkitTextStroke: "2px currentColor" }}>{"“"}</div>
            <blockquote style={{ margin: "10px 0 0", fontSize: 22, lineHeight: 1.55, fontStyle: "italic" }}>{SHORT_ANSWER}</blockquote>
            <figcaption style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "inline-block", width: 36, height: 3, background: "#0A0A0B" }} aria-hidden="true" />
              <span style={{ fontSize: 17 }}>Elena Zap, founder of Partner2B. Updated {UPDATED_LABEL}</span>
            </figcaption>
          </figure>
          <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 18, padding: "6px 0 10px" }}>
            {STATS.map((s, i) => (
              <div key={s.n} className="cut" style={{ background: TINTS[i % 3], color: "#0A0A0B", padding: "22px 28px 26px", transform: `rotate(${[-1.2, 1, -0.8][i]}deg)`, marginLeft: [0, 28, 8][i], ["--c" as string]: "18px" }}>
                <div style={{ ...michroma, fontSize: 32, lineHeight: 1, WebkitTextStroke: "1.3px currentColor" }}>{s.n}</div>
                <div style={{ marginTop: 12, fontSize: 18, lineHeight: 1.4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Which tool when */}
        <section aria-labelledby="when" style={section}>
          <h2 id="when" className="sectitle">Which partner program tool do you need?</h2>
          <p style={lead}>Match your situation to a tool, see what you enter and what you get back</p>
          <div style={{ marginTop: 28, overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>{["Your situation", "Tool", "You enter", "You get"].map((h) => <th key={h} scope="col" style={{ fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,.6)", padding: "0 20px 14px 0", borderBottom: "2px solid #A8FF5C" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {WHEN.map((r) => (
                  <tr key={r.tool}>
                    <td style={{ fontSize: 18, lineHeight: 1.5, padding: "26px 28px 26px 0", verticalAlign: "top", width: "27%", color: "rgba(255,255,255,.88)", borderBottom: "1px solid rgba(255,255,255,.18)" }}>{r.q}</td>
                    <th scope="row" style={{ ...michroma, fontSize: 17, lineHeight: 1.45, WebkitTextStroke: "0.8px currentColor", padding: "26px 28px 26px 0", verticalAlign: "top", width: "21%", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.18)" }}><Link href={r.href} style={{ textDecoration: "underline" }}>{r.tool}</Link></th>
                    <td style={{ fontSize: 18, lineHeight: 1.5, padding: "26px 28px 26px 0", verticalAlign: "top", width: "22%", color: "rgba(255,255,255,.88)", borderBottom: "1px solid rgba(255,255,255,.18)" }}>{r.enter}</td>
                    <td style={{ fontSize: 18, lineHeight: 1.5, padding: "26px 0", verticalAlign: "top", color: "rgba(255,255,255,.88)", borderBottom: "1px solid rgba(255,255,255,.18)" }}>{r.get}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What are partner program tools */}
        <section aria-labelledby="what" style={section}>
          <h2 id="what" className="sectitle">What are partner program tools?</h2>
          {WHAT_IS.map((p) => <p key={p} style={{ ...lead, marginTop: 20 }}>{p}</p>)}
        </section>

        {/* Use together */}
        <section aria-labelledby="together" style={section}>
          <h2 id="together" className="sectitle">How to use the tools together</h2>
          <p style={lead}>The right order depends on where your partner program is today</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22, marginTop: 36 }}>
            {TOGETHER.map((x, i) => (
              <div key={x.t} className="cut" style={{ background: TINTS[i % 3], color: "#0A0A0B", padding: "28px 30px 38px", ["--c" as string]: "24px" }}>
                <span style={{ ...michroma, fontSize: 26, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ ...michroma, fontSize: 19, lineHeight: 1.4, margin: "20px 0 0", ...balance }}>{x.t}</h3>
                <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55 }}>{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Efficiency levers */}
        <section aria-labelledby="levers" style={section}>
          <h2 id="levers" className="sectitle">What makes a partner program efficient</h2>
          <p style={lead}>Five places where most programs win or lose revenue. The tools are built around them</p>
          <div style={{ marginTop: 32 }}>
            {LEVERS.map((l, i) => (
              <div key={l.t} style={{ display: "flex", gap: 24, flexWrap: "wrap", padding: "26px 0", borderBottom: "1px solid rgba(255,255,255,.18)" }}>
                <div style={{ flex: "1 1 280px", minWidth: 0, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ ...michroma, fontSize: 22, lineHeight: 1.3, color: "#A8FF5C" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ ...michroma, fontSize: 18, lineHeight: 1.45, margin: 0, color: "#fff", WebkitTextStroke: "0.8px currentColor", ...balance }}>{l.t}</h3>
                </div>
                <div style={{ flex: "2 1 420px", minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,.88)" }}>{l.d}</p>
                  <Link href={l.link.href} className="kick" style={{ marginTop: 14 }}>{l.link.label}</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who it is for */}
        <section aria-labelledby="who" style={section}>
          <h2 id="who" className="sectitle">Who the tools are for</h2>
          <p style={lead}>B2B tech and AI companies that want to grow through partners and are not sure what to start with</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22, marginTop: 36 }}>
            {AUDIENCE.map((a, i) => (
              <div key={a.t} className="cut" style={{ background: TINTS[(i + 1) % 3], color: "#0A0A0B", padding: "28px 30px 38px", ["--c" as string]: "24px" }}>
                <h3 style={{ ...michroma, fontSize: 19, lineHeight: 1.4, margin: 0, ...balance }}>{a.t}</h3>
                <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55 }}>{a.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free, private, AI */}
        <section aria-labelledby="trust" style={section}>
          <h2 id="trust" className="sectitle">Free, private and clear about AI</h2>
          {TRUST.map((p) => <p key={p} style={{ ...lead, marginTop: 20 }}>{p}</p>)}
          <p style={{ ...lead, marginTop: 20 }}>Read the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link></p>
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
