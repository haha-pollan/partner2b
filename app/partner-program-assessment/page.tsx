import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { AREAS } from "@/lib/assessment/model";
import { FAQ, RELATED, REASONS, SHORT_ANSWER, SIGNS, STATS, UPDATED_ISO } from "@/lib/assessment/seo";
import { AssessmentClient } from "./AssessmentClient";
import { StartLink } from "./StartLink";

const TITLE = "Partner program not performing? Free assessment | Partner2B";
const DESC = "Partner program not performing? Answer 16 short statements and see which two things hold it back and what to fix first. Free, no company name.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/partner-program-assessment" },
  openGraph: { title: TITLE, description: DESC, url: "/partner-program-assessment", type: "website" },
};

const URL_ = `${SITE}/partner-program-assessment`;
const TINTS = ["#fff", "var(--lav)", "#ECECEE"];
const michroma: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, WebkitTextStroke: "1px currentColor" };
const section: React.CSSProperties = { marginTop: "clamp(60px,8vw,104px)" };
const steps = ["Pick what is not working and answer four quick questions", "Answer 16 short statements: Yes, Partly or No", "See the two things holding your program back and the first fix for each"];

export default function Page() {
  const left = REASONS.map((r, i) => ({ r, i })).filter((x) => x.i % 2 === 0);
  const right = REASONS.map((r, i) => ({ r, i })).filter((x) => x.i % 2 === 1);
  const reasonCard = ({ r, i }: { r: { q: string; d: string }; i: number }) => (
    <div key={i} className="cut" style={{ background: TINTS[i % 3], color: "#0A0A0B", padding: "28px 30px 36px", ["--c" as string]: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ ...michroma, fontSize: 26, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
        <span style={{ border: "2px solid #0A0A0B", borderRadius: 999, padding: "3px 13px", fontSize: 15, whiteSpace: "nowrap" }}>{AREAS[i].name}</span>
      </div>
      <h3 style={{ ...michroma, fontSize: 19, lineHeight: 1.4, margin: "20px 0 0", textWrap: "balance" as React.CSSProperties["textWrap"] }}>{r.q}</h3>
      <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55 }}>{r.d}</p>
    </div>
  );

  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", name: "Partner2B Partner program assessment", url: URL_, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "Answer 16 short statements and see which two things hold your partner program back and what to fix first.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG },
          { "@type": "WebPage", "@id": `${URL_}#webpage`, url: URL_, name: TITLE, description: DESC, inLanguage: "en", dateModified: UPDATED_ISO, about: "Why a B2B partner program does not perform", author: { "@type": "Person", name: "Elena Zap", jobTitle: "Founder, Partner2B" }, publisher: ORG },
          { "@type": "FAQPage", "@id": `${URL_}#faq`, mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          crumbs([["Partner2B", SITE], ["Partner program assessment", URL_]]),
        ],
      }} />
      <div className="hero">
        <Nav />
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Partner program assessment</span>
              <span className="pt pt2">Why it does not perform</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>Partners joined, but the revenue did not follow? Answer 16 short statements and see which two things hold your program back, and what to fix first</p>
            <div className="herobtns"><StartLink className="btn btn-p">Start the assessment</StartLink></div>
          </div>
          <div className="herotoby" aria-hidden="true">
            <Toby height={580} rows={38} glasses style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="cut freecard">
            <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 40, lineHeight: 1, WebkitTextStroke: "1.5px currentColor" }}>Free</div>
            <div style={{ marginTop: 8, fontSize: 18 }}>3 minutes, no company name</div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}><AssessmentClient /></Suspense>

      <main className="wrap" style={{ padding: "clamp(48px,7vw,84px) var(--margin) clamp(36px,9vw,120px)" }}>
        {/* Short answer and three numbers */}
        <section aria-labelledby="short-answer" style={{ display: "flex", gap: 36, flexWrap: "wrap", alignItems: "flex-start" }}>
          <figure className="cut" style={{ flex: "1 1 520px", minWidth: 0, margin: 0, background: "#A8FF5C", color: "#0A0A0B", padding: "30px 40px 40px", ["--c" as string]: "26px" }}>
            <h2 id="short-answer" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>Short answer</h2>
            <div aria-hidden="true" style={{ ...michroma, fontSize: 96, lineHeight: 0.8, height: 56, WebkitTextStroke: "2px currentColor" }}>{"\u201C"}</div>
            <blockquote style={{ margin: "10px 0 0", fontSize: 22, lineHeight: 1.55, fontStyle: "italic" }}>{SHORT_ANSWER}</blockquote>
            <figcaption style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "inline-block", width: 36, height: 3, background: "#0A0A0B" }} aria-hidden="true" />
              <span style={{ fontSize: 17 }}>Elena Zap, founder of Partner2B</span>
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

        {/* Eight reasons */}
        <section aria-labelledby="why" style={section}>
          <h2 id="why" className="sectitle">Why a partner program does not perform</h2>
          <p style={{ margin: "14px 0 0", fontSize: 19, lineHeight: 1.55, color: "rgba(255,255,255,.85)" }}>Eight places to look, in the order a partner meets your program. The assessment checks each one</p>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginTop: 36, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>{left.map(reasonCard)}</div>
            <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22, paddingTop: 44 }}>{right.map(reasonCard)}</div>
          </div>
        </section>

        {/* Signs */}
        <section aria-labelledby="signs" style={section}>
          <h2 id="signs" className="sectitle">Signs your partner program is not working</h2>
          <div style={{ marginTop: 28, overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>{["What you see", "What it usually means", "Look first at"].map((h) => <th key={h} scope="col" style={{ fontWeight: 400, fontSize: 15, color: "rgba(255,255,255,.6)", padding: "0 20px 14px 0", borderBottom: "2px solid #A8FF5C" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {SIGNS.map((s) => (
                  <tr key={s.sign}>
                    <th scope="row" style={{ ...michroma, fontSize: 17, lineHeight: 1.45, WebkitTextStroke: "0.8px currentColor", padding: "26px 28px 26px 0", verticalAlign: "top", width: "30%", color: "#fff", borderBottom: "1px solid rgba(255,255,255,.18)" }}>{s.sign}</th>
                    <td style={{ fontSize: 18, lineHeight: 1.5, padding: "26px 28px 26px 0", verticalAlign: "top", width: "38%", color: "rgba(255,255,255,.88)", borderBottom: "1px solid rgba(255,255,255,.18)" }}>{s.means}</td>
                    <td style={{ padding: "22px 0", verticalAlign: "top", borderBottom: "1px solid rgba(255,255,255,.18)" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{s.look.split(", ").map((w) => <span key={w} style={{ background: "#A8FF5C", color: "#0A0A0B", fontSize: 15, padding: "4px 13px", borderRadius: 999, whiteSpace: "nowrap" }}>{w.charAt(0).toUpperCase() + w.slice(1)}</span>)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How it works and start */}
        <section aria-labelledby="how" style={{ ...section, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "stretch" }}>
          <div className="cut" style={{ flex: "1 1 460px", minWidth: 0, background: "#ECECEE", color: "#0A0A0B", padding: "28px 32px 34px" }}>
            <h2 id="how" style={{ fontWeight: 400, fontSize: 20, letterSpacing: 0, paddingBottom: 12, borderBottom: "2px solid #0A0A0B" }}>How the assessment works</h2>
            {steps.map((t, i) => (
              <div key={t} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "18px 0", borderBottom: i < 2 ? "2px solid #0A0A0B" : 0 }}>
                <span style={{ ...michroma, fontSize: 29, letterSpacing: 0, lineHeight: 1, WebkitTextStroke: "1.5px currentColor" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 17, lineHeight: 1.45, paddingTop: 4 }}>{t}</span>
              </div>
            ))}
          </div>
          <div className="cut" style={{ flex: "1 1 400px", minWidth: 0, background: "#0A0A0B", color: "#fff", padding: "36px 38px 44px", display: "flex", flexDirection: "column", justifyContent: "center", ["--c" as string]: "26px" }}>
            <div style={{ ...michroma, fontSize: 26, lineHeight: 1.3 }}>Find your two bottlenecks</div>
            <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.55 }}>You see the first one right away. Leave your email to get the full result and a PDF</p>
            <div style={{ marginTop: 28 }}><StartLink className="btn btn-p">Start the assessment</StartLink></div>
            <p style={{ margin: "20px 0 0", fontSize: 15, color: "rgba(255,255,255,.75)" }}>Free. 3 minutes. No company name</p>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" style={section}>
          <h2 id="faq" className="sectitle">Questions about partner programs that do not perform</h2>
          <div style={{ marginTop: 32, columnWidth: 440, columnGap: 64 }}>
            {FAQ.map((f, fi) => (
              <div key={f.q} style={{ breakInside: "avoid", paddingBottom: 28, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,.18)" }}>
                <h3 style={{ ...michroma, fontSize: 18, lineHeight: 1.45, margin: 0, color: "#fff", WebkitTextStroke: "0.8px currentColor", textWrap: "balance" as React.CSSProperties["textWrap"] }}><span style={{ color: "#A8FF5C", marginRight: 12 }}>{String(fi + 1).padStart(2, "0")}</span>{f.q}</h3>
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
