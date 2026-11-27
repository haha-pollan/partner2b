"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMPANY_TYPES, PARTNER_TYPES, presetOf, type CompanyType, type PartnerType } from "@/lib/comp/model";
import { defaultsFor, fromQuery, num, toQuery } from "@/lib/comp/params";

const inputS: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (<label style={{ display: "block", fontSize: 15, fontWeight: 400, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#A8FF5C" }}> *</span>}</label>);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>{t}</div>;
const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const ghost: React.CSSProperties = { background: "transparent", border: 0, color: "#A8FF5C", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline", padding: 0 };

export function CalculatorClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = useMemo(() => fromQuery(new URLSearchParams(sp.toString())), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [type, setType] = useState<CompanyType>(initial?.type ?? "saas");
  const [partner, setPartner] = useState<PartnerType>(initial?.partner ?? presetOf(initial?.type ?? "saas").partner);
  const d0 = defaultsFor(type, partner);
  const [goal, setGoal] = useState(initial?.goal ?? "");
  const [deal, setDeal] = useState(initial?.deal ?? String(presetOf(type).deal));
  const [a, setA] = useState({ margin: initial?.margin ?? d0.margin, r: initial?.r ?? d0.r, mix: initial?.mix ?? d0.mix, mk: initial?.mk ?? d0.mk, bn: initial?.bn ?? d0.bn, rn: initial?.rn ?? d0.rn });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const setR = (k: number, v: string) => setA((p) => ({ ...p, r: p.r.map((x, i) => (i === k ? v : x)) as typeof p.r }));
  const setM = (k: number, v: string) => setA((p) => ({ ...p, mix: p.mix.map((x, i) => (i === k ? v : x)) as typeof p.mix }));
  const reset = (t = type, p = partner) => setA(defaultsFor(t, p));
  function pickType(k: CompanyType) { const p = presetOf(k); setType(k); setDeal(String(p.deal)); setPartner(p.partner); reset(k, p.partner); }
  function pickPartner(p: PartnerType) { setPartner(p); setA((x) => ({ ...x, r: defaultsFor(type, p).r })); }
  const mixSum = a.mix.reduce((s, v) => s + num(v), 0);
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    if (!(num(goal) > 0)) { setErr("Please enter your partner revenue goal."); return; }
    if (!(num(deal) > 0)) { setErr("Please enter your average deal size."); return; }
    if (!(num(a.margin) > 0 && num(a.margin) <= 100)) { setErr("Please enter your gross margin between 1 and 100."); return; }
    if (Math.abs(mixSum - 100) > 0.5) { setErr("The tier mix has to add up to 100. It adds up to " + mixSum + " now."); return; }
    setErr(""); setBusy(true);
    router.push("/partner-compensation-calculator/results?" + toQuery({ type, partner, goal, deal, margin: a.margin, r: a.r, mix: a.mix, mk: a.mk, bn: a.bn, rn: a.rn }));
  }
  return (
    <form onSubmit={calculate}>
      <Lbl t="Company type" req />
      <select value={type} onChange={(e) => pickType(e.target.value as CompanyType)} style={inputS}>{COMPANY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select>
      <Hint t="Sets the starting values below. You can change every one" />
      <Lbl t="Main partner type" req />
      <select value={partner} onChange={(e) => pickPartner(e.target.value as PartnerType)} style={inputS}>{PARTNER_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select>
      <Lbl t="Partner revenue goal for the year" req />
      <input inputMode="numeric" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="For example: 500000" style={inputS} />
      <Hint t="New contract value you want to close through partners in the next 12 months, in US dollars" />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px" }}><Lbl t="Average deal size" req /><input inputMode="numeric" value={deal} onChange={(e) => setDeal(e.target.value)} style={inputS} /><Hint t="Average first-year contract value, in US dollars" /></div>
        <div style={{ flex: "1 1 220px" }}><Lbl t="Gross margin (%)" req /><input inputMode="decimal" value={a.margin} onChange={(e) => setA({ ...a, margin: e.target.value })} style={inputS} /><Hint t="Used to show what share of margin compensation takes" /></div>
      </div>
      <details style={{ marginTop: 26, background: "#1C1D20", border: "2px solid #A8FF5C", padding: "18px 22px" }}>
        <summary style={{ cursor: "pointer", fontSize: 17 }}>Edit rates and split</summary>
        <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.5, color: "#B9BABD" }}>These starting values follow the Partner2B Program builder tier rates and planning model. Change any of them to match your own program. Only one commission rate? Enter it in tier 1 and set the split to 100, 0 and 0.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "6px 18px" }}>
          {[0, 1, 2].map((k) => (<div key={`r${k}`}><Lbl t={`Tier ${k + 1} commission (%)`} /><input inputMode="decimal" value={a.r[k]} onChange={(e) => setR(k, e.target.value)} style={inputS} /></div>))}
          {[0, 1, 2].map((k) => (<div key={`m${k}`}><Lbl t={`Deals through tier ${k + 1} (%)`} /><input inputMode="decimal" value={a.mix[k]} onChange={(e) => setM(k, e.target.value)} style={inputS} /></div>))}
          <div><Lbl t="Partner marketing funds (% of revenue)" /><input inputMode="decimal" value={a.mk} onChange={(e) => setA({ ...a, mk: e.target.value })} style={inputS} /></div>
          <div><Lbl t="Performance bonus pool (% of revenue)" /><input inputMode="decimal" value={a.bn} onChange={(e) => setA({ ...a, bn: e.target.value })} style={inputS} /></div>
          <div><Lbl t="Partner revenue renewing this year" /><input inputMode="numeric" value={a.rn} onChange={(e) => setA({ ...a, rn: e.target.value })} style={inputS} /><Hint t="Optional, in US dollars" /></div>
        </div>
        <div style={{ marginTop: 18 }}><button type="button" onClick={() => reset()} style={ghost}>Reset to the starting values</button></div>
      </details>
      {err && <div role="alert" style={{ marginTop: 18, fontSize: 15, color: "#A8FF5C" }}>{err}</div>}
      <div style={{ marginTop: 30 }}><button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>{busy ? "One moment" : "Calculate my budget"}</button></div>
    </form>
  );
}
