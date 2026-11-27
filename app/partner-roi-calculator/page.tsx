import { Suspense } from "react";
import type { Metadata } from "next";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Partner ROI calculator | Partner2B",
  description: "Enter your deal size, number of active partners and monthly program cost and see what your partner program returns, when it pays back and what each customer costs.",
  alternates: { canonical: "/partner-roi-calculator" },
};

const steps = ["Enter your deal size, partners and monthly program cost", "Check the assumptions, you can edit every one", "See your return and the month the program pays back"];

export default function Page() {
  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "WebApplication", name: "Partner2B Partner ROI calculator", url: `${SITE}/partner-roi-calculator`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "Enter a deal size, number of active partners and monthly program cost and see the return of a partner program and the month it pays back.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG }, crumbs([["Partner2B", SITE], ["Partner ROI calculator", `${SITE}/partner-roi-calculator`]]) ] }} />
      <div style={{ overflow: "hidden" }}>
        <PageHero layout="banner" title="Partner ROI calculator" accent="Know what your program returns" sub="Not sure your partner program pays off? Enter your deal size, partners and monthly cost and see the return and the month it pays back" />
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,120px)", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 640px", minWidth: 0, background: "#0A0A0B", border: "2px solid #A8FF5C", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>Your program</h2>
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
