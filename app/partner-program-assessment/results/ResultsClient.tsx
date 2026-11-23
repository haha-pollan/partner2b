"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Toby } from "@/components/Toby";
import { AREAS, BAND_LABEL, areaOf, bandOf, compute, fromQuery, headline, summaryLine, type AreaKey, type Band } from "@/lib/assessment/model";
import { track } from "@/lib/track";

const RED = "#D64545", YELLOW = "#F5C542", LIME = "#A8FF5C";
const michroma: React.CSSProperties = { fontFamily: "'Michroma',sans-serif", fontWeight: 400, WebkitTextStroke: "1px currentColor" };
const gateInput: React.CSSProperties = { width: "100%", background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const btnStyle: React.CSSProperties = { background: LIME, color: "#0A0A0B", fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 400, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const bandColor: Record<Band, string> = { critical: RED, work: YELLOW, solid: LIME };
const BandTag = ({ band, size = 14 }: { band: Band; size?: number }) => (
  <span style={{ background: bandColor[band], color: band === "critical" ? "#fff" : "#0A0A0B", fontSize: size, borderRadius: 999, padding: "4px 14px", whiteSpace: "nowrap" }}>{BAND_LABEL[band]}</span>
);

function ToolBlock({ k }: { k: AreaKey }) {
  const t = areaOf(k).tool;
  if (!t.live) {
    return (
      <div className="cut" style={{ background: "#ECECEE", padding: "26px 28px 34px", ["--c" as string]: "22px" }}>
        <div style={{ ...michroma, fontSize: 19, lineHeight: 1.35 }}>{t.name}, coming soon</div>
        <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>{t.line}</p>
      </div>
    );
  }
  const calc = k === "D";
  return (
    <div className="cut" style={{ background: "#ECE8FF", padding: "26px 28px 34px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18, ["--c" as string]: "22px" }}>
      <div>
        <div style={{ ...michroma, fontSize: 19, lineHeight: 1.35 }}>{calc ? "Free partner pipeline calculator" : t.name}</div>
        <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5 }}>{t.line}</p>
      </div>
      <Link href={t.href ?? "/contact"} className="btn btn-s" style={{ background: "#0A0A0B", color: "#fff" }}>{calc ? "Open the free calculator" : "Talk to us"}</Link>
    </div>
  );
}

function Bottleneck({ k, n, score, label }: { k: AreaKey; n: number; score: number; label?: string }) {
  const a = areaOf(k);
  return (
    <div className="cut" style={{ background: "#fff", color: "#0A0A0B", padding: "38px 44px 46px", display: "flex", flexDirection: "column", gap: 24, ["--c" as string]: "28px" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        {label ? null : <span style={{ ...michroma, fontSize: 34, color: "#7C5CFF" }}>{n}</span>}
        <h3 style={{ ...michroma, fontSize: 24 }}>{label ? `${label}: ${a.name}` : a.name}</h3>
        <BandTag band={bandOf(score)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "26px 44px" }}>
        <div><div style={{ fontSize: 20 }}>Why it holds you back</div><p style={{ margin: "10px 0 0", fontSize: 18, lineHeight: 1.55 }}>{a.why}</p></div>
        <div><div style={{ fontSize: 20 }}>First fix</div><p style={{ margin: "10px 0 0", fontSize: 18, lineHeight: 1.55 }}>{a.fix}</p></div>
      </div>
      <ToolBlock k={k} />
    </div>
  );
}

export function ResultsClient({ nav, footer }: { nav: React.ReactNode; footer: React.ReactNode }) {
  const sp = useSearchParams();
  const qs = sp.toString();
  const raw = useMemo(() => fromQuery(new URLSearchParams(qs)), [qs]);
  const r = useMemo(() => (raw ? compute(raw) : null), [raw]);

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
    if (done.current || !raw || !r) return;
    done.current = true;
    track("partner_program_assessment_completed", { percent: r.percent, first_gap: r.bottlenecks[0] ?? r.weakest, second_gap: r.bottlenecks[1] ?? "none", age: raw.age, active: raw.active });
  }, [raw, r]);

  const back = "/partner-program-assessment";

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!raw || !r) return;
    if (!first.trim() || !last.trim()) { setLeadErr("Please enter your first and last name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setLeadErr("Please enter a valid email address."); return; }
    if (!consent) { setLeadErr("Please tick the box so we can show you the full results."); return; }
    setLeadErr(""); setBusy(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const res = await fetch("/api/program-assessment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first.trim(), last_name: last.trim(), email: email.trim(), consent, website_confirm: trap,
          inputs: raw, results: r,
          utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "",
          referrer: document.referrer,
        }),
      });
      const j = await res.json().catch(() => null);
      if (!j || !j.ok) setLeadErr(j?.error ?? "Something went wrong. Please try again.");
      else { setUnlocked(true); track("partner_program_assessment_lead_submitted", { percent: r.percent, first_gap: r.bottlenecks[0] ?? r.weakest }); }
    } catch { setLeadErr("We could not reach the server. Please try again."); }
    setBusy(false);
  }

  async function downloadPdf() {
    if (pdfBusy) return;
    setPdfBusy(true); setPdfErr("");
    try {
      const res = await fetch("/api/program-assessment/pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: qs }) });
      if (!res.ok) { setPdfErr("We could not create the PDF. Please try again."); return; }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url; a.download = "Partner2B_Partner_Program_Assessment.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      track("partner_program_assessment_pdf_downloaded");
    } catch { setPdfErr("We could not create the PDF. Please try again."); }
    finally { setPdfBusy(false); }
  }

  if (!raw || !r) {
    return (
      <div style={{ overflow: "hidden" }}>
        <div className="hero">
          {nav}
          <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 110 }}>
            <div className="tapewrap">
              <h1 className="ptapes"><span className="pt pt1">Your assessment result</span></h1>
              <p className="bubble herosub" style={{ marginTop: 44 }}>We could not read your answers from this link. Take the assessment again and we will rebuild your result.</p>
              <div className="herobtns"><Link href={back} className="btn btn-p">Start the assessment</Link></div>
            </div>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  const firstKey = r.bottlenecks[0] ?? r.weakest;
  const secondKey = r.bottlenecks[1];
  const noGap = r.bottlenecks.length === 0;
  const eightAreas = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))", gap: 24 }}>
      {AREAS.map((a) => {
        const s = r.scores[a.key]; const b = bandOf(s);
        return (
          <div key={a.key} className="cut" style={{ background: "#fff", color: "#0A0A0B", padding: "26px 28px 34px", display: "flex", flexDirection: "column", gap: 14, ["--c" as string]: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <span style={{ ...michroma, fontSize: 19, whiteSpace: "nowrap" }}>{a.name}</span>
              <BandTag band={b} size={13} />
            </div>
            <div style={{ height: 16, background: "#ECECEE" }} aria-hidden="true"><div style={{ width: `${s * 25}%`, height: "100%", background: bandColor[b] }} /></div>
            <div style={{ fontSize: 17 }}>First fix</div>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>{a.fix}</p>
          </div>
        );
      })}
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
              <span className="pt pt1">Your assessment result</span>
              <span className="pt pt2">{r.percent}% in place</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>{headline(r.percent)}. {summaryLine(r)}</p>
            <div className="herobtns"><Link href={back} className="btn btn-s">Take it again</Link></div>
          </div>
        </div>
      </div>

      {/* Score and first bottleneck */}
      <section aria-labelledby="pa-first" style={{ padding: "40px 0 90px" }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div className="cut" style={{ background: LIME, color: "#0A0A0B", display: "flex", alignItems: "center", gap: 28, padding: "34px 44px 42px", maxWidth: 560, ["--c" as string]: "28px" }}>
            <span style={{ ...michroma, fontSize: 68, flex: "none", WebkitTextStroke: "1.5px currentColor" }}>{r.percent}%</span>
            <b style={{ fontWeight: 400, fontSize: 19, lineHeight: 1.4 }}>of the partner program basics in place</b>
          </div>
          <h2 id="pa-first" className="sectitle">{noGap ? "Your weakest area" : "Bottleneck 1"}</h2>
          <div style={{ marginTop: -14 }}><Bottleneck k={firstKey} n={1} score={r.scores[firstKey]} /></div>
        </div>
      </section>

      {/* Second bottleneck and all areas, behind the email form */}
      <section aria-labelledby="pa-rest" style={{ padding: "0 0 110px" }}>
        <div className="wrap">
          <div style={{ position: "relative" }}>
            <div aria-hidden={!unlocked} style={unlocked ? undefined : { filter: "blur(9px)", opacity: 0.55, pointerEvents: "none", userSelect: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
                {secondKey && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                    <h2 id="pa-rest" className="sectitle">Bottleneck 2</h2>
                    <Bottleneck k={secondKey} n={2} score={r.scores[secondKey]} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                  <h2 className="sectitle">All eight areas</h2>
                  {eightAreas}
                </div>
              </div>
            </div>
            {!unlocked && (
              <form onSubmit={unlock} className="cut plgate" style={{ ["--c" as string]: "28px", top: 260, transform: "translateX(-50%)" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 20, WebkitTextStroke: "1px currentColor", lineHeight: 1.35 }}>See your second bottleneck and all eight areas</div>
                <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, color: "#3A3B40" }}>Plus a first fix for each area and a one page PDF for your team.</p>
                <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}><label>Leave this empty<input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 18 }}>
                  <input required maxLength={60} value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" autoComplete="given-name" aria-label="First name" style={gateInput} />
                  <input required maxLength={60} value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" autoComplete="family-name" aria-label="Last name" style={gateInput} />
                </div>
                <input type="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" autoComplete="email" aria-label="Work email" style={{ ...gateInput, marginTop: 12 }} />
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, fontSize: 14, lineHeight: 1.45, cursor: "pointer" }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: "#0A0A0B", flex: "0 0 18px" }} />
                  <span>I agree to the <Link href="/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link> and to receive my result and occasional partner marketing news</span>
                </label>
                {leadErr && <div role="alert" style={{ marginTop: 14, fontSize: 15 }}>{leadErr}</div>}
                <button type="submit" disabled={busy} style={{ ...btnStyle, marginTop: 18, opacity: busy ? 0.6 : 1 }}>{busy ? "One moment" : "Show the full results"}</button>
                <p style={{ margin: "14px 0 0", fontSize: 14, color: "#6A6B71" }}>No company name needed. Your answers are never published</p>
              </form>
            )}
          </div>

          {unlocked && r.notes.length > 0 && (
            <div style={{ marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              {r.notes.map((n) => (
                <div key={n} style={{ background: "#fff", color: "#0A0A0B", padding: "28px 36px 30px", display: "flex", alignItems: "center", gap: 18, maxWidth: 980, transform: "rotate(-1.5deg)", boxShadow: "0 18px 40px rgba(58,59,64,.4)" }}>
                  <span style={{ background: "#7C5CFF", color: "#fff", fontSize: 18, borderRadius: 999, padding: "7px 18px", flex: "none" }}>Note</span>
                  <span style={{ fontSize: 21, lineHeight: 1.5 }}>{n}</span>
                </div>
              ))}
            </div>
          )}

          {unlocked && (
            <div style={{ marginTop: 90, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 36, alignItems: "stretch" }}>
              <div className="cut plnext" style={{ ["--c" as string]: "44px", padding: "48px 52px 54px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22, overflow: "visible" }}>
                <h2 style={{ fontSize: "clamp(24px,2.6vw,32px)", lineHeight: 1.3 }}>Want help fixing {secondKey ? "these two" : "this"}?</h2>
                <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55 }}>A partnership strategy session turns this result into a plan: which partners to go after, what to offer them and what to do in the first 90 days</p>
                <Link href="/contact" className="btn btn-s" style={{ background: "#0A0A0B", color: "#fff" }}>Book a strategy call</Link>
              </div>
              {firstKey !== "D" && secondKey !== "D" && (
                <div className="cut" style={{ background: "#ECE8FF", color: "#0A0A0B", padding: "40px 40px 48px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, ["--c" as string]: "28px" }}>
                  <div style={{ ...michroma, fontSize: 22 }}>Free partner pipeline calculator</div>
                  <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5 }}>Whatever you fix first, see how many partner conversations you need each month to reach your revenue goal</p>
                  <Link href="/partner-pipeline-calculator" className="btn btn-s" style={{ background: "#0A0A0B", color: "#fff" }}>Open the free calculator</Link>
                </div>
              )}
              <div className="cut" style={{ background: "#fff", color: "#0A0A0B", padding: "40px 40px 48px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, ["--c" as string]: "28px" }}>
                <div style={{ ...michroma, fontSize: 22 }}>Keep this result</div>
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5 }}>One page with your score, both bottlenecks and the first fixes, ready to share with your team</p>
                <button type="button" onClick={downloadPdf} disabled={pdfBusy} className="btn btn-s" style={{ opacity: pdfBusy ? 0.6 : 1 }}>{pdfBusy ? "Creating your PDF" : "Download the one page PDF"}</button>
                {pdfErr && <span role="alert" style={{ fontSize: 16, color: "#B3261E" }}>{pdfErr}</span>}
                <span style={{ fontSize: 14, color: "#6A6B71" }}>The link to this page keeps your answers, never your name or email</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: 70, display: "flex", alignItems: "flex-end", gap: 30, flexWrap: "wrap" }}>
            <div aria-hidden="true" className="cut" style={{ flex: "0 0 150px", height: 150, background: LIME, overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", ["--c" as string]: "22px" }}>
              <Toby height={150} rows={24} glasses animate={false} />
            </div>
            <p style={{ margin: 0, flex: "1 1 320px", maxWidth: 820, fontSize: 14, lineHeight: 1.55, color: "#85868B" }}>
              Illustrative assessment based on your own answers. Not a forecast or a promise of results.
            </p>
          </div>
        </div>
      </section>
      {footer}
    </div>
  );
}
