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
    title: "Claim a listing", intro: "Part of the company behind a program? Claim its listing to keep the terms accurate. Claiming is free",
    badge: "Free", badgeSub: "to claim a listing", card: "Your details",
    steps: ["We email your work address to confirm it", "You send us the updates to your terms", "We publish them and mark the listing as claimed"],
    band: { a: "Program not listed? ", b: "Add it for free", sub: "Send the link to its official page", cta: "Submit a program", href: "/submit" },
  },
  report: {
    title: "Report a correction", intro: "Spotted something wrong or out of date on a listing? Tell us and send a source if you have one",
    badge: "Free", badgeSub: "to report a correction", card: "What needs fixing",
    steps: ["We compare it with the official page", "We update the listing if it holds up", "You get a reply if you left an email"],
    band: { a: "Browse the ", b: "directory", sub: "Find the program page and check its details", cta: "Open the directory", href: "/directory" },
  },
};

export function FormPage({ kind, listings, defaultListing }: { kind: Kind; listings: { slug: string; label: string }[]; defaultListing?: string }) {
  const c = CFG[kind];
  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 100% no-repeat" }}>
        <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
          <div className="limepanel" style={{ width: 880 }} />
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px 90px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ maxWidth: "100%" }}>
              <h1 className="h1big" style={{ fontSize: 88 }}>{c.title}</h1>
              <p style={{ margin: "22px 0 0", maxWidth: 560, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>{c.intro}</p>
            </div>
            <div className="cut" style={{ flex: "0 0 320px", margin: "20px 40px 0 0", transform: "rotate(-4deg)", background: "#0A0A0B", color: "#ECECEE", padding: "28px 32px" }}>
              <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 64, letterSpacing: "-0.05em", lineHeight: 1, color: "#A8FF5C" }}>{c.badge}</div>
              <div style={{ marginTop: 8, fontSize: 18 }}>{c.badgeSub}</div>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ padding: "40px 40px 120px", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="cut" style={{ flex: "1 1 640px", minWidth: 0, background: "#0A0A0B", color: "#ECECEE", padding: "36px 40px 44px", position: "relative" }}>
            <h2 style={{ fontWeight: 800, fontSize: 30, letterSpacing: "-0.03em" }}>{c.card}</h2>
            <SubmissionForm kind={kind} listings={listings} defaultListing={defaultListing} />
          </div>
          <div className="cut" style={{ flex: "0 0 340px", background: "#ECECEE", color: "#0A0A0B", padding: "28px 28px 34px" }}>
            <h3 style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em", paddingBottom: 12, borderBottom: "2px solid #0A0A0B" }}>What happens next</h3>
            {c.steps.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? "2px solid #0A0A0B" : 0 }}>
                <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, paddingTop: 4 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#131416", color: "#ECECEE", padding: "90px 0 100px" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 52, letterSpacing: "-0.04em", lineHeight: 1.05 }}>{c.band.a}<span style={{ color: "#A8FF5C" }}>{c.band.b}</span></h2>
            <p style={{ margin: "16px 0 0", fontSize: 20, color: "#B9BABD" }}>{c.band.sub}</p>
          </div>
          <Link href={c.band.href} style={{ background: "#A8FF5C", color: "#0A0A0B", fontWeight: 800, padding: "16px 30px", borderRadius: 12, fontSize: 17 }}>{c.band.cta}</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
