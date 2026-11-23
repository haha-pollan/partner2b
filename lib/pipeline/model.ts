// Partner pipeline calculator: pure funnel model. No I/O, no randomness, so it can be tested on its own.
// Every default below is a planning assumption taken from published benchmarks or from the Partner2B Program builder
// economics table (lib/builder2/economics.ts). All of them can be edited by the user.

export type PartnerType = "referral" | "technology" | "agency" | "reseller";
export type Approach = "hand" | "targeted" | "broad";

export const PARTNER_TYPES: { key: PartnerType; label: string }[] = [
  { key: "referral", label: "Referral partner" },
  { key: "technology", label: "Technology partner" },
  { key: "agency", label: "Agency or consultancy" },
  { key: "reseller", label: "Reseller or MSP" },
];

export const APPROACHES: { key: Approach; label: string; hint: string }[] = [
  { key: "hand", label: "Hand-picked and personal", hint: "A small, researched list and personal messages" },
  { key: "targeted", label: "Targeted list with sequences", hint: "A filtered list and a multi-step email sequence" },
  { key: "broad", label: "Broad and automated", hint: "A large list and automated outreach" },
];

// Rates in percent
export const APPROACH_DEFAULTS: Record<Approach, { reply: number; replyToSigned: number; activation: number }> = {
  hand: { reply: 15, replyToSigned: 30, activation: 45 },
  targeted: { reply: 5, replyToSigned: 20, activation: 35 },
  broad: { reply: 3.4, replyToSigned: 15, activation: 25 },
};

export type CompanyType = "saas" | "ai" | "cyber" | "fintech" | "enterprise";
export const COMPANY_TYPES: { key: CompanyType; label: string; deal: number; win: number; cycleWeeks: number; partner: PartnerType }[] = [
  { key: "saas", label: "B2B SaaS", deal: 25000, win: 24, cycleWeeks: 12, partner: "referral" },
  { key: "ai", label: "AI product or platform", deal: 20000, win: 24, cycleWeeks: 12, partner: "technology" },
  { key: "cyber", label: "Cybersecurity and IT infrastructure", deal: 50000, win: 20, cycleWeeks: 19, partner: "reseller" },
  { key: "fintech", label: "Fintech software", deal: 60000, win: 20, cycleWeeks: 19, partner: "referral" },
  { key: "enterprise", label: "Enterprise software", deal: 150000, win: 15, cycleWeeks: 24, partner: "agency" },
];

// Closed deals per active partner per year, conservative end of the Program builder pace table.
// Bands by deal size in USD: under 5K, 5K to 20K, 20K to 100K, above 100K.
const PACE_LOW: Record<PartnerType, [number, number, number, number]> = {
  referral: [6, 4, 2, 1],
  technology: [6, 4, 2, 1],
  agency: [8, 6, 3, 2],
  reseller: [24, 12, 6, 3],
};
const band = (usd: number) => (usd < 5000 ? 0 : usd < 20000 ? 1 : usd < 100000 ? 2 : 3);
export const defaultDealsPerPartner = (dealSize: number, partner: PartnerType) => PACE_LOW[partner][band(dealSize)];

// Partner payout as percent of deal value (Tier 1 rates from the Program builder table)
export const PAYOUT_DEFAULT: Record<PartnerType, number> = { referral: 10, technology: 5, agency: 20, reseller: 25 };

export const MIN_PAYOUT_PER_DEAL = 100; // USD, below this a partner has little reason to act
export const DEFAULT_RECRUIT_MONTHS = 3;
export const DEFAULT_WINDOW_MONTHS = 12;

export type Inputs = {
  goal: number; // new contract value to close through partners within the window
  dealSize: number;
  cycleWeeks: number;
  windowMonths: number;
  partner: PartnerType;
  winRate: number;
  dealsPerPartner: number; // closed deals per active partner per year
  activation: number;
  reply: number;
  replyToSigned: number;
  recruitMonths: number;
  existingActive: number;
  marketSize: number | null; // optional: partner companies the user can identify
  payout: number; // percent
};

