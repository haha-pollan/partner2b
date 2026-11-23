import type { Metadata } from "next";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Partner pipeline calculator | Partner2B",
  description: "Enter your revenue goal, deal size and sales cycle and see how many partner companies you need to list and reach out to, with every assumption editable.",
  alternates: { canonical: "/partner-pipeline-calculator" },
};

const steps = ["Enter your revenue goal, deal size and sales cycle", "Check the assumptions, you can edit every one", "See how many partners to list and reach out to"];

const A = ({ href, t }: { href: string; t: string }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>{t}</a>;
const SOURCES: [string, string, React.ReactNode][] = [
  ["Win rate", "15 to 24% by company type", <><A href="https://www.landbase.com/blog/win-rate-benchmarks-industry-deal-size-2026" t="Win rate benchmarks by deal size" /></>],
  ["Sales cycle", "12 to 24 weeks by company type", <><A href="https://thedigitalbloom.com/learn/pipeline-performance-benchmarks-2025/" t="Pipeline benchmarks" />, <A href="https://prospeo.io/s/sales-cycle-saas" t="SaaS sales cycle data" /></>],
  ["Reply rate", "3.4%, 5% or 15% by approach", <><A href="https://instantly.ai/blog/cold-email-reply-rate-benchmarks/" t="Cold email reply benchmarks" />, <A href="https://www.apollo.io/insights/what-is-a-good-benchmark-for-reply-rates-in-cold-outreach" t="Apollo" />, <A href="https://gp.demandcurve.com/lessons/bonus-measure-success-and-building-momentum" t="Demand Curve" /></>],
  ["Activation rate", "25 to 45% by approach", <A href="https://www.introw.io/blog/partner-recruitment" t="Partner recruitment guide" />],
  ["Contact found rate", "55 to 70% by approach", <><A href="https://www.dropcontact.com/help/average-email-enrichment-rate" t="Dropcontact" />, <A href="https://www.pin.com/blog/email-finder-vendor-audit/" t="Email finder audit" /></>],
  ["Deliverability", "92 to 98% by approach", <A href="https://lemlist.com/blog/cold-email-response-rate" t="Cold email reply and bounce rates" />],
  ["Deals per active partner", "1 to 24 a year by deal size and partner type", "Partner2B planning model, conservative end"],
  ["Replies that sign, fit check", "Set by approach", "Partner2B planning assumptions, no published benchmark"],
];

export default function Page() {
  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "WebApplication", name: "Partner2B Partner pipeline calculator", url: `${SITE}/partner-pipeline-calculator`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "Enter a revenue goal, deal size and sales cycle and see how many partner companies to list and reach out to.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG }, crumbs([["Partner2B", SITE], ["Partner pipeline calculator", `${SITE}/partner-pipeline-calculator`]]) ] }} />
      <div style={{ overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <Nav />
          <div className="wrap" style={{ padding: "24px var(--margin) clamp(36px,9vw,90px)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: "100%" }}>
              <h1 className="h1big" style={{ fontSize: "clamp(28px,4vw,64px)" }}>Partner pipeline calculator</h1>
              <p style={{ margin: "22px 0 0", maxWidth: 640, fontSize: 21, lineHeight: 1.5, fontWeight: 400 }}>Not sure how many partners you need? Enter your revenue goal and deal size and see how big your partner list has to be</p>
            </div>
            <div className="cut statcard" style={{ flex: "0 0 320px", margin: "20px 40px 0 0", transform: "rotate(-4deg)", background: "#0A0A0B", padding: "28px 32px" }}>
              <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1, color: "#A8FF5C" }}>Free</div>
              <div style={{ marginTop: 8, fontSize: 18 }}>result in 1 minute</div>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,70px)", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="cut" style={{ flex: "1 1 640px", minWidth: 0, background: "#0A0A0B", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>Your goal</h2>
            <CalculatorClient />
          </div>
          <div className="cut" style={{ flex: "0 0 340px", background: "#ECECEE", color: "#0A0A0B", padding: "28px 28px 34px" }}>
            <h3 style={{ fontWeight: 400, fontSize: 18, letterSpacing: 0, paddingBottom: 12, borderBottom: "2px solid #0A0A0B" }}>How it works</h3>
            {steps.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "2px solid #0A0A0B" : 0 }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 29, letterSpacing: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4, paddingTop: 4 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="wrap" style={{ padding: "0 var(--margin) clamp(36px,9vw,120px)" }}>
          <div className="cut" style={{ background: "#fff", color: "#0A0A0B", padding: "34px 36px 40px", ["--c" as string]: "28px" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>Where the starting values come from</h2>
            <p style={{ margin: "14px 0 0", maxWidth: 760, fontSize: 17, lineHeight: 1.55, color: "#3A3B40" }}>The starting values are planning assumptions from published benchmarks. Most of those figures come from tool vendors and research blogs, so read them as ranges. Change any value to match your own data.</p>
            <div style={{ overflowX: "auto", marginTop: 22 }}>
              <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 16, lineHeight: 1.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", background: "#2A2B30", color: "#A8FF5C" }}>
                    <th style={{ padding: "12px 14px", fontWeight: 400 }}>Assumption</th><th style={{ padding: "12px 14px", fontWeight: 400 }}>Starting value</th><th style={{ padding: "12px 14px", fontWeight: 400 }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {SOURCES.map(([a, v, s], i) => (
                    <tr key={a} style={{ background: i % 2 ? "#ECECEE" : "#fff", verticalAlign: "top" }}>
                      <td style={{ padding: "12px 14px" }}>{a}</td><td style={{ padding: "12px 14px" }}>{v}</td><td style={{ padding: "12px 14px" }}>{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
