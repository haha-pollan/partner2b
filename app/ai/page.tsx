import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPrograms } from "@/lib/programs";
import { AI_CATEGORIES, inCat } from "@/lib/ai";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "AI partner programs: vendors, agent platforms and integrators | Partner2B",
  description: "Browse official partner programs from AI vendors: foundation models, agent platforms, AI infrastructure, vector databases, AI security and AI integrators.",
  alternates: { canonical: "/ai" },
};

export default async function AiHub() {
  const all = await getPrograms();
  const groups = AI_CATEGORIES.map((c) => ({ c, list: inCat(all, c) }));
  const total = groups.reduce((n, g) => n + g.list.length, 0);
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: "AI partner program categories",
    itemListElement: AI_CATEGORIES.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `https://partner2b.com/ai/${c.slug}` })),
  };
  return (
    <div style={{ background: "#fff url(/mesh-directory.svg) top / 100% 100% no-repeat", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
        <div className="limepanel" />
        <Nav />
        <div className="wrap" style={{ padding: "24px 40px clamp(36px,9vw,96px)" }}>
          <h1 className="h1big"><span style={{ display: "block" }}>AI partner</span><span style={{ display: "block" }}>programs</span></h1>
          <p style={{ margin: "24px 0 0", maxWidth: 760, fontSize: 21, lineHeight: 1.5, fontWeight: 300 }}>
            {total} official partner programs from AI vendors, agent platforms and AI integrators. Every listing links to the vendor&apos;s own page
          </p>
        </div>
      </div>
      <div style={{ position: "relative", color: "#0A0A0B", padding: "clamp(36px,9vw,96px) 0" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>Browse by category</h2>
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
            {groups.map(({ c, list }) => (
              <Link key={c.slug} href={`/ai/${c.slug}`} className="card cut" style={{ display: "block", minHeight: 190 }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 18, lineHeight: 1.25 }}>{c.name}</div>
                <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.5, fontWeight: 300 }}>{c.short}</p>
                <div style={{ marginTop: 14, fontSize: 15, fontWeight: 500 }}>{list.length} programs <span aria-hidden="true">→</span></div>
              </Link>
            ))}
          </div>
          <section style={{ marginTop: 72, maxWidth: 820 }}>
            <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>How AI partner programs work</h2>
            <p style={{ margin: "20px 0 0", fontSize: 20, lineHeight: 1.6, fontWeight: 300 }}>
              AI vendors grow through partners who implement, integrate or resell their products. Agent platforms often reward agencies with referral revenue and certification, model providers build networks of integrators, and security vendors work through resellers and managed service providers. Integrators are listed only when they publish an official partner or alliance page.
            </p>
            <p style={{ margin: "16px 0 0", fontSize: 20, lineHeight: 1.6, fontWeight: 300 }}>
              Building your own AI partner program? Try the <Link href="/program-builder" style={{ textDecoration: "underline" }}>Partner program builder</Link>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
