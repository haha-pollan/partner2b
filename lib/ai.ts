import type { Program } from "@/lib/programs";

export type AiCat = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  who: string;
  what: string;
};

export const AI_CATEGORIES: AiCat[] = [
  {
    slug: "foundation-models", name: "Foundation models and APIs", short: "Model providers that open their platforms to partners",
    intro: "Foundation model providers sell access to large language and multimodal models through APIs and enterprise platforms. Their partner programs are built for the firms that implement those models inside real businesses.",
    who: "systems integrators, consultancies, technology vendors and referral partners",
    what: "AI model and API providers",
  },
  {
    slug: "agents", name: "AI agents and automation", short: "Agent platforms with agency, reseller and referral programs",
    intro: "Agent and automation platforms let teams build AI workers that act across business systems. Most run partner programs for agencies and builders who deploy agents for clients, often with referral revenue and certification.",
    who: "AI agencies, automation consultants, builders and resellers",
    what: "AI agent and automation platforms",
  },
  {
    slug: "infrastructure", name: "AI infrastructure and MLOps", short: "Platforms for building, training and running AI",
    intro: "AI infrastructure and MLOps vendors cover the platforms used to build, train, deploy and monitor models. Their partners are usually data and AI consultancies, cloud providers and integrators.",
    who: "data and AI consultancies, cloud partners and systems integrators",
    what: "AI infrastructure and MLOps platforms",
  },
  {
    slug: "vector-databases", name: "Vector databases and data for AI", short: "Retrieval and data layers behind AI applications",
    intro: "Vector databases and data tools give AI applications their memory and retrieval. Partner programs here tend to favor technology integrations, services partners and developer-led referrals.",
    who: "technology partners, services firms and referral partners",
    what: "vector database and AI data vendors",
  },
  {
    slug: "security", name: "AI security and governance", short: "Protecting and governing models, agents and data",
    intro: "AI security and governance vendors protect models and agents from attack and help companies meet new rules on responsible AI. Their programs typically serve security resellers, consultancies and managed service providers.",
    who: "security resellers, GRC and audit firms, consultancies and MSPs",
    what: "AI security and governance vendors",
  },
  {
    slug: "integrators", name: "AI integrators and consultancies", short: "AI services firms with public alliance or partner pages",
    intro: "AI integrators and consultancies deliver AI projects for enterprises. Only firms with an official partner or alliance page are listed, so this category shows who they build with and how to approach them.",
    who: "technology vendors looking for delivery and co-selling partners",
    what: "AI services firms with public alliance pages",
  },
  {
    slug: "conversational", name: "Conversational and voice AI", short: "Voice and chat agents for customer conversations",
    intro: "Conversational and voice AI vendors power chat and phone agents for customer service and sales. Their partner programs often reward agencies, contact center integrators and CRM partners.",
    who: "contact center integrators, agencies and CRM partners",
    what: "conversational and voice AI platforms",
  },
];

export const catBySlug = (s: string) => AI_CATEGORIES.find((c) => c.slug === s);
export const aiNames = AI_CATEGORIES.map((c) => c.name);
export const inCat = (all: Program[], c: AiCat) => all.filter((p) => p.product_category === c.name);

// AI-native vendors that sit in a non-AI product category (HR, sales, security and so on)
export const AI_EXTRA_SLUGS = new Set([
  "eightfold-ai", "seekout", "findem", "hrflow-ai", "humanly", "hireez", "hirevue", "phenom", "leena-ai", "juicebox", "metaview",
  "nooks", "zowie", "pactum", "landbase", "shift-technology", "workfusion", "dropzone-ai", "skan-ai", "atomicwork", "testmu-ai",
  "beamery", "gloat", "prophet-security", "silent-eight", "uptiq", "orum", "lemlist",
  "darktrace", "vectra-ai", "deep-instinct", "horizon3-ai", "cyera", "linx-security", "lumos",
  "applitools", "coveo",
]);
export const isAi = (p: Program) => aiNames.includes(p.product_category) || AI_EXTRA_SLUGS.has(p.slug);
export const aiOnly = (all: Program[]) => all.filter(isAi);

export const AI_LAUNCH = Date.UTC(2026, 10, 21);
export const aiIsNew = () => Date.now() - AI_LAUNCH < 60 * 86400000;

const hasPaid = (p: Program) => p.commission_models.some((m) => m !== "Not published");

export function facts(list: Program[], c: AiCat) {
  const n = list.length;
  const referral = list.filter((p) => p.commission_models.includes("Referral fee")).length;
  const paid = list.filter(hasPaid).length;
  const tiered = list.filter((p) => p.tiers.length > 0).length;
  const types: Record<string, number> = {};
  list.forEach((p) => p.program_types.forEach((t) => (types[t] = (types[t] ?? 0) + 1)));
  const topTypes = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const lines: string[] = [];
  if (n) {
    lines.push(`${referral} of ${n} ${c.what} publish a referral fee.`);
    lines.push(`${paid} of ${n} publish at least one commission model.`);
    lines.push(`${tiered} of ${n} publish partner tiers.`);
    if (topTypes.length) lines.push(`The most common program types are ${topTypes.map(([t, k]) => `${t.toLowerCase()} (${k})`).join(", ")}.`);
  }
  return { n, referral, paid, tiered, topTypes, lines };
}

export function faqs(list: Program[], c: AiCat) {
  const f = facts(list, c);
  const nm = c.name.replace(/^(?!AI )(\w)/, (m) => m.toLowerCase());
  const names = list.slice(0, 5).map((p) => p.company).join(", ");
  return [
    { q: `What are ${nm} partner programs?`, a: `${c.intro} Partner2B lists ${f.n} official programs in this category, each linking to the vendor's own page.` },
    { q: `Which ${nm} companies have a partner program?`, a: f.n ? `Partner2B currently lists ${f.n}, including ${names}. Every listing links to the official program page.` : `No programs are listed in this category yet.` },
    { q: `Do ${c.what} pay partners?`, a: f.n ? `${f.referral} of ${f.n} publish a referral fee, and ${f.paid} publish at least one commission model. Many programs do not publish rates, so check each official page for current terms.` : `No data yet.` },
    { q: `Who can join these programs?`, a: `Programs in this category are aimed at ${c.who}. Requirements and tiers vary, and each listing shows what the vendor publishes.` },
    { q: `How does Partner2B choose what to list?`, a: `Only official partner program pages are listed. Each entry links to the vendor's own page, and the information comes from that public page.` },
  ];
}
