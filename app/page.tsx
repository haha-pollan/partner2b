import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Toby } from "@/components/Toby";
import { HomeModules } from "@/components/HomeModules";
import { Glyph, Tile } from "@/components/Tile";
import { getPrograms } from "@/lib/programs";
import { AI_CATEGORIES, inCat, aiOnly, aiIsNew } from "@/lib/ai";
import { builderIsNew } from "@/lib/launch";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "B2B partner programs directory: compare and join | Partner2B",
  description: "Free directory of B2B partner programs. Compare reseller, referral, technology, MSP and AI partner programs by commission, tiers and requirements.",
  alternates: { canonical: "/" },
};

const TYPES = ["Reseller", "Referral", "Technology", "Services", "MSP", "OEM or white label"];
const KIND: Record<string, string> = { Reseller: "bars", Referral: "diamond", Technology: "grid", Services: "slants", MSP: "hex", "OEM or white label": "stairs" };
// background, text, glyph colour, indent
const ROWS: [string, string, string, number][] = [
  ["#ECECEE", "#0A0A0B", "#0A0A0B", 0],
  ["#B9BABD", "#0A0A0B", "#0A0A0B", 4],
  ["#A8FF5C", "#0A0A0B", "#0A0A0B", 8],
  ["#85868B", "#0A0A0B", "#0A0A0B", 12],
  ["#3A3B40", "#ECECEE", "#ECECEE", 16],
  ["#0A0A0B", "#A8FF5C", "#A8FF5C", 20],
];

const label: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontWeight: 500, fontSize: 14, padding: "7px 14px", borderRadius: 12, whiteSpace: "nowrap" };

