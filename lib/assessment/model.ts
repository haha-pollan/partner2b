// Partner program assessment: questions, scoring and the link format.
// Everything here is plain data and pure functions, so the page, the result and the PDF all use the same numbers.

export type AreaKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type Area = {
  key: AreaKey;
  name: string;
  statements: [string, string];
  why: string;
  fix: string;
  tool: { name: string; href?: string; live: boolean; line: string };
};

// Lifecycle order. Also the last tie-break when two areas score the same.
export const AREAS: Area[] = [
  {
    key: "A", name: "Fit",
    statements: [
      "We have a written profile of the partner we want",
      "We chose our partner types on purpose and treat each type differently",
    ],
    why: "You are not sure which partners are right for you, so you sign companies that never sell for you.",
    fix: "Write down the partner you want on one page: who they are, who they serve and why they would want you.",
    tool: { name: "Partner discovery", live: false, line: "Find partners that fit your profile" },
  },
  {
    key: "B", name: "Offer",
    statements: [
      "We can say in our own words what a partner gains beyond commission",
      "Our offer helps partners grow their own business, not only promote ours",
    ],
    why: "Partners see a commission and little else. Every partner is looking to grow their own business, not to promote someone else's.",
    fix: "Say what a partner gains beyond commission in one sentence, and check that it helps them grow.",
    tool: { name: "Value proposition builder", live: false, line: "Build a clear offer for each partner type" },
  },
  {
    key: "C", name: "Economics",
    statements: [
      "Partner earnings are worth the partner's effort at our deal size and sales cycle",
      "Partners get something before the first deal closes, such as leads, margin on services or a fee for an intro",
    ],
    why: "Earnings do not match the effort. Partners wait months for a first payout and drift away.",
    fix: "Give partners something before the first deal closes: leads, margin on services or a fee for each intro.",
    tool: { name: "Tier and commission designer", live: false, line: "Design tiers and earnings partners want" },
  },
  {
    key: "D", name: "Attracting partners",
    statements: [
      "We actively promote the program to the partners we want, not only wait for applications",
      "We have enough partner conversations each month to meet our goal",
    ],
    why: "You wait for partners to apply instead of inviting the ones you want. Good partners are busy and are rarely looking for your program.",
    fix: "Pick 20 partners you would love to have and reach out to each personally, starting this week.",
    tool: { name: "Partner pipeline calculator", href: "/partner-pipeline-calculator", live: true, line: "See how many partner conversations you need each month" },
  },
  {
    key: "E", name: "Onboarding",
    statements: [
      "New partners get a clear plan for their first 30 to 90 days",
      "Most new partners bring a first lead or deal within a quarter",
    ],
    why: "New partners get no clear first 90 days, so most of them never bring a first lead.",
    fix: "Write a 30 to 90 day plan with one clear first lead goal for every new partner.",
    tool: { name: "Onboarding kit", live: false, line: "Build your first 90 day plan for new partners" },
  },
  {
    key: "F", name: "Marketing and enablement",
    statements: [
      "Partners get a ready pitch, answers to objections and proof they can send",
      "We promote our partners, for example by featuring them, co-marketing and introducing them to customers",
    ],
    why: "Partners do not have what they need to sell for you, and they do not feel promoted by you.",
    fix: "Build one ready pitch with objection answers and proof, and feature your best partners where customers see them.",
    tool: { name: "Partner marketing plan", live: false, line: "Plan how to promote your program and your partners" },
  },
  {
    key: "G", name: "Co-selling",
    statements: [
      "We work deals together with partners: account mapping, intros and joint calls",
      "Our own sales team knows the partner rules and does not compete with partners",
    ],
    why: "Deals stall because partners and your own sales team do not work them together.",
    fix: "Agree the rules with your own sales team in writing: who owns the deal, who introduces whom and how partners are credited.",
    tool: { name: "Partnership strategy session", href: "/contact", live: true, line: "Turn this result into a plan with us" },
  },
  {
    key: "H", name: "Operations and tracking",
    statements: [
      "One named person owns the program and has time for it",
      "We can see the revenue partners source and influence, and our goals are about revenue, not partners signed",
    ],
    why: "Nobody owns the program and you cannot see what partners bring, so problems stay hidden.",
    fix: "Name one owner with time set aside, and track revenue from partners, not only partners signed.",
    tool: { name: "Partner scorecard", live: false, line: "Track what your partners really bring" },
  },
];

export const ANSWERS = [
  { v: 2, label: "Yes", sub: "It exists and partners use it" },
  { v: 1, label: "Partly", sub: "Some of it, or not kept up" },
  { v: 0, label: "No", sub: "Not yet" },
] as const;

// Problems the person picks (up to two). Each points at three areas, strongest first.
export const SYMPTOMS: { key: string; label: string; areas: AreaKey[] }[] = [
  { key: "few", label: "Too few partners join", areas: ["D", "B", "A"] },
  { key: "silent", label: "Partners join but stay silent", areas: ["E", "F", "B"] },
  { key: "leads", label: "Partners bring leads but few deals close", areas: ["F", "G", "A"] },
  { key: "small", label: "Deals are small or slow", areas: ["A", "C", "F"] },
  { key: "leave", label: "Partners leave or fade away", areas: ["C", "B", "H"] },
  { key: "unsure", label: "I am not sure", areas: [] },
];
export const MAX_SYMPTOMS = 2;

