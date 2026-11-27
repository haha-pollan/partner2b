// Partner compensation budget calculator: pure rules, no AI, no I/O.
// Commission rates by tier come from the Program builder economics table (lib/builder2/economics.ts), so the two tools agree.
import { COMPANY_TYPES, type CompanyType, type PartnerType } from "@/lib/pipeline/model";
export { COMPANY_TYPES, PARTNER_TYPES, type CompanyType, type PartnerType } from "@/lib/pipeline/model";

// Tier 1, 2 and 3 commission rates in percent
const RATES: Record<PartnerType, [number, number, number]> = { referral: [10, 15, 20], agency: [20, 25, 30], reseller: [25, 30, 40], technology: [5, 10, 15] };
const RATES_CYBER: Partial<Record<PartnerType, [number, number, number]>> = { referral: [15, 20, 25], agency: [20, 30, 37.5], reseller: [20, 30, 37.5] };
export const ratesFor = (partner: PartnerType, type: CompanyType): [number, number, number] => (type === "cyber" ? RATES_CYBER[partner] : undefined) ?? RATES[partner];

// Ceiling for total partner compensation as a share of partner-sourced revenue, by company type (economics table caps)
export const CEILING: Record<CompanyType, number> = { saas: 25, ai: 25, cyber: 30, fintech: 25, enterprise: 25 };
export const MARGIN: Record<CompanyType, number> = { saas: 75, ai: 70, cyber: 60, fintech: 65, enterprise: 70 };
// Partner2B planning assumptions, all editable
export const DEFAULT_MIX: [number, number, number] = [60, 30, 10];
export const DEFAULT_MARKETING = 3; // % of partner revenue paid as partner marketing funds
export const DEFAULT_BONUS = 2; // % of partner revenue held for performance bonuses
export const RENEWAL_RATE = 5; // % paid on renewals, the retention bonus in the economics table

export type CompInputs = {
  type: CompanyType; partner: PartnerType;
  goal: number; // partner-sourced new revenue for the year, USD
  dealSize: number; margin: number; // percent
  rates: [number, number, number]; mix: [number, number, number]; // percent
  marketing: number; bonus: number; // percent of partner revenue
  renewing: number; // partner-sourced revenue renewing this year, USD
};
export type Status = "solid" | "tight" | "over";
export type CompResult = {
  ok: true; deals: number;
  commission: number; renewals: number; marketing: number; bonus: number; total: number;
  pctRevenue: number; perDeal: number; ceilingPct: number; ceilingAmount: number; headroom: number;
  marginShare: number; blendedRate: number; status: Status;
  tiers: { tier: number; rate: number; share: number; deals: number; cost: number }[];
};
export type CompFailure = { ok: false; message: string };
const pos = (n: number) => Number.isFinite(n) && n > 0;

export function compute(i: CompInputs): CompResult | CompFailure {
  const mixSum = i.mix[0] + i.mix[1] + i.mix[2];
  if (![i.goal, i.dealSize, i.margin].every(pos) || i.margin > 100 || !i.rates.every((r) => Number.isFinite(r) && r >= 0 && r < 100) || !i.mix.every((m) => Number.isFinite(m) && m >= 0) || Math.abs(mixSum - 100) > 0.5 || !(i.marketing >= 0) || !(i.bonus >= 0) || !(i.renewing >= 0)) {
    return { ok: false, message: "Please check your numbers. Revenue, deal size and margin need positive values, and the tier mix has to add up to 100." };
  }
  const deals = Math.ceil(i.goal / i.dealSize);
  const tiers = i.rates.map((rate, k) => ({ tier: k + 1, rate, share: i.mix[k], deals: (deals * i.mix[k]) / 100, cost: (i.goal * (i.mix[k] / 100) * rate) / 100 }));
  const commission = tiers.reduce((a, t) => a + t.cost, 0);
  const renewals = (i.renewing * RENEWAL_RATE) / 100;
  const marketing = (i.goal * i.marketing) / 100, bonus = (i.goal * i.bonus) / 100;
  const total = commission + renewals + marketing + bonus;
  const ceilingPct = CEILING[i.type], ceilingAmount = (i.goal * ceilingPct) / 100;
  const pctRevenue = (total / i.goal) * 100;
  return {
    ok: true, deals, commission, renewals, marketing, bonus, total, pctRevenue, perDeal: total / deals, ceilingPct, ceilingAmount, headroom: ceilingAmount - total,
    marginShare: (total / ((i.goal * i.margin) / 100)) * 100, blendedRate: (commission / i.goal) * 100,
    status: total <= ceilingAmount * 0.8 ? "solid" : total <= ceilingAmount ? "tight" : "over", tiers,
  };
}
export const trim = (n: number) => String(Math.round(n * 100) / 100);
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
export const pct = (n: number) => `${trim(Math.round(n * 10) / 10)}%`;
export const short = (n: number) => (Math.abs(n) >= 1e6 ? `$${trim(Math.round(n / 1e5) / 10)}M` : Math.abs(n) >= 1e4 ? `$${Math.round(n / 1e3)}K` : usd(n));
export const presetOf = (t: CompanyType) => COMPANY_TYPES.find((c) => c.key === t) ?? COMPANY_TYPES[0];
