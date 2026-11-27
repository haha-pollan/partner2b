import { PARTNER_TYPES, DEFAULT_HORIZON, HORIZONS, type PartnerType, type RoiInputs } from "./model";

// Form values kept as strings, as the pipeline calculator does
export type Raw = { partner: PartnerType; deal: string; partners: string; dpp: string; commission: string; monthly: string; cycle: string; horizon: string; compare: string };

export const num = (s: string) => Number(String(s).replace(/[,\s$]/g, ""));

export function toInputs(r: Raw): RoiInputs {
  return {
    partner: r.partner, dealSize: num(r.deal), partners: num(r.partners), dealsPerPartner: num(r.dpp), commission: num(r.commission),
    monthlyCost: num(r.monthly), cycleWeeks: num(r.cycle), horizon: num(r.horizon), compareCac: num(r.compare) > 0 ? num(r.compare) : null,
  };
}

export function toQuery(r: Raw): string {
  const q = new URLSearchParams({ p: r.partner, d: r.deal, n: r.partners, k: r.dpp, c: r.commission, m: r.monthly, w: r.cycle, h: r.horizon });
  if (r.compare.trim() !== "") q.set("x", r.compare);
  return q.toString();
}

// Returns null when the link is missing the basics
export function fromQuery(q: URLSearchParams): Raw | null {
  const partner = q.get("p") as PartnerType | null;
  if (!partner || !PARTNER_TYPES.some((t) => t.key === partner)) return null;
  const g = (k: string, n = 20) => (q.get(k) ?? "").slice(0, n);
  const raw: Raw = { partner, deal: g("d"), partners: g("n"), dpp: g("k"), commission: g("c"), monthly: g("m"), cycle: g("w", 10), horizon: g("h", 10) || String(DEFAULT_HORIZON), compare: g("x") };
  if (![raw.deal, raw.partners, raw.dpp, raw.monthly].every((v) => num(v) > 0)) return null;
  if (!(num(raw.commission) >= 0) || raw.commission.trim() === "" || !(num(raw.cycle) >= 0) || raw.cycle.trim() === "") return null;
  if (!(HORIZONS as readonly number[]).includes(num(raw.horizon))) return null;
  return raw;
}