export const AGE = ["Not launched", "Under 6 months", "6 to 18 months", "Over 18 months"];
export const OWNER = ["Nobody", "Part time", "One full time", "A team"];
export const TYPES: { key: string; label: string }[] = [
  { key: "referral", label: "Referral" },
  { key: "reseller", label: "Reseller" },
  { key: "agency", label: "Agency" },
  { key: "technology", label: "Technology" },
  { key: "other", label: "Other" },
];
export const ACTIVE = ["None", "1 to 5", "6 to 20", "21 to 50", "Over 50"];

export type Band = "critical" | "work" | "solid";
export const bandOf = (score: number): Band => (score <= 1 ? "critical" : score <= 3 ? "work" : "solid");
export const BAND_LABEL: Record<Band, string> = { critical: "Critical gap", work: "Needs work", solid: "Solid" };

export type Raw = {
  symptoms: string[];   // keys from SYMPTOMS
  age: number;          // index into AGE
  owner: number;        // index into OWNER
  types: string[];      // keys from TYPES
  active: number;       // index into ACTIVE
  answers: number[];    // 16 values, 0 to 2, in AREAS order, two per area
};

export type Result = {
  scores: Record<AreaKey, number>;
  total: number;
  percent: number;
  bottlenecks: AreaKey[];   // up to two, only areas scoring 2 or less
  weakest: AreaKey;         // used when nothing scores 2 or less
  notes: string[];
};

const AREA_KEYS = AREAS.map((a) => a.key);
const DEAL_PROBLEMS = ["leads", "small"];

export function compute(raw: Raw): Result {
  const scores = {} as Record<AreaKey, number>;
  AREAS.forEach((a, i) => { scores[a.key] = (raw.answers[i * 2] ?? 0) + (raw.answers[i * 2 + 1] ?? 0); });
  const total = AREA_KEYS.reduce((s, k) => s + scores[k], 0);

  // How many of the picked problems point at each area
  const pull: Record<string, number> = {};
  for (const s of raw.symptoms) {
    const sym = SYMPTOMS.find((x) => x.key === s);
    sym?.areas.forEach((k) => { pull[k] = (pull[k] ?? 0) + 1; });
  }
  // Lowest score first, then the area more picked problems point to, then lifecycle order
  const ranked = [...AREA_KEYS].sort((a, b) => scores[a] - scores[b] || (pull[b] ?? 0) - (pull[a] ?? 0) || AREA_KEYS.indexOf(a) - AREA_KEYS.indexOf(b));
  const bottlenecks = ranked.filter((k) => scores[k] <= 2).slice(0, 2);

  const notes: string[] = [];
  const newish = raw.age <= 1;
  if (newish && raw.symptoms.some((s) => DEAL_PROBLEMS.includes(s))) {
    notes.push("Your program is still young. Partner revenue usually takes several months to show, so judge progress on conversations and first leads.");
  }
  if (raw.owner === 0) {
    notes.push("Nobody runs the program today. Programs rarely grow without one named owner, even a part time one.");
  }
  return { scores, total, percent: Math.round((total / 32) * 100), bottlenecks, weakest: ranked[0], notes };
}

export function headline(percent: number): string {
  if (percent < 35) return "Your program has big gaps to close";
  if (percent < 60) return "Your program is half way there";
  if (percent < 80) return "Your program is in good shape";
  return "Your program is strong";
}

export function summaryLine(r: Result): string {
  if (r.bottlenecks.length === 0) return "No major gap. Your weakest area is still worth a look";
  if (r.bottlenecks.length === 1) return "One gap is slowing you down, and it is fixable this month";
  return "Two gaps are slowing you down. Fix these in order and partners start to bring deals";
}

export const areaOf = (k: AreaKey) => AREAS.find((a) => a.key === k)!;

// ---- Link format. No names or emails, only the answers ----
export function toQuery(raw: Raw): string {
  const q = new URLSearchParams();
  q.set("s", raw.symptoms.join(",") || "unsure");
  q.set("g", String(raw.age)); q.set("o", String(raw.owner)); q.set("n", String(raw.active));
  q.set("t", raw.types.join(",") || "other");
  q.set("a", raw.answers.join(""));
  return q.toString();
}

export function fromQuery(q: URLSearchParams): Raw | null {
  const a = q.get("a") ?? "";
  if (!/^[012]{16}$/.test(a)) return null;
  const idx = (k: string, len: number) => { const v = Number(q.get(k)); return Number.isInteger(v) && v >= 0 && v < len ? v : 0; };
  const symptoms = (q.get("s") ?? "").split(",").filter((s) => SYMPTOMS.some((x) => x.key === s)).slice(0, MAX_SYMPTOMS);
  const types = (q.get("t") ?? "").split(",").filter((s) => TYPES.some((x) => x.key === s)).slice(0, TYPES.length);
  return { symptoms, age: idx("g", AGE.length), owner: idx("o", OWNER.length), active: idx("n", ACTIVE.length), types, answers: a.split("").map(Number) };
}
