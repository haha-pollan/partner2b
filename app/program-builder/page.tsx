import type { Metadata } from "next";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { BuilderClient } from "./BuilderClient";

export const metadata: Metadata = {
  title: "Partner program builder | Partner2B",
  description: "Answer a few questions and get a full partner program strategy as a PDF in your own branding: partner types, tiers, commercial model, KPIs and a 90-day plan.",
  alternates: { canonical: "/program-builder" },
};

const steps = ["Tell us about your company, buyers and goals", "We write your partner program strategy", "You download a PDF in your own branding"];

export default function Page() {
  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "WebApplication", name: "Partner2B Program builder", url: `${SITE}/program-builder`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "Answer a few questions and get a partner program strategy as a PDF: partner types, tiers, commercial model, KPIs and a 90-day plan.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG }, crumbs([["Partner2B", SITE], ["Program builder", `${SITE}/program-builder`]]) ] }} />
      <div style={{ overflow: "hidden" }}>
        <PageHero layout="form" title="Partner program builder" accent="" sub="Not sure which partners fit your product? Answer a few questions and get a full partner program strategy" slot={
          <div className="cut statcard" style={{ transform: "rotate(-4deg)", background: "#A8FF5C", color: "#0A0A0B", padding: "28px 32px", maxWidth: 320 }}>
            <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1, color: "#0A0A0B" }}>Free</div>
            <div style={{ marginTop: 8, fontSize: 18 }}>strategy in 3 minutes</div>
          </div>
        } />
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,120px)", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="" style={{ flex: "1 1 640px", minWidth: 0, background: "#0A0A0B", border: "2px solid #A8FF5C", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>Your company</h2>
            <BuilderClient />
          </div>
          <div className="cut" style={{ flex: "0 0 340px", background: "#FFFFFF", color: "#0A0A0B", padding: "28px 28px 34px" }}>
            <h3 style={{ fontWeight: 400, fontSize: 18, letterSpacing: 0, paddingBottom: 12, borderBottom: "2px solid #0A0A0B" }}>How it works</h3>
            {steps.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "2px solid #0A0A0B" : 0 }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 29, letterSpacing: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4, paddingTop: 4 }}>{t}</span>
              </div>
            ))}
            <div style={{ marginTop: 26, paddingTop: 18, borderTop: "2px solid #0A0A0B" }}>
              <div style={{ fontSize: 14, fontWeight: 400 }}>Example pages from a strategy</div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {[["/builder/sample-cover.jpg", "Cover page"], ["/builder/sample-ecosystem.jpg", "Partner ecosystem map"], ["/builder/sample-glance.jpg", "Program at a glance"]].map(([src, alt]) => (
                  <Image key={src} src={src} alt={`Example: ${alt}`} width={728} height={1029} sizes="100px" style={{ width: "calc(33.3% - 7px)", height: "auto", borderRadius: 4, border: "1px solid #B9BABD", background: "#fff" }} />
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#3A3B40" }}>An example for a fictional company</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
