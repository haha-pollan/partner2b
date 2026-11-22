import { Fragment } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { Glyph } from "@/components/Tile";

export const metadata: Metadata = {
  title: "Partner2B Services: B2B go-to-market and partner ecosystems",
  description:
    "GTM, partner recruitment, enablement, co-marketing and partner operations for B2B vendors in AI, SaaS, fintech and cybersecurity. Grow through partner ecosystems.",
  alternates: { canonical: "/services" },
};

type Svc = { tag: string; title: string; text: string; items: string[]; hot?: boolean };
type Step = { id: string; n: string; title: string; lead: string; kind: string; svcs: Svc[] };

const STEPS: Step[] = [
  {
    id: "gtm", n: "01", kind: "diamond",
    title: "Get your go-to-market ready",
    lead: "A partner can only sell what is clear. Start with the offer, the message and the channel.",
    svcs: [
      { tag: "Market strategy", title: "Marketing strategy & positioning",
        text: "Positioning and messaging that set your offer apart, shorten B2B sales cycles and defend your pricing.",
        items: ["Positioning and messaging audit", "Competitive category research", "Quarterly execution roadmap", "Objection handling playbooks"] },
      { tag: "Sales alignment", title: "Go-to-market & sales enablement",
        text: "Playbooks and collateral that equip your sales team to close B2B deals without margin-killing discounts.",
        items: ["Sales collateral and decks", "Battlecards and pitch scripts", "Champion enablement training", "Pipeline attribution tracking"] },
      { tag: "Partner channels", title: "Partner ecosystems & co-selling", hot: true,
        text: "Channel recruitment and co-selling programs that add a predictable second revenue stream at lower CAC.",
        items: ["Partner ICP definition", "Marketplace setup", "Co-marketing playbooks", "Co-selling workflows"] },
    ],
  },
  {
    id: "pipeline", n: "02", kind: "bars",
    title: "Fill the pipeline",
    lead: "Once the offer is clear, bring in B2B buyers and partners through the channels that convert.",
    svcs: [
      { tag: "Search and acquisition", title: "Digital marketing & SEO/AEO",
        text: "Search and AI engine visibility plus paid acquisition aimed at B2B buyers who are evaluating solutions.",
        items: ["SEO and AEO optimization", "Paid ad management", "Email lifecycle flows", "High-intent search targeting"] },
      { tag: "Pipeline acquisition", title: "Demand & lead generation",
        text: "Repeatable inbound and outbound channels that build verified B2B pipeline without burning budget.",
        items: ["Multi-channel lead campaigns", "Funnel conversion optimization", "Targeted ABM programs", "Pipeline attribution tracking"] },
      { tag: "Digital conversion", title: "Website development & conversion",
        text: "B2B website architecture and message paths built to turn technical traffic into qualified opportunities.",
        items: ["Redesign wireframes", "Conversion optimization", "UX message mapping", "Deployment"] },
    ],
  },
  {
    id: "ops", n: "03", kind: "grid",
    title: "Run it without friction",
    lead: "Partners add volume. Operations and systems keep delivery fast and margins intact.",
    svcs: [
      { tag: "Operational efficiency", title: "Process audit & opportunity mapping",
        text: "End-to-end workflow audits that find delivery bottlenecks and show where automation cuts cost.",
        items: ["Workflow process mapping", "Bottleneck diagnostics", "Automation ROI roadmap", "Systems stack audit"] },
      { tag: "Process automation", title: "Workflow automation & systems",
        text: "Re-engineered handoffs and connected tools that shorten delivery cycles and protect gross margin.",
        items: ["CRM and operational sync", "Client onboarding pipelines", "API data orchestration", "Operational bottleneck removal"] },
      { tag: "Systems development", title: "Production systems & AI development",
        text: "Custom software, backend integrations and autonomous AI agents that expand your delivery capacity.",
        items: ["Custom agent architecture", "Core systems modernization", "API and database integration", "Production deployment monitoring"] },
    ],
  },
];

const WHY = [
  { t: "Diagnostic range", p: "Unbiased advice. We fix your real constraint, not what an agency sells.", kind: "hex", bg: "#2A2B30", fg: "#ECECEE", rot: -2 },
  { t: "Senior execution", p: "Led by operators who have run B2B revenue and operations at executive level.", kind: "bars", bg: "#ECECEE", fg: "#0A0A0B", rot: 2 },
  { t: "One accountable team", p: "Growth and engineering run under one plan, with no agency handoffs.", kind: "diamond", bg: "#A8FF5C", fg: "#0A0A0B", rot: -2 },
];

