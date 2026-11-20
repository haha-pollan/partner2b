import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Glyph, Tile } from "@/components/Tile";
import { getPrograms } from "@/lib/programs";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Partner2B Directory: find the B2B partner program that fits",
  description: "Free B2B partner program directory. Compare reseller, referral, technology, MSP and white label programs, partner tiers, commissions and requirements.",
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

const label: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontWeight: 500, fontSize: 14, padding: "7px 14px", borderRadius: 8, whiteSpace: "nowrap" };

export default async function Home() {
  const all = await getPrograms();
  const pick = (t: string) => all.find((p) => p.primary_type === t && p.domain);
  const cards = [
    { p: pick("Reseller"), bg: "#0A0A0B", fg: "#ECECEE", rot: -5, ml: 0 },
    { p: pick("MSP") ?? pick("Services"), bg: "#ECECEE", fg: "#0A0A0B", rot: 3, ml: 36 },
    { p: pick("Technology"), bg: "#A8FF5C", fg: "#0A0A0B", rot: -3, ml: 12 },
  ].filter((c) => c.p);

  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 100% no-repeat" }}>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
        <div className="limepanel" />
        <Nav />
        <div className="wrap" style={{ padding: "24px 40px 110px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto", maxWidth: "100%" }}>
            <h1 className="h1big">
              <span style={{ display: "block" }}>Find the B2B</span>
              <span style={{ display: "block" }}>partner program</span>
              <span style={{ display: "block" }}>that fits</span>
            </h1>
            <p style={{ margin: "24px 0 0", maxWidth: 560, fontSize: 21, lineHeight: 1.5, fontWeight: 300 }}>
              A free directory of public partner programs. Every listing is built from public information and links to its source
            </p>
            <form method="get" action="/directory" className="search" role="search">
              <label htmlFor="q" style={{ position: "absolute", left: -9999 }}>Search programs or companies</label>
              <input id="q" name="q" type="search" placeholder="Search programs or companies" />
              <button type="submit">Search</button>
            </form>
          </div>
          <div style={{ flex: "0 0 380px", maxWidth: "100%", display: "flex", flexDirection: "column", gap: 22, marginTop: 20 }}>
            {cards.map(({ p, bg, fg, rot, ml }) => (
              <Link key={p!.id} href={`/directory/${p!.slug}`} className="cut" style={{ marginLeft: ml, transform: `rotate(${rot}deg)`, background: bg, color: fg, padding: "22px 26px", display: "flex", alignItems: "center", gap: 18 }}>
                <Tile type={p!.primary_type} size={64} domain={p!.domain} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 21, letterSpacing: 0, lineHeight: 1.1 }}>{p!.company}</div>
                  <div style={{ marginTop: 6, fontSize: 15, fontWeight: 400, opacity: 0.8 }}>{p!.primary_type}</div>
                </div>
              </Link>
            ))}
          </div>
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

      {/* Browse by type */}
      <section style={{ padding: "64px 0 96px" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0, color: "#0A0A0B" }}>Browse by program type</h2>
        </div>
        <div style={{ marginTop: 40 }}>
          {TYPES.map((t, i) => {
            const [bg, tx, gl, ind] = ROWS[i];
            const n = all.filter((p) => p.program_types.includes(t)).length;
            return (
              <Link key={t} href={`/directory?type=${encodeURIComponent(t)}`} style={{ display: "flex", alignItems: "center", gap: 24, background: bg, color: tx, padding: "16px 40px", marginLeft: `${ind}%` }}>
                <span style={{ fontSize: 14, fontWeight: 500, width: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 34, letterSpacing: 0 }}>{t}</span>
                <span style={{ fontSize: 15, fontWeight: 400 }}>{n} programs</span>
                <Glyph kind={KIND[t]} fg={gl} size={34} />
                <span style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${tx}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 20 }}>→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* What every listing shows */}
      <section style={{ padding: "40px 0 120px", color: "#ECECEE" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0 }}>What every listing shows</h2>
          <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 56, alignItems: "flex-end" }}>
              <span style={label}>Type of program</span>
              <span style={label}>Terms as published</span>
              <span style={label}>Report a correction</span>
            </div>
            <div className="cut" style={{ width: 620, maxWidth: "100%", background: "#0A0A0B", padding: "28px 32px 36px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 22, letterSpacing: 0 }}>[Company name]</span>
                <span className="pill" style={{ background: "#A8FF5C", color: "#0A0A0B" }}>Reseller program</span>
              </div>
              {[["Commission", "[Published rate]"], ["Region", "[Region]"], ["Source", "[Official program page]"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #3A3B40", padding: "14px 0", fontSize: 16 }}>
                  <span style={{ color: "#85868B" }}>{k}</span><span style={{ fontWeight: 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                <span style={{ background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "12px 20px", borderRadius: 10, fontSize: 14 }}>Go to program</span>
                <span style={{ border: "1.5px solid #55565B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "12px 20px", borderRadius: 10, fontSize: 14 }}>Report a correction</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 56, alignItems: "flex-start" }}>
              <span style={label}>Link to the source</span>
              <span style={label}>Apply on the official page</span>
            </div>
          </div>
        </div>
      </section>

      {/* For partners / For vendors */}
      <section style={{ display: "flex", flexWrap: "wrap", color: "#0A0A0B" }}>
        <div style={{ flex: "1 1 520px", background: "#A8FF5C", padding: "96px 80px 96px 40px", clipPath: "polygon(0 0,100% 0,92% 50%,100% 100%,0 100%)" }}>
          <h2 style={{ fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1 }}>For partners</h2>
          <p style={{ margin: "20px 0 0", maxWidth: 420, fontSize: 19, lineHeight: 1.5, fontWeight: 300 }}>Compare programs and find the ones that fit your business.</p>
          <Link href="/directory" style={{ display: "inline-block", marginTop: 28, background: "#0A0A0B", color: "#A8FF5C", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "14px 26px", borderRadius: 12, fontSize: 14 }}>Browse programs</Link>
        </div>
        <div style={{ flex: "1 1 520px", padding: "96px 40px 96px 80px", color: "#ECECEE" }}>
          <h2 style={{ fontWeight: 400, fontSize: 49, letterSpacing: 0, lineHeight: 1 }}>For vendors</h2>
          <p style={{ margin: "20px 0 0", maxWidth: 420, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>Claim your listing for free and keep your terms accurate.</p>
          <Link href="/claim" style={{ display: "inline-block", marginTop: 28, background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "14px 26px", borderRadius: 12, fontSize: 14 }}>Claim a listing</Link>
        </div>
      </section>

      {/* Claim band */}
      <section style={{ padding: "120px 0 140px", color: "#ECECEE" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <h2 style={{ fontWeight: 400, fontSize: 44, letterSpacing: 0, lineHeight: 1.05 }}>
              <span style={{ display: "block" }}>Run a partner program?</span>
              <span style={{ display: "block", color: "#A8FF5C" }}>Claim your listing</span>
            </h2>
            <p style={{ margin: "22px 0 0", maxWidth: 440, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>Claiming is free. Correct your terms and keep them current</p>
          </div>
          <Link href="/claim" className="cut" style={{ flex: "0 0 400px", maxWidth: "100%", transform: "rotate(3deg)", background: "#A8FF5C", color: "#0A0A0B", padding: "28px 30px 32px", display: "block" }}>
            {["Company name", "Program page URL", "Work email"].map((k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{k}</div>
                <div style={{ marginTop: 6, background: "#0A0A0B", borderRadius: 8, height: 42 }} />
              </div>
            ))}
            <div style={{ marginTop: 20, background: "#0A0A0B", color: "#A8FF5C", fontWeight: 400, fontFamily: "'Michroma',sans-serif", textAlign: "center", padding: "14px", borderRadius: 10 }}>Claim a listing</div>
          </Link>
        </div>
      </section>

      </div>
      <Footer />
    </div>
  );
}
