import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Toby } from "@/components/Toby";
import CountUp from "@/components/CountUp";
import { Glyph } from "@/components/Tile";
import { getPrograms } from "@/lib/programs";
import { adminConfigured, db } from "@/lib/admin/session";
import { AI_CATEGORIES, inCat, aiOnly, aiIsNew } from "@/lib/ai";
import { builderIsNew } from "@/lib/launch";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Partner2B: partner marketing and B2B partner program directory",
  description: "Partner2B helps B2B tech companies build and run partner programs. Compare reseller, referral, technology, MSP and AI partner programs in the free directory.",
  alternates: { canonical: "/" },
};

const TYPES = ["Reseller", "Referral", "Technology", "Services", "MSP", "OEM or white label"];
const KIND: Record<string, string> = { Reseller: "bars", Referral: "diamond", Technology: "grid", Services: "slants", MSP: "hex", "OEM or white label": "stairs" };
// background, text, indent
const ROWS: [string, string, number][] = [
  ["#FFFFFF", "#0A0A0B", 0],
  ["#A8FF5C", "#0A0A0B", 4],
  ["#7C5CFF", "#FFFFFF", 8],
  ["#FFFFFF", "#0A0A0B", 12],
  ["#A8FF5C", "#0A0A0B", 16],
  ["#7C5CFF", "#FFFFFF", 20],
];
const STEPS = [
  { t: "Answer a few questions", d: "Your product, customers and goals" },
  { t: "Get your program shaped", d: "Partner types, tiers and modelled earnings" },
  { t: "Download your PDF", d: "With an ecosystem map and a 90 day plan" },
];

