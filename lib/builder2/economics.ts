// Deterministic partner economics. The model never calculates: it copies these figures.
import type { Intake } from "./intake";

type Kind = "tech" | "referral" | "reseller" | "agency" | "community";
type Row = { benchmark: string; rates: [number, number, number]; mode: "pct" | "flat" | "margin"; recurring?: boolean };

const B2B: Record<Kind, Row> = {
  referral: { benchmark: "Referral", rates: [10, 15, 20], mode: "pct" },
  agency: { benchmark: "Agency", rates: [20, 25, 30], mode: "pct", recurring: true },
  reseller: { benchmark: "Reseller or VAR", rates: [25, 30, 40], mode: "margin" },
  community: { benchmark: "Affiliate or Community", rates: [15, 22, 30], mode: "pct" },
  tech: { benchmark: "Technology co-sell", rates: [5, 10, 15], mode: "pct" },
};
const TABLES: Record<string, Partial<Record<Kind, Row>>> = {
  "B2B SaaS": {},
  "IT Infrastructure and Cybersecurity": {
    referral: { benchmark: "Referral", rates: [15, 20, 25], mode: "pct" },
    agency: { benchmark: "MSP or VAR", rates: [20, 30, 37.5], mode: "pct" },
    reseller: { benchmark: "MSP or VAR", rates: [20, 30, 37.5], mode: "margin" },
  },
  "Fintech and Financial Services": {
    referral: { benchmark: "Referral (flat fee)", rates: [100, 250, 500], mode: "flat" },
    community: { benchmark: "Affiliate", rates: [15, 25, 35], mode: "pct" },
  },
  "Healthcare and Biotech": {
    referral: { benchmark: "Referral", rates: [8.5, 12.5, 15], mode: "pct" },
    agency: { benchmark: "Agency", rates: [15, 20, 25], mode: "pct" },
    reseller: { benchmark: "Reseller", rates: [15, 22, 30], mode: "margin" },
  },
  "Retail, eCommerce and Manufacturing": {
    referral: { benchmark: "Affiliate", rates: [6.5, 10, 13.5], mode: "pct" },
    community: { benchmark: "Affiliate", rates: [6.5, 10, 13.5], mode: "pct" },
    reseller: { benchmark: "Distributor", rates: [10, 15, 20], mode: "margin" },
    agency: { benchmark: "Agency", rates: [8, 12, 15], mode: "pct" },
  },
};
const CAP: Record<string, number> = { "B2B SaaS": 25, "IT Infrastructure and Cybersecurity": 30, "Fintech and Financial Services": 25, "Healthcare and Biotech": 20, "Retail, eCommerce and Manufacturing": 15 };
// The Fintech flat referral fee ($100, $250, $500) only makes sense for small contracts. At $5K and above, the B2B SaaS percentage applies.
const rowFor = (vertical: string, kind: Kind, acvUsd: number): Row => {
  const r = TABLES[vertical]?.[kind];
  if (r?.mode === "flat" && acvUsd >= 5000) return B2B[kind];
  return r ?? B2B[kind];
};

// Closed deals per active partner per year, [conservative, optimistic], by ACV band (under 5K, 5K to 20K, 20K to 100K, above 100K).
const PACE: Record<Kind, [number, number][]> = {
  referral: [[6, 18], [4, 10], [2, 5], [1, 3]],
  tech: [[6, 15], [4, 8], [2, 4], [1, 3]],
  community: [[4, 12], [3, 8], [2, 5], [1, 3]],
  agency: [[8, 24], [6, 15], [3, 8], [2, 5]],
  reseller: [[24, 60], [12, 36], [6, 18], [3, 10]],
};
const CONV: Record<Kind, [number, number]> = { referral: [15, 25], tech: [30, 45], community: [1, 5], agency: [25, 40], reseller: [20, 35] };
const IMPL = (acvUsd: number) => (acvUsd < 20000 ? 1 : acvUsd < 50000 ? 1.5 : acvUsd < 150000 ? 2 : 2.5);
const FX: Record<string, number> = { USD: 1, EUR: 1.08, GBP: 1.27, PLN: 0.25, Other: 1 };
const band = (usd: number) => (usd < 5000 ? 0 : usd < 20000 ? 1 : usd < 100000 ? 2 : 3);

export const TYPES: { name: string; kind: Kind; note?: string }[] = [
  { name: "Technology Partner", kind: "tech", note: "Introductions are co-sell eligible and represent about a quarter of the joint pipeline." },
  { name: "AI and Automation Partner", kind: "tech", note: "Same figures as Technology Partner. Introductions are co-sell eligible and represent about a quarter of the joint pipeline." },
  { name: "Channel Partner (referral)", kind: "referral" },
  { name: "Channel Partner (reseller or distributor)", kind: "reseller" },
  { name: "Agency Partner", kind: "agency" },
  { name: "Community Partner", kind: "community" },
];

