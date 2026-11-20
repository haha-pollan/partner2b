import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer style={{ background: "#0A0A0B", color: "#ECECEE", position: "relative", overflow: "hidden", minHeight: 380 }}>
      <div className="bigword" aria-hidden="true">Partner2B</div>
      <div style={{ position: "relative", maxWidth: 1360, margin: "0 auto", padding: "48px 40px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
        <Logo variant="light" />
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", fontSize: 16, fontWeight: 600 }}>
          <Link href="/directory">Directory</Link>
        </div>
        <div style={{ fontSize: 15, color: "#85868B" }}>© 2026 Partner2B</div>
      </div>
    </footer>
  );
}
