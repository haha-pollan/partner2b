import type { Metadata } from "next";
import { JsonLd, ORG, SITE, crumbs } from "@/components/JsonLd";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";

export const metadata: Metadata = {
  title: "About Partner2B | Partner marketing for B2B tech companies",
  description: "Partner2B helps B2B tech companies build and run partner programs, from recruitment and enablement to co-marketing. It also runs a free directory of B2B partner programs.",
  alternates: { canonical: "/about-us" },
};

export default function Page() {
  return (
    <div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "AboutPage", name: "About Partner2B", url: `${SITE}/about-us`, about: { "@id": `${SITE}/#organization` } }, { ...ORG, founder: { "@type": "Person", name: "Elena Zap", jobTitle: "Founder, Partner2B" } }, crumbs([["Partner2B", SITE], ["About", `${SITE}/about-us`]]) ] }} />
      <div style={{ overflow: "hidden" }}>
        <PageHero layout="poster" title="About" accent="Partner2B" sub="Partner2B helps businesses grow through partner ecosystems." />
      </div>
      <main className="wrap" style={{ padding: "clamp(36px,9vw,64px) var(--margin) clamp(36px,9vw,96px)" }}>
        <div style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.65, color: "#ECECEE" }}>
          <p style={{ margin: 0 }}>
            Partner2B is a free directory of B2B partner programs. It brings commissions, tiers, requirements and benefits for reseller, referral, technology, services, MSP and OEM programs into one place, so you can compare programs and join the ones that fit.
          </p>
          <p style={{ margin: "22px 0 0" }}>
            Every listing is compiled from open sources and links to the official program page. Companies can submit or claim their program, and only the company itself can change its terms.
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
