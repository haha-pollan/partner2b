import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { adminConfigured, db } from "@/lib/admin/session";
import OpenMine from "./OpenMine";
import Doors from "./Doors";
import { AUDIENCES, BUILDER_CATEGORIES, REGIONS } from "@/lib/builder2/intake";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Find partners for your B2B partner program | Partner2B",
  description: "Get a ranked list of real companies that fit your partner program: resellers, referral partners, technology partners, agencies and more. Start with the free Program builder.",
  alternates: { canonical: "/find-partners" },
};

type C = { id: number; name: string; website: string; description: string | null; subtype: string | null };

async function load(): Promise<{ total: number; sample: C[] }> {
  if (!adminConfigured()) return { total: 0, sample: [] };
  try {
    const [a, b] = await Promise.all([
      db("companies?select=id&status=eq.approved&limit=1", { headers: { Prefer: "count=exact" } }),
      db(`companies?select=id,name,website,description,subtype&status=eq.approved&partner_types=cs.${encodeURIComponent('{"Services"}')}&description=not.is.null&order=id.desc&limit=40`),
    ]);
    const total = Number((a.headers.get("content-range") || "").split("/")[1]) || 0;
    const rows: C[] = b.ok ? await b.json() : [];
    const sample = rows.filter((c) => (c.description || "").length > 60 && c.website).slice(0, 5);
    return { total, sample };
  } catch { return { total: 0, sample: [] }; }
}

const STEPS = [
  { t: "Tell us who you want", d: "Tell us what you are looking for, or build a strategy in the free Program builder." },
  { t: "We match real companies", d: "Each partner type is matched with the right companies, ranked by fit." },
  { t: "Start with the best five", d: "See the top companies for each partner type, with why each one fits." },
];

export default async function Page() {
  const { total, sample } = await load();
  const n = total ? `${Math.floor(total / 100) * 100}+` : "Thousands of";
  return (
    <>
      <Nav />
      <section className="hero" style={{ padding: "150px 0 120px", position: "relative" }}>
        <div className="wrap">
          <span className="kick">Find partners<span className="newbadge" suppressHydrationWarning>New</span></span>
          <h1 style={{ marginTop: 22 }}>Find the companies to build your partner program with</h1>
          <p style={{ marginTop: 22, fontSize: 20, lineHeight: 1.5, maxWidth: 720 }}>Get a ranked list of real companies for each partner type in your strategy. {n} companies and growing every week.</p>
          <div style={{ marginTop: 34, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#start" className="btn btn-p">Find my partners</a>
            <OpenMine />
          </div>
        </div>
      </section>

      <section style={{ padding: "150px 0 0" }}>
        <div className="wrap">
          <div><Doors opts={{ categories: BUILDER_CATEGORIES, audiences: AUDIENCES, regions: REGIONS }} /></div>
        </div>
      </section>

      <section style={{ padding: "150px 0 0" }}>
        <div className="wrap">
          <h2 className="sectitle">How it works</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: "48px 0 0", display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
            {STEPS.map((s, i) => (
              <li key={s.t} className="cut" style={{ background: i === 1 ? "#A8FF5C" : "#ECECEE", color: "#0A0A0B", padding: "30px 28px" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 26 }}>{i + 1}</div>
                <b style={{ display: "block", marginTop: 16, fontSize: 20 }}>{s.t}</b>
                <span style={{ display: "block", marginTop: 8, fontSize: 17, lineHeight: 1.5 }}>{s.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {sample.length ? (
        <section style={{ padding: "170px 0 0" }}>
          <div className="wrap">
            <h2 className="sectitle">A sample result: agency partners</h2>
            <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.5 }}>Five real agency partners. Your own list is ranked for your product and your buyers.</p>
            <div style={{ marginTop: 44, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
              {sample.map((c, i) => (
                <a key={c.id} href={c.website} target="_blank" rel="noopener noreferrer" className="cut" style={{ background: i === 0 ? "#A8FF5C" : "#ECECEE", color: "#0A0A0B", padding: "22px 20px", display: "block", textDecoration: "none" }}>
                  <b style={{ fontSize: 18 }}>{c.name}</b>
                  <span style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: 10, fontSize: 15, lineHeight: 1.45 }}>{c.description}</span>
                  {c.subtype ? <span style={{ display: "block", marginTop: 12, fontSize: 14, opacity: 0.75 }}>{c.subtype}</span> : null}
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section style={{ padding: "170px 0 170px" }}>
        <div className="wrap">
          <div className="cut" style={{ background: "#1C1D20", color: "#ECECEE", padding: "52px clamp(24px,5vw,64px)", boxShadow: "inset 0 5px 0 #A8FF5C" }}>
            <h2 className="sectitle" style={{ color: "#fff" }}>Ready to see your own matches?</h2>
            <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.5, color: "#B9BABD" }}>Tell us what you are looking for, or build a full strategy first. Both are free.</p>
            <div style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#start" className="btn btn-s">Find my partners</a>
              <OpenMine />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
