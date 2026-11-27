import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Glyph } from "@/components/Tile";
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

async function load(): Promise<{ sample: C[] }> {
  if (!adminConfigured()) return { sample: [] };
  try {
    const b = await db(`companies?select=id,name,website,description,subtype&status=eq.approved&partner_types=cs.${encodeURIComponent('{"Agency Partner"}')}&description=not.is.null&order=id.desc&limit=40`);
    const rows: C[] = b.ok ? await b.json() : [];
    const sample = rows.filter((c) => (c.description || "").length > 60 && c.website).slice(0, 5);
    return { sample };
  } catch { return { sample: [] }; }
}

const STEPS = [
  { t: "Share what you need", d: "Pick the partner types you want, or build a strategy in the free Program builder.", kind: "diamond" },
  { t: "We match real companies", d: "Each partner type is matched with the right companies, ranked by fit.", kind: "bars" },
  { t: "Start with the best five", d: "See the top companies for each partner type, with why each one fits.", kind: "grid" },
];
const WORDS = ["Technology", "Channel", "Agency", "Strategic", "Community", "AI and automation"];
const CARDS = [
  { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", gl: "#0A0A0B", num: "#85868B", rot: -1.6 },
  { bg: "#A8FF5C", fg: "#0A0A0B", sub: "#1C1D20", gl: "#0A0A0B", num: "#3F7A12", rot: 1.2 },
  { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", gl: "#A8FF5C", num: "#55565B", rot: -0.8 },
];
const ROT = [-1.6, 1.2, -0.8, 1.4, -1.2];

export default async function Page() {
  const { sample } = await load();
  return (
    <div style={{ overflow: "hidden" }}>
      <PageHero
        layout="toby-strap"
        title="Find the right companies"
        accent="to partner with"
        sub="A ranked list of real companies for every partner type you need, with new ones added every week."
        buttons={<><a href="#start" className="btn btn-p">Find my partners</a><OpenMine outline /></>}
        words={WORDS}
      />

      <section style={{ padding: "clamp(36px,9vw,72px) 0 0" }}>
        <div className="wrap"><Doors opts={{ categories: BUILDER_CATEGORIES, audiences: AUDIENCES, regions: REGIONS }} /></div>
      </section>

      <section style={{ padding: "clamp(36px,9vw,110px) 0 clamp(36px,9vw,60px)" }}>
        <div className="wrap">
          <h2 className="sectitle">How it <span style={{ color: "#A8FF5C" }}>works</span></h2>
          <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {STEPS.map((s, i) => {
              const T = CARDS[i];
              return (
                <div key={s.t} className="cut" style={{ background: T.bg, color: T.fg, transform: `rotate(${T.rot}deg)`, padding: "26px 28px 30px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: "0 0 56px", width: 56, height: 56, borderRadius: 16, border: `2px solid ${T.gl}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Glyph kind={s.kind} fg={T.gl} size={32} />
                    </div>
                    <h3 style={{ fontSize: 18, lineHeight: 1.3, flex: 1 }}>{s.t}</h3>
                    <span style={{ fontFamily: "'Michroma',sans-serif", fontSize: 29, color: T.num }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p style={{ margin: "20px 0 0", minHeight: 78, fontSize: 16, lineHeight: 1.55, color: T.sub }}>{s.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div aria-hidden="true" style={{ position: "relative", height: 150, overflow: "hidden", background: "linear-gradient(transparent 50%, #A8FF5C 50%)" }}>
        {[{ bg: "#fff", fg: "#0A0A0B", rot: 2, top: 34 }, { bg: "#7C5CFF", fg: "#fff", rot: -2, top: 44 }].map((b, i) => (
          <div key={i} style={{ position: "absolute", left: -40, right: -40, top: b.top, transform: `rotate(${b.rot}deg)`, background: b.bg, color: b.fg, padding: "14px 0", whiteSpace: "nowrap", overflow: "hidden", fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 20, letterSpacing: 0, textTransform: "uppercase" }}>
            {Array.from({ length: 3 }).map(() => WORDS.map((t) => `${t} ◆ `).join("")).join("")}
          </div>
        ))}
      </div>

      {sample.length ? (
        <section style={{ background: "#A8FF5C", color: "#0A0A0B", padding: "clamp(36px,9vw,80px) 0 clamp(36px,9vw,110px)" }}>
          <div className="wrap">
            <h2 className="sectitle">A sample result: agency partners</h2>
            <p style={{ margin: "14px 0 0", fontSize: 19, lineHeight: 1.5, color: "#1C1D20" }}>Five real agency partners. Your own list is ranked for your product and your buyers.</p>
            <div className="fpgrid" style={{ marginTop: 52, gap: 24 }}>
              {sample.map((c, i) => {
                const hot = i === 0;
                return (
                  <a key={c.id} href={c.website} target="_blank" rel="noopener noreferrer" className="cut" style={{ background: hot ? "#ECECEE" : "#2A2B30", color: hot ? "#0A0A0B" : "#ECECEE", transform: `rotate(${ROT[i]}deg)`, padding: "24px 22px 28px", display: "flex", flexDirection: "column", textDecoration: "none" }}>
                    <h3 style={{ fontSize: 16, lineHeight: 1.3 }}>{c.name}</h3>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: 12, fontSize: 15, lineHeight: 1.5, color: hot ? "#3A3B40" : "#B9BABD" }}>{c.description}</span>
                    {c.subtype ? <span style={{ alignSelf: "flex-start", marginTop: 16, fontSize: 13, padding: "5px 12px", borderRadius: 999, background: hot ? "#0A0A0B" : "#2A2B2F", color: hot ? "#A8FF5C" : "#B9BABD", border: hot ? 0 : "1px solid #3A3B40" }}>{c.subtype}</span> : null}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section style={{ padding: "clamp(36px,9vw,120px) 0 clamp(36px,9vw,140px)", color: "#ECECEE" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <h2 style={{ fontSize: "clamp(29px,3.6vw,44px)", lineHeight: 1.05 }}>
              <span style={{ display: "block" }}>Ready to see</span>
              <span style={{ display: "block", color: "#A8FF5C" }}>your own matches?</span>
            </h2>
            <p style={{ margin: "22px 0 0", fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>Pick your partner types, or build a full strategy first. Both are free.</p>
            <div style={{ marginTop: 26 }}><OpenMine link /></div>
          </div>
          <a href="#start" className="cut" style={{ flex: "0 0 400px", maxWidth: "100%", transform: "rotate(3deg)", background: "#fff", color: "#0A0A0B", padding: "28px 30px 32px", display: "block" }}>
            {["Your company website", "What you sell", "Partner types"].map((k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14 }}>{k}</div>
                <div style={{ marginTop: 6, background: "#ECECEE", borderRadius: 10, height: 46 }} />
              </div>
            ))}
            <div className="btn btn-s" style={{ marginTop: 22, textAlign: "center" }}>Find my partners</div>
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
