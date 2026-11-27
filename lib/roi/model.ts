// Partner ROI calculator: pure model. No I/O, no randomness.
// It answers one question: what does a partner program return for what it costs, and when does it pay back.
// Return is the first-year contract value of deals closed through partners. Cost is the program spend plus partner commission.
import { PAYOUT_DEFAULT, defaultDealsPerPartner, type PartnerType } from "@/lib/pipeline/model";

export { PARTNER_TYPES, type PartnerType } from "@/lib/pipeline/model";

export const DEFAULT_DEAL = 25000;
export const DEFAULT_CYCLE_WEEKS = 12;
export const DEFAULT_HORIZON = 12;
export const HORIZONS = [12, 24] as const;
export const MAX_PAYBACK_MONTHS = 60;

export const defaultsFor = (partner: PartnerType, deal: number) => ({
  dealsPerPartner: defaultDealsPerPartner(deal > 0 ? deal : DEFAULT_DEAL, partner),
  commission: PAYOUT_DEFAULT[partner],
});

export type RoiInputs = {
  partner: PartnerType;
  dealSize: number; // average first-year contract value, USD
  partners: number; // active partners
  dealsPerPartner: number; // closed deals per active partner per year
  commission: number; // percent of deal value paid to the partner
  monthlyCost: number; // team, tools, enablement and partner marketing, USD a month
  cycleWeeks: number;
  horizon: number; // months
  compareCac: number | null; // optional: cost per customer from other channels, USD
};

export type Row = { month: number; cost: number; revenue: number; net: number };

export type RoiResult = {
  ok: true;
  deals: number;
  revenue: number;
  commissionTotal: number;
  programCost: number;
  totalCost: number;
  net: number;
  roi: number; // percent
  payback: number | null; // month, rounded up; null when it does not pay back within five years
  paybackExact: number | null;
  firstDeal: number; // month of the first closed deal
  dealsPerPartnerInWindow: number;
  costPerCustomer: number;
  rows: Row[];
};
export type RoiFailure = { ok: false; reason: "time" | "input"; message: string };

const pos = (n: number) => Number.isFinite(n) && n > 0;
const MONTH = 30.4;

export function compute(i: RoiInputs): RoiResult | RoiFailure {
  if (![i.dealSize, i.partners, i.dealsPerPartner, i.monthlyCost, i.horizon].every(pos) || !Number.isFinite(i.cycleWeeks) || i.cycleWeeks < 0 || !Number.isFinite(i.commission) || i.commission < 0 || i.commission >= 100) {
    return { ok: false, reason: "input", message: "Please check your numbers. Every field needs a positive value and the commission must be between 0 and 99." };
  }
  const cycleM = (i.cycleWeeks * 7) / MONTH;
  if (i.horizon <= cycleM) {
    return { ok: false, reason: "time", message: "With this sales cycle, no partner deal can close inside your time window. Extend the window or shorten the cycle." };
  }
  const k = (i.partners * i.dealsPerPartner) / 12; // deals a month once partners are producing
  const at = (m: number): Row => {
    const deals = k * Math.max(0, m - cycleM);
    const revenue = deals * i.dealSize;
    const cost = i.monthlyCost * m + revenue * (i.commission / 100);
    return { month: m, cost, revenue, net: revenue - cost };
  };
  const rows: Row[] = [];
  for (let m = 1; m <= i.horizon; m++) rows.push(at(m));
  const end = at(i.horizon);
  const deals = k * (i.horizon - cycleM);
  const perDealNet = i.dealSize * (1 - i.commission / 100);
  const slope = perDealNet * k - i.monthlyCost;
  const exact = slope > 0 ? (perDealNet * k * cycleM) / slope : null;
  const paybackExact = exact !== null && exact <= MAX_PAYBACK_MONTHS ? exact : null;
  const programCost = i.monthlyCost * i.horizon;
  return {
    ok: true,
    deals, revenue: end.revenue, commissionTotal: end.revenue * (i.commission / 100), programCost, totalCost: end.cost,
    net: end.net, roi: (end.net / end.cost) * 100,
    payback: paybackExact === null ? null : Math.max(1, Math.ceil(paybackExact)), paybackExact,
    firstDeal: Math.min(i.horizon, Math.max(1, Math.ceil(cycleM + 1 / Math.max(k, 0.0001)))),
    dealsPerPartnerInWindow: (i.dealsPerPartner * (i.horizon - cycleM)) / 12,
    costPerCustomer: end.cost / deals,
    rows,
  };
}

export type Lever = { text: string; from: number; to: number };

// The one change that lifts the return the most, out of two plain levers.
export function biggestLever(i: RoiInputs, base: RoiResult): Lever | null {
  const cands: Lever[] = [];
  const tryRun = (patch: Partial<RoiInputs>, text: string) => {
    const r = compute({ ...i, ...patch });
    if (r.ok && r.roi > base.roi + 1) cands.push({ text, from: base.roi, to: r.roi });
  };
  const d2 = Math.max(i.dealsPerPartner + 1, Math.round(i.dealsPerPartner * 1.5 * 10) / 10);
  tryRun({ dealsPerPartner: d2 }, `If each partner closed ${trim(d2)} deals a year instead of ${trim(i.dealsPerPartner)}`);
  const c2 = Math.max(1, Math.round(i.cycleWeeks * 0.75));
  if (c2 < i.cycleWeeks) tryRun({ cycleWeeks: c2 }, `Shortening the sales cycle from ${trim(i.cycleWeeks)} to ${trim(c2)} weeks`);
  if (!cands.length) return null;
  return cands.sort((a, b) => b.to - b.from - (a.to - a.from))[0];
}

// Same plan if partners bring half as many deals
export function halfCase(i: RoiInputs): RoiResult | null {
  const r = compute({ ...i, dealsPerPartner: i.dealsPerPartner / 2 });
  return r.ok ? r : null;
}

export const trim = (n: number) => String(Math.round(n * 100) / 100);
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
export const pct = (n: number) => `${n < 0 ? "-" : ""}${Math.round(Math.abs(n)).toLocaleString("en-US")}%`;
export const deals1 = (n: number) => (n >= 10 ? fmt(n) : String(Math.max(0.1, Math.round(n * 10) / 10)));

export type Verdict = "strong" | "slow" | "negative";
// strong: pays back inside the window; slow: pays back later; negative: does not pay back at these numbers
export const verdict = (r: RoiResult, horizon: number): Verdict => (r.payback === null ? "negative" : r.payback <= horizon ? "strong" : "slow");

// Coarse buckets for analytics so no exact figure leaves the page
export const bucket = (n: number, edges: number[]) => {
  for (let k = 0; k < edges.length; k++) if (n < edges[k]) return `lt_${edges[k]}`;
  return `gte_${edges[edges.length - 1]}`;
};
