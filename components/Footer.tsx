import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="foot" style={{ background: "#0A0A0B", color: "#ECECEE", position: "relative", overflow: "hidden", minHeight: 380 }}>
      <div className="bigword" aria-hidden="true" style={{ bottom: 58 }}>Partner2B</div>
      <div className="footinner" style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "48px 40px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 400 }}>
          <Link href="/" aria-label="Partner2B home"><Logo variant="light" /></Link>
          <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: "#B9BABD" }}>
            Partner2B is a free B2B partner program directory. Compare reseller, referral, technology, MSP and OEM programs, partner tiers, commission models and requirements. Every listing links to its official source.
          </p>
        </div>
        <div className="footlinks" style={{ display: "flex", gap: 28, flexWrap: "wrap", fontSize: 16, fontWeight: 400 }}>
          <Link href="/directory">Directory</Link>
          <Link href="/services">Services</Link>
          <Link href="/post">Blog</Link>
          <Link href="/submit">Submit a program</Link>
        </div>
      </div>
      <div className="legalbar" style={{ position: "absolute", left: 0, right: 0, bottom: 18 }}><div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 12, fontWeight: 300, color: "#85868B" }}>
        <span>© 2026 Partner2B</span>
        <span style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </span>
      </div></div>
    </footer>
  );
}
