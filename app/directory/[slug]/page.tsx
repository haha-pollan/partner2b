import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { Tile } from "@/components/Tile";
import { companyDescription } from "@/lib/describe";
import { Glyph } from "@/components/Tile";
import { getPrograms, getProgram, commissionLabel } from "@/lib/programs";
import { isAi } from "@/lib/ai";
import { BenefitIcon } from "@/components/BenefitIcon";

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
    description: `${p.company} ${p.primary_type.toLowerCase()} partner program: tiers, commission and region as published, with a link to the official page. Free on Partner2B Directory.`,
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

  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <Nav />
        <div className="wrap" style={{ padding: "8px var(--margin) clamp(36px,9vw,80px)" }}>
          <div style={{ fontSize: 15, fontWeight: 400, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/directory" style={{ textDecoration: "underline" }}>Directory</Link><span>/</span>
            {isAi(p) && (<><Link href="/ai" style={{ textDecoration: "underline" }}>AI programs</Link><span>/</span></>)}
            <span>{p.product_category}</span><span>/</span><span>{p.company}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 28, flexWrap: "wrap" }}>
            <Tile type={p.primary_type} size={120} domain={p.domain} />
            <h1 style={{ fontWeight: 400, fontSize: "clamp(26px,4.2vw,68px)", lineHeight: 1, letterSpacing: 0 }}>{p.company}</h1>
          </div>
          {p.product_note && <div style={{ marginTop: 12, fontSize: 20, fontWeight: 400 }}>{p.product_note}</div>}
          <p style={{ margin: "24px 0 0", maxWidth: 760, fontSize: 22, lineHeight: 1.5, fontWeight: 400 }}>{p.description}</p>
          <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isAi(p) && <span className="aibadge" style={{ alignSelf: "center" }}>AI</span>}
            {p.program_types.map((t) => (<span key={t} className="pill">{t}</span>))}
            <span className="tag" style={{ background: "#ECECEE" }}>{p.region}</span>
            <span className="tag" style={{ background: "#ECECEE" }}>{p.product_category}</span>
            {p.commission_models.some((c) => c !== "Not published") && <span className="tag" style={{ background: "#ECECEE" }}>{commissionLabel(p)}</span>}
          </div>
          <div style={{ marginTop: 36, display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 800 }}>
            <a href={p.program_url} target="_blank" rel="noopener noreferrer" className="btn btn-s" style={{ display: "inline-block" }}>
              Visit the official program page
            </a>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", padding: "clamp(36px,9vw,80px) 0 clamp(36px,9vw,96px)" }}>
        <div className="wrap" style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 620px", minWidth: 0 }}>
            <section style={{ marginBottom: 64 }}>
              <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>About {p.company}</h2>
              <p style={{ margin: "20px 0 0", maxWidth: 760, fontSize: 20, lineHeight: 1.6, fontWeight: 400 }}>{companyDescription(p)}</p>
            </section>
            {p.tiers.length > 0 && (
              <section>
                <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>Partner tiers</h2>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {p.tiers.map((t, i) => (
                    <div key={t} className="card cut">
                      <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 24, color: "#A8FF5C", background: "#0A0A0B", display: "inline-block", padding: "2px 12px" }}>{i + 1}</div>
                      <div style={{ marginTop: 14, fontSize: 20, fontWeight: 400, lineHeight: 1.25 }}>{t}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {p.benefits.length > 0 && (
              <section style={{ marginTop: 64 }}>
                <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>What partners get</h2>
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
                  {p.benefits.map((b, i) => (
                    <div key={b} className="card cut" style={{ display: "flex", gap: 18, alignItems: "flex-start", minHeight: 110 }}>
                      <BenefitIcon text={b} index={i} />
                      <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.25 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {p.how_it_works && p.how_it_works.length > 0 && (
              <section style={{ marginTop: 64 }}>
                <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>How the program works</h2>
                <div style={{ marginTop: 16 }}>
                  {p.how_it_works.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 28, alignItems: "center", padding: "18px 0", borderTop: i === 0 ? 0 : "2px solid #0A0A0B" }}>
                      <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 40, letterSpacing: 0, lineHeight: 1, flex: "0 0 80px" }}>{String(i + 1).padStart(2, "0")}</div>
                      <div style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.35 }}>{step}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          <aside className="facts cut" style={{ flex: "0 0 380px", maxWidth: "100%" }}>
            <h2 style={{ fontWeight: 400, fontSize: 22, letterSpacing: 0 }}>Program facts</h2>
            <dl style={{ margin: 0 }}>
              <dt>Program type</dt><dd>{p.program_types.join(", ")}</dd>
              <dt>Product category</dt><dd>{p.product_category}</dd>
              <dt>Commission</dt><dd>{commissionLabel(p)}</dd>
              <dt>Region</dt><dd>{p.region}</dd>
              <dt>Partner tiers</dt><dd>{p.tiers.length ? p.tiers.join(", ") : "Not published"}</dd>
              {p.requirements && (<><dt>Requirements</dt><dd>{p.requirements}</dd></>)}
              
            </dl>
            <a href={p.program_url} target="_blank" rel="noopener noreferrer" className="btn btn-p" style={{ display: "block", marginTop: 28, textAlign: "center" }}>Explore partner program</a>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #3A3B40", fontSize: 13, lineHeight: 1.5, color: "#85868B" }}>
              <div>Information is compiled from open sources. <a href={p.program_url} target="_blank" rel="noopener noreferrer" style={{ color: "#B9BABD", textDecoration: "underline" }}>Official page</a></div>
              <div style={{ marginTop: 8 }}>Is this your program? <Link href={`/claim?listing=${p.slug}`} style={{ color: "#B9BABD", textDecoration: "underline" }}>Claim this listing</Link></div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ position: "relative", padding: "0 0 112px" }}>
          <div className="wrap">
            <h2 style={{ fontWeight: 400, fontSize: 34, letterSpacing: 0, color: "#ECECEE" }}>More {p.product_category} programs</h2>
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
              {related.map((r) => (
                <Link key={r.id} href={`/directory/${r.slug}`} className="card cut" style={{ display: "block" }}>
                  <Tile type={r.primary_type} size={64} domain={r.domain} />
                  <div style={{ marginTop: 14, fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 21, letterSpacing: 0 }}>{r.company}</div>
                  <div style={{ marginTop: 6, fontSize: 15, color: "#3A3B40", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: "clamp(36px,9vw,90px) 0 clamp(36px,9vw,100px)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontWeight: 400, fontSize: 40, letterSpacing: 0, lineHeight: 1.05 }}>Is this your program? <span style={{ color: "#A8FF5C" }}>Claim it for free</span></h2>
            <p style={{ margin: "16px 0 0", fontSize: 20, color: "#B9BABD" }}>Correct your terms and keep them current</p>
          </div>
          <Link href={`/claim?listing=${p.slug}`} className="btn btn-p">Claim this listing</Link>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: p.company,
            ...(p.domain ? { url: `https://${p.domain}` } : {}),
            description: companyDescription(p),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <BuilderCta images={false} />
      <Footer />
    </div>
  );
}
