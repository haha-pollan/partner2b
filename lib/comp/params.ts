import { COMPANY_TYPES, PARTNER_TYPES, DEFAULT_BONUS, DEFAULT_MARKETING, DEFAULT_MIX, MARGIN, ratesFor, type CompInputs, type CompanyType, type PartnerType } from "./model";
export type Raw = { type: CompanyType; partner: PartnerType; goal: string; deal: string; margin: string; r: [string, string, string]; mix: [string, string, string]; mk: string; bn: string; rn: string };
export const num = (s: string) => Number(String(s).replace(/[,\s$]/g, ""));
export const defaultsFor = (type: CompanyType, partner: PartnerType) => ({ margin: String(MARGIN[type]), r: ratesFor(partner, type).map(String) as [string, string, string], mix: DEFAULT_MIX.map(String) as [string, string, string], mk: String(DEFAULT_MARKETING), bn: String(DEFAULT_BONUS), rn: "0" });
export const toInputs = (x: Raw): CompInputs => ({ type: x.type, partner: x.partner, goal: num(x.goal), dealSize: num(x.deal), margin: num(x.margin), rates: x.r.map(num) as [number, number, number], mix: x.mix.map(num) as [number, number, number], marketing: num(x.mk), bonus: num(x.bn), renewing: num(x.rn) });
export const toQuery = (x: Raw) => new URLSearchParams({ t: x.type, p: x.partner, g: x.goal, d: x.deal, m: x.margin, r: x.r.join("_"), x: x.mix.join("_"), k: x.mk, b: x.bn, n: x.rn }).toString();
export function fromQuery(q: URLSearchParams): Raw | null {
  const type = q.get("t") as CompanyType | null, partner = q.get("p") as PartnerType | null;
  if (!type || !COMPANY_TYPES.some((c) => c.key === type) || !partner || !PARTNER_TYPES.some((c) => c.key === partner)) return null;
  const r = (q.get("r") ?? "").split("_").slice(0, 3), x = (q.get("x") ?? "").split("_").slice(0, 3);
  if (r.length !== 3 || x.length !== 3) return null;
  const g = (k: string) => (q.get(k) ?? "").slice(0, 20);
  const raw: Raw = { type, partner, goal: g("g"), deal: g("d"), margin: g("m"), r: r.map((v) => v.slice(0, 8)) as Raw["r"], mix: x.map((v) => v.slice(0, 8)) as Raw["mix"], mk: g("k"), bn: g("b"), rn: g("n") || "0" };
  return num(raw.goal) > 0 && num(raw.deal) > 0 && num(raw.margin) > 0 ? raw : null;
}
