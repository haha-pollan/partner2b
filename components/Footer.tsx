import Link from "next/link";
import { Logo } from "./Logo";
import { AI_CATEGORIES } from "@/lib/ai";

const TYPES = ["Reseller", "Referral", "Technology", "Services", "MSP", "OEM or white label"];
const head: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 13, color: "#ECECEE", marginBottom: 16 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };

export function Footer() {
  return (
    <footer className="foot" style={{ background: "#0A0A0B", color: "#ECECEE", position: "relative", overflow: "hidden", minHeight: 540 }}>
      <div className="bigword" aria-hidden="true" style={{ bottom: 58 }}>Partner2B</div>
      <div className="footinner" style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "48px 40px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 400 }}>
          <Link href="/" aria-label="Partner2B home"><Logo variant="light" /></Link>
          <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: "#B9BABD" }}>
            Partner2B is a free B2B partner program directory. Compare reseller, referral, technology, MSP and OEM programs, partner tiers, commission models and requirements. Every listing links to its official source.
          </p>
        </div>
        <div className="footlinks" style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
          <div>
            <div style={head}>Directory</div>
            <div className="footcol" style={col}>
              <Link href="/directory">All programs</Link>
              {TYPES.map((t) => (<Link key={t} href={`/directory?type=${encodeURIComponent(t)}`}>{t}</Link>))}
            </div>
          </div>
          <div>
            <div style={{ ...head, color: "#B9A9FF" }}>AI programs</div>
            <div className="footcol" style={col}>
              <Link href="/ai">All AI programs</Link>
              {AI_CATEGORIES.map((c) => (<Link key={c.slug} href={`/ai/${c.slug}`}>{c.name}</Link>))}
            </div>
          </div>
          <div>
            <div style={head}>Partner2B</div>
            <div className="footcol" style={col}>
              <Link href="/program-builder">Program builder</Link>
              <Link href="/services">Services</Link>
              <Link href="/post">Blog</Link>
              <Link href="/glossary">Glossary</Link>
              <Link href="/about-us">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/submit">Submit a program</Link>
              <Link href="/claim">Claim a listing</Link>
              <Link href="/report">Report a correction</Link>
            </div>
          </div>
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