export function makeMoney(currency: string) {
  const sym = currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "Other" ? "" : currency + " ";
  return (n: number) => `${sym}${Math.round(n).toLocaleString("en-US")}`;
}
const pct = (n: number) => `${Math.round(n * 100) / 100}%`;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function buildEconomics(i: Intake, vertical: string, acvAverage: number) {
  const money = makeMoney(i.currency); const fx = FX[i.currency] ?? 1;
  const toUsd = (n: number) => n * fx;
  const b = band(toUsd(acvAverage));
  const cap = CAP[vertical] ?? 25;
  const out: Record<string, unknown> = {};
  const conservativeDeals: number[] = [];

  for (const t of TYPES) {
    const row = rowFor(vertical, t.kind, toUsd(acvAverage));
    let rates = [...row.rates] as [number, number, number];
    // Sustainability: average effective rate over three years must stay under the vertical cap (commission types, Tiers 1 and 2).
    let capped = false;
    if (row.mode === "pct") {
      const avg1 = (rates[0] + 2 * (row.recurring ? rates[0] : 5)) / 3;
      const avg2 = (rates[1] + 2 * 5) / 3;
      if (avg1 > cap || avg2 > cap) {
        const max1 = row.recurring ? cap : 3 * cap - 10; const f = Math.min(1, max1 / rates[0]);
        rates = [rates[0] * f, rates[1] * f, rates[2]]; capped = true;
      }
    }
    // Flat fees are quoted in USD in the benchmark and converted to the intake currency.
    const flat = (usd: number) => usd / fx;
    const commission = (rate: number, acv: number) => (row.mode === "flat" ? flat(rate) : (acv * rate) / 100);
    const [dLo, dHi] = PACE[t.kind][b]; const dMid = (dLo + dHi) / 2;
    const [cLo, cHi] = CONV[t.kind]; const cMid = (cLo + cHi) / 2;
    const stages: Record<string, [number, number]> = { before: [cMid, cHi], during: [cMid, (cMid + cHi) / 2], after: [cMid, cMid] };
    const comLo = commission(rates[0], i.acvLow), comHi = commission(rates[0], i.acvHigh), comAvg = commission(rates[0], acvAverage);
    const byStage = Object.fromEntries(Object.entries(stages).map(([s, [lo, hi]]) => [s, {
      conversion: lo === hi ? pct(lo) : `${pct(lo)} to ${pct(hi)}`,
      introductionsPerYearConservative: Math.max(1, Math.ceil(dLo / (lo / 100))),
      introductionsPerYearOptimistic: Math.max(1, Math.ceil(dHi / (hi / 100))),
    }]));
    const tierTable = rates.map((r, k) => {
      const c = commission(r, acvAverage);
      return { tier: k + 1, rate: row.mode === "flat" ? `${money(flat(r))} flat` : pct(r), commissionPerDeal: money(c), closedDealsPerYear: r1(dMid), earningsPerYear: money(r1(dMid) * c) };
    });
    const entry: Record<string, unknown> = {
      benchmarkRow: row.benchmark, rates: tierTable.map((x) => x.rate),
      renewalRate: row.mode === "flat" ? "none" : row.mode === "margin" ? "not applicable, resale margin" : row.recurring ? "same as the first-year rate at Tier 1, 5% at Tier 2" : "5% retention bonus",
      commissionPerDeal: { conservative: money(comLo), optimistic: money(comHi) },
      closedDealsPerYear: { conservative: dLo, optimistic: dHi },
      earningsPerYear: { conservative: money(dLo * comLo), optimistic: money(dHi * comHi) },
      earningsRangeText: `${money(dLo * comLo)} to ${money(dHi * comHi)}`,
      introductionsByBuyerJourneyStage: byStage,
      tierTable,
    };
    if (t.note) entry.note = t.note;
    if (capped) entry.rateCapNote = "Rates were reduced to stay sustainable. Never mention this in the document.";
    if (t.kind === "agency") {
      const impl = acvAverage * IMPL(toUsd(acvAverage));
      entry.implementation = {
        implementationRevenuePerDeal: money(impl),
        referralOnly: { perDeal: money(comAvg), closedDealsPerYear: r1(dMid), earningsPerYear: money(r1(dMid) * comAvg) },
        referralPlusImplementation: { perDeal: money(comAvg + impl), closedDealsPerYear: r1(dMid), earningsPerYear: money(r1(dMid) * (comAvg + impl)) },
      };
    }
    out[t.name] = entry;
    if (!["AI and Automation Partner"].includes(t.name)) conservativeDeals.push(dLo);
  }
  const avgDeals = conservativeDeals.reduce((a, c) => a + c, 0) / conservativeDeals.length;
  const projected = 8 * avgDeals * 0.5 * acvAverage;
  const target = i.year1PartnerRevenueTarget;
  return {
    currency: i.currency,
    acvAverageFormatted: money(acvAverage),
    tierThresholds: { tier1ToTier2: `${money(acvAverage * 5)} of partner-sourced revenue since joining`, tier2ToTier3: `${money(acvAverage * 20)} of partner-sourced revenue since joining` },
    revenueCheck: {
      expectedActivePartners: 8,
      projectedYear1PartnerRevenue: money(projected),
      year1PartnerRevenueTarget: money(target),
      result: projected >= target ? `Projected revenue exceeds the target by ${money(projected - target)}. Carry the surplus as a buffer in the recruitment target.` : `Projected revenue is ${money(target - projected)} short of the target. Flag this gap and pass it to the partner pipeline model in the Days 16 to 30 action plan. Do not adjust the economics to close it.`,
    },
    partnerTypes: out,
  };
}
