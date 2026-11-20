"use client";
import { useState } from "react";
import Link from "next/link";
import { GOALS, AUDIENCES, SIZES, STAGES, REGIONS, BUILDER_CATEGORIES } from "@/lib/builder/config";
import type { Teaser, Result } from "@/lib/builder/engine";

const inputS: React.CSSProperties = { width: "100%", background: "#1C1D20", color: "#ECECEE", border: "1px solid #2A2B2F", borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (
  <label style={{ display: "block", fontSize: 15, fontWeight: 500, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#A8FF5C" }}> *</span>}</label>
);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>{t}</div>;
const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "16px 30px", borderRadius: 12, fontSize: 14, border: 0, cursor: "pointer" };
const h3s: React.CSSProperties = { fontWeight: 400, fontSize: 20, letterSpacing: 0, margin: "36px 0 14px", color: "#fff" };
const sub: React.CSSProperties = { fontSize: 14, color: "#A8FF5C", fontWeight: 500, margin: "0 0 6px" };
const box: React.CSSProperties = { background: "#1C1D20", borderRadius: 14, padding: "18px 20px", marginBottom: 12 };

type Vals = Record<string, string>;
const empty: Vals = { url: "", category: "", goal: "", goal2: "", audience: "", size: "", stage: "", region: "" };

function Sel({ name, v, set, opts, ph, req }: { name: string; v: Vals; set: (k: string, x: string) => void; opts: { value: string; label: string }[]; ph: string; req?: boolean }) {
  return (
    <select name={name} required={req} value={v[name]} onChange={(e) => set(name, e.target.value)} style={inputS}>
      <option value="" disabled={req}>{ph}</option>
      {opts.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  );
}
const same = (a: string[]) => a.map((x) => ({ value: x, label: x }));

export function BuilderClient() {
  const [v, setV] = useState<Vals>(empty);
  const [teaser, setTeaser] = useState<Teaser | null>(null);
  const [full, setFull] = useState<{ result: Result; pdf: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const set = (k: string, x: string) => setV((p) => ({ ...p, [k]: x }));

  async function call(payload: object) {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/program-builder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, website_confirm: trap }) });
      const j = await res.json();
      if (!res.ok || !j.ok) { setErr(j.error ?? "Something went wrong. Please try again."); return null; }
      return j;
    } catch { setErr("We could not reach the server. Please try again."); return null; } finally { setBusy(false); }
  }
  async function build(e: React.FormEvent) {
    e.preventDefault();
    const j = await call({ action: "preview", input: v });
    if (j) { setTeaser(j.teaser); setTimeout(() => document.getElementById("builder-top")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }
  }
  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    const j = await call({ action: "unlock", input: v, email, consent });
    if (j) setFull({ result: j.result, pdf: j.pdf });
  }
  function download() {
    if (!full) return;
    const bin = atob(full.pdf); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    a.download = `${full.result.company.domain.replace(/[^a-z0-9.-]/gi, "")}-partner-program-blueprint.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  const goalOpts = GOALS.map((g) => ({ value: g.id, label: g.label }));
  const goal2Opts = goalOpts.filter((o) => o.value !== v.goal);

  if (full) return <Report r={full.result} onDownload={download} onEdit={() => { setFull(null); setTeaser(null); }} />;

  if (teaser) {
    return (
      <div id="builder-top">
        <div style={sub}>Preview</div>
        <h2 style={{ fontWeight: 400, fontSize: 26, letterSpacing: 0, color: "#fff" }}>{teaser.company.name}: your partner program</h2>
        <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.6, color: "#C9CACE" }}>{teaser.ipp.summary}</p>
        <h3 style={h3s}>Partner types to recruit</h3>
        {teaser.ipp.partnerTypes.map((t) => (
          <div key={t.type} style={box}>
            <div style={{ fontSize: 17, fontWeight: 500, color: "#ECECEE" }}>{t.title}</div>
            <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.55, color: "#B9BABD" }}>{t.who}</div>
          </div>
        ))}
        <h3 style={h3s}>Program structure</h3>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: "#C9CACE", margin: 0 }}>{teaser.model} Tiers: {teaser.tierNames.join(", ")}.</p>
        <h3 style={h3s}>{teaser.benchmarkCount} programs that fit your ideal partner profile</h3>
        {teaser.benchmarkPreview.map((b) => (
          <div key={b.company} style={{ ...box, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 500, color: "#ECECEE" }}>{b.company}</span><span style={{ color: "#85868B", fontSize: 14 }}>{b.category}</span>
          </div>
        ))}
        <div style={{ ...box, filter: "blur(5px)", userSelect: "none" }} aria-hidden="true">Seven more programs with the reasons they fit, the full tier design, economics, 90-day plan and enablement kit</div>
        <div style={{ marginTop: 28, background: "#A8FF5C", color: "#0A0A0B", borderRadius: 16, padding: "26px 28px" }}>
          <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 18 }}>Get the full blueprint as a PDF</div>
          <p style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.5, color: "#0A0A0B" }}>Tiers, economics, the 90-day plan, the enablement kit and all ten matched programs.</p>
          <form onSubmit={unlock}>
            <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}><label>Leave this empty<input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
            <input type="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" style={{ ...inputS, marginTop: 16, background: "#fff", color: "#0A0A0B", border: "1px solid #0A0A0B" }} />
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 14, lineHeight: 1.45, cursor: "pointer" }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#0A0A0B", flex: "0 0 18px" }} />
              <span>I agree to the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link> and to receive my report and occasional partner marketing news</span>
            </label>
            {err && <div role="alert" style={{ marginTop: 14, fontSize: 15, fontWeight: 500 }}>{err}</div>}
            <button type="submit" disabled={busy} style={{ ...btn, background: "#0A0A0B", color: "#A8FF5C", marginTop: 18, opacity: busy ? 0.6 : 1 }}>{busy ? "Preparing your report" : "Unlock the blueprint"}</button>
          </form>
        </div>
        <button type="button" onClick={() => setTeaser(null)} style={{ marginTop: 22, background: "transparent", border: 0, color: "#A8FF5C", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline" }}>Change my answers</button>
      </div>
    );
  }

  return (
    <form onSubmit={build}>
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}><label>Leave this empty<input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
      <Lbl t="Company website" req />
      <input name="url" required maxLength={300} value={v.url} onChange={(e) => set("url", e.target.value)} placeholder="yourcompany.com" style={inputS} />
      <Hint t="We read your public homepage to name your program. Nothing else is collected" />
      <Lbl t="What category is your product in?" req />
      <Sel name="category" v={v} set={set} req ph="Choose one" opts={same(BUILDER_CATEGORIES)} />
      <Lbl t="Who do you sell to?" req />
      <Sel name="audience" v={v} set={set} req ph="Choose one" opts={same(AUDIENCES)} />
      <Lbl t="Your company size" req />
      <Sel name="size" v={v} set={set} req ph="Choose one" opts={same(SIZES)} />
      <Lbl t="Main region you sell in" req />
      <Sel name="region" v={v} set={set} req ph="Choose one" opts={same(REGIONS)} />
      <Lbl t="Where are you with partners today?" req />
      <Sel name="stage" v={v} set={set} req ph="Choose one" opts={same(STAGES)} />
      <Lbl t="Main goal for your partner program" req />
      <Sel name="goal" v={v} set={set} req ph="Choose one" opts={goalOpts} />
      <Lbl t="Second goal" />
      <Sel name="goal2" v={v} set={set} ph="None" opts={goal2Opts} />
      {err && <div role="alert" style={{ marginTop: 18, fontSize: 15, color: "#A8FF5C" }}>{err}</div>}
      <div style={{ marginTop: 30 }}>
        <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>{busy ? "Building your program" : "Build my partner program"}</button>
      </div>
    </form>
  );
}

function Report({ r, onDownload, onEdit }: { r: Result; onDownload: () => void; onEdit: () => void }) {
  const goal = GOALS.find((g) => g.id === r.input.goal)?.label;
  return (
    <div id="builder-top">
      <div style={sub}>Your blueprint</div>
      <h2 style={{ fontWeight: 400, fontSize: 26, letterSpacing: 0, color: "#fff" }}>{r.program.name}</h2>
      <p style={{ marginTop: 10, fontSize: 15, color: "#85868B" }}>{r.company.domain} | {r.input.category} | {goal}</p>
      <div style={{ marginTop: 20 }}><button type="button" onClick={onDownload} style={btn}>Download the PDF</button></div>

      <h3 style={h3s}>1. Your ideal partner profile</h3>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: "#C9CACE", margin: "0 0 16px" }}>{r.ipp.summary}</p>
      {r.ipp.partnerTypes.map((t) => (
        <div key={t.type} style={box}>
          <div style={{ fontSize: 17, fontWeight: 500, color: "#ECECEE" }}>{t.title}</div>
          <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.55, color: "#B9BABD" }}>{t.who}</div>
          <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>They earn: {t.earns.toLowerCase()}. They need: {t.need.toLowerCase()}.</div>
        </div>
      ))}
      <p style={{ ...sub, marginTop: 20 }}>Who to approach first</p>
      <ul style={{ margin: 0, paddingLeft: 22, color: "#C9CACE", lineHeight: 1.7, fontSize: 16 }}>{r.ipp.archetypes.map((a) => <li key={a}>{a}</li>)}</ul>

      <h3 style={h3s}>2. Program structure</h3>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: "#C9CACE", margin: "0 0 16px" }}>{r.program.model}</p>
      {r.program.tiers.map((t) => (
        <div key={t.name} style={box}>
          <div style={{ fontSize: 17, fontWeight: 500, color: "#ECECEE" }}>{t.name}</div>
          <div style={{ marginTop: 6, fontSize: 14, color: "#85868B", lineHeight: 1.5 }}>{t.criteria}</div>
          <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: "#C9CACE", lineHeight: 1.6, fontSize: 15 }}>{t.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      ))}
      <p style={{ ...sub, marginTop: 20 }}>Economics by partner type</p>
      {r.program.economics.map((e) => (
        <div key={e.title} style={box}><div style={{ fontWeight: 500, color: "#ECECEE" }}>{e.title}</div><div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.55, color: "#B9BABD" }}>{e.guidance}</div></div>
      ))}
      {r.program.insight.length > 0 && (<><p style={{ ...sub, marginTop: 20 }}>What the benchmark programs do</p>
        <ul style={{ margin: 0, paddingLeft: 22, color: "#C9CACE", lineHeight: 1.7, fontSize: 16 }}>{r.program.insight.map((a) => <li key={a}>{a}</li>)}</ul></>)}
      <p style={{ ...sub, marginTop: 20 }}>Terms to write down before you recruit</p>
      <ul style={{ margin: 0, paddingLeft: 22, color: "#C9CACE", lineHeight: 1.7, fontSize: 16 }}>{r.program.terms.map((a) => <li key={a}>{a}</li>)}</ul>

      <h3 style={h3s}>3. Enablement kit</h3>
      <ul style={{ margin: 0, paddingLeft: 22, color: "#C9CACE", lineHeight: 1.7, fontSize: 16 }}>{r.enablement.map((a) => <li key={a}>{a}</li>)}</ul>

      <h3 style={h3s}>4. First 90 days</h3>
      {r.plan.map((p) => (
        <div key={p.phase} style={box}>
          <div style={{ fontWeight: 500, color: "#ECECEE" }}>{p.phase} <span style={{ color: "#A8FF5C", fontSize: 14, marginLeft: 8 }}>{p.weeks}</span></div>
          <ul style={{ margin: "10px 0 0", paddingLeft: 20, color: "#C9CACE", lineHeight: 1.6, fontSize: 15 }}>{p.actions.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      ))}
      <p style={{ ...sub, marginTop: 20 }}>What to measure</p>
      <ul style={{ margin: 0, paddingLeft: 22, color: "#C9CACE", lineHeight: 1.7, fontSize: 16 }}>{r.kpis.map((a) => <li key={a}>{a}</li>)}</ul>

      <h3 style={h3s}>5. Ten programs to benchmark</h3>
      {r.benchmarks.map((b, i) => (
        <Link key={b.slug} href={`/directory/${b.slug}`} style={{ ...box, display: "block" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 500, color: "#ECECEE" }}>{i + 1}. {b.company}{b.note ? ` ${b.note}` : ""}</span>
            <span style={{ color: "#A8FF5C", fontSize: 14 }}>{b.types.join(", ")}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.55, color: "#B9BABD" }}>{b.why}</div>
        </Link>
      ))}
      {r.notes.length > 0 && <p style={{ marginTop: 22, fontSize: 14, lineHeight: 1.6, color: "#85868B" }}>{r.notes.join(" ")}</p>}

      <div style={{ marginTop: 36, background: "#A8FF5C", color: "#0A0A0B", borderRadius: 16, padding: "26px 28px" }}>
        <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 18 }}>Want help running this program?</div>
        <p style={{ margin: "10px 0 18px", fontSize: 16, lineHeight: 1.5, color: "#0A0A0B" }}>Partner2B is an AI-first partner marketing agency. We recruit, enable and market your partners.</p>
        <a href="mailto:info@partner2b.com?subject=Partner%20program%20blueprint" style={{ ...btn, background: "#0A0A0B", color: "#A8FF5C", display: "inline-block" }}>Talk to us</a>
      </div>
      <button type="button" onClick={onEdit} style={{ marginTop: 22, background: "transparent", border: 0, color: "#A8FF5C", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline" }}>Start again with different answers</button>
    </div>
  );
}
