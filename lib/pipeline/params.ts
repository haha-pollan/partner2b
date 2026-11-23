import {
  APPROACH_DEFAULTS, COMPANY_TYPES, DEFAULT_RECRUIT_MONTHS, DEFAULT_WINDOW_MONTHS, PARTNER_TYPES, PAYOUT_DEFAULT, defaultDealsPerPartner,
  type Approach, type CompanyType, type Inputs, type PartnerType,
} from "./model";

// The form values the user types, kept as strings, plus any edited assumptions
export type Raw = {
  type: CompanyType;
  goal: string;
  deal: string;
  cycle: string;
  windowM: string;
  partner: PartnerType;
  approach: Approach;
  ov: Record<string, string>;
};

export const OVERRIDE_KEYS = ["winRate", "dealsPerPartner", "activation", "reply", "replyToSigned", "recruitMonths", "payout", "existingActive", "marketSize"] as const;

export const num = (s: string) => Number(String(s).replace(/[,\s$]/g, ""));

export function presetFor(type: CompanyType) {
  return COMPANY_TYPES.find((t) => t.key === type) ?? COMPANY_TYPES[0];
}

export function defaultsFor(approach: Approach, partner: PartnerType, dealSize: number, type: CompanyType): Record<string, number> {
  const ap = APPROACH_DEFAULTS[approach];
  const preset = presetFor(type);
  const d = dealSize > 0 ? dealSize : preset.deal;
  return {
    winRate: preset.win, dealsPerPartner: defaultDealsPerPartner(d, partner),
    activation: ap.activation, reply: ap.reply, replyToSigned: ap.replyToSigned,
    recruitMonths: DEFAULT_RECRUIT_MONTHS, payout: PAYOUT_DEFAULT[partner], existingActive: 0,
  };
}

export function toInputs(raw: Raw): Inputs {
  const defs = defaultsFor(raw.approach, raw.partner, num(raw.deal), raw.type);
  const val = (k: string) => (raw.ov[k] !== undefined ? raw.ov[k] : defs[k] !== undefined ? String(defs[k]) : "");
  return {
    goal: num(raw.goal), dealSize: num(raw.deal), cycleWeeks: num(raw.cycle), windowMonths: num(raw.windowM), partner: raw.partner,
    winRate: num(val("winRate")), dealsPerPartner: num(val("dealsPerPartner")), activation: num(val("activation")),
    reply: num(val("reply")), replyToSigned: num(val("replyToSigned")),
    recruitMonths: num(val("recruitMonths")), existingActive: num(val("existingActive")) || 0,
    marketSize: num(val("marketSize")) > 0 ? num(val("marketSize")) : null, payout: num(val("payout")),
  };
}

export function toQuery(raw: Raw): string {
  const q = new URLSearchParams({ t: raw.type, g: raw.goal, d: raw.deal, c: raw.cycle, w: raw.windowM, p: raw.partner, a: raw.approach });
  for (const k of OVERRIDE_KEYS) if (raw.ov[k] !== undefined && raw.ov[k] !== "") q.set(`o_${k}`, raw.ov[k]);
  return q.toString();
}

// Returns null when the link is missing the basics
export function fromQuery(q: URLSearchParams): Raw | null {
  const type = q.get("t") as CompanyType | null;
  const partner = q.get("p") as PartnerType | null;
  const approach = q.get("a") as Approach | null;
  if (!type || !COMPANY_TYPES.some((t) => t.key === type)) return null;
  if (!partner || !PARTNER_TYPES.some((t) => t.key === partner)) return null;
  if (!approach || !(approach in APPROACH_DEFAULTS)) return null;
  const goal = q.get("g") ?? "", deal = q.get("d") ?? "", cycle = q.get("c") ?? "", windowM = q.get("w") ?? String(DEFAULT_WINDOW_MONTHS);
  if (!(num(goal) > 0) || !(num(deal) > 0) || !(num(cycle) >= 0) || cycle.trim() === "" || !(num(windowM) > 0)) return null;
  const ov: Record<string, string> = {};
  for (const k of OVERRIDE_KEYS) { const v = q.get(`o_${k}`); if (v !== null && v !== "") ov[k] = v.slice(0, 20); }
  return { type, goal: goal.slice(0, 20), deal: deal.slice(0, 20), cycle: cycle.slice(0, 10), windowM: windowM.slice(0, 10), partner, approach, ov };
}
