import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact | Partner2B",
  description: "Contact Partner2B at hello@partner2b.com about partner marketing, program listings, corrections and partnerships.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <div>
      <PageHero layout="diagonal" title="Contact" accent="" sub="Questions about the directory, a listing or a partnership? Write to us." buttons={<a href="mailto:hello@partner2b.com" className="btn btn-p">hello@partner2b.com</a>} />
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) var(--margin) clamp(36px,9vw,96px)" }}>
        <div style={{ maxWidth: 760 }}>
          <p style={{ margin: "0", fontSize: 18, lineHeight: 1.65, color: "#ECECEE" }}>
            To add your program, use the <Link href="/submit" style={{ borderBottom: "1.5px solid #A8FF5C" }}>submission form</Link>. To take over a listing and correct its terms, <Link href="/claim" style={{ borderBottom: "1.5px solid #A8FF5C" }}>claim it</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
