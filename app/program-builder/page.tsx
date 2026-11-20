import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderClient } from "./BuilderClient";

export const metadata: Metadata = {
  title: "Partner program builder | Partner2B",
  description: "Answer a few questions and get a partner program blueprint: your ideal partner profile, program structure, a 90-day plan and ten matched programs to benchmark.",
  alternates: { canonical: "/program-builder" },
};

const steps = ["Tell us about your company and goals", "We define your ideal partner profile", "You get a blueprint and ten matched programs"];

export default function Page() {
  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 100% no-repeat" }}>
        <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
          <div className="limepanel" style={{ width: 1040 }} />
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px clamp(36px,9vw,90px)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: "100%" }}>
              <h1 className="h1big" style={{ fontSize: "clamp(28px,4vw,64px)" }}>Partner program builder</h1>
              <p style={{ margin: "22px 0 0", maxWidth: 560, fontSize: 21, lineHeight: 1.5, fontWeight: 300 }}>Not sure which partners fit your product? Answer a few questions and get a program built around your ideal partner profile</p>
            </div>
            <div className="cut statcard" style={{ flex: "0 0 320px", margin: "20px 40px 0 0", transform: "rotate(-4deg)", background: "#0A0A0B", color: "#ECECEE", padding: "28px 32px" }}>
              <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1, color: "#A8FF5C" }}>Free</div>
              <div style={{ marginTop: 8, fontSize: 18 }}>blueprint in 2 minutes</div>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ padding: "40px 40px clamp(36px,9vw,120px)", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="cut" style={{ flex: "1 1 640px", minWidth: 0, background: "#0A0A0B", color: "#ECECEE", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>Your company</h2>
            <BuilderClient />
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
      </div>
      <Footer />
    </div>
  );
}
