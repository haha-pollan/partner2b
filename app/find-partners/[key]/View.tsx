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
const ROT_SMALL = [-0.5, 0.4, -0.3, 0.5, -0.4, 0.3];
const ROLE_TEXT: [RegExp, string][] = [
  [/ai|automation/i, "AI and automation firms that build your product into client projects."],
  [/technology/i, "Software companies whose product works alongside yours."],
  [/channel/i, "Resellers and distributors that sell your product to their customers."],
  [/agency/i, "Agencies and consultancies that implement and recommend you."],
  [/community/i, "Communities and networks that already reach your audience."],
  [/strategic/i, "Larger companies that open new markets and add credibility."],
];
const roleText = (type: string) => ROLE_TEXT.find(([re]) => re.test(type))?.[1] ?? "";
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
function Lock({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M5 7.5V3h6v4.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
      <rect x="2.5" y="7" width="11" height="8" fill="currentColor" />
      <rect x="7.2" y="9.6" width="1.6" height="3" fill="#2A2B30" />
    </svg>
  );
}
function Progress({ total, opened }: { total: number; opened: number }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="chip">Matches {nf(total)}</span>
        {STAGES.map((st) => <span key={st} className="chip" style={{ background: "#2A2B30", color: "#ECECEE" }}><Lock size={13} /> {st}</span>)}
      </div>
      <div style={{ marginTop: 22, background: "#2A2B30", height: 10, maxWidth: 760 }}><div style={{ background: "#A8FF5C", height: 10, width: `${Math.max(2, Math.round((opened / Math.max(1, total)) * 100))}%` }} /></div>
      <p style={{ margin: "10px 0 0", fontSize: 15, color: "#B9BABD" }}>{opened} of {nf(total)} matches shown. Unlock all to start your plan.</p>
    </div>
  );
}
function Initial({ name }: { name: string }) {
  return <div style={{ flex: "0 0 40px", width: 40, height: 40, borderRadius: 14, background: "#fff", color: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{name.trim().charAt(0).toUpperCase()}</div>;
}

export default function View({ preview, strategyId, company }: { preview: Preview; strategyId: string; company?: string | null }) {
  const { total, week, opened, types } = preview;
  return (
    <div style={{ overflowX: "clip" }}>
      <div className="hero">
        <Nav />
        <div className="wrap herobody" style={{ paddingTop: 90, paddingBottom: 80 }}>
          <div className="tapewrap">
            <h1 className="ptapes">
              <span className="pt pt1">Your strategy is written</span>
              <span className="pt pt2">Now find the partners</span>
            </h1>
            <div className="fprow">
              <FactBubble total={nf(total)} />
            </div>
          </div>
          <div className="herotoby" aria-hidden="true" style={{ width: "clamp(190px,19vw,360px)", top: 104 }}>
            <Toby height={580} rows={38} glasses style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(50px,7vw,90px)" }}>
        <Progress total={total} opened={opened} />
      </section>

      <section className="wrap" style={{ padding: "clamp(30px,5vw,60px) var(--margin) 0" }}>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, letterSpacing: 0, WebkitTextStroke: "1.5px currentColor", fontSize: "clamp(22px,2.6vw,34px)" }}>Your {nf(total)} matches{company ? ` for ${company}` : ""}</h2>
        <p style={{ margin: "14px 0 0", maxWidth: 660, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Grouped by partner type. The top five of each type are open. The rest unlock with full access.</p>
      </section>
      <nav aria-label="Partner types" className="fpnav">
        <div className="wrap fpnavin" style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px var(--margin)" }}>
          {types.map((t, ti) => (
            <a key={t.type} href={`#type-${ti}`} className="chip" style={{ background: ti % 2 === 1 ? "#7C5CFF" : "#A8FF5C", color: ti % 2 === 1 ? "#fff" : "#0A0A0B", fontSize: 15, padding: "7px 14px" }}>{t.type}s <strong style={{ fontWeight: 400, opacity: 0.85 }}>{nf(t.pool)}</strong></a>
          ))}
        </div>
      </nav>

      <section className="wrap" style={{ padding: "clamp(50px,7vw,90px) var(--margin) clamp(70px,9vw,130px)" }}>
        {types.map((t, ti) => {
          const ai = ti % 2 === 1;
          const accent = ai ? "#7C5CFF" : "#A8FF5C";
          const shown = t.shown.length;
          return (
            <div key={t.type} id={`type-${ti}`} style={{ marginTop: ti === 0 ? 0 : "clamp(60px,8vw,100px)", paddingTop: ti === 0 ? 0 : "clamp(60px,8vw,100px)", borderTop: ti === 0 ? 0 : "1px solid #2A2B30", scrollMarginTop: 70 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: "clamp(46px,6.4vw,84px)", lineHeight: 1, letterSpacing: 0, color: accent, WebkitTextStroke: "2px currentColor" }}>{nf(t.pool)}</div>
                <span className="pill" style={{ background: accent, color: ai ? "#fff" : "#0A0A0B", fontSize: 16, padding: "7px 16px" }}>{t.type}s</span>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 19, lineHeight: 1.45, color: "#ECECEE", maxWidth: 760 }}>companies found. {roleText(t.type)}</p>
              <div className="fpgrid" style={{ marginTop: 30 }}>
                {t.shown.map((o, i) => {
                  const first = i === 0;
                  const T = first ? (ai ? { bg: "#7C5CFF", fg: "#fff", sub: "#EDE8FF", ar: "#fff", arf: "#7C5CFF" } : { bg: "#A8FF5C", fg: "#0A0A0B", sub: "#1C1D20", ar: "#0A0A0B", arf: "#A8FF5C" }) : { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", ar: "#0A0A0B", arf: "#A8FF5C" };
                  const href = o.directory ?? o.website;
                  return (
                    <div key={o.name + i} className="cut gcard" style={{ background: T.bg, color: T.fg, transform: `rotate(${ROT_SMALL[(i + ti) % 6]}deg)`, padding: "16px 16px 18px", display: "flex", flexDirection: "column", ["--c" as string]: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <LogoTile domain={host(o.website)} size={40} fallback={<Initial name={o.name} />} />
                        <h3 style={{ fontWeight: 400, fontSize: 16, letterSpacing: 0, lineHeight: 1.25, minWidth: 0, flex: 1, ...clamp(2) }}>{o.name}</h3>
                        <span aria-label={`Rank ${i + 1}`} style={{ fontSize: 13, color: T.sub, alignSelf: "flex-start" }}>#{i + 1}</span>
                      </div>
                      <p style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.45, color: T.sub, minHeight: 84, ...clamp(4) }}>{o.reason}</p>
                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 13, color: T.sub, ...clamp(1) }}>{o.subtype ?? "Partner"}</span>
                        <a href={href} {...(o.directory ? {} : { target: "_blank", rel: "noopener noreferrer" })} aria-label={o.name} style={{ flex: "0 0 32px", width: 32, height: 32, borderRadius: "50%", background: T.ar, color: T.arf, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>→</a>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <SeeMore type={t.type} total={nf(t.pool)} strategyId={strategyId} violet={ai} />
                <span style={{ fontSize: 16, color: "#B9BABD", maxWidth: 560 }}>Top {shown} of <span style={{ color: accent }}>{nf(t.pool)}</span>.{t.moreLocked > 0 ? ` Unlock ${nf(t.moreLocked)} more, with why each fits and when to approach.` : ""}</span>
              </div>
            </div>
          );
        })}
        {week > 0 ? <p style={{ marginTop: "clamp(60px,8vw,100px)", fontSize: 18, color: "#ECECEE" }}>{nf(week)} new companies of these types were added to our database this week.</p> : null}
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(70px,9vw,130px)" }}>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, letterSpacing: 0, WebkitTextStroke: "1.5px currentColor", fontSize: "clamp(22px,2.6vw,34px)" }}>Track your first 90 days</h2>
        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Your plan board follows every match from first contact to first deal, so no partner goes quiet.</p>
        <div style={{ marginTop: 26 }}><Progress total={total} opened={opened} /></div>
      </section>

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(80px,10vw,140px)" }}>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(22px,2.6vw,34px)", letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>Free tools while you wait</h2>
        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Use these while you review your matches. Size your outreach, check your program and learn the terms. All free, no sign up.</p>
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

      <section className="wrap" style={{ padding: "0 var(--margin) clamp(70px,9vw,120px)" }}>
        <div id="unlock" className="cut fpcta" style={{ background: "#1C1D20", color: "#fff", boxShadow: "inset 0 5px 0 #A8FF5C", padding: "clamp(34px,4.5vw,56px) clamp(24px,4vw,56px)", ["--c" as string]: "30px" }}>
          <div>
            <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(22px,2.6vw,34px)", lineHeight: 1.2, letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>Open all <span style={{ color: "#A8FF5C" }}>{nf(total)}</span> matches</h2>
            <p style={{ margin: "16px 0 0", maxWidth: 520, fontSize: 18, lineHeight: 1.5, color: "#ECECEE" }}>Every match, why each fits, when to approach, the plan board, weekly new matches, PDF and CSV.</p>
          </div>
          <RequestForm strategyId={strategyId} inline />
        </div>
      </section>
      <Footer />
    </div>
  );
}
