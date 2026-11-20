import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Tile } from "@/components/Tile";
import { getPrograms, getProgram, commissionLabel, verifiedLabel } from "@/lib/programs";

export const revalidate = 600;

export async function generateStaticParams() {
  const all = await getPrograms();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProgram(slug);
  if (!p) return {};
  return {
    title: `${p.company} partner program | Partner2B Directory`,
    description: p.description ?? `${p.company} partner program details.`,
    alternates: { canonical: `/directory/${p.slug}` },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getPrograms();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();

  const related = all
    .filter((x) => x.id !== p.id && x.product_category === p.product_category)
    .slice(0, 3);
  const source = p.domain ?? new URL(p.program_url).hostname;

  return (
    <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 100% no-repeat", overflow: "hidden" }}>
      <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
        <div className="limepanel" />
        <Nav />
        <div className="wrap" style={{ padding: "8px 40px 80px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/directory" style={{ textDecoration: "underline" }}>Directory</Link><span>/</span>
            <span>{p.product_category}</span><span>/</span><span>{p.company}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 28, flexWrap: "wrap" }}>
            <Tile type={p.primary_type} size={120} />
            <h1 style={{ fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: "-0.05em" }}>{p.company}</h1>
          </div>
          {p.product_note && <div style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>{p.product_note}</div>}
          <p style={{ margin: "24px 0 0", maxWidth: 760, fontSize: 22, lineHeight: 1.5, fontWeight: 500 }}>{p.description}</p>
          <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {p.program_types.map((t) => (<span key={t} className="pill">{t}</span>))}
            <span className="tag" style={{ background: "#ECECEE" }}>{p.region}</span>
            <span className="tag" style={{ background: "#ECECEE" }}>{p.product_category}</span>
            <span className="tag" style={{ background: "#ECECEE" }}>{commissionLabel(p)}</span>
          </div>
          <div style={{ marginTop: 36 }}>
            <a href={p.program_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#0A0A0B", color: "#A8FF5C", fontWeight: 800, fontSize: 18, padding: "20px 36px", borderRadius: 12 }}>
              Visit the official program page
            </a>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", color: "#0A0A0B", padding: "80px 0 96px" }}>
        <div className="wrap" style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 620px", minWidth: 0 }}>
            {p.tiers.length > 0 && (
              <section>
                <h2 style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-0.04em" }}>Partner tiers</h2>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {p.tiers.map((t, i) => (
                    <div key={t} className="card cut">
                      <div style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 40, color: "#A8FF5C", background: "#0A0A0B", display: "inline-block", padding: "2px 12px" }}>{i + 1}</div>
                      <div style={{ marginTop: 14, fontSize: 20, fontWeight: 800, lineHeight: 1.25 }}>{t}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {p.benefits.length > 0 && (
              <section style={{ marginTop: 64 }}>
                <h2 style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-0.04em" }}>What partners get</h2>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
                  {p.benefits.map((b) => (
                    <div key={b} className="card cut" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4, minHeight: 120 }}>{b}</div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="facts cut" style={{ flex: "0 0 380px", maxWidth: "100%" }}>
            <h2 style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>Program facts</h2>
            <dl style={{ margin: 0 }}>
              <dt>Program type</dt><dd>{p.program_types.join(", ")}</dd>
              <dt>Product category</dt><dd>{p.product_category}</dd>
              <dt>Commission</dt><dd>{commissionLabel(p)}</dd>
              <dt>Region</dt><dd>{p.region}</dd>
              <dt>Partner tiers</dt><dd>{p.tiers.length ? p.tiers.join(", ") : "Not published"}</dd>
              <dt>Source</dt><dd><a href={p.program_url} target="_blank" rel="noopener noreferrer" style={{ color: "#A8FF5C", textDecoration: "underline" }}>{source}</a></dd>
              <dt>Last verified</dt><dd>{verifiedLabel(p)}</dd>
            </dl>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ position: "relative", color: "#0A0A0B", padding: "0 0 112px" }}>
          <div className="wrap">
            <h2 style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-0.04em", color: "#ECECEE" }}>More {p.product_category} programs</h2>
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
              {related.map((r) => (
                <Link key={r.id} href={`/directory/${r.slug}`} className="card cut" style={{ display: "block" }}>
                  <Tile type={r.primary_type} size={64} />
                  <div style={{ marginTop: 14, fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em" }}>{r.company}</div>
                  <div style={{ marginTop: 6, fontSize: 15, color: "#3A3B40", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
