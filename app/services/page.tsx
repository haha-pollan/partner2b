import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Glyph } from "@/components/Tile";

export const metadata: Metadata = {
  title: "Partner2B Services: get ready to grow through partners",
  description:
    "Go-to-market, partner ecosystems, demand generation and operations. Nine services that get a company ready to grow through partners.",
  alternates: { canonical: "/services" },
};

type Svc = { tag: string; title: string; text: string; items: string[]; hot?: boolean };
type Step = { n: string; title: string; lead: string; svcs: Svc[] };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Get your go-to-market ready",
    lead: "A partner can only sell what is clear. Start with the offer, the message and the channel.",
    svcs: [
      {
        tag: "Market strategy",
        title: "Marketing strategy & positioning",
        text: "Clear positioning and messaging that differentiate your offer, shorten sales cycles, and defend pricing power against competitors.",
        items: ["Positioning and messaging audit", "Competitive category research", "Quarterly execution roadmap", "Objection handling playbooks"],
      },
      {
        tag: "Sales alignment",
        title: "Go-to-market & sales enablement",
        text: "Sales collateral and enablement playbooks that equip internal champions to close deals without margin-killing discounts.",
        items: ["Multi-channel lead campaigns", "Funnel conversion optimization", "Targeted ABM programs", "Pipeline attribution tracking"],
      },
      {
        tag: "Partner channels",
        title: "Partner ecosystems & co-selling",
        text: "Channel recruitment and co-selling programs that create a predictable second revenue stream at a lower customer acquisition cost.",
        items: ["Partner ICP definition", "Marketplace setup", "Co-marketing playbooks", "Co-selling workflows"],
        hot: true,
      },
    ],
  },
  {
    n: "02",
    title: "Fill the pipeline",
    lead: "Once the offer is clear, bring in buyers and partners through the channels that convert.",
    svcs: [
      {
        tag: "Search and acquisition",
        title: "Digital marketing & SEO/AEO",
        text: "Search visibility, AI engine optimization (AEO), and paid acquisition targeted at buyers actively evaluating solutions.",
        items: ["SEO and AEO optimization", "Paid ad management", "Email lifecycle flows", "High-intent search targeting"],
      },
      {
        tag: "Pipeline acquisition",
        title: "Demand & lead generation",
        text: "Repeatable inbound and outbound acquisition channels that generate verified buyer pipeline without burning budget.",
        items: ["Multi-channel lead campaigns", "Funnel conversion optimization", "Targeted ABM programs", "Pipeline attribution tracking"],
      },
      {
        tag: "Digital conversion",
        title: "Website development & conversion",
        text: "Modern B2B website architecture and messaging paths engineered to turn technical traffic into qualified sales opportunities.",
        items: ["Redesign wireframes", "Conversion optimization", "UX message mapping", "Deployment"],
      },
    ],
  },
  {
    n: "03",
    title: "Run it without friction",
    lead: "Growth through partners adds volume. Operations and systems keep delivery fast and margins intact.",
    svcs: [
      {
        tag: "Operational efficiency",
        title: "Process audit & opportunity mapping",
        text: "End-to-end workflow audits that locate delivery bottlenecks and identify where automation yields direct cost reductions.",
        items: ["Workflow process mapping", "Bottleneck diagnostics", "Automation ROI roadmap", "Systems stack audit"],
      },
      {
        tag: "Process automation",
        title: "Workflow automation & systems",
        text: "Re-engineering operational handoffs and connecting internal tools to compress delivery cycles and protect gross margin.",
        items: ["CRM and operational sync", "Client onboarding pipelines", "API data orchestration", "Operational bottleneck removal"],
      },
      {
        tag: "Systems development",
        title: "Production systems & AI development",
        text: "Building custom software, modern backend integrations, and autonomous AI agents designed to transform delivery capacity.",
        items: ["Custom agent architecture", "Core systems modernization", "API and database integration", "Production deployment monitoring"],
      },
    ],
  },
];

const WHY = [
  {
    t: "Diagnostic range",
    p: "Marketing agencies push more ads, while dev shops push more code. We are not biased toward either. Every recommendation targets your actual constraint, not whichever service an agency happens to sell.",
  },
  {
    t: "Senior execution",
    p: "No junior account managers learning on your budget. Every program, campaign, and automation deployment is led directly by operators who have run revenue and operations at the executive level.",
  },
  {
    t: "One accountable team",
    p: "No handoffs between separate growth and engineering agencies who have never spoken to each other. Pipeline generation and operational delivery run together under one unified plan.",
  },
];

const MAIL = "mailto:info@partner2b.com?subject=Partner2B%20services";

