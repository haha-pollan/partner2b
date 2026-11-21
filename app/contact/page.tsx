import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact | Partner2B",
  description: "Contact Partner2B at hello@partner2b.com for questions about the B2B partner program directory, listings, corrections and partnerships.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 220% no-repeat", overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px 40px clamp(36px,9vw,64px)" }}>
          <h1 style={{ fontWeight: 400, fontSize: 56, lineHeight: 1, letterSpacing: 0, color: "#0A0A0B" }}>Contact</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 720, fontSize: 20, lineHeight: 1.5, color: "#1C1D20" }}>
            Questions about the directory, a listing or a partnership? Write to us.
          </p>
        </div>
      </div>
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) 40px clamp(36px,9vw,96px)" }}>
        <div style={{ maxWidth: 760 }}>
          <a href="mailto:hello@partner2b.com" style={{ display: "inline-block", background: "#0A0A0B", color: "#A8FF5C", fontFamily: "'Michroma',sans-serif", fontSize: 16, padding: "16px 30px", borderRadius: 12 }}>
            hello@partner2b.com
          </a>
          <p style={{ margin: "36px 0 0", fontSize: 18, lineHeight: 1.65, color: "#2A2B2F" }}>
            To add your program, use the <Link href="/submit" style={{ borderBottom: "1.5px solid #A8FF5C" }}>submission form</Link>. To take over a listing, <Link href="/claim" style={{ borderBottom: "1.5px solid #A8FF5C" }}>claim it</Link>. If something on a listing is wrong, <Link href="/report" style={{ borderBottom: "1.5px solid #A8FF5C" }}>report a correction</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