export type Result = {
  ok: true;
  deals: number;
  opportunities: number;
  productiveMonths: number;
  productivePct: number;
  dealsPerPartnerInWindow: number;
  activePartners: number;
  signed: number;
  replies: number;
  reached: number;
  list: number;
  perWeek: number;
  payoutTotal: number;
  payoutPerDeal: number;
  covered: boolean; // existing partners already cover the goal
};
export type Failure = { ok: false; reason: "time" | "input"; message: string };

const pos = (n: number) => Number.isFinite(n) && n > 0;

export function compute(i: Inputs): Result | Failure {
  const rates = [i.winRate, i.activation, i.reply, i.replyToSigned];
  if (![i.goal, i.dealSize, i.windowMonths, i.recruitMonths, i.dealsPerPartner].every(pos) || !pos(i.cycleWeeks + 0.0001) || i.cycleWeeks < 0 || !rates.every((r) => pos(r) && r <= 100)) {
    return { ok: false, reason: "input", message: "Please check your numbers. Every field needs a positive value and rates must be between 0 and 100." };
  }
  const cycleMonths = (i.cycleWeeks * 7) / 30.4;
  const productive = i.windowMonths - i.recruitMonths - cycleMonths;
  if (productive <= 0) {
    return { ok: false, reason: "time", message: "With this sales cycle and this recruiting time, no deal can close inside your window. Extend the window or shorten the cycle." };
  }
  const deals = Math.ceil(i.goal / i.dealSize);
  const opportunities = Math.ceil(deals / (i.winRate / 100));
  const per = (i.dealsPerPartner * productive) / 12;
  const activeGross = Math.ceil(deals / per);
  const activePartners = Math.max(0, activeGross - Math.max(0, Math.floor(i.existingActive || 0)));
  const signed = Math.ceil(activePartners / (i.activation / 100));
  const replies = Math.ceil(signed / (i.replyToSigned / 100));
  const reached = Math.ceil(replies / (i.reply / 100));
  // The list is the set of companies that match the ideal partner profile and are contacted
  const list = reached;
  const weeks = Math.max(1, i.recruitMonths * 4.33);
  return {
    ok: true,
    deals,
    opportunities,
    productiveMonths: productive,
    productivePct: (productive / i.windowMonths) * 100,
    dealsPerPartnerInWindow: per,
    activePartners,
    signed,
    replies,
    reached,
    list,
    perWeek: Math.ceil(reached / weeks),
    payoutTotal: (i.goal * i.payout) / 100,
    payoutPerDeal: (i.dealSize * i.payout) / 100,
    covered: activePartners === 0,
  };
}

export type Lever = { text: string; from: number; to: number };

// The single change that cuts the initial list the most, out of three plain levers.
export function biggestLever(i: Inputs, base: Result): Lever | null {
  if (!base.ok || base.list === 0) return null;
  const cands: Lever[] = [];
  const tryRun = (patch: Partial<Inputs>, text: string) => {
    const r = compute({ ...i, ...patch });
    if (r.ok && r.list < base.list) cands.push({ text, from: base.list, to: r.list });
  };
  const a2 = Math.min(90, i.activation + 15);
  if (a2 > i.activation) tryRun({ activation: a2 }, `Raising activation from ${trim(i.activation)}% to ${trim(a2)}%`);
  tryRun({ windowMonths: i.windowMonths + 6 }, `Extending the window from ${trim(i.windowMonths)} to ${trim(i.windowMonths + 6)} months`);
  const p2 = Math.max(i.dealsPerPartner + 1, Math.round(i.dealsPerPartner * 1.5 * 10) / 10);
  tryRun({ dealsPerPartner: p2 }, `If each partner closed ${trim(p2)} deals a year instead of ${trim(i.dealsPerPartner)}`);
  if (!cands.length) return null;
  return cands.sort((a, b) => a.to / a.from - b.to / b.from)[0];
}

export const trim = (n: number) => String(Math.round(n * 100) / 100);
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export type Band = "small" | "medium" | "large";
export const listBand = (list: number): Band => (list < 500 ? "small" : list <= 5000 ? "medium" : "large");

// Coarse buckets for analytics so no exact figure leaves the page
export const bucket = (n: number, edges: number[]) => {
  for (let k = 0; k < edges.length; k++) if (n < edges[k]) return `lt_${edges[k]}`;
  return `gte_${edges[edges.length - 1]}`;
};
