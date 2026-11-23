"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  APPROACHES, APPROACH_DEFAULTS, COMPANY_TYPES, PARTNER_TYPES, PAYOUT_DEFAULT, DEFAULT_RECRUIT_MONTHS, DEFAULT_WINDOW_MONTHS,
  MIN_PAYOUT_PER_DEAL, biggestLever, bucket, compute, defaultDealsPerPartner, fmt, listBand, trim, usd,
  type Approach, type CompanyType, type Inputs, type PartnerType, type Result,
} from "@/lib/pipeline/model";
import { track } from "@/lib/track";

const inputS: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (<label style={{ display: "block", fontSize: 15, fontWeight: 400, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#A8FF5C" }}> *</span>}</label>);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>{t}</div>;
const btn: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const ghost: React.CSSProperties = { background: "transparent", border: 0, color: "#A8FF5C", cursor: "pointer", font: "inherit", fontSize: 15, textDecoration: "underline", padding: 0 };
const numStyle: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, lineHeight: 1, WebkitTextStroke: "1.5px currentColor" };
const gateInput: React.CSSProperties = { ...inputS, background: "#fff", color: "#0A0A0B", border: "1px solid #0A0A0B" };

const num = (s: string) => Number(String(s).replace(/[,\s$]/g, ""));
const partnerWord: Record<PartnerType, string> = { referral: "referral partners", technology: "technology partners", agency: "agencies", reseller: "resellers" };

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
  const [type, setType] = useState<CompanyType>("saas");
  const preset = COMPANY_TYPES.find((t) => t.key === type)!;
  const [goal, setGoal] = useState("");
  const [deal, setDeal] = useState(String(preset.deal));
  const [cycle, setCycle] = useState(String(preset.cycleWeeks));
  const [windowM, setWindowM] = useState(String(DEFAULT_WINDOW_MONTHS));
  const [partner, setPartner] = useState<PartnerType>(preset.partner);
  const [approach, setApproach] = useState<Approach>("targeted");
  const [ov, setOv] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);
  const [err, setErr] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadErr, setLeadErr] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    track("partner_pipeline_calculator_opened");
  }, []);

  const defs: Record<string, number> = useMemo(() => {
    const ap = APPROACH_DEFAULTS[approach];
    const d = num(deal) > 0 ? num(deal) : preset.deal;
    return {
      winRate: preset.win, dealsPerPartner: defaultDealsPerPartner(d, partner),
      activation: ap.activation, reply: ap.reply, replyToSigned: ap.replyToSigned,
      recruitMonths: DEFAULT_RECRUIT_MONTHS, payout: PAYOUT_DEFAULT[partner], existingActive: 0,
    };
  }, [approach, partner, deal, preset]);
  const val = (k: string) => (ov[k] !== undefined ? ov[k] : defs[k] !== undefined ? String(defs[k]) : "");
  const setAssump = (k: string, v: string) => setOv((p) => ({ ...p, [k]: v }));
  const drop = (keys: string[]) => setOv((p) => { const n = { ...p }; keys.forEach((k) => delete n[k]); return n; });

  const inputs: Inputs = {
    goal: num(goal), dealSize: num(deal), cycleWeeks: num(cycle), windowMonths: num(windowM), partner,
    winRate: num(val("winRate")), dealsPerPartner: num(val("dealsPerPartner")), activation: num(val("activation")),
    reply: num(val("reply")), replyToSigned: num(val("replyToSigned")),
    recruitMonths: num(val("recruitMonths")), existingActive: num(val("existingActive")) || 0,
    marketSize: num(val("marketSize")) > 0 ? num(val("marketSize")) : null, payout: num(val("payout")),
  };
  const result = useMemo(() => compute(inputs), [JSON.stringify(inputs)]); // eslint-disable-line react-hooks/exhaustive-deps

  function pickType(k: CompanyType) {
    const p = COMPANY_TYPES.find((t) => t.key === k)!;
    setType(k); setDeal(String(p.deal)); setCycle(String(p.cycleWeeks)); setPartner(p.partner); setOv({});
  }
  function calculate(e: React.FormEvent) {
    e.preventDefault();
    if (!(num(goal) > 0)) { setErr("Please enter your revenue goal."); return; }
    if (!(num(deal) > 0)) { setErr("Please enter your average deal size."); return; }
    if (!(num(cycle) >= 0) || cycle.trim() === "") { setErr("Please enter your sales cycle in weeks."); return; }
    if (!(num(windowM) > 0)) { setErr("Please enter the time window in months."); return; }
    setErr("");
    setCalculated(true);
    if (result.ok) {
      track("partner_pipeline_calculator_completed", {
        company_type: type, partner_type: partner, approach, window_months: num(windowM),
        goal_band: bucket(num(goal), [50000, 250000, 1000000, 5000000]),
        deal_band: bucket(num(deal), [1000, 10000, 50000, 150000]),
        list_band: listBand(result.list), edited_assumptions: Object.keys(ov).length,
      });
    } else {
      track("partner_pipeline_calculator_completed", { company_type: type, partner_type: partner, approach, outcome: result.reason });
    }
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }
  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!result.ok) return;
    if (!first.trim() || !last.trim()) { setLeadErr("Please enter your first and last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setLeadErr("Please enter a valid email address."); return; }
    if (!consent) { setLeadErr("Please tick the box so we can show you the full results."); return; }
    setLeadErr(""); setBusy(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const res = await fetch("/api/pipeline-calculator", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first.trim(), last_name: last.trim(), email: email.trim(), consent, website_confirm: trap,
          company_type: type, inputs: { ...inputs, approach }, results: result,
          utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "",
          referrer: document.referrer,
        }),
      });
      const j = await res.json().catch(() => null);
      if (!j || !j.ok) setLeadErr(j?.error ?? "Something went wrong. Please try again.");
      else { setUnlocked(true); track("partner_pipeline_calculator_lead_submitted", { company_type: type, partner_type: partner, approach, list_band: listBand(result.list) }); }
    } catch { setLeadErr("We could not reach the server. Please try again."); }
    setBusy(false);
  }

  const lever = result.ok ? biggestLever(inputs, result) : null;

  return (
    <div>
      <form onSubmit={calculate}>
        <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}><label>Leave this empty<input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>

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
          <button type="submit" style={btn}>Calculate my pipeline</button>
        </div>
      </form>

      <div ref={resultRef} aria-live="polite" style={{ scrollMarginTop: 24 }}>
        {calculated && !result.ok && (
          <div role="alert" style={{ marginTop: 36, background: "#1C1D20", padding: "24px 26px", fontSize: 17, lineHeight: 1.6, color: "#A8FF5C" }}>{result.message}</div>
        )}
        {calculated && result.ok && <Results r={result} i={inputs} lever={lever} unlocked={unlocked} gate={{ first, setFirst, last, setLast, email, setEmail, consent, setConsent, busy, leadErr, unlock }} />}
      </div>
    </div>
  );
}

