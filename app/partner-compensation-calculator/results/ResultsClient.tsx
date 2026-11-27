"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toby } from "@/components/Toby";
import { compute, fmt, pct, short, trim, usd, type PartnerType } from "@/lib/comp/model";
import { fromQuery, toInputs } from "@/lib/comp/params";
import { track } from "@/lib/track";

const partnerWord: Record<PartnerType, string> = { referral: "referral partners", technology: "technology partners", agency: "agencies", reseller: "resellers" };
const gateInput: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const btnStyle: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const STATUS = { solid: { label: "Solid", bg: "#A8FF5C", fg: "#0A0A0B" }, tight: { label: "Tight", bg: "#FFD84D", fg: "#0A0A0B" }, over: { label: "Over the ceiling", bg: "#FF6B6B", fg: "#0A0A0B" } } as const;

export function ResultsClient({ nav, footer }: { nav: React.ReactNode; footer: React.ReactNode }) {
  const sp = useSearchParams();
  const qs = sp.toString();
  const raw = useMemo(() => fromQuery(new URLSearchParams(qs)), [qs]);
  const inputs = useMemo(() => (raw ? toInputs(raw) : null), [raw]);
  const r = useMemo(() => (inputs ? compute(inputs) : null), [inputs]);
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
  const band = (n: number, edges: number[]) => { for (const e of edges) if (n < e) return `lt_${e}`; return `gte_${edges[edges.length - 1]}`; };
  useEffect(() => {
    if (done.current || !raw || !inputs || !r) return;
    done.current = true;
    if (r.ok) track("partner_compensation_calculator_completed", { company_type: raw.type, partner_type: raw.partner, status: r.status, goal_band: band(inputs.goal, [50000, 250000, 1000000, 5000000]), share_band: band(r.pctRevenue, [10, 15, 20, 25]) });
    else track("partner_compensation_calculator_completed", { company_type: raw.type, partner_type: raw.partner, outcome: "input" });
  }, [raw, inputs, r]);
  const back = "/partner-compensation-calculator" + (qs ? `?${qs}` : "");

  if (!raw || !inputs || !r || !r.ok) {
    return (
      <div style={{ overflow: "hidden" }}>
        <div className="hero">{nav}
          <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}><div className="tapewrap">
            <h1 className="ptapes"><span className="pt pt1">Your compensation budget</span></h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>{!raw || !r ? "We could not read your numbers from this link. Enter them again and we will rebuild your budget." : r.ok ? "" : r.message}</p>
            <div className="herobtns"><Link href={back} className="btn btn-p">Change your inputs</Link></div>
          </div></div>
        </div>{footer}
      </div>
    );
  }
  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!raw || !inputs || !r || !r.ok) return;
    if (!first.trim() || !last.trim()) { setLeadErr("Please enter your first and last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setLeadErr("Please enter a valid email address."); return; }
    if (!consent) { setLeadErr("Please tick the box so we can show you the full results."); return; }
    setLeadErr(""); setBusy(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const res = await fetch("/api/compensation-calculator", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first.trim(), last_name: last.trim(), email: email.trim(), consent, website_confirm: trap,
          company_type: raw.type, inputs, results: r,
          utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "",
          referrer: document.referrer,
        }),
      });
      const j = await res.json().catch(() => null);
      if (!j || !j.ok) setLeadErr(j?.error ?? "Something went wrong. Please try again.");
      else { setUnlocked(true); track("partner_compensation_calculator_lead_submitted", { company_type: raw.type, partner_type: raw.partner, status: r.status }); }
    } catch { setLeadErr("We could not reach the server. Please try again."); }
    setBusy(false);
  }
  async function downloadPdf() {
    if (pdfBusy) return;
    setPdfBusy(true); setPdfErr("");
    try {
      const res = await fetch("/api/compensation-calculator/pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: qs }) });
      if (!res.ok) { setPdfErr("We could not create the PDF. Please try again."); return; }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url; a.download = "Partner2B_Partner_Compensation_Budget_One-pager.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      track("partner_compensation_calculator_pdf_downloaded");
    } catch { setPdfErr("We could not create the PDF. Please try again."); }
    finally { setPdfBusy(false); }
  }
  const S = STATUS[r.status];
  const parts: [string, number, string, string][] = [
    ["Commissions", r.commission, "#A8FF5C", "#0A0A0B"], ["Renewals", r.renewals, "#FFFFFF", "#0A0A0B"],
    ["Partner marketing funds", r.marketing, "#7C5CFF", "#FFFFFF"], ["Performance bonuses", r.bonus, "#FFFFFF", "#0A0A0B"],
  ];
  const shown = parts.filter((p) => p[1] > 0);
  const scale = Math.max(r.total, r.ceilingAmount) * 1.12;
  const fitText = r.status === "solid"
    ? `At ${pct(r.pctRevenue)} of partner revenue you stay well inside the ${r.ceilingPct}% ceiling, with ${usd(r.headroom)} of room for upside.`
    : r.status === "tight"
      ? `At ${pct(r.pctRevenue)} of partner revenue you are close to the ${r.ceilingPct}% ceiling and have ${usd(r.headroom)} of room left.`
      : `At ${pct(r.pctRevenue)} of partner revenue you are ${usd(-r.headroom)} over the ${r.ceilingPct}% ceiling. Lower a tier rate, shift deals to lower tiers or cut the marketing funds.`;
  const next = r.status === "solid"
    ? { t: "See what the program returns", p: "Your compensation fits the margin. The next question is when the whole program pays back.", cta: "Open the ROI calculator", href: "/partner-roi-calculator" }
    : { t: "Rebuild the commercial model", p: "The program builder sets partner types, tiers and rates that stay inside a sustainable ceiling for your company type.", cta: "Open the program builder", href: "/program-builder" };
  const levels: [string, number][] = [["50% of the goal", 0.5], ["100% of the goal", 1], ["150% of the goal", 1.5]];
  const gated = (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 420px", minWidth: 0 }}>
        <h3 style={{ fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>By tier</h3>
        {[["Tier", "Rate", "Deals", "Cost"], ...r.tiers.map((t) => [String(t.tier), `${trim(t.rate)}%`, trim(Math.round(t.deals * 10) / 10), usd(t.cost)])].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "0.6fr 1fr 1fr 1.4fr", gap: 12, padding: "11px 0", borderBottom: i === 0 ? "2px solid #fff" : "1px solid #3A3B40", color: i === 0 ? "#B9BABD" : "#fff", fontSize: 17 }}>{row.map((c, j) => <span key={j}>{c}</span>)}</div>
        ))}
      </div>
      <div style={{ flex: "1 1 420px", minWidth: 0 }}>
        <h3 style={{ fontWeight: 400, fontSize: 20, margin: "0 0 14px" }}>If you reach more or less than the goal</h3>
        {[["Goal reached", "Revenue", "Budget"], ...levels.map(([l, f]) => [l, short(inputs.goal * f), usd(r.commission * f + r.marketing * f + r.bonus * f + r.renewals)])].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 12, padding: "11px 0", borderBottom: i === 0 ? "2px solid #fff" : "1px solid #3A3B40", color: i === 0 ? "#B9BABD" : "#fff", fontSize: 17 }}>{row.map((c, j) => <span key={j}>{c}</span>)}</div>
        ))}
      </div>
    </div>
  );
  const stats: [string, string, string, string, number, number][] = [
    [usd(r.total), "a year for partner compensation", "#FFFFFF", "#0A0A0B", 1.5, 40],
    [pct(r.pctRevenue), "of partner-sourced revenue", "#A8FF5C", "#0A0A0B", -2, 0],
    [usd(r.perDeal), "per closed deal", "#7C5CFF", "#FFFFFF", 1.5, 40],
  ];
  return (
    <div style={{ overflow: "hidden" }}>
      <div className="hero">{nav}
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}><div className="tapewrap">
          <h1 className="ptapes"><span className="pt pt1">Your compensation budget</span><span className="pt pt2">{usd(r.total)} a year</span></h1>
          <p className="bubble herosub" style={{ marginTop: 44 }}>If you plan to bring in {usd(inputs.goal)} through partners with a deal size of {usd(inputs.dealSize)}, this is what to budget for partner compensation. It takes {fmt(r.deals)} {r.deals === 1 ? "deal" : "deals"}.</p>
          <div className="herobtns"><Link href={back} className="btn btn-s">Change your inputs</Link></div>
        </div></div>
      </div>

      <section aria-labelledby="cb-nums" style={{ padding: "40px 0 170px" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 56, flexWrap: "wrap" }}>
          <div className="dirtext" style={{ flex: "1 1 460px" }}>
            <span className="kick">The numbers</span>
            <h2 id="cb-nums">What partners will cost you</h2>
            <p>With your tier mix, {partnerWord[inputs.partner]} earn a blended commission of {pct(r.blendedRate)}, which is {usd(r.commission)} on {usd(inputs.goal)} of closed revenue.</p>
            <p>Compensation takes {pct(r.marginShare)} of the gross margin on that revenue.</p>
          </div>
          <div className="dirstack plstats" style={{ flex: "0 1 480px", display: "flex", flexDirection: "column", gap: 18 }}>
            {stats.map(([n, l, bg, fg, rot, ml]) => (
              <div key={l} className="cut stat" style={{ background: bg, color: fg, transform: `rotate(${rot}deg)`, marginLeft: ml, flexDirection: "column", alignItems: "flex-start", gap: 12, whiteSpace: "normal", padding: "26px 32px 30px" }}>
                <span className="statn" style={{ color: fg }}>{n}</span><span className="statl">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cb-split" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 id="cb-split" className="sectitle">Where the budget goes</h2>
          <div style={{ display: "flex", marginTop: 44, gap: 6, height: 96 }} role="img" aria-label="Budget split">
            {shown.map(([name, v, bg, fg], k) => (
              <div key={name} className="cut" style={{ flex: `${Math.max(v, r.total * 0.06)} 1 0`, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", ["--c" as string]: "16px", fontFamily: "'Michroma',sans-serif", fontSize: 17, minWidth: 0, transform: `rotate(${k % 2 ? 0.8 : -0.8}deg)` }}>{pct((v / r.total) * 100)}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22, marginTop: 40 }}>
            {shown.map(([name, v, bg]) => (
              <div key={name} style={{ borderTop: `6px solid ${bg}`, paddingTop: 18 }}>
                <span className="statn" style={{ display: "block", fontSize: 30 }}>{short(v)}</span>
                <span style={{ display: "block", marginTop: 12, fontSize: 18 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cb-fit" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 id="cb-fit" className="sectitle">Does it fit your margin</h2>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <span style={{ background: S.bg, color: S.fg, padding: "8px 20px", fontSize: 18, whiteSpace: "nowrap" }}>{S.label}</span>
            <p style={{ margin: 0, flex: "1 1 420px", fontSize: 20, lineHeight: 1.55 }}>{fitText}</p>
          </div>
          <div style={{ position: "relative", marginTop: 58, height: 34, background: "#1C1D20" }}>
            <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${(r.total / scale) * 100}%`, background: "#A8FF5C" }} />
            <div style={{ position: "absolute", top: -14, bottom: -14, left: `${(r.ceilingAmount / scale) * 100}%`, borderLeft: "3px dashed #FFFFFF" }} />
            <span style={{ position: "absolute", top: -50, left: `${(r.ceilingAmount / scale) * 100}%`, transform: "translateX(-50%)", background: "#7C5CFF", color: "#fff", padding: "4px 12px", fontSize: 15, whiteSpace: "nowrap" }}>Ceiling {r.ceilingPct}%, {short(r.ceilingAmount)}</span>
            <span style={{ position: "absolute", top: 46, left: 0, fontSize: 15, color: "#B9BABD" }}>Your budget {short(r.total)}</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="cb-more" style={{ padding: "0 0 170px" }}>
        <div className="wrap">
          <h2 id="cb-more" className="sectitle">Your budget in detail</h2>
          <div style={{ position: "relative", marginTop: 50 }}>
            <div aria-hidden={!unlocked} style={unlocked ? undefined : { minHeight: 470, filter: "blur(9px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}>{gated}</div>
            {!unlocked && (
              <form onSubmit={unlock} className="cut plgate" style={{ ["--c" as string]: "28px" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 20, WebkitTextStroke: "1px currentColor" }}>See your budget in detail</div>
                <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>Your budget by tier, what to reserve if you beat the goal, and a one-page PDF to share with finance.</p>
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
          {unlocked && (
            <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              <button type="button" onClick={downloadPdf} disabled={pdfBusy} style={{ ...btnStyle, opacity: pdfBusy ? 0.6 : 1 }}>{pdfBusy ? "Creating your PDF" : "Download your one-pager (PDF)"}</button>
              <span style={{ fontSize: 17, lineHeight: 1.5, color: "#ECECEE" }}>Your budget on one page, ready to share with finance.</span>
              {pdfErr && <span role="alert" style={{ fontSize: 17, color: "#B3261E" }}>{pdfErr}</span>}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="cb-next" style={{ padding: "0 0 150px" }}>
        <div className="wrap">
          <div className="cut plnext" style={{ ["--c" as string]: "44px" }}>
            <div style={{ flex: "1 1 460px" }}>
              <span className="kick" style={{ borderColor: "#0A0A0B", color: "#0A0A0B" }}>Your next step</span>
              <h2 id="cb-next" style={{ marginTop: 18, fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.15 }}>{next.t}</h2>
              <p style={{ margin: "16px 0 0", maxWidth: 620, fontSize: 19, lineHeight: 1.55 }}>{next.p}</p>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center", marginTop: 28 }}><Link href={next.href} className="btn btn-s">{next.cta}</Link><Link href="/contact" style={{ fontSize: 19, textDecoration: "underline" }}>Talk to us</Link></div>
            </div>
            <div aria-hidden="true" className="plnexttoby"><Toby height={300} rows={32} glasses animate={false} /></div>
          </div>
          <p style={{ margin: "30px 0 0", maxWidth: 820, fontSize: 14, lineHeight: 1.55, color: "#85868B" }}>These figures are illustrative estimates based on the values you enter and the Partner2B planning model. They are not a forecast or a promise of results.</p>
        </div>
      </section>
      {footer}
    </div>
  );
}
