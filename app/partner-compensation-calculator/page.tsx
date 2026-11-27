import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Partner compensation budget calculator | Partner2B",
  description: "Enter your partner revenue goal, deal size and partner type and see how much to budget for commissions, renewals, partner marketing funds and bonuses, and whether it fits your margin.",
  alternates: { canonical: "/partner-compensation-calculator" },
};
const steps = ["Enter your partner revenue goal, deal size and partner type", "Check the rates and the split, you can edit every one", "See your compensation budget and where it goes"];

export default function Page() {
  return (
    <div style={{ overflow: "hidden" }}>
      <PageHero layout="banner" title="Partner compensation budget calculator" accent="Know what to pay your partners" sub="Not sure how much to budget for partners? Enter your revenue goal and deal size and see what compensation costs and whether it fits your margin" />
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
      <Footer />
    </div>
  );
}
