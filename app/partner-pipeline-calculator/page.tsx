import { Suspense } from "react";
import type { Metadata } from "next";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Partner pipeline calculator | Partner2B",
  description: "Enter your revenue goal, deal size and sales cycle and see how many partner companies you need to list and reach out to, with every assumption editable.",
  alternates: { canonical: "/partner-pipeline-calculator" },
};

const steps = ["Enter your revenue goal, deal size and sales cycle", "Check the assumptions, you can edit every one", "See how many partners to list and reach out to"];

export default function Page() {
  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "WebApplication", name: "Partner2B Partner pipeline calculator", url: `${SITE}/partner-pipeline-calculator`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "Enter a revenue goal, deal size and sales cycle and see how many partner companies to list and reach out to.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG }, crumbs([["Partner2B", SITE], ["Partner pipeline calculator", `${SITE}/partner-pipeline-calculator`]]) ] }} />
      <div style={{ overflow: "hidden" }}>
        <PageHero layout="banner" title="Partner pipeline calculator" accent="Know your pipeline before you start" sub="Not sure how many partners you need? Enter your revenue goal and deal size and see how big your partner list has to be" />
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,120px)", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="" style={{ flex: "1 1 640px", minWidth: 0, background: "#0A0A0B", border: "2px solid #A8FF5C", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>Your goal</h2>
            <Suspense fallback={null}><CalculatorClient /></Suspense>
          </div>
          <div style={{ flex: "0 0 340px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="cut" style={{ background: "#FFFFFF", color: "#0A0A0B", padding: "28px 28px 34px" }}>
            <h3 style={{ fontWeight: 400, fontSize: 18, letterSpacing: 0, paddingBottom: 12, borderBottom: "2px solid #0A0A0B" }}>How it works</h3>
            {steps.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "2px solid #0A0A0B" : 0 }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 29, letterSpacing: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4, paddingTop: 4 }}>{t}</span>
              </div>
            ))}
          </div>
          <div className="cut" aria-hidden="true" style={{ background: "#A8FF5C", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", minHeight: 190, ["--c" as string]: "24px" }}>
            <Toby height={190} rows={30} glasses animate={false} />
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
