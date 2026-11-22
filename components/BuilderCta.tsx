import Link from "next/link";
import Image from "next/image";
import { builderIsNew } from "@/lib/launch";

const PAGES = [
  { src: "/builder/sample-cover.jpg", alt: "Cover of an example partner program strategy" },
  { src: "/builder/sample-ecosystem.jpg", alt: "Partner ecosystem map from an example strategy" },
  { src: "/builder/sample-glance.jpg", alt: "Program at a glance page from an example strategy" },
];
const CHIPS = ["Partner types and ecosystem map", "Tiers and earnings", "KPIs and a 90 day plan"];

// A band that promotes the program builder. Place it just above the footer.
export function BuilderCta({ images = true, variant = "band" }: { images?: boolean; variant?: "band" | "home" }) {
  const home = variant === "home";
  const shown = images ? PAGES.slice(0, home ? 3 : 2) : [];
  return (
    <section aria-labelledby={home ? "bcta-home" : undefined} style={{ padding: "60px 0 20px" }}>
      <div className="wrap">
        <div className="bldbox cut">
          <div className="bldtext">
            {builderIsNew() && <span className="newbadge" suppressHydrationWarning style={{ marginLeft: 0, marginBottom: 14 }}>New</span>}
            <h2 id={home ? "bcta-home" : undefined} style={{ fontSize: "clamp(24px,3vw,40px)", lineHeight: 1.15 }}>Build your partner program strategy</h2>
            <p style={{ margin: "18px 0 0", fontSize: 19, lineHeight: 1.55, fontWeight: 400 }}>Answer a few questions and get a strategy PDF in your own branding, with partner types, tiers, earnings and a 90 day plan</p>
            {home && <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>{CHIPS.map((c) => <span key={c} className="chip">{c}</span>)}</div>}
            <Link href="/program-builder" className="btn btn-s" style={{ marginTop: 28 }}>Open the program builder</Link>
          </div>
          {shown.length > 0 && (
            <div className="bldpages" aria-hidden="true">
              {shown.slice(0, 2).map((p, i) => (
                <Image key={p.src} src={p.src} alt="" width={728} height={1029} sizes="270px" className={`bldpg bldpg${i}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
