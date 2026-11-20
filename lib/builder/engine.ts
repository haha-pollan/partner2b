import type { Program } from "@/lib/programs";
import { TYPES } from "@/lib/formsConfig";
import {
  GOALS, AUDIENCES, SIZES, STAGES, REGIONS, BUILDER_CATEGORIES, OTHER, TYPE_ROLES, ARCHETYPES, AUDIENCE_ARCHETYPE,
  CATEGORY_TYPE_BIAS, groupOf,
} from "./config";

export type BuilderInput = {
  url: string; category: string; goal: string; goal2: string; audience: string; size: string; stage: string; region: string;
};
export type Site = { domain: string; name: string; description: string; keywords: string[] };

export type Benchmark = {
  slug: string; company: string; note: string; category: string; types: string[]; commission: string; tags: string[]; url: string; why: string;
};
export type Result = {
  company: { name: string; domain: string; description: string };
  input: BuilderInput;
  ipp: { summary: string; partnerTypes: { type: string; title: string; who: string; earns: string; need: string }[]; archetypes: string[] };
  program: {
    name: string; model: string;
    tiers: { name: string; criteria: string; benefits: string[] }[];
    economics: { title: string; guidance: string }[];
    insight: string[];
    terms: string[];
  };
  enablement: string[];
  plan: { phase: string; weeks: string; actions: string[] }[];
  kpis: string[];
  benchmarks: Benchmark[];
  notes: string[];
};

const has = (list: string[], v: string) => list.includes(v);
const joinList = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : a[0] ?? "");

export function parseInput(raw: Record<string, unknown>): { ok: true; input: BuilderInput } | { ok: false; error: string } {
  const s = (k: string) => String(raw[k] ?? "").trim();
  let url = s("url");
  if (!url) return { ok: false, error: "Please enter your company website." };
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let host = "";
  try { host = new globalThis.URL(url).hostname.toLowerCase(); } catch { return { ok: false, error: "That website address does not look right." }; }
  if (!host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":") || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal"))
    return { ok: false, error: "Please enter your public company website, for example yourcompany.com." };
  const input: BuilderInput = { url, category: s("category"), goal: s("goal"), goal2: s("goal2"), audience: s("audience"), size: s("size"), stage: s("stage"), region: s("region") };
  if (!has(BUILDER_CATEGORIES, input.category)) return { ok: false, error: "Please choose your product category." };
  if (!GOALS.some((g) => g.id === input.goal)) return { ok: false, error: "Please choose your main goal." };
  if (input.goal2 && (!GOALS.some((g) => g.id === input.goal2) || input.goal2 === input.goal)) input.goal2 = "";
  if (!has(AUDIENCES, input.audience)) return { ok: false, error: "Please choose who you sell to." };
  if (!has(SIZES, input.size)) return { ok: false, error: "Please choose your company size." };
  if (!has(STAGES, input.stage)) return { ok: false, error: "Please choose your partner program stage." };
  if (!has(REGIONS, input.region)) return { ok: false, error: "Please choose your main region." };
  return { ok: true, input };
}

