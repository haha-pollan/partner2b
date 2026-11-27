"use client";
import { Toby } from "@/components/Toby";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BUILDER_CATEGORIES, DELIVERY, AUDIENCES, REGIONS, STAGES, CURRENCIES, GOALS } from "@/lib/builder2/intake";
import { DEMOS } from "./demos";

const inputS: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (<label style={{ display: "block", fontSize: 15, fontWeight: 400, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#FFFFFF" }}> *</span>}</label>);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#FFFFFF" }}>{t}</div>;
const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const ghost: React.CSSProperties = { background: "transparent", border: 0, color: "#FFFFFF", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline", padding: 0 };

type Vals = Record<string, string>;
const empty: Vals = { website: "", companyName: "", category: "", offeringSummary: "", keyFeatures: "", differentiators: "", deliveryModel: "", competitors: "", endUser: "", primaryBuyer: "", audience: "", industriesServed: "", region: "", pricing: "", acvLow: "", acvHigh: "", currency: "USD", stage: "", year1PartnerRevenueTarget: "", partnerRevenueSharePercent: "" };
const REQUIRED: string[][] = [
  ["website", "category", "offeringSummary", "keyFeatures", "differentiators", "deliveryModel"],
  ["endUser", "primaryBuyer", "audience", "industriesServed", "region", "pricing", "acvLow", "acvHigh", "currency"],
  ["stage", "year1PartnerRevenueTarget", "partnerRevenueSharePercent"],
];
const STEPS = ["Your company", "Your buyers", "Your goals", "Your branding"];
const same = (a: string[]) => a.map((x) => ({ value: x, label: x }));
const toFile = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "company";

const Ctx = createContext<{ v: Vals; set: (k: string, x: string) => void }>({ v: empty, set: () => {} });
function Field({ k, label, ph, hint, area }: { k: string; label: string; ph?: string; hint?: string; area?: boolean }) {
  const { v, set } = useContext(Ctx);
  return (
    <>
      <Lbl t={label} req />
      {area ? <textarea rows={3} value={v[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph} maxLength={600} style={{ ...inputS, resize: "vertical" }} />
        : <input value={v[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph} maxLength={300} style={inputS} />}
      {hint && <Hint t={hint} />}
    </>
  );
}
function Sel({ k, label, opts, req = true }: { k: string; label: string; opts: string[]; req?: boolean }) {
  const { v, set } = useContext(Ctx);
  return (
    <>
      <Lbl t={label} req={req} />
      <select value={v[k]} onChange={(e) => set(k, e.target.value)} style={inputS}>
        <option value="" disabled>Choose one</option>
        {same(opts).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </>
  );
}

export function BuilderClient() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Vals>(empty);
  const [goals, setGoals] = useState<string[]>([]);
  const [brand, setBrand] = useState({ color: "", logo: "" });
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [secs, setSecs] = useState(0);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ pdf: string; company: string; key?: string } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const set = (k: string, x: string) => setV((p) => ({ ...p, [k]: x }));

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("demo");
    const demo = d ? DEMOS[d] : null;
    if (!demo) return;
    const next: Vals = { ...empty };
    for (const k of Object.keys(empty)) if (demo[k] !== undefined) next[k] = String(demo[k]);
    setV(next); setGoals((demo.programGoals as string[]) ?? []);
  }, []);
  useEffect(() => { if (!busy) return; setSecs(0); const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, [busy]);
  const scroll = () => setTimeout(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);

  function validSite(raw: string) {
    const t = raw.trim();
    if (!t) return false;
    try { const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`); return u.hostname.includes(".") && !/\s/.test(t); } catch { return false; }
  }
  function missing(i: number) {
    if (REQUIRED[i]?.some((k) => !v[k].trim())) return "Please fill in the fields marked with a star.";
    if (i === 0 && !validSite(v.website)) return "Please enter your company website, for example yourcompany.com.";
    if (i === 1 && !(Number(v.acvHigh) >= Number(v.acvLow) && Number(v.acvLow) > 0)) return "Please enter the contract value range from a lower to a higher number.";
    if (i === 2 && goals.length < 1) return "Please choose at least one goal.";
    if (i === 2 && !(Number(v.partnerRevenueSharePercent) > 0 && Number(v.partnerRevenueSharePercent) <= 100)) return "The share of revenue from partners must be between 1 and 100.";
    return "";
  }
  async function next(e: React.FormEvent) {
    e.preventDefault();
    const m = missing(step); if (m) { setErr(m); return; }
    setErr("");
    if (step === 0 && (!brand.logo || !v.companyName)) {
      setBusy(true);
      try {
        const res = await fetch("/api/program-builder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "prefill", website: v.website, website_confirm: trap }) });
        const j = await res.json();
        if (j.ok) { setBrand((b) => ({ color: b.color || j.color || "", logo: b.logo || j.logo || "" })); setV((p) => ({ ...p, companyName: p.companyName || j.name || "" })); }
      } catch { /* branding is optional */ }
      setBusy(false);
    }
    setStep(step + 1); scroll();
  }
  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!first.trim() || !last.trim()) { setErr("Please enter your first and last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) { setErr("Please enter a valid email and tick the box to receive your report."); return; }
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/program-builder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "generate", input: { ...v, programGoals: goals, contactName: `${first.trim()} ${last.trim()}` }, brand, email, consent, website_confirm: trap }) });
      const j = await res.json().catch(() => null);
      if (!j || !j.ok) {
        const msg = j?.error ?? "This took longer than expected. Please try again.";
        setErr(msg);
        if (/website/i.test(msg)) { setStep(0); scroll(); }
      }
      else { setDone({ pdf: j.pdf, company: j.company, key: j.strategyKey }); scroll(); }
    } catch { setErr("We could not reach the server. Please try again."); }
    setBusy(false);
  }
  function download() {
    if (!done) return;
    const bin = atob(done.pdf); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    a.download = `${toFile(done.company)}-partner-program-strategy.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
  }
  function onLogo(f: File | undefined) {
    if (!f) return;
    if (!/^image\/(png|jpeg)$/.test(f.type) || f.size > 350_000) { setErr("Please upload a PNG or JPG logo under 350 KB."); return; }
    const r = new FileReader(); r.onload = () => { setErr(""); setBrand((b) => ({ ...b, logo: String(r.result) })); }; r.readAsDataURL(f);
  }

  if (done) {
    return (
      <div ref={top}>
        <div style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 400 }}>Your strategy is ready</div>
        <h2 style={{ fontWeight: 400, fontSize: 26, letterSpacing: 0, color: "#fff", marginTop: 6 }}>{done.company}: partner program strategy</h2>
        <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6, color: "#C9CACE" }}>Your PDF covers positioning, partner types, value propositions, tiers, the commercial model, year 1 KPIs and a 90-day plan.</p>
        <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap" }}><button type="button" onClick={download} style={btn}>Download the PDF</button>{done.key ? <a href={`/find-partners/${done.key}`} style={{ ...btn, display: "inline-block", textDecoration: "none" }}>Find my partners</a> : null}</div>
        <div style={{ marginTop: 30 }}><button type="button" onClick={() => { setDone(null); setStep(0); }} style={ghost}>Start again with different answers</button></div>
      </div>
    );
  }

  if (busy && step === 3) {
    return (
      <div ref={top} role="status">
        <h2 style={{ fontWeight: 400, fontSize: 24, letterSpacing: 0, color: "#fff" }}>Writing your strategy</h2>
        <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6, color: "#C9CACE" }}>This takes two to three minutes. Please keep this tab open, your PDF appears here when it is ready.</p>
        <div style={{ marginTop: 22, height: 8, borderRadius: 999, background: "#5B3FE0", overflow: "hidden" }}><div style={{ width: `${Math.min(95, secs / 1.8)}%`, height: "100%", background: "#A8FF5C", transition: "width 1s linear" }} /></div>
        <div style={{ marginTop: 10, fontSize: 14, color: "#FFFFFF" }}>{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</div>
        <div aria-hidden="true" style={{ marginTop: 26 }}><Toby height={190} /></div>
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ v, set }}>
    <form onSubmit={step === 3 ? generate : next} ref={top as unknown as React.RefObject<HTMLFormElement>}>
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}><label>Leave this empty<input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (<span key={s} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 999, background: i === step ? "#A8FF5C" : "#FFFFFF", color: i === step ? "#0A0A0B" : "#0A0A0B" }}>{i + 1}. {s}</span>))}
      </div>

      {step === 0 && (<>
        <Field k="website" label="Company website" ph="yourcompany.com" hint="We read your public homepage for your name, logo and colour. Nothing else is collected" />
        <Sel k="category" label="Product category" opts={BUILDER_CATEGORIES} />
        <Field k="offeringSummary" label="What does your product do?" area ph="One or two sentences" />
        <Field k="keyFeatures" label="Top 3 features" ph="For example: feature one, feature two, feature three" />
        <Field k="differentiators" label="Why do customers choose you over alternatives?" area />
        <Sel k="deliveryModel" label="How is it delivered?" opts={DELIVERY} />
        <Lbl t="Main alternatives" /><input value={v.competitors} onChange={(e) => set("competitors", e.target.value)} maxLength={200} placeholder="Optional" style={inputS} />
      </>)}
      {step === 1 && (<>
        <Field k="endUser" label="Who uses it day to day?" ph="Job title and what they use it for" />
        <Field k="primaryBuyer" label="Who approves the purchase?" ph="Job title" />
        <Sel k="audience" label="Company size you sell to" opts={AUDIENCES} />
        <Field k="industriesServed" label="Industries you serve" />
        <Sel k="region" label="Main region" opts={REGIONS} />
        <Field k="pricing" label="How do you price?" ph="For example: from $500 per month" />
        <Lbl t="Typical annual contract value" req />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input inputMode="numeric" value={v.acvLow} onChange={(e) => set("acvLow", e.target.value)} placeholder="From" style={{ ...inputS, flex: "1 1 140px", width: "auto" }} />
          <input inputMode="numeric" value={v.acvHigh} onChange={(e) => set("acvHigh", e.target.value)} placeholder="To" style={{ ...inputS, flex: "1 1 140px", width: "auto" }} />
          <select value={v.currency} onChange={(e) => set("currency", e.target.value)} style={{ ...inputS, flex: "0 1 120px", width: "auto" }}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </>)}
      {step === 2 && (<>
        <Sel k="stage" label="Where is your partner program today?" opts={STAGES} />
        <Lbl t="What do you want from partners? Choose up to three" req />
        {GOALS.map((g) => {
          const on = goals.includes(g); const off = !on && goals.length >= 3;
          return (<label key={g} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", opacity: off ? 0.45 : 1, cursor: off ? "default" : "pointer", fontSize: 16 }}>
            <input type="checkbox" checked={on} disabled={off} onChange={() => setGoals(on ? goals.filter((x) => x !== g) : [...goals, g])} style={{ width: 18, height: 18, accentColor: "#A8FF5C" }} />{g}</label>);
        })}
        <Field k="year1PartnerRevenueTarget" label="Partner revenue target for year 1" ph="A number in your currency" />
        <Field k="partnerRevenueSharePercent" label="Share of total revenue you want from partners, in percent" ph="For example: 20" />
      </>)}
      {step === 3 && (<>
        <Lbl t="Your branding" />
        <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.5, color: "#FFFFFF" }}>The PDF uses your logo and colour. We found these on your site, change them if they are not right.</p>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {brand.logo ? <img src={brand.logo} alt="Logo preview" style={{ maxWidth: 52, maxHeight: 52 }} /> : <span style={{ color: "#0A0A0B", fontWeight: 400, fontSize: 22 }}>{(v.companyName || "?").slice(0, 1).toUpperCase()}</span>}
          </div>
          <label style={{ fontSize: 15, color: "#FFFFFF", cursor: "pointer", textDecoration: "underline" }}>Upload a logo<input type="file" accept="image/png,image/jpeg" onChange={(e) => onLogo(e.target.files?.[0])} style={{ display: "none" }} /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>Colour
            <input type="color" value={brand.color || "#5B3FE0"} onChange={(e) => setBrand((b) => ({ ...b, color: e.target.value }))} style={{ width: 44, height: 36, border: 0, background: "transparent", padding: 0 }} /></label>
        </div>
        <Lbl t="Company name on the PDF" req />
        <input value={v.companyName} onChange={(e) => set("companyName", e.target.value)} maxLength={80} style={inputS} />
        <div style={{ marginTop: 30, background: "#A8FF5C", color: "#0A0A0B", borderRadius: 16, padding: "24px 26px" }}>
          <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 17 }}>Where should we send your strategy?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 14 }}>
            <input required maxLength={60} value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" autoComplete="given-name" style={{ ...inputS, background: "#fff", color: "#0A0A0B", border: "1px solid #0A0A0B" }} />
            <input required maxLength={60} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" autoComplete="family-name" style={{ ...inputS, background: "#fff", color: "#0A0A0B", border: "1px solid #0A0A0B" }} />
          </div>
          <input type="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" autoComplete="email" style={{ ...inputS, marginTop: 12, background: "#fff", color: "#0A0A0B", border: "1px solid #0A0A0B" }} />
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 14, lineHeight: 1.45, cursor: "pointer" }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#0A0A0B", flex: "0 0 18px" }} />
            <span>I agree to the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link> and to receive occasional partner marketing news</span>
          </label>
        </div>
      </>)}

      {err && <div role="alert" style={{ marginTop: 18, fontSize: 15, color: "#FFFFFF" }}>{err}</div>}
      <div style={{ marginTop: 30, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>{step === 3 ? "Create my strategy" : busy ? "One moment" : "Continue"}</button>
        {step > 0 && <button type="button" onClick={() => { setErr(""); setStep(step - 1); scroll(); }} style={ghost}>Back</button>}
      </div>
    </form>
    </Ctx.Provider>
  );
}
