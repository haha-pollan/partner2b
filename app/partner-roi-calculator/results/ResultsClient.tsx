"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toby } from "@/components/Toby";
import { biggestLever, bucket, compute, deals1, fmt, halfCase, pct, trim, usd, verdict } from "@/lib/roi/model";
import { fromQuery, toInputs } from "@/lib/roi/params";
import { track } from "@/lib/track";
import { RoiChart } from "./RoiChart";

const partnerWord = { referral: "referral partners", technology: "technology partners", agency: "agencies", reseller: "resellers" } as const;
const gateInput: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const btnStyle: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const short = (n: number) => `${n < 0 ? "-" : ""}${Math.abs(n) >= 1e6 ? `$${trim(Math.round(Math.abs(n) / 1e5) / 10)}M` : Math.abs(n) >= 1e4 ? `$${Math.round(Math.abs(n) / 1e3)}K` : usd(Math.abs(n))}`;

export function ResultsClient({ nav, footer }: { nav: React.ReactNode; footer: React.ReactNode }) {
  const sp = useSearchParams();
  const qs = sp.toString();
  const raw = useMemo(() => fromQuery(new URLSearchParams(qs)), [qs]);
  const inputs = useMemo(() => (raw ? toInputs(raw) : null), [raw]);
  const r = useMemo(() => (inputs ? compute(inputs) : null), [inputs]);
  const lever = inputs && r && r.ok ? biggestLever(inputs, r) : null;
  const half = inputs && r && r.ok ? halfCase(inputs) : null;

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [leadErr, setLeadErr] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfErr, setPdfErr] = useState("");
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !raw || !inputs || !r) return;
    done.current = true;
    if (r.ok) {
      track("partner_roi_calculator_completed", {
        partner_type: raw.partner, horizon_months: inputs.horizon, verdict: verdict(r, inputs.horizon),
        deal_band: bucket(inputs.dealSize, [1000, 10000, 50000, 150000]),
        cost_band: bucket(inputs.monthlyCost, [2000, 10000, 30000, 100000]),
        roi_band: bucket(r.roi, [0, 100, 300, 1000]),
      });
    } else {
      track("partner_roi_calculator_completed", { partner_type: raw.partner, outcome: r.reason });
    }
  }, [raw, inputs, r]);

  const back = "/partner-roi-calculator" + (qs ? `?${qs}` : "");

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!raw || !inputs || !r || !r.ok) return;
    if (!first.trim() || !last.trim()) { setLeadErr("Please enter your first and last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setLeadErr("Please enter a valid email address."); return; }
    if (!consent) { setLeadErr("Please tick the box so we can show you the full results."); return; }
    setLeadErr(""); setBusy(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const { rows, ...results } = r; void rows;
      const res = await fetch("/api/roi-calculator", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first.trim(), last_name: last.trim(), email: email.trim(), consent, website_confirm: trap,
          partner_type: raw.partner, inputs, results,
          utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "",
          referrer: document.referrer,
        }),
      });
      const j = await res.json().catch(() => null);
      if (!j || !j.ok) setLeadErr(j?.error ?? "Something went wrong. Please try again.");
      else { setUnlocked(true); track("partner_roi_calculator_lead_submitted", { partner_type: raw.partner, verdict: verdict(r, inputs.horizon) }); }
    } catch { setLeadErr("We could not reach the server. Please try again."); }
    setBusy(false);
  }

  if (!raw || !inputs || !r || !r.ok) {
    const msg = !raw || !inputs || !r ? "We could not read your numbers from this link. Enter them again and we will rebuild your result." : r.ok ? "" : r.message;
    return (
      <div style={{ overflow: "hidden" }}>
        <div className="hero">
          {nav}
          <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
            <div className="tapewrap">
              <h1 className="ptapes"><span className="pt pt1">Your partner ROI</span></h1>
              <p className="bubble herosub" style={{ marginTop: 44 }}>{msg}</p>
              <div className="herobtns"><Link href={back} className="btn btn-p">Change your inputs</Link></div>
            </div>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  const v = verdict(r, inputs.horizon);
  const H = trim(inputs.horizon);
  const perDeal = (inputs.dealSize * inputs.commission) / 100;
  const dpp = deals1(r.dealsPerPartnerInWindow);

  async function downloadPdf() {
    if (pdfBusy) return;
    setPdfBusy(true); setPdfErr("");
    try {
      const res = await fetch("/api/roi-calculator/pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: qs }) });
      if (!res.ok) { setPdfErr("We could not create the PDF. Please try again."); return; }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url; a.download = "Partner2B_Partner_ROI_One-pager.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      track("partner_roi_calculator_pdf_downloaded");
    } catch { setPdfErr("We could not create the PDF. Please try again."); }
    finally { setPdfBusy(false); }
  }

  // background, text, rotation, left margin
  const stats: [string, string, string, string, number, number][] = [
    [pct(r.roi), `return on ${short(r.totalCost)} invested`, "#FFFFFF", "#0A0A0B", 1.5, 40],
    [r.payback === null ? "None" : `Month ${r.payback}`, r.payback === null ? "break-even at these numbers" : "your program pays back", "#A8FF5C", "#0A0A0B", -2, 0],
    [short(r.revenue), "closed through partners", "#7C5CFF", "#FFFFFF", 1.5, 40],
  ];
  const notes: string[] = [];
  if (v === "negative") notes.push("At these numbers the program does not pay back. Partner revenue each month stays below what the program costs each month.");
  if (v === "slow") notes.push(`The program pays back in month ${r.payback}, after your ${H} month window.`);
  if (v !== "negative" && r.firstDeal * 2 > inputs.horizon) notes.push(`The first deal closes in month ${r.firstDeal}, so half of your window passes before the return starts.`);

  const cmp = inputs.compareCac
    ? (r.costPerCustomer < inputs.compareCac
      ? `That is ${Math.round((1 - r.costPerCustomer / inputs.compareCac) * 100)}% less than the ${usd(inputs.compareCac)} a customer costs you through other channels.`
      : `That is ${Math.round((r.costPerCustomer / inputs.compareCac - 1) * 100)}% more than the ${usd(inputs.compareCac)} a customer costs you through other channels.`)
    : null;

  const next = v === "strong"
    ? { t: "Size the pipeline behind these numbers", p: "Your program pays back inside the window. The next question is how many partner companies you need to list and contact to reach a revenue goal.", cta: "Open the pipeline calculator", href: "/partner-pipeline-calculator" }
    : { t: "Find what holds the program back", p: "At these numbers the program pays back slowly or not at all. Targeting the wrong partners, a weak value proposition and too little partner marketing are the most common reasons. The assessment shows which two apply to you.", cta: "Take the assessment", href: "/partner-program-assessment" };

  const table = (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 520px", minWidth: 0 }}>
        <div role="table" aria-label="Cost and return by month" style={{ fontSize: 17 }}>
          <div role="row" style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 1fr 1fr", gap: 12, padding: "0 0 12px", borderBottom: "2px solid #FFFFFF", color: "#B9BABD" }}>
            <span role="columnheader">Month</span><span role="columnheader">Cost</span><span role="columnheader">Return</span><span role="columnheader">Net</span>
          </div>
          {r.rows.map((x) => (
            <div role="row" key={x.month} style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 1fr 1fr", gap: 12, padding: "11px 0", borderBottom: "1px solid #3A3B40" }}>
              <span role="cell">{x.month}</span><span role="cell">{usd(x.cost)}</span><span role="cell">{usd(x.revenue)}</span>
              <span role="cell" style={{ color: x.net >= 0 ? "#A8FF5C" : "#FFFFFF" }}>{usd(x.net)}</span>
            </div>
          ))}
        </div>
      </div>
      {half && (
        <div className="cut" style={{ flex: "0 1 340px", background: "#FFFFFF", color: "#0A0A0B", padding: "28px 28px 34px" }}>
          <span className="statn" style={{ color: "#0A0A0B" }}>{pct(half.roi)}</span>
          <span className="statl" style={{ display: "block", marginTop: 12 }}>return if partners bring half as many deals</span>
          <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>{half.payback === null ? "The program would not pay back at that pace." : `The program would pay back in month ${half.payback}.`}</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ overflow: "hidden" }}>
      <div className="hero">
        {nav}
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Your partner ROI</span>
              <span className="pt pt2">{usd(r.revenue)} back in {H} months</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>If you invest {usd(r.totalCost)} in your partner program over {H} months, this is what comes back. It takes {deals1(r.deals)} {deals1(r.deals) === "1" ? "deal" : "deals"} to get there.</p>
            <div className="herobtns"><Link href={back} className="btn btn-s">Change your inputs</Link></div>
          </div>
        </div>
      </div>

      <section aria-labelledby="roi-nums" style={{ padding: "40px 0 170px" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 56, flexWrap: "wrap" }}>
          <div className="dirtext" style={{ flex: "1 1 460px" }}>
            <span className="kick">The numbers</span>
            <h2 id="roi-nums">What your program returns</h2>
            <p>Each active partner closes about {dpp} {dpp === "1" ? "deal" : "deals"} in your window. At a commission of {trim(inputs.commission)}%, {partnerWord[inputs.partner]} earn about {usd(perDeal)} per deal and {usd(r.commissionTotal)} in total.</p>
            <p>Each customer through partners costs about {usd(r.costPerCustomer)}, counting program cost and commission. {cmp}</p>
            {notes.map((n) => <p key={n} style={{ color: "#A8FF5C" }}>{n}</p>)}
          </div>
          <div className="dirstack plstats" style={{ flex: "0 1 480px", display: "flex", flexDirection: "column", gap: 18 }}>
            {stats.map(([n, l, bg, fg, rot, ml]) => (
              <div key={l} className="cut stat" style={{ background: bg, color: fg, transform: `rotate(${rot}deg)`, marginLeft: ml, flexDirection: "column", alignItems: "flex-start", gap: 12, whiteSpace: "normal", padding: "26px 32px 30px" }}>
                <span className="statn" style={{ color: fg }}>{n}</span>
                <span className="statl">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="roi-chart" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 id="roi-chart" className="sectitle">Cost versus return</h2>
          <p style={{ margin: "14px 0 0", maxWidth: 760, fontSize: 19, lineHeight: 1.55, color: "rgba(255,255,255,.88)" }}>
            {r.payback === null ? "The return does not catch up with the cost at these numbers." : `Where the two tapes cross, the program has paid for itself. That happens in month ${r.payback}.`}
          </p>
          <div style={{ marginTop: 36, maxWidth: 1040, overflowX: "auto" }}><div style={{ minWidth: 640 }}><RoiChart r={r} horizon={inputs.horizon} /></div></div>
        </div>
      </section>

      <section aria-labelledby="roi-month" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 id="roi-month" className="sectitle">Your month by month</h2>
          <div style={{ position: "relative", marginTop: 50 }}>
            <div aria-hidden={!unlocked} style={unlocked ? undefined : { filter: "blur(9px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}>{table}</div>
            {!unlocked && (
              <form onSubmit={unlock} className="cut plgate" style={{ ["--c" as string]: "28px" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 20, WebkitTextStroke: "1px currentColor" }}>See your month by month</div>
                <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>Cost, return and net for every month, the result if partners bring half as many deals, and the one change that helps most.</p>
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
                <span style={{ background: "#A8FF5C", padding: "2px 12px", borderRadius: 999 }}>The change that helps most</span> {lever.text} would lift your return from {pct(lever.from)} to {pct(lever.to)}.
              </p>
            </div>
          )}
          {unlocked && (
            <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              <button type="button" onClick={downloadPdf} disabled={pdfBusy} style={{ ...btnStyle, opacity: pdfBusy ? 0.6 : 1 }}>{pdfBusy ? "Creating your PDF" : "Download your one-pager (PDF)"}</button>
              <span style={{ fontSize: 17, lineHeight: 1.5, color: "#ECECEE" }}>Your return on one page, ready to share with your team.</span>
              {pdfErr && <span role="alert" style={{ fontSize: 17, color: "#B3261E" }}>{pdfErr}</span>}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="roi-next" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div className="cut plnext" style={{ ["--c" as string]: "44px" }}>
            <div style={{ flex: "1 1 460px" }}>
              <span className="kick" style={{ borderColor: "#0A0A0B", color: "#0A0A0B" }}>Your next step</span>
              <h2 id="roi-next" style={{ marginTop: 18, fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.15 }}>{next.t}</h2>
              <p style={{ margin: "16px 0 0", maxWidth: 620, fontSize: 19, lineHeight: 1.55 }}>{next.p}</p>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center", marginTop: 28 }}>
                <Link href={next.href} className="btn btn-s">{next.cta}</Link>
                <Link href="/contact" style={{ fontSize: 19, textDecoration: "underline" }}>Talk to us</Link>
              </div>
            </div>
            <div aria-hidden="true" className="plnexttoby"><Toby height={300} rows={32} glasses animate={false} /></div>
          </div>
          <p style={{ margin: "30px 0 0", maxWidth: 820, fontSize: 14, lineHeight: 1.55, color: "#85868B" }}>
            These figures are illustrative estimates based on the values you enter. Return counts the first-year contract value of deals closed through partners. They are not a forecast or a promise of results.
          </p>
        </div>
      </section>
      {footer}
    </div>
  );
}
