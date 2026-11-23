"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toby } from "@/components/Toby";
import { Glyph } from "@/components/Tile";
import { MIN_PAYOUT_PER_DEAL, biggestLever, bucket, compute, fmt, listBand, trim, usd, type PartnerType } from "@/lib/pipeline/model";
import { fromQuery, toInputs } from "@/lib/pipeline/params";
import { track } from "@/lib/track";

const partnerWord: Record<PartnerType, string> = { referral: "referral partners", technology: "technology partners", agency: "agencies", reseller: "resellers" };
const numStyle: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, lineHeight: 1, WebkitTextStroke: "1.5px currentColor" };
const gateInput: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const btnStyle: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };

export function ResultsClient({ nav, footer }: { nav: React.ReactNode; footer: React.ReactNode }) {
  const sp = useSearchParams();
  const qs = sp.toString();
  const raw = useMemo(() => fromQuery(new URLSearchParams(qs)), [qs]);
  const inputs = useMemo(() => (raw ? toInputs(raw) : null), [raw]);
  const r = useMemo(() => (inputs ? compute(inputs) : null), [inputs]);
  const lever = inputs && r && r.ok ? biggestLever(inputs, r) : null;

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadErr, setLeadErr] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !raw || !inputs || !r) return;
    done.current = true;
    if (r.ok) {
      track("partner_pipeline_calculator_completed", {
        company_type: raw.type, partner_type: raw.partner, approach: raw.approach, window_months: inputs.windowMonths,
        goal_band: bucket(inputs.goal, [50000, 250000, 1000000, 5000000]),
        deal_band: bucket(inputs.dealSize, [1000, 10000, 50000, 150000]),
        list_band: listBand(r.list), edited_assumptions: Object.keys(raw.ov).length,
      });
    } else {
      track("partner_pipeline_calculator_completed", { company_type: raw.type, partner_type: raw.partner, approach: raw.approach, outcome: r.reason });
    }
  }, [raw, inputs, r]);

  const back = "/partner-pipeline-calculator" + (qs ? `?${qs}` : "");

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!raw || !inputs || !r || !r.ok) return;
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
          company_type: raw.type, inputs: { ...inputs, approach: raw.approach }, results: r,
          utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "",
          referrer: document.referrer,
        }),
      });
      const j = await res.json().catch(() => null);
      if (!j || !j.ok) setLeadErr(j?.error ?? "Something went wrong. Please try again.");
      else { setUnlocked(true); track("partner_pipeline_calculator_lead_submitted", { company_type: raw.type, partner_type: raw.partner, approach: raw.approach, list_band: listBand(r.list) }); }
    } catch { setLeadErr("We could not reach the server. Please try again."); }
    setBusy(false);
  }

  // Missing or broken link, or a plan that cannot work in the window
  if (!raw || !inputs || !r || !r.ok || r.covered) {
    const msg = !raw || !inputs || !r
      ? "We could not read your numbers from this link. Enter them again and we will rebuild your pipeline."
      : !r.ok ? r.message
      : "Your existing active partners already cover this goal. Raise the goal or lower the number of existing partners to see the pipeline you would need.";
    return (
      <div style={{ overflow: "hidden" }}>
        <div className="hero">
          {nav}
          <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
            <div className="tapewrap">
              <h1 className="ptapes"><span className="pt pt1">Your partner pipeline</span></h1>
              <p className="bubble herosub" style={{ marginTop: 44 }}>{msg}</p>
              <div className="herobtns"><Link href={back} className="btn btn-p">Change your inputs</Link></div>
            </div>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  const band = listBand(r.list);
  const next = {
    small: { t: "Start with a hand-picked list", p: "A list this size is manageable for one person. Research each company, write personal messages and track every reply. Your partner program strategy shows which partner types to start with." },
    medium: { t: "Give the work a named owner", p: "A list this size needs a dedicated owner, a sequence of messages and a simple way to track partners. Settle your partner types, tiers and earnings first, so outreach has a clear offer." },
    large: { t: "Change the levers before you start", p: "A list this large is hard to build and harder to work. Try a higher activation rate, a longer window or a partner type that closes more deals per partner. You can also add inbound routes, such as listing your program in the directory." },
  }[band];
  const lowPayout = inputs.partner !== "technology" && r.payoutPerDeal < MIN_PAYOUT_PER_DEAL;
  const overMarket = inputs.marketSize !== null && r.list > inputs.marketSize;
  const perTxt = r.dealsPerPartnerInWindow >= 10 ? fmt(r.dealsPerPartnerInWindow) : String(Math.max(0.1, Math.round(r.dealsPerPartnerInWindow * 10) / 10));
  const firstDeal = Math.min(inputs.windowMonths, Math.ceil(inputs.recruitMonths + (inputs.cycleWeeks * 7) / 30.4));
  const win = trim(inputs.windowMonths);

  // background, text, indent, glyph
  const stages: [string, string, number, string, string, string, string][] = [
    ["Find", fmt(r.list), 0, "#ECECEE", "#0A0A0B", "bars", `Build a list of partner companies that match your ideal partner profile and reach out to every one. About ${fmt(r.perWeek)} a week over the first ${trim(inputs.recruitMonths)} months.`],
    ["Sign", fmt(r.signed), 4, "#A8FF5C", "#0A0A0B", "diamond", "Partners that reply and agree to work with you."],
    ["Activate", fmt(r.activePartners), 8, "#85868B", "#0A0A0B", "grid", `Signed partners that start bringing you deals. Each one closes about ${perTxt} ${perTxt === "1" ? "deal" : "deals"} in your window.`],
    ["Close", fmt(r.deals), 12, "#4A4B51", "#fff", "stairs", `Deals closed, enough to reach ${usd(inputs.goal)} in ${win} months.`],
  ];
  const units = ["partner companies", r.signed === 1 ? "partner" : "partners", r.activePartners === 1 ? "active partner" : "active partners", r.deals === 1 ? "deal" : "deals"];
  const stats: [string, string, string, string, string, number, number][] = [
    [trim(firstDeal), firstDeal === 1 ? "month to your first deal" : "months to your first deal", "#FFFFFF", "#0A0A0B", "#0A0A0B", 1.5, 40],
    [perTxt, "deals per active partner", "#A8FF5C", "#0A0A0B", "#0A0A0B", -2, 0],
    [fmt(r.perWeek), "outreach messages a week", "#3A3B40", "#fff", "#A8FF5C", 1.5, 40],
  ];
  const plan: [string, string, string][] = [
    ["Month 0", `Build a list of ${fmt(r.list)} partner companies`, "Companies that match your ideal partner profile, each with a verified contact"],
    ["Months 1 to " + trim(inputs.recruitMonths), `Reach out to all ${fmt(r.list)}`, `About ${fmt(r.perWeek)} a week`],
    ["Month " + trim(inputs.recruitMonths), `${fmt(r.signed)} ${r.signed === 1 ? "partner" : "partners"} signed`, `${fmt(r.activePartners)} of them active and bringing deals`],
    ["Month " + trim(firstDeal), "First deals close", `After a sales cycle of ${trim(inputs.cycleWeeks)} weeks`],
    ["Month " + win, `${usd(inputs.goal)} reached`, `${fmt(r.deals)} ${r.deals === 1 ? "deal" : "deals"} closed in total`],
  ];
  const timeline = (
    <div className="tl">
      {plan.map(([when, what, note], k) => (
        <div key={when} className="tli">
          <span className="tldot">{k + 1}</span>
          <div className="tlt">
            <div className="tlw">{when}</div>
            <div className="tlh">{what}</div>
            <div className="tln">{note}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ overflow: "hidden" }}>
      {/* Hero */}
      <div className="hero">
        {nav}
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Your partner pipeline</span>
              <span className="pt pt2">{usd(inputs.goal)} in {win} months</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>If you plan to reach {usd(inputs.goal)} in {win} months with a deal size of {usd(inputs.dealSize)}, this is the pipeline you need. It takes {fmt(r.deals)} {r.deals === 1 ? "deal" : "deals"}.</p>
            <div className="herobtns"><Link href={back} className="btn btn-s">Change your inputs</Link></div>
          </div>
          <div className="herotoby" aria-hidden="true">
            <Toby height={580} rows={38} glasses style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>

      {/* Stages as a staircase, edge to edge */}
      <section aria-labelledby="pl-stages" style={{ padding: "40px 0 150px" }}>
        <div className="wrap"><h2 id="pl-stages" className="sectitle">Four stages to your goal</h2></div>
        <div style={{ marginTop: 44 }}>
          {stages.map(([name, n, ind, bg, tx, glyph, text], k) => (
            <div key={name} className="stair plstair" style={{ background: bg, color: tx, marginLeft: `${ind}%` }}>
              <span className="plnumwrap">
                <span className="plnum" style={{ color: k === 3 ? "#A8FF5C" : tx }}>{n}</span>
                <span style={{ display: "block", marginTop: 10, fontSize: 16 }}>{units[k]}</span>
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="stairname" style={{ display: "block", fontFamily: "'Michroma',sans-serif", fontSize: 28, WebkitTextStroke: "1.2px currentColor" }}>{name}</span>
                <span style={{ display: "block", marginTop: 8, fontSize: 17, lineHeight: 1.5, maxWidth: 640 }}>{text}</span>
              </span>
              <span className="stairglyph" style={{ display: "flex" }}><Glyph kind={glyph} fg={tx} size={44} /></span>
            </div>
          ))}
        </div>
      </section>

      {/* The numbers */}
      <section aria-labelledby="pl-nums" style={{ padding: "0 0 170px" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 56, flexWrap: "wrap" }}>
          <div className="dirtext" style={{ flex: "1 1 460px" }}>
            <span className="kick">The numbers</span>
            <h2 id="pl-nums">What it takes to get there</h2>
            <p>Each active partner closes about {perTxt} {perTxt === "1" ? "deal" : "deals"} in your window. At a payout of {trim(inputs.payout)}%, {partnerWord[inputs.partner]} earn about {usd(r.payoutPerDeal)} per deal and {usd(r.payoutTotal)} in total.</p>
            {lowPayout && <p style={{ color: "#A8FF5C" }}>At {usd(r.payoutPerDeal)} per deal, {partnerWord[inputs.partner]} have little reason to act. Consider a larger bundle or an annual plan{inputs.partner === "reseller" ? "" : ", or partner types that earn through volume, such as resellers"}.</p>}
            {overMarket && <p style={{ color: "#A8FF5C" }}>This plan needs a list of {fmt(r.list)}, more than the {fmt(inputs.marketSize as number)} partner companies you can identify. Raise activation, extend the window or choose a partner type that closes more deals per partner.</p>}
            {r.productiveMonths < 3 && <p style={{ color: "#A8FF5C" }}>Only {trim(r.productiveMonths)} months of your window are left for closing deals, after recruiting and the sales cycle. Small changes to the window move the result a lot.</p>}
          </div>
          <div className="dirstack plstats" style={{ flex: "0 1 480px", display: "flex", flexDirection: "column", gap: 18 }}>
            {stats.map(([n, l, bg, fg, num, rot, ml]) => (
              <div key={l} className="cut stat" style={{ background: bg, color: fg, transform: `rotate(${rot}deg)`, marginLeft: ml }}>
                <span className="statn" style={{ color: num }}>{n}</span>
                <span className="statl">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline, behind the email form */}
      <section aria-labelledby="pl-time" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 id="pl-time" className="sectitle">Your milestones</h2>
          <div style={{ position: "relative", marginTop: 50 }}>
            <div aria-hidden={!unlocked} style={unlocked ? undefined : { filter: "blur(9px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}>{timeline}</div>
            {!unlocked && (
              <form onSubmit={unlock} className="cut plgate" style={{ ["--c" as string]: "28px" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 20, WebkitTextStroke: "1px currentColor" }}>See your timeline</div>
                <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>Your milestones from the first message to the goal, and the one change that helps most.</p>
                <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}><label>Leave this empty<input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 18 }}>
                  <input required maxLength={60} value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" autoComplete="given-name" style={gateInput} />
                  <input required maxLength={60} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" autoComplete="family-name" style={gateInput} />
                </div>
                <input type="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" autoComplete="email" style={{ ...gateInput, marginTop: 12 }} />
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 14, lineHeight: 1.45, cursor: "pointer" }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#0A0A0B", flex: "0 0 18px" }} />
                  <span>I agree to the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link> and to receive occasional partner marketing news</span>
                </label>
                {leadErr && <div role="alert" style={{ marginTop: 14, fontSize: 15 }}>{leadErr}</div>}
                <button type="submit" disabled={busy} style={{ ...btnStyle, marginTop: 18, opacity: busy ? 0.6 : 1 }}>{busy ? "One moment" : "Show the full results"}</button>
              </form>
            )}
          </div>
          {unlocked && lever && (
            <div style={{ marginTop: 70, display: "flex", alignItems: "flex-end", gap: 30, flexWrap: "wrap" }}>
              <div aria-hidden="true" className="cut" style={{ flex: "0 0 180px", height: 180, background: "#A8FF5C", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", ["--c" as string]: "24px" }}>
                <Toby height={180} rows={26} glasses animate={false} />
              </div>
              <p className="bubble" style={{ flex: "1 1 320px", margin: 0, fontSize: 20, maxWidth: 760 }}>
                <span style={{ background: "#A8FF5C", padding: "2px 12px", borderRadius: 999 }}>The change that helps most</span> {lever.text} would cut your list from {fmt(lever.from)} to {fmt(lever.to)}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Next step */}
      <section aria-labelledby="pl-next" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div className="cut plnext" style={{ ["--c" as string]: "44px" }}>
            <div style={{ flex: "1 1 460px" }}>
              <span className="kick" style={{ borderColor: "#0A0A0B", color: "#0A0A0B" }}>Your next step</span>
              <h2 id="pl-next" style={{ marginTop: 18, fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.15 }}>{next.t}</h2>
              <p style={{ margin: "16px 0 0", maxWidth: 620, fontSize: 19, lineHeight: 1.55 }}>{next.p}</p>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center", marginTop: 28 }}>
                <Link href="/program-builder" className="btn btn-s">Open the program builder</Link>
                <Link href="/contact" style={{ fontSize: 19, textDecoration: "underline" }}>Talk to us</Link>
              </div>
            </div>
            <div aria-hidden="true" className="plnexttoby"><Toby height={300} rows={32} glasses animate={false} /></div>
          </div>
          <p style={{ margin: "30px 0 0", maxWidth: 820, fontSize: 14, lineHeight: 1.55, color: "#85868B" }}>
            These figures are illustrative estimates based on published benchmarks and the values you enter. They are not a forecast or a promise of results.
          </p>
        </div>
      </section>
      {footer}
    </div>
  );
}
