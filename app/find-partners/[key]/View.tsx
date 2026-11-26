import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Toby } from "@/components/Toby";
import type { Preview } from "@/lib/discovery/preview";
import RequestForm from "./RequestForm";

const TONES = [
  { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", ar: "#0A0A0B", arf: "#A8FF5C" },
  { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", ar: "#A8FF5C", arf: "#0A0A0B" },
];
const ROT = [-1.4, 1.1, -0.8, 1.3, -1.1, 0.9];
const FACTS = [
  { n: "53%", t: "more likely to close when a partner is in the deal" },
  { n: "37%", t: "of partnership leaders say finding the right partners is a top challenge" },
  { n: "3 to 4x", t: "more likely to stay active after a year when the first deal lands in 90 days" },
];
const STAGES = ["Shortlist", "Outreach", "In talks", "Signed", "First deal"];
const nf = (n: number) => n.toLocaleString("en-US");

export default function View({ preview, strategyId }: { preview: Preview; strategyId: string }) {
  const { total, week, opened, types } = preview;
  return (
    <div style={{ overflow: "hidden" }}>
      <div className="hero">
        <Nav />
        <div className="wrap herobody" style={{ paddingTop: 36, paddingBottom: 80 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Your strategy is written</span>
              <span className="pt pt2">Now find the partners</span>
            </h1>
            <p className="bubble herosub" style={{ marginTop: 44 }}>
              I found {nf(total)} companies that fit the partner types in your strategy. You can open {opened} of them today.
            </p>
          </div>
          <div className="herotoby" aria-hidden="true">
            <Toby height={580} rows={38} glasses style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>

      <section className="wrap" style={{ padding: "10px var(--margin) clamp(40px,8vw,80px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "30px 40px" }}>
          {FACTS.map((f) => (
            <div key={f.n} style={{ borderTop: "3px solid #A8FF5C", paddingTop: 16 }}>
              <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: "clamp(34px,4vw,56px)", lineHeight: 1.05, color: "#A8FF5C", WebkitTextStroke: "1.5px currentColor" }}>{f.n}</div>
              <p style={{ margin: "12px 0 0", fontSize: 18, lineHeight: 1.45, color: "#ECECEE", maxWidth: 340 }}>{f.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(30px,6vw,60px)" }}>
        {types.map((t, ti) => {
          const ai = ti % 2 === 1;
          return (
            <div key={t.type} style={{ marginBottom: 64 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <span className="pill" style={{ background: ai ? "#7C5CFF" : "#A8FF5C", color: ai ? "#fff" : "#0A0A0B" }}>{t.type}s</span>
                <span style={{ fontSize: 16, color: "#B9BABD" }}>{nf(t.pool)} companies{t.open ? ", 1 open" : ""}</span>
              </div>
              <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 26 }}>
                {t.open ? (
                  <div className="cut gcard" style={{ background: "#A8FF5C", color: "#0A0A0B", transform: `rotate(${ROT[ti % 6]}deg)`, padding: "24px 26px 30px", display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.25, minHeight: 44 }}>{t.open.name}</h3>
                    <p style={{ margin: "12px 0 0", minHeight: 96, fontSize: 15, lineHeight: 1.5, color: "#1C1D20" }}>{t.open.reason}</p>
                    {t.open.directory ? (
                      <Link href={t.open.directory} aria-label={`${t.open.name} in the directory`} style={{ marginTop: 18, alignSelf: "flex-start", width: 40, height: 40, borderRadius: "50%", background: "#0A0A0B", color: "#A8FF5C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>→</Link>
                    ) : (
                      <a href={t.open.website} target="_blank" rel="noopener noreferrer" aria-label={`${t.open.name} website`} style={{ marginTop: 18, alignSelf: "flex-start", width: 40, height: 40, borderRadius: "50%", background: "#0A0A0B", color: "#A8FF5C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>→</a>
                    )}
                  </div>
                ) : null}
                {t.locked.map((l, i) => {
                  const T = TONES[(i + ti) % 2];
                  return (
                    <div key={i} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT[(i + ti + 2) % 6]}deg)`, padding: "24px 26px 30px", display: "flex", flexDirection: "column" }}>
                      <div aria-hidden="true" style={{ filter: "blur(7px)", userSelect: "none" }}>
                        <h3 style={{ fontWeight: 400, fontSize: 17, letterSpacing: 0, lineHeight: 1.25, minHeight: 44 }}>Company name hidden</h3>
                        <p style={{ margin: "12px 0 0", minHeight: 72, fontSize: 15, lineHeight: 1.5, color: T.sub }}>One line on why this company fits your strategy is shown after you unlock it.</p>
                      </div>
                      <p style={{ margin: "10px 0 0", fontSize: 14, color: T.sub, minHeight: 24 }}>{l.hint}</p>
                      <span aria-hidden="true" style={{ marginTop: 10, alignSelf: "flex-start", width: 40, height: 40, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>&#128274;</span>
                    </div>
                  );
                })}
              </div>
              {t.moreLocked > 0 ? <p style={{ margin: "22px 0 0", fontSize: 16, color: "#B9BABD" }}><span style={{ color: "#A8FF5C" }}>+ {nf(t.moreLocked)} more</span> are locked</p> : null}
            </div>
          );
        })}
        {week > 0 ? <p style={{ fontSize: 18, color: "#ECECEE" }}>{nf(week)} new companies of these types were added to our database this week.</p> : null}
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(40px,8vw,80px)" }}>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>Track your first 90 days</h2>
        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Your plan board follows every match from first contact to first deal, so no partner goes quiet.</p>
        <div style={{ marginTop: 26, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="chip">Matches {nf(total)}</span>
          {STAGES.map((s) => <span key={s} className="chip" style={{ background: "#2A2B30", color: "#ECECEE" }}>&#128274; {s}</span>)}
        </div>
        <div style={{ marginTop: 22, background: "#2A2B30", height: 10, maxWidth: 760 }}><div style={{ background: "#A8FF5C", height: 10, width: `${Math.max(2, Math.round((opened / Math.max(1, total)) * 100))}%` }} /></div>
        <p style={{ margin: "10px 0 0", fontSize: 15, color: "#B9BABD" }}>{opened} of {nf(total)} matches open. 0 contacted. Day 0 of 90.</p>
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(60px,9vw,110px)" }}>
        <div className="cut" style={{ background: "#A8FF5C", color: "#0A0A0B", padding: "clamp(26px,4vw,44px) clamp(24px,4vw,48px) clamp(32px,4vw,52px)", ["--c" as string]: "30px" }}>
          <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(22px,2.8vw,38px)", lineHeight: 1.15, letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>Open all {nf(total)} matches</h2>
          <p style={{ margin: "14px 0 0", maxWidth: 640, fontSize: 18, lineHeight: 1.5 }}>Ten companies per partner type, why each fits, when to approach, the plan board, weekly new matches, PDF and CSV.</p>
          <RequestForm strategyId={strategyId} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
