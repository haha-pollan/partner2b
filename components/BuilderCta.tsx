import Link from "next/link";
import Image from "next/image";
import { builderIsNew } from "@/lib/launch";

const PAGES = [
  { src: "/builder/sample-cover.jpg", alt: "Cover of an example partner program strategy" },
  { src: "/builder/sample-ecosystem.jpg", alt: "Partner ecosystem map from an example strategy" },
  { src: "/builder/sample-glance.jpg", alt: "Program at a glance page from an example strategy" },
];
const CHIPS = ["Partner types and ecosystem map", "Tiers and earnings", "KPIs and a 90 day plan"];

// A full width band that promotes the program builder. Place it just above the footer.
export function BuilderCta({ images = true, variant = "band" }: { images?: boolean; variant?: "band" | "home" }) {
  const home = variant === "home";
  const shown = images ? PAGES.slice(0, home ? 3 : 2) : [];
  return (
    <section className={home ? "bcta bctahome" : "bcta"} aria-labelledby={home ? "bcta-home" : undefined}>
      <div className="wrap bctain">
        <div className="bctatext">
          {builderIsNew() && <span className="bctanew" suppressHydrationWarning>New</span>}
          <h2 id={home ? "bcta-home" : undefined}>Build your partner program strategy</h2>
          <p>Answer a few questions and get a strategy PDF in your own branding, with partner types, tiers, earnings and a 90 day plan</p>
          {home && <div className="bctachips">{CHIPS.map((c) => <span key={c}>{c}</span>)}</div>}
          <Link href="/program-builder" className="bctabtn">Open the program builder</Link>
        </div>
        {shown.length > 0 && (
          <div className={home ? "bctapages bctapages3" : "bctapages"}>
            {shown.map((p, i) => (
              <Image key={p.src} src={p.src} alt={p.alt} width={728} height={1029} sizes="220px" className={`bctapg bctapg${i}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
