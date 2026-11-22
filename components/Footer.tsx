import Link from "next/link";
import { Logo } from "./Logo";
import { AI_CATEGORIES } from "@/lib/ai";

const TYPES = ["Reseller", "Referral", "Technology", "Services", "MSP", "OEM or white label"];

export function Footer() {
  return (
    <footer className="foot">
      <div className="footinner">
        <div style={{ maxWidth: 400 }}>
          <Link href="/" aria-label="Partner2B home"><Logo variant="light" /></Link>
          <p style={{ margin: "20px 0 0", fontSize: 17, lineHeight: 1.6, fontWeight: 400, color: "#ECECEE" }}>
            A free B2B partner program directory with links to official sources
          </p>
        </div>
        <div className="footlinks" style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          <div>
            <div className="foothead">Directory</div>
            <div className="footcol">
              <Link href="/directory">All programs</Link>
              {TYPES.map((t) => (<Link key={t} href={`/directory?type=${encodeURIComponent(t)}`}>{t}</Link>))}
            </div>
          </div>
          <div>
            <div className="foothead">AI programs</div>
            <div className="footcol">
              <Link href="/ai">All AI programs</Link>
              {AI_CATEGORIES.map((c) => (<Link key={c.slug} href={`/ai/${c.slug}`}>{c.name}</Link>))}
            </div>
          </div>
          <div>
            <div className="foothead">Partner2B</div>
            <div className="footcol">
              <Link href="/program-builder">Program builder</Link>
              <Link href="/services">Services</Link>
              <Link href="/playbook">Free playbook</Link>
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
      <div className="legalbar">
        <span>© 2026 Partner2B</span>
        <span style={{ display: "flex", gap: 22 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
