"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  APPROACHES, COMPANY_TYPES, DEFAULT_WINDOW_MONTHS, PARTNER_TYPES,
  type Approach, type CompanyType, type PartnerType,
} from "@/lib/pipeline/model";
import { defaultsFor, fromQuery, num, presetFor, toQuery } from "@/lib/pipeline/params";
import { track } from "@/lib/track";

const inputS: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (<label style={{ display: "block", fontSize: 15, fontWeight: 400, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#A8FF5C" }}> *</span>}</label>);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>{t}</div>;
const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const ghost: React.CSSProperties = { background: "transparent", border: 0, color: "#A8FF5C", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline", padding: 0 };

const ASSUMPTIONS: { k: string; label: string; unit: string; hint: string }[] = [
  { k: "winRate", label: "Win rate", unit: "%", hint: "Share of qualified partner opportunities you win" },
  { k: "dealsPerPartner", label: "Closed deals per active partner, per year", unit: "", hint: "Set from deal size and partner type" },
  { k: "activation", label: "Activation rate", unit: "%", hint: "Signed partners that bring a qualified deal within 90 days" },
  { k: "reply", label: "Reply rate", unit: "%", hint: "Companies that reply to your outreach" },
  { k: "replyToSigned", label: "Replies that become signed partners", unit: "%", hint: "Share of replying companies that sign" },
  { k: "recruitMonths", label: "Months to recruit and onboard", unit: "months", hint: "Before the first partner can bring a deal" },
  { k: "payout", label: "Partner payout or margin", unit: "%", hint: "Share of deal value paid to the partner" },
  { k: "existingActive", label: "Active partners you already have", unit: "", hint: "Partners already bringing you deals" },
  { k: "marketSize", label: "Partner companies you can identify", unit: "", hint: "Optional, used to check the list against your market" },
];

export function CalculatorClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = useMemo(() => fromQuery(new URLSearchParams(sp.toString())), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [type, setType] = useState<CompanyType>(initial?.type ?? "saas");
  const preset = presetFor(type);
  const [goal, setGoal] = useState(initial?.goal ?? "");
  const [deal, setDeal] = useState(initial?.deal ?? String(preset.deal));
  const [cycle, setCycle] = useState(initial?.cycle ?? String(preset.cycleWeeks));
  const [windowM, setWindowM] = useState(initial?.windowM ?? String(DEFAULT_WINDOW_MONTHS));
  const [partner, setPartner] = useState<PartnerType>(initial?.partner ?? preset.partner);
  const [approach, setApproach] = useState<Approach>(initial?.approach ?? "targeted");
  const [ov, setOv] = useState<Record<string, string>>(initial?.ov ?? {});
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    track("partner_pipeline_calculator_opened");
  }, []);

  const defs = useMemo(() => defaultsFor(approach, partner, num(deal), type), [approach, partner, deal, type]);
  const val = (k: string) => (ov[k] !== undefined ? ov[k] : defs[k] !== undefined ? String(defs[k]) : "");
  const setAssump = (k: string, v: string) => setOv((p) => ({ ...p, [k]: v }));
  const drop = (keys: string[]) => setOv((p) => { const n = { ...p }; keys.forEach((k) => delete n[k]); return n; });

  function pickType(k: CompanyType) {
    const p = presetFor(k);
    setType(k); setDeal(String(p.deal)); setCycle(String(p.cycleWeeks)); setPartner(p.partner); setOv({});
  }
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    if (!(num(goal) > 0)) { setErr("Please enter your revenue goal."); return; }
    if (!(num(deal) > 0)) { setErr("Please enter your average deal size."); return; }
    if (!(num(cycle) >= 0) || cycle.trim() === "") { setErr("Please enter your sales cycle in weeks."); return; }
    if (!(num(windowM) > 0)) { setErr("Please enter the time window in months."); return; }
    setErr(""); setBusy(true);
    // Keep only the assumptions the user actually changed
    const changed: Record<string, string> = {};
    Object.keys(ov).forEach((k) => { if (ov[k].trim() !== "" && ov[k] !== String(defs[k])) changed[k] = ov[k]; });
    router.push("/partner-pipeline-calculator/results?" + toQuery({ type, goal, deal, cycle, windowM, partner, approach, ov: changed }));
  }

  return (
    <div>
      <form onSubmit={calculate}>

        <Lbl t="Company type" req />
        <select value={type} onChange={(e) => pickType(e.target.value as CompanyType)} style={inputS}>
          {COMPANY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <Hint t="Sets the starting values below. You can change every one" />

        <Lbl t="Revenue goal" req />
        <input inputMode="numeric" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="For example: 500000" style={inputS} />
        <Hint t="New contract value you want to close through partners within the time window, in US dollars" />

        <Lbl t="Average deal size" req />
        <input inputMode="numeric" value={deal} onChange={(e) => setDeal(e.target.value)} style={inputS} />
        <Hint t="Average annual contract value, in US dollars" />

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Sales cycle in weeks" req />
            <input inputMode="decimal" value={cycle} onChange={(e) => setCycle(e.target.value)} style={inputS} />
            <Hint t="From first conversation to signed deal" />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Time window in months" req />
            <input inputMode="decimal" value={windowM} onChange={(e) => setWindowM(e.target.value)} style={inputS} />
            <Hint t="How long you have to reach the goal" />
          </div>
        </div>

        <Lbl t="Main partner type" req />
        <select value={partner} onChange={(e) => { setPartner(e.target.value as PartnerType); drop(["dealsPerPartner", "payout"]); }} style={inputS}>
          {PARTNER_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>

        <Lbl t="How will you reach partners" req />
        <select value={approach} onChange={(e) => { setApproach(e.target.value as Approach); drop(["reply", "replyToSigned", "activation"]); }} style={inputS}>
          {APPROACHES.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>
        <Hint t={APPROACHES.find((a) => a.key === approach)!.hint} />

        <details style={{ marginTop: 26, background: "#1C1D20", padding: "18px 22px" }}>
          <summary style={{ cursor: "pointer", fontSize: 17 }}>Edit assumptions</summary>
          <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.5, color: "#B9BABD" }}>These starting values come from published benchmarks and the Partner2B planning model. Change any of them to match your own data.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "6px 18px" }}>
            {ASSUMPTIONS.map((a) => (
              <div key={a.k}>
                <Lbl t={a.unit ? `${a.label} (${a.unit})` : a.label} />
                <input inputMode="decimal" value={val(a.k)} onChange={(e) => setAssump(a.k, e.target.value)} placeholder={a.k === "marketSize" ? "Optional" : undefined} style={inputS} />
                <Hint t={a.hint} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}><button type="button" onClick={() => setOv({})} style={ghost}>Reset assumptions to the starting values</button></div>
        </details>

        {err && <div role="alert" style={{ marginTop: 18, fontSize: 15, color: "#A8FF5C" }}>{err}</div>}
        <div style={{ marginTop: 30 }}>
          <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>{busy ? "One moment" : "Calculate my pipeline"}</button>
        </div>
      </form>
    </div>
  );
}