type Theme = { bg: string; tx: string; sub: string; num: string; card: string; ctx: string; csub: string; ctag: string; ctagTx: string; line: string; gl: string; hot: string; hotTx: string };
const THEMES: Theme[] = [
  { bg: "transparent", tx: "#fff", sub: "#ECECEE", num: "#A8FF5C", card: "#2A2B30", ctx: "#ECECEE", csub: "#B9BABD", ctag: "#2A2B2F", ctagTx: "#B9BABD", line: "#3A3B40", gl: "#A8FF5C", hot: "#A8FF5C", hotTx: "#0A0A0B" },
  { bg: "transparent", tx: "#fff", sub: "#ECECEE", num: "#A8FF5C", card: "#ECECEE", ctx: "#0A0A0B", csub: "#3A3B40", ctag: "#0A0A0B", ctagTx: "#A8FF5C", line: "#B9BABD", gl: "#0A0A0B", hot: "#A8FF5C", hotTx: "#0A0A0B" },
  { bg: "#A8FF5C", tx: "#0A0A0B", sub: "#1C1D20", num: "#0A0A0B", card: "#2A2B30", ctx: "#ECECEE", csub: "#B9BABD", ctag: "#2A2B2F", ctagTx: "#B9BABD", line: "#3A3B40", gl: "#A8FF5C", hot: "#ECECEE", hotTx: "#0A0A0B" },
];

const WORDS = ["Go-to-market", "Partner ecosystems", "Demand generation", "Automation", "AI development"];
const MAIL = "mailto:info@partner2b.com?subject=Partner2B%20services";
const SEGMENTS: { t: string; p: string; kind: string }[] = [
  { t: "AI Vendors", p: "Every competitor claims category leadership before the category exists. We help you say something buyers believe.", kind: "diamond" },
  { t: "B2B SaaS", p: "Feature comparisons are a race to the bottom. We build the story that gets you chosen, not just compared.", kind: "bars" },
  { t: "Fintech", p: "Compliance slows everything down, and buyers assume the worst until proven otherwise. We market inside that reality.", kind: "grid" },
  { t: "Cybersecurity", p: "Trust builds through ecosystems, not louder claims. We grow you through the partners and integrations buyers already trust.", kind: "hex" },
  { t: "Manufacturing & Logistics", p: "Long sales cycles punish anything that sounds like fluff. Technical buyers respond to specifics, not slogans.", kind: "stairs" },
  { t: "Tech Services & Agencies", p: "Referrals only get you so far. We build the visibility that brings clients to you, not the other way around.", kind: "slants" },
];

