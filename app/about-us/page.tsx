import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";

export const metadata: Metadata = {
  title: "About Partner2B | B2B partner program directory",
  description: "Partner2B is a free directory of B2B partner programs. Compare reseller, referral, technology and MSP programs, with commissions, tiers and requirements from official sources.",
  alternates: { canonical: "/about-us" },
};

export default function Page() {
  return (
    <div>
      <div style={{ overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "40px 40px clamp(36px,9vw,64px)" }}>
          <h1 className="h1big">About Partner2B</h1>
          <p style={{ margin: "22px 0 0", maxWidth: 720, fontSize: 20, lineHeight: 1.5, color: "#ECECEE" }}>
            Partner2B helps businesses grow through partner ecosystems.
          </p>
        </div>
      </div>
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) 40px clamp(36px,9vw,96px)" }}>
        <div style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.65, color: "#ECECEE" }}>
          <p style={{ margin: 0 }}>
            Partner2B is a free directory of B2B partner programs. It brings commissions, tiers, requirements and benefits for reseller, referral, technology, services, MSP and OEM programs into one place, so you can compare programs and join the ones that fit.
          </p>
          <p style={{ margin: "22px 0 0" }}>
            Every listing is compiled from open sources and links to the official program page. Companies can submit or claim their program, and anyone can report a correction.
          </p>
          <p style={{ margin: "22px 0 0" }}>
            Explore the <Link href="/directory" style={{ borderBottom: "1.5px solid #A8FF5C" }}>directory</Link>, read the <Link href="/glossary" style={{ borderBottom: "1.5px solid #A8FF5C" }}>glossary</Link>, or <Link href="/contact" style={{ borderBottom: "1.5px solid #A8FF5C" }}>get in touch</Link>.
          </p>
        </div>
      </main>
      <BuilderCta />
      <Footer />
    </div>
  );
}
