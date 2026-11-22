import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BuilderCta } from "@/components/BuilderCta";
import { PlaybookForm } from "./PlaybookForm";

const URL_ = "https://partner2b.com/playbook";
const TITLE = "The Ecosystem-Led Growth Playbook 2026: free B2B partnership guide (PDF)";
const DESC = "A free playbook on ecosystem-led growth for B2B marketers. Learn how partnerships work as a go-to-market motion, which partner types to build, and the 10 KPIs that prove partner ROI.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/playbook" },
  openGraph: { type: "article", url: URL_, title: TITLE, description: DESC, siteName: "Partner2B", images: [{ url: "/playbook/cover.jpg", width: 579, height: 819, alt: "Cover of the Ecosystem-Led Growth Playbook 2026" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/playbook/cover.jpg"] },
};

const STATS: [string, string][] = [
  ["58%", "of revenue for top-performing companies comes from partners"],
  ["46%", "faster closes on deals that involve partners"],
  ["72%", "of companies report lower customer acquisition cost through partnerships"],
  ["70%", "of executives say partnerships are critical to growth"],
];

const CHAPTERS: [string, string][] = [
  ["Why partnerships are no longer optional", "What changed in B2B buying and why ecosystems now decide shortlists."],
  ["Essential terms you need to know", "Account mapping, co-selling, channel partners and ecosystem-led growth, defined in plain words."],
  ["The 2026 B2B landscape", "Longer sales cycles, falling win rates and why trust now comes from the network."],
  ["Ecosystem-led growth in your GTM stack", "How ELG layers on product-led and sales-led growth, with the 6 W's framework."],
  ["Cross-functional partnership alignment", "How product, marketing, sales and customer success each own a part of the ecosystem."],
  ["Understanding partner types", "Technology partners, resellers, MSPs, system integrators, agencies and referral partners."],
  ["The partner journey", "Five stages from mapping your ICP workflows to launching and measuring visibility."],
  ["Partner marketing strategies", "Co-marketing, channel enablement, market development funds and partner marketing infrastructure."],
  ["Partnership KPIs", "The 10 metrics that matter, each with a target range you can benchmark against."],
  ["Your roadmap for 2026", "Key takeaways and a step-by-step plan from this week to this year."],
];

const WHO = [
  "B2B marketers who are new to partnerships and need a clear starting point",
  "Founders and heads of growth deciding whether to build a partner program",
  "Partnership and channel managers who want a shared language with sales, product and customer success",
];

const FAQS: [string, string][] = [
  ["What is ecosystem-led growth?", "Ecosystem-led growth (ELG) is a go-to-market strategy where a company builds the infrastructure that lets many partners connect and create compound value through network effects. The vendor orchestrates partner discovery, integrations and attribution across many-to-many relationships instead of managing individual one-to-one partnerships."],
  ["How is ecosystem-led growth different from product-led and sales-led growth?", "Product-led growth drives adoption through the product itself, often with free trials or freemium. Sales-led growth builds revenue through high-touch, relationship-driven selling. Ecosystem-led growth uses partnerships, integrations and network effects so buyers find your product through your partners. The playbook explains why the strongest companies layer all three motions rather than choosing one."],
  ["Which partnership KPIs should a B2B company track?", "The playbook covers 10 core metrics: partner-influenced revenue, partner-sourced pipeline, partner-influenced deal velocity, partner-influenced win rate, partner CAC versus direct CAC, partner program ROI, active partner percentage, integration adoption rate, partner marketplace traffic and ecosystem customer retention. Each comes with a target range."],
  ["Who is the playbook for?", "It is written for B2B marketing professionals who are new to partnerships. It explains what partnerships are, why they matter and how to use ecosystem-led growth as a core go-to-market motion."],
  ["What is inside the playbook?", "It covers why partnerships matter now, a glossary of essential terms, the 2026 B2B landscape, ecosystem-led growth in your GTM stack, cross-functional alignment, partner types, the five-stage partner journey, partner marketing strategies, the 10 KPIs and a roadmap with next steps."],
  ["Is the playbook free?", "Yes. You leave your work email and the PDF downloads straight away. There is no payment and no account to create."],
  ["Who wrote it?", "Elena Zap, founder of Partner2B, who has more than 17 years of experience in B2B sales, marketing and partnerships."],
];

const SHOTS: [string, string, string][] = [
  ["/playbook/cover.jpg", "Cover of the Ecosystem-Led Growth Playbook 2026", "Cover"],
  ["/playbook/six-ws.jpg", "Page showing the 6 W's of a B2B go-to-market strategy and where the partner ecosystem fits", "The 6 W's of GTM"],
  ["/playbook/alignment.jpg", "Page showing the partnership alignment model across product, marketing, sales and customer success", "Alignment model"],
  ["/playbook/partner-types.jpg", "Page listing ecosystem and growth partner types", "Partner types"],
  ["/playbook/kpis.jpg", "Page listing the 10 partnership KPIs with target ranges", "The 10 KPIs"],
];

export default function Page() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article", "@id": `${URL_}#article`, headline: "The Ecosystem-Led Growth Playbook 2026", description: DESC, url: URL_, inLanguage: "en",
        datePublished: "2026-11-22", dateModified: "2026-11-22", isAccessibleForFree: true,
        image: "https://partner2b.com/playbook/cover.jpg",
        about: ["ecosystem-led growth", "B2B partnerships", "partner programs", "go-to-market strategy", "partner marketing"],
        author: { "@type": "Person", name: "Elena Zap", jobTitle: "Founder, Partner2B", url: "https://partner2b.com/about-us" },
        publisher: { "@type": "Organization", name: "Partner2B", url: "https://partner2b.com" },
        mainEntityOfPage: URL_,
      },
      { "@type": "FAQPage", "@id": `${URL_}#faq`, mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Partner2B", item: "https://partner2b.com" },
        { "@type": "ListItem", position: 2, name: "Resources", item: "https://partner2b.com/post" },
        { "@type": "ListItem", position: 3, name: "Ecosystem-Led Growth Playbook 2026", item: URL_ },
      ] },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* HERO */}
      <div style={{ overflow: "hidden" }}>
        <Nav />
        <div className="wrap" style={{ padding: "24px 40px clamp(40px,8vw,90px)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 520px", maxWidth: 640 }}>
            <span className="pill">Free playbook 2026</span>
            <h1 className="h1big" style={{ marginTop: 20, fontSize: "clamp(28px,3.8vw,58px)" }}>The <span style={{ whiteSpace: "nowrap" }}>Ecosystem-Led</span> Growth Playbook</h1>
            <p style={{ margin: "22px 0 0", maxWidth: 560, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>
              How B2B marketers can drive scalable revenue through partnerships, with the KPIs that prove partner ROI.
            </p>
            <ul style={{ margin: "26px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10, fontSize: 17, fontWeight: 400 }}>
              {["Why buyers now check your ecosystem before they talk to sales", "Which partner types to build, and in what order", "A five-stage journey from first partner to measurable revenue"].map((t) => (
                <li key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span aria-hidden="true" style={{ flex: "0 0 10px", height: 10, background: "#2A2B30", marginTop: 8, clipPath: "polygon(0 0,100% 0,100% 60%,60% 100%,0 100%)" }} />{t}</li>
              ))}
            </ul>
          </div>
          <div style={{ flex: "0 1 420px", width: "100%", position: "relative" }}>
            <PlaybookForm id="download" />
          </div>
        </div>
      </div>

      {/* ANSWER-FIRST SUMMARY + STATS */}
      <section style={{ padding: "clamp(40px,9vw,84px) 0" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(22px,2.6vw,36px)", lineHeight: 1.2, maxWidth: 860 }}>Partnerships are now part of the buying decision</h2>
          <p style={{ margin: "22px 0 0", maxWidth: 820, fontSize: 19, lineHeight: 1.65, color: "#C9CACE" }}>
            The Ecosystem-Led Growth Playbook 2026 is a free guide for B2B marketing professionals. It explains how partnerships, integrations and a visible ecosystem work as a core go-to-market motion alongside product-led and sales-led growth, and how to build one step by step.
          </p>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 22 }}>
            {STATS.map(([n, t], i) => (
              <div key={n} className="cut" style={{ background: i % 2 ? "#ECECEE" : "#A8FF5C", color: "#0A0A0B", padding: "26px 26px 34px" }}>
                <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 40, lineHeight: 1 }}>{n}</div>
                <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.5 }}>{t}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: "18px 0 0", fontSize: 13, color: "#85868B" }}>Figures as reported in the playbook.</p>
        </div>
      </section>

      {/* CHAPTERS */}
      <section style={{ padding: "clamp(40px,9vw,84px) 0" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(22px,2.6vw,36px)", lineHeight: 1.2 }}>What is inside</h2>
          <p style={{ margin: "16px 0 0", maxWidth: 720, fontSize: 18, lineHeight: 1.6, color: "#2A2B2F" }}>From the why to a working plan.</p>
          <ol style={{ margin: "36px 0 0", padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
            {CHAPTERS.flatMap(([t, d], i) => {
              const card = (
                <li key={t} className="cut" style={{ background: "#ECECEE", padding: "24px 26px 34px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <span style={{ flex: "0 0 44px", height: 44, borderRadius: "50%", background: "#2A2B30", color: "#A8FF5C", fontFamily: "'Michroma',sans-serif", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 style={{ fontSize: 16, lineHeight: 1.35 }}>{t}</h3>
                    <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.55, color: "#3A3B40" }}>{d}</p>
                  </div>
                </li>
              );
              if (i !== 3) return [card];
              return [card, (
                <li key="title-card" className="cut" style={{ background: "#2A2B30", padding: "26px 28px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span className="pill" style={{ alignSelf: "flex-start", background: "#A8FF5C", color: "#0A0A0B" }}>Partner2B 2026</span>
                  <h3 style={{ marginTop: 16, fontSize: 19, lineHeight: 1.3, color: "#A8FF5C" }}>The Ecosystem-Led Growth Playbook</h3>
                  <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.55, color: "#B9BABD" }}>A practical guide to growing revenue through partnerships.</p>
                </li>
              )];
            })}
            <li className="cut" style={{ background: "#A8FF5C", color: "#0A0A0B", padding: "24px 26px 34px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18 }}>
              <div>
                <h3 style={{ fontSize: 16, lineHeight: 1.35 }}>Put partnerships to work</h3>
                <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.55, color: "#1C1D20" }}>Download the playbook and start building your ecosystem today.</p>
              </div>
              <a href="#download" className="btn btn-s btn-sm" style={{ alignSelf: "flex-start" }}>Get the free playbook</a>
            </li>
          </ol>
        </div>
      </section>

      {/* PREVIEW PAGES */}
      <section style={{ padding: "clamp(40px,9vw,84px) 0", overflow: "hidden" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(22px,2.6vw,36px)", lineHeight: 1.2 }}>A look at the pages</h2>
          <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 22 }}>
            {SHOTS.map(([src, alt, cap]) => (
              <figure key={src} style={{ margin: 0 }}>
                <Image src={src} alt={alt} width={579} height={819} sizes="(max-width: 700px) 45vw, 230px" style={{ width: "100%", height: "auto", borderRadius: 6, border: "1px solid #2F3036" }} />
                <figcaption style={{ marginTop: 10, fontSize: 14, color: "#B9BABD" }}>{cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* WHO + AUTHOR */}
      <section style={{ padding: "clamp(40px,9vw,84px) 0" }}>
        <div className="wrap" style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px" }}>
            <h2 style={{ fontSize: "clamp(22px,2.4vw,32px)", lineHeight: 1.2 }}>Who it is for</h2>
            <ul style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 16, fontSize: 18, lineHeight: 1.55 }}>
              {WHO.map((w) => (<li key={w} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}><span aria-hidden="true" style={{ flex: "0 0 12px", height: 12, background: "#A8FF5C", border: "1.5px solid #0A0A0B", marginTop: 8 }} />{w}</li>))}
            </ul>
          </div>
          <div className="cut" style={{ flex: "1 1 420px", background: "#ECECEE", padding: "30px 32px 40px" }}>
            <h2 style={{ fontSize: 20, lineHeight: 1.3 }}>Written by Elena Zap</h2>
            <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.65, color: "#2A2B2F" }}>
              Elena is the founder of Partner2B and has spent more than 17 years in B2B sales, marketing and partnerships. She wrote the playbook after seeing the same gap again and again: most companies hide their partner ecosystems behind generic partners pages that do nothing for discovery.
            </p>
            <Link href="/about-us" className="more">About Partner2B</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#ECECEE", padding: "clamp(40px,9vw,84px) 0" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(22px,2.6vw,36px)", lineHeight: 1.2 }}>Common questions</h2>
          <div style={{ marginTop: 32, maxWidth: 880 }}>
            {FAQS.map(([q, a]) => (
              <div key={q} style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 17, lineHeight: 1.4 }}>{q}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 18, lineHeight: 1.65, color: "#2A2B2F" }}>{a}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: "40px 0 0", fontSize: 17, lineHeight: 1.6 }}>
            Related: <Link href="/glossary" style={{ textDecoration: "underline" }}>partner program glossary</Link>, <Link href="/directory" style={{ textDecoration: "underline" }}>partner program directory</Link> and <Link href="/post" style={{ textDecoration: "underline" }}>the Partner2B blog</Link>.
          </p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ background: "#A8FF5C", padding: "clamp(36px,8vw,72px) 0" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "clamp(22px,2.6vw,36px)", lineHeight: 1.2, maxWidth: 720 }}>Your ecosystem is part of your value proposition. Make it impossible to ignore.</h2>
          <a href="#download" className="btn btn-s">Get the free playbook</a>
        </div>
      </section>

      <BuilderCta />
      <Footer />
    </div>
  );
}
