import { Suspense } from "react";
import type { Metadata } from "next";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Toby } from "@/components/Toby";
import { Footer } from "@/components/Footer";
import { AssessmentClient } from "./AssessmentClient";

export const metadata: Metadata = {
  title: "Partner program assessment | Partner2B",
  description: "Find out why your partner program does not perform. Answer 16 short statements and see which two things hold it back and what to fix first. Free, no company name needed.",
  alternates: { canonical: "/partner-program-assessment" },
};

export default function Page() {
  return (
    <div style={{ overflow: "hidden" }}>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "WebApplication", name: "Partner2B Partner program assessment", url: `${SITE}/partner-program-assessment`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "Answer 16 short statements and see which two things hold your partner program back and what to fix first.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: ORG }, crumbs([["Partner2B", SITE], ["Partner program assessment", `${SITE}/partner-program-assessment`]]) ] }} />
      <div className="hero">
        <Nav />
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Partner program assessment</span>
              <span className="pt pt2">Why it does not perform</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>Partners joined, but the revenue did not follow? Answer 16 short statements and see which two things hold your program back, and what to fix first</p>
            <div className="herobtns"><a href="#start" className="btn btn-p">Start the assessment</a></div>
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
      <div id="start" className="wrap" style={{ padding: "60px var(--margin) clamp(36px,9vw,120px)" }}>
        <Suspense fallback={null}><AssessmentClient /></Suspense>
      </div>
      <Footer />
    </div>
  );
}