export default async function Home() {
  const all = await getPrograms();
  const aiCount = aiOnly(all).length;
  const pick = (t: string) => all.find((p) => p.primary_type === t && p.domain);
  const cards = [
    { p: pick("Reseller"), bg: "#0A0A0B", fg: "#ECECEE", rot: -5, ml: 0 },
    { p: pick("MSP") ?? pick("Services"), bg: "#ECECEE", fg: "#0A0A0B", rot: 3, ml: 36 },
  ].filter((c) => c.p);

  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 100% no-repeat" }}>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
        <div className="limefull" />
        <Nav />
        <div className="wrap hc">
          <div className="hcin">
            <h1 className="h1big hch1">
              <span style={{ display: "block" }}>Find a B2B partner program</span>
              <span style={{ display: "block" }}>or build your own</span>
            </h1>
            <p className="hcp">{`Compare commissions, tiers and requirements across ${all.length} programs, or answer a few questions and get a strategy for your own`}</p>
            <form method="get" action="/directory" className="search" role="search">
              <label htmlFor="q" style={{ position: "absolute", left: -9999 }}>Search programs or companies</label>
              <input id="q" name="q" type="search" placeholder="Search programs or companies" />
              <button type="submit">Search</button>
            </form>
            <div className="hcor"><span>or</span></div>
            <Link href="/program-builder" className="cut hcbuild">
              {builderIsNew() && <span suppressHydrationWarning className="hcbnew">New</span>}
              <span>Build your own program</span><span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hctoby"><Toby height={300} /></div>
        </div>
      </div>

      {/* Marquee band */}
      <div aria-hidden="true" style={{ position: "relative", height: 150, overflow: "hidden" }}>
        {[{ bg: "#0A0A0B", fg: "#A8FF5C", rot: 2, top: 34 }, { bg: "#A8FF5C", fg: "#0A0A0B", rot: -2, top: 44 }].map((b, i) => (
          <div key={i} style={{ position: "absolute", left: -40, right: -40, top: b.top, transform: `rotate(${b.rot}deg)`, background: b.bg, color: b.fg, padding: "14px 0", whiteSpace: "nowrap", overflow: "hidden", fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 20, letterSpacing: 0, textTransform: "uppercase" }}>
            {Array.from({ length: 3 }).map((_, k) => TYPES.map((t) => `${t} ◆ `).join("")).join("")}
          </div>
        ))}
      </div>

      <HomeModules programs={all.length} aiPrograms={aiCount} types={TYPES.length} />

      {/* Browse by type */}
      <section style={{ padding: "clamp(36px,9vw,64px) 0 clamp(36px,9vw,96px)" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0, color: "#0A0A0B" }}>Browse by program type</h2>
        </div>
        <div style={{ marginTop: 40 }}>
          {TYPES.map((t, i) => {
            const [bg, tx, gl, ind] = ROWS[i];
            const n = all.filter((p) => p.program_types.includes(t)).length;
            return (
              <Link key={t} href={`/directory?type=${encodeURIComponent(t)}`} className="typerow" style={{ display: "flex", alignItems: "center", gap: 24, background: bg, color: tx, padding: "16px 40px", marginLeft: `${ind}%` }}>
                <span style={{ fontSize: 14, fontWeight: 500, width: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="typename" style={{ flex: 1, fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>{t}</span>
                <span className="typecnt" style={{ fontSize: 15, fontWeight: 400 }}>{n} programs</span>
                <span className="typeglyph" style={{ display: "flex" }}><Glyph kind={KIND[t]} fg={gl} size={34} /></span>
                <span style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${tx}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 20 }}>→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI programs */}
      <section style={{ padding: "0 0 clamp(36px,9vw,96px)" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0, color: "#0A0A0B" }}>AI partner programs{aiIsNew() && <span className="newbadge" style={{ fontSize: 12, padding: "5px 11px" }}>New</span>}</h2>
          <p style={{ margin: "16px 0 0", maxWidth: 680, fontSize: 20, lineHeight: 1.5, fontWeight: 300, color: "#0A0A0B" }}>Official programs from AI vendors, agent platforms and AI integrators, with their own categories and filters.</p>
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
            {AI_CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/ai/${c.slug}`} className="aicard cut" style={{ padding: "22px 24px 24px" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 16, lineHeight: 1.25 }}>{c.name}</div>
                <div style={{ marginTop: 12, fontSize: 15, fontWeight: 500 }}>{inCat(all, c).length} programs <span aria-hidden="true">→</span></div>
              </Link>
            ))}
          </div>
          <Link href="/ai" style={{ display: "inline-block", marginTop: 28, background: "#7C5CFF", color: "#fff", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "14px 26px", borderRadius: 12, fontSize: 14 }}>Browse AI programs</Link>
        </div>
      </section>

      <div style={{ background: "rgba(10,10,11,0.5)" }}>
      {/* What every listing shows */}
      <section style={{ padding: "40px 0 clamp(36px,9vw,120px)", color: "#ECECEE" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0 }}>What every listing shows</h2>
          <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            <div className="lblcol" style={{ display: "flex", flexDirection: "column", gap: 56, alignItems: "flex-end" }}>
              <span style={label}>Type of program</span>
              <span style={label}>Terms as published</span>
              <span style={label}>Report a correction</span>
            </div>
            <div className="cut mockcard" style={{ width: 620, maxWidth: "100%", background: "#0A0A0B", padding: "28px 32px 36px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 22, letterSpacing: 0 }}>[Company name]</span>
                <span className="pill" style={{ background: "#A8FF5C", color: "#0A0A0B" }}>Reseller program</span>
              </div>
              {[["Commission", "[Published rate]"], ["Region", "[Region]"], ["Source", "[Official program page]"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #3A3B40", padding: "14px 0", fontSize: 16 }}>
                  <span style={{ color: "#85868B" }}>{k}</span><span style={{ fontWeight: 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                <span style={{ background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "12px 20px", borderRadius: 12, fontSize: 14 }}>Go to program</span>
                <span style={{ border: "1.5px solid #55565B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "12px 20px", borderRadius: 12, fontSize: 14 }}>Report a correction</span>
              </div>
            </div>
            <div className="lblcol" style={{ display: "flex", flexDirection: "column", gap: 56, alignItems: "flex-start" }}>
              <span style={label}>Link to the source</span>
              <span style={label}>Apply on the official page</span>
            </div>
          </div>
        </div>
      </section>

      {/* For partners / For vendors */}
      <section style={{ display: "flex", flexWrap: "wrap", color: "#0A0A0B" }}>
        <div className="splitL" style={{ flex: "1 1 520px", background: "#A8FF5C", padding: "96px 80px 96px 40px", clipPath: "polygon(0 0,100% 0,92% 50%,100% 100%,0 100%)" }}>
          <h2 style={{ fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1 }}>For partners</h2>
          <p style={{ margin: "20px 0 0", maxWidth: 420, fontSize: 19, lineHeight: 1.5, fontWeight: 300 }}>Compare programs and find the ones that fit your business.</p>
          <Link href="/directory" style={{ display: "inline-block", marginTop: 28, background: "#0A0A0B", color: "#A8FF5C", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "14px 26px", borderRadius: 12, fontSize: 14 }}>Browse programs</Link>
        </div>
        <div className="splitR" style={{ flex: "1 1 520px", padding: "96px 40px 96px 80px", color: "#ECECEE" }}>
          <h2 style={{ fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1 }}>For vendors</h2>
          <p style={{ margin: "20px 0 0", maxWidth: 420, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>Claim your listing for free and keep your terms accurate.</p>
          <Link href="/claim" style={{ display: "inline-block", marginTop: 28, background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "14px 26px", borderRadius: 12, fontSize: 14 }}>Claim a listing</Link>
        </div>
      </section>

      {/* Claim band */}
      <section style={{ padding: "clamp(36px,9vw,120px) 0 clamp(36px,9vw,140px)", color: "#ECECEE" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0, lineHeight: 1.05 }}>
              <span style={{ display: "block" }}>Run a partner program?</span>
              <span style={{ display: "block", color: "#A8FF5C" }}>Claim your listing</span>
            </h2>
            <p style={{ margin: "22px 0 0", maxWidth: 440, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>Claiming is free. Correct your terms and keep them current</p>
          </div>
          <Link href="/claim" className="cut" style={{ flex: "0 0 400px", maxWidth: "100%", transform: "rotate(3deg)", background: "#17181B", color: "#ECECEE", padding: "28px 30px 32px", display: "block" }}>
            {["Company name", "Program page URL", "Work email"].map((k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 400 }}>{k}</div>
                <div style={{ marginTop: 6, background: "#1C1D20", border: "1px solid #2A2B2F", borderRadius: 12, height: 46 }} />
              </div>
            ))}
            <div style={{ marginTop: 20, background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", fontSize: 14, textAlign: "center", padding: "16px 30px", borderRadius: 12 }}>Claim a listing</div>
          </Link>
        </div>
      </section>

      </div>
      </div>
      <Footer />
    </div>
  );
}