const btnA: React.CSSProperties = { background: "#A8FF5C", color: "#0A0A0B", fontFamily: "'Sora',sans-serif", fontWeight: 500, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };
const btnB: React.CSSProperties = { background: "#7C5CFF", color: "#fff", fontFamily: "'Sora',sans-serif", fontWeight: 500, fontSize: 19, padding: "18px 34px", border: 0, cursor: "pointer", display: "inline-block", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" };

export default function Services() {
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ overflow: "hidden" }}>
        {/* Hero */}
        <div style={{ position: "relative" }}>
          <Nav />
          <div className="wrap" style={{ padding: "24px 40px clamp(36px,9vw,110px)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto", maxWidth: "min(100%, 800px)" }}>
              <span className="pill">For B2B companies</span>
              <h1 style={{ margin: "20px 0 0", fontWeight: 400, fontSize: "clamp(26px,3.4vw,47px)", lineHeight: 1, letterSpacing: 0 }}>
                <span style={{ display: "block" }}>Want to grow</span>
                <span style={{ display: "block" }}>through partners?</span>
                <span style={{ display: "block" }}>Start with your GTM</span>
              </h1>
              <p style={{ margin: "24px 0 0", maxWidth: 560, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>
                B2B partner programs work when the offer, the pipeline and the operations behind them are ready. We help with all three, in that order.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
                <a href={MAIL} style={btnA}>Talk to us</a>
                <Link href="/directory" style={btnB}>Browse partner programs</Link>
              </div>
            </div>
            <div style={{ flex: "0 0 380px", maxWidth: "100%", display: "flex", flexDirection: "column", gap: 22, marginTop: 20 }}>
              {[
                { s: STEPS[0], bg: "#2A2B30", fg: "#ECECEE", gl: "#A8FF5C", rot: -5, ml: 0 },
                { s: STEPS[1], bg: "#ECECEE", fg: "#0A0A0B", gl: "#0A0A0B", rot: 3, ml: 36 },
                { s: STEPS[2], bg: "#A8FF5C", fg: "#0A0A0B", gl: "#0A0A0B", rot: -3, ml: 12 },
              ].map(({ s, bg, fg, gl, rot, ml }) => (
                <a key={s.id} href={`#${s.id}`} className="cut hcard" style={{ marginLeft: ml, transform: `rotate(${rot}deg)`, background: bg, color: fg, padding: "22px 26px", display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ flex: "0 0 64px", width: 64, height: 64, borderRadius: 16, border: `2px solid ${gl}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph kind={s.kind} fg={gl} size={38} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.8 }}>Step {s.n}</div>
                    <div style={{ marginTop: 4, fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 18, letterSpacing: 0, lineHeight: 1.1 }}>{s.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Segments */}
      <section style={{ padding: "clamp(36px,9vw,72px) 0 clamp(36px,9vw,96px)", position: "relative", overflow: "hidden" }}>
        <div className="wrap" style={{ position: "relative" }}>
          <span className="pill" style={{ background: "#A8FF5C", color: "#0A0A0B" }}>Your vertical</span>
          <h2 style={{ margin: "18px 0 0", fontWeight: 400, fontSize: "clamp(26px,3.4vw,44px)", letterSpacing: 0, lineHeight: 1.15 }}>
            We Know Your <span style={{ color: "#A8FF5C" }}>Category</span>
          </h2>
          <p style={{ margin: "18px 0 0", maxWidth: 620, fontSize: 18, lineHeight: 1.5, color: "#B9BABD" }}>
            From strategy and recruitment to enablement and co-marketing. One AI-first team runs your full partner marketing program.
          </p>
          <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 28 }}>
            {SEGMENTS.map((g, i) => {
              const T = [
                { bg: "#ECECEE", fg: "#0A0A0B", sub: "#3A3B40", gl: "#0A0A0B", num: "#85868B" },
                { bg: "#A8FF5C", fg: "#0A0A0B", sub: "#1C1D20", gl: "#0A0A0B", num: "#3F7A12" },
                { bg: "#2A2B30", fg: "#ECECEE", sub: "#B9BABD", gl: "#A8FF5C", num: "#55565B" },
              ][(i + Math.floor(i / 3)) % 3];
              const rot = [-1.6, 1.2, -0.8, 1.4, -1.2, 1.6][i];
              return (
                <div key={g.t} className="cut" style={{ background: T.bg, color: T.fg, transform: `rotate(${rot}deg)`, padding: "26px 28px 30px", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: "0 0 56px", width: 56, height: 56, borderRadius: 16, border: `2px solid ${T.gl}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Glyph kind={g.kind} fg={T.gl} size={32} />
                    </div>
                    <h3 style={{ fontWeight: 400, fontSize: 18, letterSpacing: 0, lineHeight: 1.3, flex: 1 }}>{g.t}</h3>
                    <span style={{ fontFamily: "'Michroma',sans-serif", fontSize: 29, color: T.num }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p style={{ margin: "20px 0 0", minHeight: 96, fontSize: 16, lineHeight: 1.55, color: T.sub }}>{g.p}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps */}
      {STEPS.map((s, i) => (
        <Fragment key={s.id}>
        <section id={s.id} style={{ background: THEMES[i].bg, color: THEMES[i].tx, padding: "clamp(36px,9vw,110px) 0", position: "relative" }}>
          <div className="wrap">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 28, flexWrap: "wrap" }}>
              <span className="bignum" style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 94, lineHeight: 0.8, letterSpacing: 0, color: THEMES[i].num }}>{s.n}</span>
              <div style={{ flex: "1 1 420px" }}>
                <h2 style={{ fontWeight: 400, fontSize: "clamp(25px,3.2vw,44px)", letterSpacing: 0, lineHeight: 1.05 }}>{s.title}</h2>
                <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 19, lineHeight: 1.5, color: THEMES[i].sub }}>{s.lead}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 56 }}>
              {s.svcs.map((v) => (
                <article key={v.title} className="cut" style={{ flex: "1 1 320px", background: v.hot ? THEMES[i].hot : THEMES[i].card, color: v.hot ? THEMES[i].hotTx : THEMES[i].ctx, padding: "30px 30px 40px", display: "flex", flexDirection: "column" }}>
                  <span style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 500, padding: "5px 12px", borderRadius: 999, background: v.hot ? "#0A0A0B" : THEMES[i].ctag, color: v.hot ? "#A8FF5C" : THEMES[i].ctagTx }}>{v.tag}</span>
                  <h3 style={{ margin: "20px 0 0", minHeight: 58, fontWeight: 400, fontSize: 18, letterSpacing: 0, lineHeight: 1.2 }}>{v.title}</h3>
                  <p style={{ margin: "12px 0 0", minHeight: 78, fontSize: 16, lineHeight: 1.5, color: v.hot ? "#0A0A0B" : THEMES[i].csub }}>{v.text}</p>
                  <ul style={{ listStyle: "none", margin: "22px 0 0", padding: "20px 0 0", borderTop: `1px solid ${v.hot ? "#0A0A0B" : THEMES[i].line}`, display: "grid", gap: 12 }}>
                    {v.items.map((it) => (
                      <li key={it} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, fontWeight: 400 }}>
                        <span style={{ flex: "0 0 14px" }}><Glyph kind="diamond" size={14} fg={v.hot ? "#0A0A0B" : THEMES[i].gl} /></span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            {i === 0 && (
              <Link href="/directory" className="btn btn-s" style={{ display: "inline-block", marginTop: 32 }}>
                See how real partner programs are built
              </Link>
            )}
          </div>
        </section>
        {i === 0 && (
    <div aria-hidden="true" style={{ position: "relative", height: 150, overflow: "hidden", background: "linear-gradient(#cfd0d3 50%, #0A0A0B 50%)" }}>
      {[{ bg: "#fff", fg: "#0A0A0B", rot: 2, top: 34 }, { bg: "#A8FF5C", fg: "#0A0A0B", rot: -2, top: 44 }].map((b, i) => (
        <div key={i} style={{ position: "absolute", left: -40, right: -40, top: b.top, transform: `rotate(${b.rot}deg)`, background: b.bg, color: b.fg, padding: "14px 0", whiteSpace: "nowrap", overflow: "hidden", fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 20, letterSpacing: 0, textTransform: "uppercase" }}>
          {Array.from({ length: 3 }).map(() => WORDS.map((t) => `${t} ◆ `).join("")).join("")}
        </div>
      ))}
    </div>

        )}
        </Fragment>
      ))}

      {/* Why us */}
      <section style={{ padding: "clamp(36px,9vw,110px) 0 clamp(36px,9vw,130px)" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 400, fontSize: "clamp(26px,3.4vw,44px)", letterSpacing: 0, lineHeight: 1.05 }}>
            Why B2B tech companies <span style={{ color: "#A8FF5C" }}>work with us</span>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 36, marginTop: 64, justifyContent: "center" }}>
            {WHY.map((w) => (
              <div key={w.t} className="cut" style={{ flex: "1 1 300px", maxWidth: 400, transform: `rotate(${w.rot}deg)`, background: w.bg, color: w.fg, padding: "28px 28px 40px" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, border: `2px solid ${w.fg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph kind={w.kind} fg={w.fg} size={38} />
                </div>
                <h3 style={{ margin: "22px 0 0", fontWeight: 400, fontSize: 22, letterSpacing: 0, lineHeight: 1.1 }}>{w.t}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.45, fontWeight: 500, opacity: 0.85 }}>{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ padding: "clamp(36px,9vw,120px) 0 clamp(36px,9vw,140px)", color: "#ECECEE" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px" }}>
            <h2 style={{ fontWeight: 400, fontSize: "clamp(29px,3.6vw,44px)", letterSpacing: 0, lineHeight: 1.05 }}>
              <span style={{ display: "block" }}>Ready to grow</span>
              <span style={{ display: "block", color: "#A8FF5C" }}>through partners?</span>
            </h2>
            <p style={{ margin: "22px 0 0", maxWidth: 440, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>Tell us where your B2B growth is stuck. We will tell you which step to start with.</p>
          </div>
          <a href={MAIL} className="cut" style={{ flex: "0 0 400px", maxWidth: "100%", transform: "rotate(3deg)", background: "#fff", color: "#0A0A0B", padding: "28px 30px 32px", display: "block" }}>
            {["Company name", "Work email", "Where growth is stuck"].map((k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 400 }}>{k}</div>
                <div style={{ marginTop: 6, background: "#ECECEE", borderRadius: 10, height: 46 }} />
              </div>
            ))}
            <div className="btn btn-p" style={{ marginTop: 22, textAlign: "center" }}>Talk to us</div>
          </a>
        </div>
      </section>
      <BuilderCta />
      <Footer />
    </div>
  );
}
