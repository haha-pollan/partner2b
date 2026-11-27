"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_CYCLE_WEEKS, DEFAULT_DEAL, DEFAULT_HORIZON, HORIZONS, PARTNER_TYPES, defaultsFor, type PartnerType } from "@/lib/roi/model";
import { fromQuery, num, toQuery } from "@/lib/roi/params";
import { track } from "@/lib/track";

const inputS: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (<label style={{ display: "block", fontSize: 15, fontWeight: 400, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#A8FF5C" }}> *</span>}</label>);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>{t}</div>;
const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const ghost: React.CSSProperties = { background: "transparent", border: 0, color: "#A8FF5C", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline", padding: 0 };

export function CalculatorClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = useMemo(() => fromQuery(new URLSearchParams(sp.toString())), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [partner, setPartner] = useState<PartnerType>(initial?.partner ?? "referral");
  const startDeal = initial?.deal ?? String(DEFAULT_DEAL);
  const startDefs = defaultsFor(initial?.partner ?? "referral", num(startDeal));
  const [deal, setDeal] = useState(startDeal);
  const [partners, setPartners] = useState(initial?.partners ?? "");
  const [dpp, setDpp] = useState(initial?.dpp ?? String(startDefs.dealsPerPartner));
  const [commission, setCommission] = useState(initial?.commission ?? String(startDefs.commission));
  const [monthly, setMonthly] = useState(initial?.monthly ?? "");
  const [cycle, setCycle] = useState(initial?.cycle ?? String(DEFAULT_CYCLE_WEEKS));
  const [horizon, setHorizon] = useState(initial?.horizon ?? String(DEFAULT_HORIZON));
  const [compare, setCompare] = useState(initial?.compare ?? "");
  const [dppEdited, setDppEdited] = useState(!!initial);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    track("partner_roi_calculator_opened");
  }, []);

  // The partner type sets the starting values. Changing the deal size keeps updating deals per partner until the user edits it.
  function pickPartner(p: PartnerType) {
    const d = defaultsFor(p, num(deal));
    setPartner(p); setDpp(String(d.dealsPerPartner)); setCommission(String(d.commission)); setDppEdited(false);
  }
  function changeDeal(v: string) {
    setDeal(v);
    if (!dppEdited) setDpp(String(defaultsFor(partner, num(v)).dealsPerPartner));
  }
  function reset() {
    const d = defaultsFor(partner, num(deal));
    setDpp(String(d.dealsPerPartner)); setCommission(String(d.commission)); setCycle(String(DEFAULT_CYCLE_WEEKS)); setDppEdited(false);
  }
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    if (!(num(deal) > 0)) { setErr("Please enter your average deal size."); return; }
    if (!(num(partners) > 0)) { setErr("Please enter the number of active partners."); return; }
    if (!(num(monthly) > 0)) { setErr("Please enter your monthly program cost."); return; }
    if (!(num(dpp) > 0)) { setErr("Please enter the deals per active partner per year."); return; }
    if (commission.trim() === "" || !(num(commission) >= 0) || num(commission) >= 100) { setErr("Please enter a partner commission between 0 and 99."); return; }
    if (cycle.trim() === "" || !(num(cycle) >= 0)) { setErr("Please enter your sales cycle in weeks."); return; }
    setErr(""); setBusy(true);
    router.push("/partner-roi-calculator/results?" + toQuery({ partner, deal, partners, dpp, commission, monthly, cycle, horizon, compare }));
  }

  return (
    <div>
      <form onSubmit={calculate}>
        <Lbl t="Main partner type" req />
        <select value={partner} onChange={(e) => pickPartner(e.target.value as PartnerType)} style={inputS}>
          {PARTNER_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <Hint t="Sets the starting values below. You can change every one" />

        <Lbl t="Average deal size" req />
        <input inputMode="numeric" value={deal} onChange={(e) => changeDeal(e.target.value)} style={inputS} />
        <Hint t="Average first-year contract value, in US dollars" />

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Active partners" req />
            <input inputMode="numeric" value={partners} onChange={(e) => setPartners(e.target.value)} placeholder="For example: 10" style={inputS} />
            <Hint t="Partners who bring you deals, current or planned" />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Closed deals per active partner, per year" req />
            <input inputMode="decimal" value={dpp} onChange={(e) => { setDpp(e.target.value); setDppEdited(true); }} style={inputS} />
            <Hint t="Set from deal size and partner type" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Partner commission (%)" req />
            <input inputMode="decimal" value={commission} onChange={(e) => setCommission(e.target.value)} style={inputS} />
            <Hint t="Share of each deal paid to the partner" />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Monthly program cost" req />
            <input inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="For example: 8000" style={inputS} />
            <Hint t="Team, tools, enablement and partner marketing, in US dollars a month" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Sales cycle in weeks" req />
            <input inputMode="decimal" value={cycle} onChange={(e) => setCycle(e.target.value)} style={inputS} />
            <Hint t="From first conversation to signed deal" />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <Lbl t="Time window" req />
            <select value={horizon} onChange={(e) => setHorizon(e.target.value)} style={inputS}>
              {HORIZONS.map((h) => <option key={h} value={h}>{h} months</option>)}
            </select>
            <Hint t="How long you measure the program" />
          </div>
        </div>

        <Lbl t="Cost per customer from other channels" />
        <input inputMode="numeric" value={compare} onChange={(e) => setCompare(e.target.value)} placeholder="Optional" style={inputS} />
        <Hint t="Optional. Adds a comparison with what a customer costs you today, in US dollars" />

        <div style={{ marginTop: 16 }}><button type="button" onClick={reset} style={ghost}>Reset to the starting values</button></div>

        {err && <div role="alert" style={{ marginTop: 18, fontSize: 15, color: "#A8FF5C" }}>{err}</div>}
        <div style={{ marginTop: 30 }}>
          <button type="submit" disabled={busy} style={{ ...btn, opacity: busy ? 0.6 : 1 }}>{busy ? "One moment" : "Calculate my return"}</button>
        </div>
      </form>
    </div>
  );
}
