import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SubmissionForm } from "./SubmissionForm";
import type { Kind } from "@/lib/formsConfig";

type Cfg = {
  title: string; intro: string; badge: string; badgeSub: string; card: string; steps: string[];
  band: { a: string; b?: string; sub: string; cta: string; href: string };
};
const CFG: Record<Kind, Cfg> = {
  submit: {
    title: "Submit a program", intro: "Know a partner program that is missing? Send us the link to its official page. Listing is free",
    badge: "Free", badgeSub: "to list a program", card: "Program details",
    steps: ["We check the link to the official page", "We add the listing to the directory", "The company can claim it and keep its terms current"],
    band: { a: "Own a listed program? ", b: "Claim it for free", sub: "Keep your terms accurate and up to date", cta: "Claim a listing", href: "/claim" },
  },
  claim: {
    title: "Claim a listing", intro: "Part of the company behind a program? Claim its listing to keep the terms accurate and correct anything that is wrong. Claiming is free",
    badge: "Free", badgeSub: "to claim a listing", card: "Your details",
    steps: ["We email your work address to confirm it", "You send us the updates to your terms", "We publish them and mark the listing as claimed"],
    band: { a: "Program not listed? ", b: "Add it for free", sub: "Send the link to its official page", cta: "Submit a program", href: "/submit" },
  },
};

export function FormPage({ kind, listings, defaultListing }: { kind: Kind; listings: { slug: string; label: string }[]; defaultListing?: string }) {
  const c = CFG[kind];
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{ position: "relative" }}>
          <Nav />
          <div className="wrap" style={{ padding: "24px var(--margin) clamp(36px,9vw,90px)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: "100%" }}>
              <h1 className="h1big" style={{ fontSize: "clamp(28px,4vw,64px)" }}>{c.title}</h1>
              <p style={{ margin: "22px 0 0", maxWidth: 560, fontSize: 21, lineHeight: 1.5, fontWeight: 400 }}>{c.intro}</p>
            </div>
            <div className="cut statcard" style={{ flex: "0 0 320px", margin: "20px 40px 0 0", transform: "rotate(-4deg)", background: "#26272B", padding: "28px 32px" }}>
              <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1, color: "#A8FF5C" }}>{c.badge}</div>
              <div style={{ marginTop: 8, fontSize: 18 }}>{c.badgeSub}</div>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ padding: "40px var(--margin) clamp(36px,9vw,120px)", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="cut" style={{ flex: "1 1 640px", minWidth: 0, background: "#26272B", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0 }}>{c.card}</h2>
            <SubmissionForm kind={kind} listings={listings} defaultListing={defaultListing} />
          </div>
          <div className="cut" style={{ flex: "0 0 340px", background: "#ECECEE", color: "#0A0A0B", padding: "28px 28px 34px" }}>
            <h3 style={{ fontWeight: 400, fontSize: 18, letterSpacing: 0, paddingBottom: 12, borderBottom: "2px solid #0A0A0B" }}>What happens next</h3>
            {c.steps.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "2px solid #0A0A0B" : 0 }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 29, letterSpacing: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4, paddingTop: 4 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "clamp(36px,9vw,90px) 0 clamp(36px,9vw,100px)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontWeight: 400, fontSize: 40, letterSpacing: 0, lineHeight: 1.05 }}>{c.band.a}<span style={{ color: "#A8FF5C" }}>{c.band.b}</span></h2>
            <p style={{ margin: "16px 0 0", fontSize: 20, color: "#B9BABD" }}>{c.band.sub}</p>
          </div>
          <Link href={c.band.href} className="btn btn-p">{c.band.cta}</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