function recommendedTypes(i: BuilderInput) {
  const group = groupOf(i.category);
  const w: Record<string, number> = {};
  const add = (t: string, n: number) => { w[t] = (w[t] ?? 0) + n; };
  const g1 = GOALS.find((g) => g.id === i.goal)!;
  Object.entries(g1.types).forEach(([t, n]) => add(t, n));
  const g2 = GOALS.find((g) => g.id === i.goal2);
  if (g2) Object.entries(g2.types).forEach(([t, n]) => add(t, n * 0.5));
  Object.entries(CATEGORY_TYPE_BIAS[i.category] ?? {}).forEach(([t, n]) => add(t, n));
  if (i.audience === "Large enterprises") add("Services", 1);
  if (i.audience === "Small businesses") { add("Referral", 1); if (group === "infra") add("MSP", 1); }
  if (i.stage === "No partner program yet") add("Referral", 1);
  return Object.entries(w).filter(([t]) => TYPES.includes(t)).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

const STOP = new Set("with that this from your their have more than into about which what when where will also they them been were over such only other these those platform software solution solutions company business customers teams team help helps using used make makes built".split(" "));
const tokens = (t: string) => Array.from(new Set((t.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((x) => !STOP.has(x))));

export function siteKeywords(name: string, description: string) { return tokens(`${name} ${description}`).slice(0, 40); }

const topCount = (items: string[][], n: number) => {
  const c: Record<string, number> = {};
  items.forEach((l) => new Set(l).forEach((x) => { c[x] = (c[x] ?? 0) + 1; }));
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n);
};

export function generate(input: BuilderInput, site: Site, all: Program[]): Result {
  const goal = GOALS.find((g) => g.id === input.goal)!;
  const goal2 = GOALS.find((g) => g.id === input.goal2);
  const rec = recommendedTypes(input);
  const recTypes = rec.map(([t]) => t);
  const recWeight = Object.fromEntries(rec);
  const group = groupOf(input.category);
  const goalFeatures = Array.from(new Set([...goal.features, ...(goal2?.features ?? [])]));

  // Ideal partner profile first: only programs that run at least one recommended partner type are eligible.
  const scored = all
    .filter((p) => p.domain !== site.domain && !(p.program_url || "").includes(site.domain))
    .map((p) => {
      const matched = p.program_types.filter((t) => recTypes.includes(t));
      if (!matched.length) return null;
      let score = matched.reduce((a, t) => a + (recWeight[t] ?? 0) * 4, 0);
      const sameCat = p.product_category === input.category;
      const sameGroup = !sameCat && !!group && groupOf(p.product_category) === group;
      score += sameCat ? 30 : sameGroup ? 12 : 0;
      const feats = goalFeatures.filter((f) => p.feature_tags.includes(f));
      score += Math.min(feats.length, 3) * 3;
      const hay = `${p.description ?? ""} ${p.company_description ?? ""} ${p.product_category}`.toLowerCase();
      score += Math.min(site.keywords.filter((k) => hay.includes(k)).length, 6);
      if (input.stage === "No partner program yet" && p.tiers.length > 0 && p.tiers.length <= 3) score += 2;
      if (input.stage !== "No partner program yet" && p.tiers.length >= 3) score += 2;
      if (p.verification_status === "verified") score += 2;
      return { p, matched, sameCat, sameGroup, feats, score };
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
    .sort((a, b) => b.score - a.score || a.p.company.localeCompare(b.p.company));

  const picked: typeof scored = [];
  const perType: Record<string, number> = {};
  let sameCatCount = 0;
  const perCompany: Record<string, number> = {};
  const take = (x: (typeof scored)[number]) => { if (x.sameCat) sameCatCount += 1; picked.push(x); perType[x.p.primary_type] = (perType[x.p.primary_type] ?? 0) + 1; perCompany[x.p.company] = 1; };
  // Make sure each of the top two recommended types is represented when the database has it.
  for (const t of recTypes.slice(0, 2)) {
    const x = scored.find((s) => s.matched.includes(t) && !perCompany[s.p.company]);
    if (x && picked.length < 10) take(x);
  }
  for (const x of scored) {
    if (picked.length >= 10) break;
    if (perCompany[x.p.company]) continue;
    if ((perType[x.p.primary_type] ?? 0) >= 5) continue;
    if (x.sameCat && sameCatCount >= 7) continue;
    take(x);
  }
  for (const x of scored) { if (picked.length >= 10) break; if (!perCompany[x.p.company]) take(x); }
  picked.sort((a, b) => b.score - a.score);

  const benchmarks: Benchmark[] = picked.map((x) => {
    const p = x.p;
    const comm = p.commission_models.filter((c) => c !== "Not published");
    const parts = [
      x.sameCat ? `Same category: ${p.product_category}.` : x.sameGroup ? `Adjacent category: ${p.product_category}.` : `Category: ${p.product_category}.`,
      `Runs ${joinList(x.matched)} partnerships, which match your ideal partner profile.`,
    ];
    if (x.feats.length) parts.push(`Offers ${x.feats.slice(0, 2).join(" and ").toLowerCase()}.`);
    if (comm.length) parts.push(`Commercial model: ${comm.join(", ").toLowerCase()}.`);
    return { slug: p.slug, company: p.company, note: p.product_note ?? "", category: p.product_category, types: p.program_types, commission: comm.join(", ") || "Not published", tags: p.feature_tags, url: p.program_url, why: parts.join(" ") };
  });

  const partnerTypes = rec.map(([t]) => ({ type: t, title: TYPE_ROLES[t].title, who: TYPE_ROLES[t].who, earns: TYPE_ROLES[t].earns, need: TYPE_ROLES[t].need }));
  const archetypes = [...(ARCHETYPES[input.category] ?? ARCHETYPES[OTHER])];
  if (AUDIENCE_ARCHETYPE[input.audience]) archetypes.push(AUDIENCE_ARCHETYPE[input.audience]);

  const name = site.name || site.domain;
  const typeTitles = rec.map(([t]) => TYPE_ROLES[t].short);
  const summary = `${name} sells ${input.category === OTHER ? "software" : `in the ${input.category} category`} to ${input.audience.toLowerCase()}. To ${goal.label.charAt(0).toLowerCase() + goal.label.slice(1)}${goal2 ? ` and ${goal2.label.charAt(0).toLowerCase() + goal2.label.slice(1)}` : ""}, the partners that fit best are ${joinList(typeTitles)}.`;

  // Program structure
  const threeTiers = input.stage !== "No partner program yet" || input.size === "201 to 1,000 employees" || input.size === "More than 1,000 employees";
  const refOrRes = recTypes.some((t) => t === "Referral" || t === "Reseller" || t === "MSP");
  const tiers = [
    { name: "Registered", criteria: "Open to any partner that signs the terms and completes onboarding.",
      benefits: ["Listing in your partner directory", "Sales and product training", "Partner page and brand assets", ...(refOrRes ? ["Deal registration so introduced leads are protected"] : []), ...(recTypes.includes("Technology") ? ["Integration documentation and sandbox access"] : [])] },
    ...(threeTiers ? [{ name: "Select", criteria: "Certified staff and the first closed deals. Suggested starting point: two certified people and two closed deals in 12 months. Adjust after your first ten partners.",
      benefits: ["Everything in Registered", "A named contact on your team", "Co-marketing support for joint campaigns", "Priority access to sales engineers"] }] : []),
    { name: "Premier", criteria: "Proven revenue and a joint plan. Invite or application, reviewed once a year.",
      benefits: ["Everything in the tier below", "A joint business plan and quarterly reviews", "Best commission or discount rate", "Early access to product news and roadmap", "Joint events and case studies"] },
  ];
  const economics = recTypes.map((t) => ({ title: TYPE_ROLES[t].title, guidance: TYPE_ROLES[t].economics }));
  const model = `A ${tiers.length}-tier program built around ${joinList(typeTitles)}, starting with a small pilot cohort before opening to everyone.`;

  const n = benchmarks.length;
  const commCounts = topCount(picked.map((x) => x.p.commission_models.filter((c) => c !== "Not published")), 3);
  const tagCounts = topCount(picked.map((x) => x.p.feature_tags), 4);
  const tierCounts = picked.map((x) => x.p.tiers.length).filter((c) => c > 0);
  const insight: string[] = [];
  if (n) {
    const phrase: Record<string, string> = { "Discount on resale": "give partners a discount on resale", "Referral fee": "pay partners a referral fee", "Revenue share": "share revenue with partners" };
    commCounts.forEach(([m, c]) => insight.push(`${c} of the ${n} benchmark programs ${phrase[m] ?? "use " + m.toLowerCase()}.`));
    if (tagCounts.length) insight.push(`The most common program features among them are ${tagCounts.map(([t]) => t.toLowerCase()).join(", ")}.`);
    if (tierCounts.length) {
      const avg = tierCounts.reduce((a, b) => a + b, 0) / tierCounts.length;
      insight.push(`Programs in this group that publish their tiers use ${Math.round(avg)} tiers on average.`);
    }
  }

  const terms = [
    "One page of partner terms in plain language: what partners can do, what they earn, when they are paid",
    "Deal ownership rules: how long an introduced lead is protected and what happens when two partners claim the same deal",
    "Brand and messaging rules for how partners describe your product",
    "A way to remove inactive partners after twelve months without activity",
  ];

  const kit = ["Partner one-pager that explains the program in two minutes", "Ideal partner profile and a short pitch for each partner type", "Product overview and objection handling for partner sales teams", "Onboarding checklist for the first 30 days", "Co-marketing playbook with ready-to-use templates"];
  recTypes.forEach((t) => kit.push(...TYPE_ROLES[t].kit));

  const plan = [
    { phase: "Define", weeks: "Weeks 1 to 2", actions: ["Confirm the ideal partner profile and the first two partner types to recruit", "Set the economics for each partner type using the benchmark programs", "Write the one-page partner terms", goal.action] },
    { phase: "Build", weeks: "Weeks 3 to 4", actions: ["Create the partner page on your website and a listing in the Partner2B Directory", "Build the tier structure and the onboarding path", "Prepare the enablement kit", ...(goal2 ? [goal2.action] : [])] },
    { phase: "Recruit a pilot cohort", weeks: "Weeks 5 to 8", actions: ["List 50 target partners from the partner archetypes in this report", "Run personal outreach and book calls", "Sign five to ten pilot partners and onboard each one personally"] },
    { phase: "Activate and learn", weeks: "Weeks 9 to 12", actions: ["Run a first joint campaign or webinar with the most active partners", "Review every partner deal and fix what slows partners down", "Adjust terms and tiers, then open the program publicly"] },
  ];

  const kpis = [...goal.kpis, ...(goal2 ? goal2.kpis.slice(0, 1) : []), "Partners signed and partners active in the last 90 days"];

  const notes = [
    "This report is generated from your answers and from the Partner2B Directory. Treat the economics ranges as starting points and validate them against your margins.",
    ...(input.stage === "No partner program yet" ? ["With no program yet, start with one partner type and a small pilot. A program that is easy to explain recruits faster."] : []),
    ...(input.region !== "Global" ? [`Prioritize partners with a local presence in ${input.region}.`] : []),
  ];

  return {
    company: { name, domain: site.domain, description: site.description },
    input,
    ipp: { summary, partnerTypes, archetypes },
    program: { name: `${name} Partner Program`, model, tiers, economics, insight, terms },
    enablement: kit, plan, kpis, benchmarks, notes,
  };
}

export type Teaser = Pick<Result, "company" | "ipp" | "input"> & { model: string; tierNames: string[]; benchmarkCount: number; benchmarkPreview: { company: string; category: string }[] };
export function teaser(r: Result): Teaser {
  return { company: r.company, input: r.input, ipp: r.ipp, model: r.program.model, tierNames: r.program.tiers.map((t) => t.name), benchmarkCount: r.benchmarks.length,
    benchmarkPreview: r.benchmarks.slice(0, 3).map((b) => ({ company: b.company, category: b.category })) };
}
