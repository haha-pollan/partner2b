"use client";
import { useState } from "react";
import Link from "next/link";
import { Glyph } from "@/components/Tile";

const TYPES: [string, string][] = [
  ["Channel Partner", "Resellers and distributors that sell your product"],
  ["Agency Partner", "Agencies and consultancies that implement and recommend you"],
  ["Technology Partner", "Software companies whose product works alongside yours"],
  ["AI and Automation Partner", "AI and automation firms that build you into client projects"],
  ["Community Partner", "Communities and networks that reach your audience"],
  ["Strategic Partner", "Larger companies that open new markets"],
];
type Opts = { categories: string[]; audiences: string[]; regions: string[] };

const field: React.CSSProperties = { background: "#fff", color: "#0A0A0B", border: 0, padding: "15px 16px", fontSize: 17, fontFamily: "inherit", width: "100%" };
const label: React.CSSProperties = { display: "block", marginBottom: 8, fontSize: 16, color: "#B9BABD" };

export default function Doors({ opts }: { opts: Opts }) {
  const [quick, setQuick] = useState(false);
  const [website, setWebsite] = useState(""); const [category, setCategory] = useState(""); const [audience, setAudience] = useState(""); const [region, setRegion] = useState("");
  const [types, setTypes] = useState<string[]>([]); const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");

  async function go(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (!website.trim() || !category || !audience || !region) { setErr("Please answer all the questions."); return; }
    if (!types.length) { setErr("Please choose at least one partner type."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/discovery/quick", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website, category, audience, region, types, website_confirm: trap }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) { setErr(j.error || "Something went wrong. Try again."); setBusy(false); return; }
      window.location.href = `/find-partners/${j.key}`;
    } catch { setErr("Something went wrong. Try again."); setBusy(false); }
  }

  if (!quick) {
    return (
      <div id="start">
      <h2 className="sectitle" style={{ marginBottom: 52 }}>Where are you <span style={{ color: "#A8FF5C" }}>starting from?</span></h2>
      <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))" }}>
        {[
          { t: "I know who I want to partner with", p: "Pick the partner types you want and get a ranked list of real companies in a minute.", bg: "#A8FF5C", sub: "#1C1D20", num: "#3F7A12", kind: "diamond", rot: -1.2 },
          { t: "I am starting from scratch", p: "Not sure which partners fit? Build your strategy first and we will work out the right ones for you.", bg: "#ECECEE", sub: "#3A3B40", num: "#85868B", kind: "bars", rot: 1.2 },
        ].map((c, i) => (
          <div key={c.t} className="cut" style={{ background: c.bg, color: "#0A0A0B", transform: `rotate(${c.rot}deg)`, padding: "26px 28px 30px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: "0 0 56px", width: 56, height: 56, borderRadius: 16, border: "2px solid #0A0A0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph kind={c.kind} fg="#0A0A0B" size={32} />
              </div>
              <h3 style={{ fontSize: 18, lineHeight: 1.3, flex: 1 }}>{c.t}</h3>
              <span style={{ fontFamily: "'Michroma',sans-serif", fontSize: 29, color: c.num }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p style={{ margin: "20px 0 0", minHeight: 72, fontSize: 16, lineHeight: 1.55, color: c.sub, flex: 1 }}>{c.p}</p>
            <div style={{ marginTop: 24 }}>
              {i === 0 ? <button type="button" className="btn btn-s" onClick={() => setQuick(true)}>Pick my partner types</button> : <Link href="/program-builder" className="btn btn-s">Open the Program builder</Link>}
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  }

  return (
    <form id="start" onSubmit={go} className="cut" style={{ background: "#1C1D20", color: "#ECECEE", padding: "44px clamp(24px,5vw,56px)", boxShadow: "inset 0 5px 0 #A8FF5C", display: "grid", gap: 26 }}>
      <input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }} name="website_confirm" />
      <h2 style={{ fontSize: 26, lineHeight: 1.2, color: "#fff" }}>Tell us what you are looking for</h2>
      <div><label style={label} htmlFor="q-site">1. Your company website</label><input id="q-site" style={field} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourcompany.com" /></div>
      <div><label style={label} htmlFor="q-cat">2. What you sell</label>
        <select id="q-cat" style={field} value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Choose a category</option>{opts.categories.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div>
        <span style={label}>3. Who you sell to</span>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          <select aria-label="Company size you sell to" style={field} value={audience} onChange={(e) => setAudience(e.target.value)}><option value="">Company size</option>{opts.audiences.map((c) => <option key={c}>{c}</option>)}</select>
          <select aria-label="Main region" style={field} value={region} onChange={(e) => setRegion(e.target.value)}><option value="">Main region</option>{opts.regions.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </div>
      <div>
        <span style={label}>4. Which partner types do you want? Choose one or more</span>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {TYPES.map(([t, d]) => {
            const on = types.includes(t);
            return (
              <button key={t} type="button" aria-pressed={on} onClick={() => setTypes(on ? types.filter((x) => x !== t) : [...types, t])} style={{ textAlign: "left", cursor: "pointer", fontFamily: "inherit", border: 0, padding: "16px 18px", background: on ? "#A8FF5C" : "#2A2B30", color: on ? "#0A0A0B" : "#ECECEE" }}>
                <b style={{ display: "block", fontSize: 17 }}>{t.replace(" Partner", "")}</b>
                <span style={{ display: "block", marginTop: 4, fontSize: 15, lineHeight: 1.4, opacity: on ? 1 : 0.8 }}>{d}</span>
              </button>
            );
          })}
        </div>
      </div>
      {err ? <p role="alert" style={{ fontSize: 16, color: "#A8FF5C" }}>{err}</p> : null}
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-s" disabled={busy}>{busy ? "Finding your partners, up to a minute" : "Show my partners"}</button>
        {busy ? null : <button type="button" onClick={() => setQuick(false)} style={{ background: "none", border: 0, color: "#A8FF5C", textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", fontSize: 17 }}>Back</button>}
      </div>
    </form>
  );
}