export default async function Home() {
  const all = await getPrograms();
  let findSample: { id: number; name: string; description: string | null }[] = [];
  if (adminConfigured()) {
    try {
      const b = await db(`companies?select=id,name,description&status=eq.approved&partner_types=cs.${encodeURIComponent('{"Agency Partner"}')}&description=not.is.null&order=id.desc&limit=40`);
      const rows: { id: number; name: string; description: string | null }[] = b.ok ? await b.json() : [];
      findSample = rows.filter((c) => (c.description || "").length > 60).slice(0, 5);
    } catch { /* section shows without the sample */ }
  }
  const aiCount = aiOnly(all).length;
  const stats = [
    { n: all.length, l: "partner programs", bg: "#FFFFFF", fg: "#0A0A0B", num: "#0A0A0B", rot: 1.5, ml: 40 },
    { n: aiCount, l: "AI partner programs", bg: "#A8FF5C", fg: "#0A0A0B", num: "#0A0A0B", rot: -2, ml: 0 },
    { n: TYPES.length, l: "program types", bg: "#7C5CFF", fg: "#fff", num: "#FFFFFF", rot: 1.5, ml: 40 },
  ];

  return (
    <>
      {/* Hero */}
      <PageHero layout="toby-center" title="Plan your partner program" accent="then find who to partner with" sub={`Plan your strategy with free tools, then get a ranked list of real companies to partner with. Or compare ${all.length} partner programs in the directory`} buttons={<><Link href="/find-partners" className="btn btn-p">Find partners</Link><Link href="/directory" className="btn btn-o">Browse the directory</Link></>} />

      {/* Directory */}
      <section aria-labelledby="hm-dir" style={{ padding: "70px 0 170px" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 56, flexWrap: "wrap" }}>
          <div className="dirtext" style={{ flex: "1 1 460px" }}>
            <span className="kick">The directory</span>
            <h2 id="hm-dir">Every partner program in one place</h2>
            <p>Partner2B is a free directory of B2B partner programs. Each listing shows commissions, tiers and requirements and links to the official source, so you can compare programs before you apply</p>
            <Link href="/directory" className="btn btn-p" style={{ marginTop: 30 }}>Browse the directory</Link>
          </div>
          <div className="dirstack" style={{ flex: "0 1 480px", display: "flex", flexDirection: "column", gap: 18 }}>
            {stats.map((s) => (
              <div key={s.l} className="cut stat" style={{ background: s.bg, color: s.fg, transform: `rotate(${s.rot}deg)`, marginLeft: s.ml }}>
                <span className="statn" style={{ color: s.num }}>{s.n}</span>
                <span className="statl">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Builder */}
      <section aria-labelledby="hm-bld" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <div className="bldbox cut">
            <div className="bldtext">
              <span className="kick" style={{ borderColor: "#0A0A0B", color: "#0A0A0B" }}>Program builder{builderIsNew() && <span className="newbadge" suppressHydrationWarning>New</span>}</span>
              <h2 id="hm-bld">Build your own partner program</h2>
              <p>Answer a few questions about your company and get a strategy PDF in your own branding</p>
              <ol className="bldsteps">
                {STEPS.map((s, i) => (
                  <li key={s.t}><span className="bldn">{i + 1}</span><span><b>{s.t}</b><i>{s.d}</i></span></li>
                ))}
              </ol>
              <Link href="/program-builder" className="btn btn-s" style={{ marginTop: 30 }}>Open the program builder</Link>
            </div>
            <div className="bldpages" aria-hidden="true">
              <Image src="/builder/sample-ecosystem.jpg" alt="" width={728} height={1029} sizes="270px" className="bldpg bldpg0" />
              <Image src="/builder/sample-cover.jpg" alt="" width={728} height={1029} sizes="270px" className="bldpg bldpg1" />
            </div>
          </div>
        </div>
      </section>

      {/* Find partners */}
      <section aria-labelledby="hm-find" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <span className="kick">Find partners<span className="newbadge" suppressHydrationWarning>New</span></span>
          <h2 id="hm-find" className="sectitle" style={{ marginTop: 18 }}>Then find who to partner with</h2>
          <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.5 }}>Your strategy names the partner types. We match the right companies to each one, ranked by fit.</p>
          <div style={{ marginTop: 44, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            {findSample.map((c, i) => (
              <div key={c.id} className="cut" style={{ background: ["#A8FF5C", "#FFFFFF", "#7C5CFF"][i % 3], color: i % 3 === 2 ? "#FFFFFF" : "#0A0A0B", padding: "22px 20px" }}>
                <b style={{ fontSize: 18 }}>{c.name}</b>
                <span style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: 10, fontSize: 15, lineHeight: 1.45 }}>{c.description}</span>
              </div>
            ))}
          </div>
          <Link href="/find-partners" className="btn btn-p" style={{ marginTop: 36 }}>See how it works</Link>
        </div>
      </section>

      {/* Browse by type */}
      <section style={{ padding: "0 0 170px" }}>
        <div className="wrap"><h2 className="sectitle">Browse by program type</h2></div>
        <div style={{ marginTop: 40 }}>
          {TYPES.map((t, i) => {
            const [bg, tx, ind] = ROWS[i];
            const n = all.filter((p) => p.program_types.includes(t)).length;
            return (
              <Link key={t} href={`/directory?type=${encodeURIComponent(t)}`} className="stair" style={{ background: bg, color: tx, marginLeft: `${ind}%` }}>
                <span style={{ fontSize: 15, fontWeight: 400, width: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="stairname" style={{ flex: 1, fontFamily: "'Michroma',sans-serif", fontSize: 32, WebkitTextStroke: "1.2px currentColor" }}>{t}</span>
                <span className="staircnt" style={{ fontSize: 16, fontWeight: 400 }}>{n} programs</span>
                <span className="stairglyph" style={{ display: "flex" }}><Glyph kind={KIND[t]} fg={tx} size={34} /></span>
                <span style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${tx}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 400, fontSize: 20 }}>→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI programs */}
      <section style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 className="sectitle">AI partner programs{aiIsNew() && <span className="newbadge" suppressHydrationWarning style={{ fontSize: 13, padding: "4px 12px", marginLeft: 14 }}>New</span>}</h2>
          <p style={{ margin: "16px 0 0", fontSize: 20, lineHeight: 1.5, fontWeight: 400 }}>Official programs from AI vendors, agent platforms and AI integrators, with their own categories and filters.</p>
          <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {AI_CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/ai/${c.slug}`} className="aicard cut" style={{ ["--c" as string]: "24px" }}>
                <span className="aibadge">AI</span>
                <div style={{ marginTop: 14, fontFamily: "'Michroma',sans-serif", fontSize: 16, lineHeight: 1.25, WebkitTextStroke: ".8px currentColor" }}>{c.name}</div>
                <div style={{ marginTop: 12, fontSize: 16, fontWeight: 400 }}>{inCat(all, c).length} programs <span aria-hidden="true">→</span></div>
              </Link>
            ))}
            <div className="cut" aria-hidden="true" style={{ background: "#A8FF5C", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", minHeight: 150, ["--c" as string]: "24px" }}>
              <Toby height={150} rows={26} glasses animate={false} />
            </div>
          </div>
          <Link href="/ai" className="btn btn-s" style={{ marginTop: 30 }}>Browse AI programs</Link>
        </div>
      </section>

      {/* What every listing shows */}
      <section style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 className="sectitle">What every listing shows</h2>
          <div style={{ marginTop: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            <div className="lblcol" style={{ alignItems: "flex-end" }}>
              <span className="chip">Type of program</span><span className="chip">Terms as published</span><span className="chip">Claim this listing</span>
            </div>
            <div className="card cut" style={{ width: 620, maxWidth: "100%", padding: "28px 32px 38px", ["--c" as string]: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Michroma',sans-serif", fontSize: 22, WebkitTextStroke: "1.2px currentColor" }}>[Company name]</span>
                <span className="pill">Reseller program</span>
              </div>
              {[["Commission", "[Published rate]"], ["Region", "[Region]"], ["Source", "[Official program page]"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderTop: "2px solid #ECECEE", padding: "14px 0", fontSize: 17 }}>
                  <span style={{ color: "#6A6B71", fontWeight: 400 }}>{k}</span><span style={{ fontWeight: 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                <span className="btn btn-p btn-sm">Go to program</span>
                <span className="btn btn-s btn-sm">Claim this listing</span>
              </div>
            </div>
            <div className="lblcol" style={{ alignItems: "flex-start" }}>
              <span className="chip">Link to the source</span><span className="chip">Apply on the official page</span>
            </div>
          </div>
        </div>
      </section>

      {/* For partners / For vendors */}
      <section className="splitwrap">
        <div className="splitL" style={{ flex: "1 1 520px", background: "#A8FF5C", padding: "96px 80px 96px 40px", clipPath: "polygon(0 0,100% 0,92% 50%,100% 100%,0 100%)" }}>
          <h2 style={{ fontSize: 44, lineHeight: 1.05 }}>For partners</h2>
          <p style={{ margin: "20px 0 0", fontSize: 19, lineHeight: 1.5, fontWeight: 400 }}>Compare programs and find the ones that fit your business.</p>
          <Link href="/directory" className="btn btn-s" style={{ marginTop: 28 }}>Browse programs</Link>
        </div>
        <div className="splitR" style={{ flex: "1 1 520px", padding: "96px 40px 96px 80px", color: "#fff" }}>
          <h2 style={{ fontSize: 44, lineHeight: 1.05 }}>For vendors</h2>
          <p style={{ margin: "20px 0 0", fontSize: 19, lineHeight: 1.5, fontWeight: 400, color: "#ECECEE" }}>Claim your listing for free and keep your terms accurate.</p>
          <Link href="/claim" className="btn btn-p" style={{ marginTop: 28 }}>Claim a listing</Link>
        </div>
      </section>

      {/* Claim */}
      <section style={{ padding: "150px 0 150px" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <h2 style={{ fontSize: 44, lineHeight: 1.1 }}>
              <span style={{ display: "block" }}>Run a partner program?</span>
              <span style={{ display: "block", color: "#A8FF5C" }}>Claim your listing</span>
            </h2>
            <p style={{ margin: "22px 0 0", fontSize: 19, lineHeight: 1.5, fontWeight: 400, color: "#ECECEE" }}>Claiming is free. Correct your terms and keep them current</p>
          </div>
          <Link href="/claim" className="claimcard cut">
            {["Company name", "Program page URL", "Work email"].map((k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 400, color: "#4A4B51" }}>{k}</div>
                <div style={{ marginTop: 6, background: "#ECECEE", borderRadius: 10, height: 46 }} />
              </div>
            ))}
            <div className="btn btn-p" style={{ marginTop: 20, display: "block", textAlign: "center" }}>Claim a listing</div>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
