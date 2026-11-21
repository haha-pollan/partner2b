import Link from "next/link";
import type { Metadata } from "next";
import { getPrograms } from "@/lib/programs";
import { AI_CATEGORIES, inCat, aiOnly } from "@/lib/ai";
import { DirectoryView, type SP } from "@/components/DirectoryView";

export const revalidate = 600;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Object.values(sp).some((v) => v !== undefined && v !== "");
  return {
    title: "AI partner programs: vendors, agent platforms and integrators | Partner2B",
    description: "Browse and filter official partner programs from AI vendors: foundation models, agent platforms, AI infrastructure, vector databases, AI security, AI-first HR and sales tools, and AI integrators.",
    alternates: { canonical: "/ai" },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function AiHub({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  const pool = aiOnly(all);
  const groups = AI_CATEGORIES.map((c) => ({ c, list: inCat(all, c) }));
  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: "AI partner program categories",
    itemListElement: AI_CATEGORIES.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `https://partner2b.com/ai/${c.slug}` })),
  };
  const before = (
    <div className="wrap" style={{ marginBottom: 56 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>Browse by category</h2>
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
        {groups.map(({ c, list }) => (
          <Link key={c.slug} href={`/ai/${c.slug}`} className="aicard cut" style={{ minHeight: 190 }}>
            <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 18, lineHeight: 1.25 }}>{c.name}</div>
            <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.5, fontWeight: 300 }}>{c.short}</p>
            <div style={{ marginTop: 14, fontSize: 15, fontWeight: 500 }}>{list.length} programs <span aria-hidden="true">→</span></div>
          </Link>
        ))}
      </div>
      <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0, marginTop: 64 }}>All AI programs</h2>
    </div>
  );
  const after = (
    <div style={{ position: "relative", color: "#0A0A0B", padding: "0 0 clamp(36px,9vw,96px)" }}>
      <div className="wrap">
        <section style={{ maxWidth: 820 }}>
          <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>How AI partner programs work</h2>
          <p style={{ margin: "20px 0 0", fontSize: 20, lineHeight: 1.6, fontWeight: 300 }}>
            AI vendors grow through partners who implement, integrate or resell their products. Agent platforms often reward agencies with referral revenue and certification, model providers build networks of integrators, and security vendors work through resellers and managed service providers. Integrators are listed only when they publish an official partner or alliance page.
          </p>
        </section>
      </div>
    </div>
  );
  return (
    <DirectoryView sp={sp} pool={pool} base="/ai" ai h1={["AI partner", "programs"]}
      sub={`${pool.length} official partner programs from AI vendors, agent platforms and AI integrators. Every listing links to the vendor's own page`}
      before={before} after={after} />
  );
}
