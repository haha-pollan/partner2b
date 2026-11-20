import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer style={{ background: "#0A0A0B", color: "#ECECEE", position: "relative", overflow: "hidden", minHeight: 380 }}>
      <div className="bigword" aria-hidden="true">Partner2B</div>
      <div style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "48px 40px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 340 }}>
          <Link href="/" aria-label="Partner2B home"><Logo variant="light" /></Link>
          <p style={{ margin: "18px 0 0", fontSize: 14, lineHeight: 1.6, fontWeight: 300, color: "#B9BABD" }}>
            Free directory of public B2B partner programs. Every listing is built from public information and links to its official source.
          </p>
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", fontSize: 16, fontWeight: 400 }}>
          <Link href="/directory">Directory</Link>
          <Link href="/services">Services</Link>
          <Link href="/post">Blog</Link>
          <Link href="/submit">Submit a program</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div style={{ fontSize: 15, color: "#85868B" }}>© 2026 Partner2B</div>
      </div>
    </footer>
  );
}
