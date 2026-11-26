import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Toby } from "@/components/Toby";
import type { Preview } from "@/lib/discovery/preview";
import RequestForm from "./RequestForm";
import FactBubble from "./FactBubble";
import SeeMore from "./SeeMore";
import { LogoTile } from "@/components/LogoTile";

const TONES = [
  { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", ar: "#0A0A0B", arf: "#A8FF5C" },
  { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", ar: "#A8FF5C", arf: "#0A0A0B" },
];
const ROT = [-1.4, 1.1, -0.8, 1.3, -1.1, 0.9];
const ROT_SMALL = [-0.9, 0.7, -0.6, 0.9, -0.7, 0.6];
const TOOLS = [
  { name: "Partner pipeline calculator", text: "How many partners to approach to reach your revenue goal.", href: "/partner-pipeline-calculator" },
  { name: "Partner program assessment", text: "Three minutes to find what holds your program back.", href: "/partner-program-assessment" },
  { name: "Partner program directory", text: "See how other companies run their partner programs.", href: "/directory" },
  { name: "Partner glossary", text: "Plain definitions of every partner term you will meet.", href: "/glossary" },
];
const STAGES = ["Shortlist", "Outreach", "In talks", "Signed", "First deal"];
const nf = (n: number) => n.toLocaleString("en-US");
const host = (u: string) => { try { return new URL(u).host.replace(/^www\./, ""); } catch { return ""; } };
const clamp = (n: number) => ({ display: "-webkit-box", WebkitLineClamp: n, WebkitBoxOrient: "vertical" as const, overflow: "hidden" });
function Initial({ name }: { name: string }) {
  return <div style={{ flex: "0 0 40px", width: 40, height: 40, borderRadius: 14, background: "#fff", color: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{name.trim().charAt(0).toUpperCase()}</div>;
}

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
            <div className="fprow">
              <FactBubble total={nf(total)} />
              <div className="fptoby" aria-hidden="true">
                <Toby height={580} rows={38} glasses style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(40px,6vw,64px)" }}>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>Track your first 90 days</h2>
        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Your plan board follows every match from first contact to first deal, so no partner goes quiet.</p>
        <div style={{ marginTop: 26, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="chip">Matches {nf(total)}</span>
          {STAGES.map((s) => <span key={s} className="chip" style={{ background: "#2A2B30", color: "#ECECEE" }}>&#128274; {s}</span>)}
        </div>
        <div style={{ marginTop: 22, background: "#2A2B30", height: 10, maxWidth: 760 }}><div style={{ background: "#A8FF5C", height: 10, width: `${Math.max(2, Math.round((opened / Math.max(1, total)) * 100))}%` }} /></div>
        <p style={{ margin: "10px 0 0", fontSize: 15, color: "#B9BABD" }}>{opened} of {nf(total)} matches open. 0 contacted. Day 0 of 90.</p>
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(30px,6vw,60px)" }}>
        {types.map((t, ti) => {
          const ai = ti % 2 === 1;
          const shown = (t.open ? 1 : 0) + t.locked.length;
          return (
            <div key={t.type} style={{ marginBottom: 72 }}>
              <span className="pill" style={{ background: ai ? "#7C5CFF" : "#A8FF5C", color: ai ? "#fff" : "#0A0A0B" }}>{t.type}s</span>
              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: "clamp(46px,6.4vw,84px)", lineHeight: 1, letterSpacing: 0, color: "#A8FF5C", WebkitTextStroke: "2px currentColor" }}>{nf(t.pool)}</div>
                <div style={{ marginTop: 10, fontSize: 20, color: "#ECECEE" }}>companies found for your {t.type.toLowerCase()} strategy</div>
              </div>
              <div className="fpgrid" style={{ marginTop: 30 }}>
                {t.open ? (
                  <div className="cut gcard" style={{ background: "#A8FF5C", color: "#0A0A0B", transform: `rotate(${ROT_SMALL[ti % 6]}deg)`, padding: "16px 16px 18px", display: "flex", flexDirection: "column", ["--c" as string]: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <LogoTile domain={host(t.open.website)} size={40} fallback={<Initial name={t.open.name} />} />
                      <h3 style={{ fontWeight: 400, fontSize: 15, letterSpacing: 0, lineHeight: 1.25, minWidth: 0, ...clamp(2) }}>{t.open.name}</h3>
                    </div>
                    <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.45, color: "#1C1D20", minHeight: 82, ...clamp(4) }}>{t.open.reason}</p>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 13, color: "#1C1D20", ...clamp(1) }}>{t.open.subtype ?? "Open"}</span>
                      <a href={t.open.directory ?? t.open.website} {...(t.open.directory ? {} : { target: "_blank", rel: "noopener noreferrer" })} aria-label={`${t.open.name}`} style={{ flex: "0 0 32px", width: 32, height: 32, borderRadius: "50%", background: "#0A0A0B", color: "#A8FF5C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>→</a>
                    </div>
                  </div>
                ) : null}
                {t.locked.map((l, i) => {
                  const T = TONES[(i + ti) % 2];
                  return (
                    <div key={i} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT_SMALL[(i + ti + 2) % 6]}deg)`, padding: "16px 16px 18px", display: "flex", flexDirection: "column", ["--c" as string]: "16px" }}>
                      <div aria-hidden="true" style={{ filter: "blur(6px)", userSelect: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: "0 0 40px", width: 40, height: 40, borderRadius: 14, background: "#fff" }} />
                          <h3 style={{ fontWeight: 400, fontSize: 15, letterSpacing: 0, lineHeight: 1.25 }}>Company name hidden</h3>
                        </div>
                        <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.45, color: T.sub, minHeight: 82 }}>One line on why this company fits your strategy is shown after you unlock it.</p>
                      </div>
                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 13, color: T.sub, ...clamp(2) }}>{l.hint}</span>
                        <span aria-hidden="true" style={{ flex: "0 0 32px", width: 32, height: 32, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&#128274;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <SeeMore type={t.type} total={nf(t.pool)} strategyId={strategyId} />
                <span style={{ fontSize: 16, color: "#B9BABD" }}>Showing {shown} of <span style={{ color: "#A8FF5C" }}>{nf(t.pool)}</span></span>
              </div>
            </div>
          );
        })}
        {week > 0 ? <p style={{ fontSize: 18, color: "#ECECEE" }}>{nf(week)} new companies of these types were added to our database this week.</p> : null}
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(50px,8vw,90px)" }}>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>Free tools while you wait</h2>
        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Size your outreach, check your program and learn the terms. All free, no sign up.</p>
        <div className="fptools" style={{ marginTop: 30 }}>
          {TOOLS.map((tl, i) => {
            const T = TONES[i % 2];
            return (
              <a key={tl.href} href={tl.href} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT_SMALL[(i + 1) % 6]}deg)`, padding: "22px 22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 190, ["--c" as string]: "18px" }}>
                <div>
                  <h3 style={{ fontWeight: 400, fontSize: 18, letterSpacing: 0, lineHeight: 1.25 }}>{tl.name}</h3>
                  <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.5, color: T.sub }}>{tl.text}</p>
                </div>
                <span aria-hidden="true" style={{ marginTop: 16, alignSelf: "flex-end", width: 36, height: 36, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>→</span>
              </a>
            );
          })}
        </div>
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