type Gate = { first: string; setFirst: (v: string) => void; last: string; setLast: (v: string) => void; email: string; setEmail: (v: string) => void; consent: boolean; setConsent: (v: boolean) => void; busy: boolean; leadErr: string; unlock: (e: React.FormEvent) => void };

function Results({ r, i, lever, unlocked, gate }: { r: Result; i: Inputs; lever: ReturnType<typeof biggestLever>; unlocked: boolean; gate: Gate }) {
  const band = listBand(r.list);
  const next = {
    small: { t: "Start with a hand-picked list", p: "A list this size is manageable for one person. Research each company, write personal messages and track every reply. Your partner program strategy shows which partner types to start with." },
    medium: { t: "Give the work a named owner", p: "A list this size needs a dedicated owner, a sequence of messages and a simple way to track partners. Settle your partner types, tiers and earnings first, so outreach has a clear offer." },
    large: { t: "Change the levers before you start", p: "A list this large is hard to build and harder to work. Try a higher activation rate, a longer window or a partner type that closes more deals per partner. You can also add inbound routes, such as listing your program in the directory." },
  }[band];
  const lowPayout = i.partner !== "technology" && r.payoutPerDeal < MIN_PAYOUT_PER_DEAL;
  const overMarket = i.marketSize !== null && r.list > i.marketSize;
  const levels: [string, number, string, string, string][] = [
    ["Build a list and reach out to", r.list, `Companies that match your ideal partner profile. About ${fmt(r.perWeek)} a week over the first ${trim(i.recruitMonths)} months.`, "#ECECEE", "#0A0A0B"],
    [r.signed === 1 ? "Sign 1 partner" : `Sign ${fmt(r.signed)} partners`, r.signed, "Companies that reply and agree to work with you.", "#A8FF5C", "#0A0A0B"],
    ["Active partners", r.activePartners, "Signed partners that start bringing you deals.", "#85868B", "#0A0A0B"],
    ["Deals closed", r.deals, `Enough to reach ${usd(i.goal)} in ${trim(i.windowMonths)} months.`, "#4A4B51", "#fff"],
  ];
  const widths = [100, 82, 64, 48];
  const firstDeal = Math.min(i.windowMonths, Math.ceil(i.recruitMonths + (i.cycleWeeks * 7) / 30.4));
  const plan: [string, string, string][] = [
    ["Month 0", `Build a list of ${fmt(r.list)} partner companies`, "Companies that match your ideal partner profile, each with a verified contact"],
    ["Months 1 to " + trim(i.recruitMonths), `Reach out to all ${fmt(r.list)}`, `About ${fmt(r.perWeek)} a week`],
    ["Month " + trim(i.recruitMonths), `${fmt(r.signed)} ${r.signed === 1 ? "partner" : "partners"} signed`, `${fmt(r.activePartners)} of them active and bringing deals`],
    ["Month " + trim(firstDeal), "First deals close", `After a sales cycle of ${trim(i.cycleWeeks)} weeks`],
    ["Month " + trim(i.windowMonths), `${usd(i.goal)} reached`, `${fmt(r.deals)} ${r.deals === 1 ? "deal" : "deals"} closed in total`],
  ];
  return (
    <div style={{ marginTop: 44 }}>
      <h2 style={{ fontWeight: 400, fontSize: "clamp(24px,2.6vw,34px)", letterSpacing: 0, color: "#fff" }}>Your partner pipeline</h2>
      {r.covered ? (
        <p style={{ margin: "18px 0 0", fontSize: 19, lineHeight: 1.5 }}>Your existing active partners already cover this goal. Raise the goal or lower the number of existing partners to see the pipeline you would need.</p>
      ) : (
        <>
          <p style={{ margin: "18px 0 0", fontSize: 19, lineHeight: 1.5, maxWidth: 640 }}>If you plan to reach {usd(i.goal)} in {trim(i.windowMonths)} months with a deal size of {usd(i.dealSize)}, this is the pipeline you need. It takes {fmt(r.deals)} {r.deals === 1 ? "deal" : "deals"}.</p>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 6 }}>
            {levels.map(([label, n, text, bg, fg], k) => (
              <div key={label} className="cut pipe" style={{ background: bg, color: fg, width: `${widths[k]}%`, alignSelf: "center", ["--c" as string]: "24px" }}>
                <span style={{ fontSize: 15, width: 28 }}>{String(k + 1).padStart(2, "0")}</span>
                <span className="pipen" style={{ color: k === 3 ? "#A8FF5C" : fg }}>{fmt(n)}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 18 }}>{label}</span>
                  <span style={{ display: "block", marginTop: 3, fontSize: 15, lineHeight: 1.4 }}>{text}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      {!r.covered && (
        <>
          {lowPayout && (
            <div role="note" style={{ marginTop: 22, fontSize: 16, lineHeight: 1.55, color: "#A8FF5C" }}>
              At {usd(r.payoutPerDeal)} per deal, {partnerWord[i.partner]} have little reason to act. Consider a larger bundle or an annual plan{i.partner === "reseller" ? "" : ", or partner types that earn through volume, such as resellers"}.
            </div>
          )}
          {overMarket && (
            <div role="note" style={{ marginTop: 18, fontSize: 16, lineHeight: 1.55, color: "#A8FF5C" }}>
              This plan needs a list of {fmt(r.list)}, more than the {fmt(i.marketSize as number)} partner companies you can identify. Raise activation, extend the window or choose a partner type that closes more deals per partner.
            </div>
          )}
          {r.productiveMonths < 3 && (
            <div role="note" style={{ marginTop: 18, fontSize: 16, lineHeight: 1.55, color: "#A8FF5C" }}>
              Only {trim(r.productiveMonths)} months of your window are left for closing deals, after recruiting and the sales cycle. Small changes to the window move the result a lot.
            </div>
          )}

          <div className="cut" style={{ marginTop: 26, background: "#fff", color: "#0A0A0B", padding: "26px 28px 34px", ["--c" as string]: "22px" }}>
            <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 17 }}>{next.t}</div>
            <p style={{ margin: "12px 0 0", fontSize: 17, lineHeight: 1.55, color: "#3A3B40" }}>{next.p}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 22 }}>
              <Link href="/program-builder" className="btn btn-p">Open the program builder</Link>
              <Link href="/contact" className="btn btn-s">Talk to us</Link>
            </div>
          </div>

          {!unlocked ? (
            <form onSubmit={gate.unlock} style={{ marginTop: 26, background: "#A8FF5C", color: "#0A0A0B", borderRadius: 16, padding: "24px 26px" }}>
              <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 17 }}>See your timeline</div>
              <p style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.5 }}>Your milestones from the first message to the goal, and the one change that helps most.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 16 }}>
                <input required maxLength={60} value={gate.first} onChange={(e) => gate.setFirst(e.target.value)} placeholder="First name" autoComplete="given-name" style={gateInput} />
                <input required maxLength={60} value={gate.last} onChange={(e) => gate.setLast(e.target.value)} placeholder="Last name" autoComplete="family-name" style={gateInput} />
              </div>
              <input type="email" required maxLength={320} value={gate.email} onChange={(e) => gate.setEmail(e.target.value)} placeholder="name@company.com" autoComplete="email" style={{ ...gateInput, marginTop: 12 }} />
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 14, lineHeight: 1.45, cursor: "pointer" }}>
                <input type="checkbox" checked={gate.consent} onChange={(e) => gate.setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#0A0A0B", flex: "0 0 18px" }} />
                <span>I agree to the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link> and to receive occasional partner marketing news</span>
              </label>
              {gate.leadErr && <div role="alert" style={{ marginTop: 14, fontSize: 15, fontWeight: 400 }}>{gate.leadErr}</div>}
              <button type="submit" disabled={gate.busy} style={{ ...btn, background: "#0A0A0B", color: "#A8FF5C", marginTop: 18, opacity: gate.busy ? 0.6 : 1 }}>{gate.busy ? "One moment" : "Show the full results"}</button>
            </form>
          ) : (
            <div style={{ marginTop: 34 }}>
              <h2 style={{ fontWeight: 400, fontSize: 23, letterSpacing: 0, color: "#fff" }}>Your milestones</h2>
              <ol className="bldsteps" style={{ marginTop: 22, gap: 18 }}>
                {plan.map(([when, what, note], k) => (
                  <li key={when} style={{ alignItems: "flex-start" }}>
                    <span className="bldn" style={{ background: "#A8FF5C", color: "#0A0A0B" }}>{k + 1}</span>
                    <span>
                      <span style={{ display: "block", fontSize: 15, color: "#A8FF5C" }}>{when}</span>
                      <b style={{ marginTop: 2 }}>{what}</b>
                      <i style={{ color: "#85868B" }}>{note}</i>
                    </span>
                  </li>
                ))}
              </ol>
              {lever && (
                <p style={{ margin: "26px 0 0", fontSize: 17, lineHeight: 1.55, color: "#C9CACE" }}>
                  <span style={{ color: "#A8FF5C" }}>The change that helps most.</span> {lever.text} would cut your initial list from {fmt(lever.from)} to {fmt(lever.to)}.
                </p>
              )}
            </div>
          )}
        </>
      )}
      <p style={{ margin: "26px 0 0", fontSize: 14, lineHeight: 1.55, color: "#85868B" }}>
        These figures are illustrative estimates based on published benchmarks and the values you enter. They are not a forecast or a promise of results.
      </p>
    </div>
  );
}
