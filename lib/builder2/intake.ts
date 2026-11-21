import { CATEGORIES } from "@/lib/formsConfig";

export const DELIVERY = ["Self-serve software", "Software with onboarding", "Software plus implementation services", "Managed service", "On premise or hardware"];
export const AUDIENCES = ["Small businesses", "Mid-market companies", "Large enterprises", "A mix of sizes"];
export const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East and Africa", "Global"];
export const STAGES = ["No partner program yet", "A few informal partners", "A program with fewer than 20 partners"];
export const CURRENCIES = ["USD", "EUR", "GBP", "PLN", "Other"];
export const GOALS = [
  "Generate partner-sourced pipeline",
  "Reduce customer acquisition cost",
  "Expand into new geographies or segments",
  "Build ecosystem visibility",
  "Add delivery or implementation capacity",
  "Accelerate adoption or usage",
];
export const BUILDER_CATEGORIES = [...CATEGORIES, "Other or not listed"];

const FINTECH = ["Payments", "Billing and subscriptions", "Buy now, pay later", "Fraud, risk and compliance", "Identity and KYC", "Banking as a service and card issuing", "Core and digital banking", "Open banking and financial data", "Spend management and AP", "Finance and accounting software", "Payroll and HR"];
const INFRA = ["Cloud and infrastructure", "Cybersecurity", "IT management and DevOps", "AI infrastructure and MLOps", "AI security and governance"];
const HEALTH = ["Life sciences and healthcare"];
const RETAIL = ["Ecommerce and marketing tech", "Content and digital experience", "Construction, real estate and field operations"];
export function verticalFor(category: string) {
  if (FINTECH.includes(category)) return "Fintech and Financial Services";
  if (INFRA.includes(category)) return "IT Infrastructure and Cybersecurity";
  if (HEALTH.includes(category)) return "Healthcare and Biotech";
  if (RETAIL.includes(category)) return "Retail, eCommerce and Manufacturing";
  return "B2B SaaS";
}

export type Intake = {
  website: string; companyName: string; contactName: string; category: string; offeringSummary: string; keyFeatures: string; differentiators: string;
  deliveryModel: string; competitors: string; endUser: string; primaryBuyer: string; audience: string; industriesServed: string;
  region: string; pricing: string; acvLow: number; acvHigh: number; currency: string; stage: string; programGoals: string[];
  year1PartnerRevenueTarget: number; partnerRevenueSharePercent: number;
};
export type Brand = { color: string; logo: string }; // logo is a data URL (png or jpeg) or ""

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ").trim().slice(0, max);
const num = (v: unknown) => { const n = Number(String(v ?? "").replace(/[^0-9.]/g, "")); return Number.isFinite(n) ? n : NaN; };
const oneOf = (v: string, list: string[]) => list.includes(v);

export function normaliseUrl(raw: string) {
  const t = clean(raw, 300).replace(/^\s+|\s+$/g, "");
  if (!t) return null;
  try {
    const u = new globalThis.URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if (!u.hostname.includes(".") || /^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(u.hostname)) return null;
    return u.toString();
  } catch { return null; }
}

export function parseIntake(raw: Record<string, unknown>): { ok: true; intake: Intake; vertical: string; acvAverage: number } | { ok: false; error: string } {
  const website = normaliseUrl(String(raw.website ?? ""));
  if (!website) return { ok: false, error: "Please enter a valid company website." };
  const category = clean(raw.category, 80);
  if (!oneOf(category, BUILDER_CATEGORIES)) return { ok: false, error: "Please choose a product category." };
  const fields: [keyof Intake, string, number][] = [
    ["offeringSummary", "what your product does", 600], ["keyFeatures", "your top features", 400], ["differentiators", "why customers choose you", 500],
    ["endUser", "who uses it day to day", 160], ["primaryBuyer", "who approves the purchase", 160], ["industriesServed", "the industries you serve", 200], ["pricing", "how you price", 160],
  ];
  const contactName = clean(raw.contactName, 80);
  if (!contactName) return { ok: false, error: "Please enter your name." };
  const out: Record<string, unknown> = { website, category, contactName, companyName: clean(raw.companyName, 80) || new globalThis.URL(website).hostname.replace(/^www\./, "").split(".")[0], competitors: clean(raw.competitors, 200) };
  for (const [k, label, max] of fields) { const v = clean(raw[k], max); if (!v) return { ok: false, error: `Please fill in ${label}.` }; out[k] = v; }
  const pick = (k: string, list: string[], label: string) => { const v = clean(raw[k], 80); if (!oneOf(v, list)) return `Please choose ${label}.`; out[k] = v; return ""; };
  for (const e of [pick("deliveryModel", DELIVERY, "how your product is delivered"), pick("audience", AUDIENCES, "the company size you sell to"), pick("region", REGIONS, "your main region"), pick("currency", CURRENCIES, "a currency"), pick("stage", STAGES, "where your partner program is today")]) if (e) return { ok: false, error: e };
  const low = num(raw.acvLow), high = num(raw.acvHigh);
  if (!(low > 0) || !(high >= low)) return { ok: false, error: "Please enter your typical contract value range, from a lower to a higher number." };
  out.acvLow = Math.round(low); out.acvHigh = Math.round(high);
  const goals = (Array.isArray(raw.programGoals) ? raw.programGoals : []).map((g) => clean(g, 80)).filter((g) => oneOf(g, GOALS));
  const uniq = Array.from(new Set(goals)).slice(0, 3);
  if (uniq.length < 1) return { ok: false, error: "Please choose at least one goal, up to three." };
  out.programGoals = uniq;
  const target = num(raw.year1PartnerRevenueTarget);
  if (!(target > 0)) return { ok: false, error: "Please enter your partner revenue target for year 1." };
  out.year1PartnerRevenueTarget = Math.round(target);
  const share = num(raw.partnerRevenueSharePercent);
  if (!(share > 0 && share <= 100)) return { ok: false, error: "Please enter the share of revenue you want from partners, between 1 and 100." };
  out.partnerRevenueSharePercent = Math.round(share * 10) / 10;
  const intake = out as unknown as Intake;
  return { ok: true, intake, vertical: verticalFor(category), acvAverage: Math.round((intake.acvLow + intake.acvHigh) / 2) };
}