export default function Services() {
  return (
    <div style={{ background: "#0A0A0B", overflow: "hidden" }}>
      <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 130% no-repeat" }}>
        <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
          <Nav />
          <div className="wrap" style={{ padding: "40px 40px 120px" }}>
            <span className="pill">Services</span>
            <h1 style={{ margin: "22px 0 0", fontWeight: 800, fontSize: "clamp(40px,6.4vw,92px)", letterSpacing: "-0.045em", lineHeight: 1, maxWidth: 1000 }}>
              Want to grow through partners? Start with your go-to-market
            </h1>
            <p style={{ margin: "26px 0 0", maxWidth: 640, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>
              Partner programs work when the offer, the pipeline and the operations behind them are ready. We help with all three, in that order.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
              <a href={MAIL} style={{ background: "#0A0A0B", color: "#A8FF5C", fontWeight: 800, padding: "15px 28px", borderRadius: 12, fontSize: 16 }}>Talk to us</a>
              <Link href="/directory" style={{ border: "1.5px solid #0A0A0B", fontWeight: 800, padding: "14px 26px", borderRadius: 12, fontSize: 16 }}>Browse partner programs</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Three steps */}
      {STEPS.map((s, i) => (
        <section key={s.n} style={{ background: i % 2 ? "#131416" : "#0A0A0B", color: "#ECECEE", padding: "110px 0" }}>
          <div className="wrap">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 28, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 120, lineHeight: 0.8, letterSpacing: "-0.05em", color: "#A8FF5C" }}>{s.n}</span>
              <div style={{ flex: "1 1 420px" }}>
                <h2 style={{ fontWeight: 800, fontSize: "clamp(32px,4.2vw,56px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>{s.title}</h2>
                <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>{s.lead}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 56 }}>
              {s.svcs.map((v) => (
                <article
                  key={v.title}
                  className="cut"
                  style={{ flex: "1 1 320px", background: v.hot ? "#A8FF5C" : "#1C1D20", color: v.hot ? "#0A0A0B" : "#ECECEE", padding: "30px 30px 40px", display: "flex", flexDirection: "column" }}
                >
                  <span style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 800, padding: "5px 12px", borderRadius: 999, background: v.hot ? "#0A0A0B" : "#2A2B2F", color: v.hot ? "#A8FF5C" : "#B9BABD" }}>{v.tag}</span>
                  <h3 style={{ margin: "20px 0 0", fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{v.title}</h3>
                  <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.5, color: v.hot ? "#0A0A0B" : "#B9BABD" }}>{v.text}</p>
                  <ul style={{ listStyle: "none", margin: "24px 0 0", padding: "20px 0 0", borderTop: `1px solid ${v.hot ? "#0A0A0B" : "#3A3B40"}`, display: "grid", gap: 12 }}>
                    {v.items.map((it) => (
                      <li key={it} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, fontWeight: 600 }}>
                        <Glyph kind="diamond" size={14} fg={v.hot ? "#0A0A0B" : "#A8FF5C"} />
                        {it}
                      </li>
                    ))}
                  </ul>
                  {v.hot && (
                    <Link href="/directory" style={{ marginTop: 26, alignSelf: "flex-start", background: "#0A0A0B", color: "#A8FF5C", fontWeight: 800, padding: "12px 20px", borderRadius: 10, fontSize: 15 }}>
                      See real partner programs
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Why us */}
      <section style={{ background: "#0A0A0B", color: "#ECECEE", padding: "110px 0" }}>
        <div className="wrap">
          <h2 style={{ fontWeight: 800, fontSize: "clamp(32px,4.2vw,56px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            <span style={{ color: "#A8FF5C" }}>Why tech companies</span> work with us
          </h2>
          <p style={{ margin: "16px 0 0", maxWidth: 620, fontSize: 19, lineHeight: 1.5, color: "#B9BABD" }}>
            One senior team bridging commercial demand and operational delivery without the typical agency handoffs.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 48 }}>
            {WHY.map((w) => (
              <div key={w.t} style={{ flex: "1 1 300px", background: "#131416", border: "1px solid #2A2B2F", borderRadius: 24, padding: "32px 32px 38px" }}>
                <h3 style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{w.t}</h3>
                <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.55, color: "#B9BABD" }}>{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#A8FF5C", color: "#0A0A0B", padding: "100px 0" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <h2 style={{ flex: "1 1 460px", fontWeight: 800, fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-0.04em", lineHeight: 1.02 }}>
            Ready to grow through partners?
          </h2>
          <a href={MAIL} style={{ background: "#0A0A0B", color: "#A8FF5C", fontWeight: 800, padding: "18px 34px", borderRadius: 14, fontSize: 18 }}>Talk to us</a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
