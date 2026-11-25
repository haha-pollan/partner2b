import { CATEGORIES, TYPES } from "@/lib/formsConfig";
import { AI_CATEGORIES } from "@/lib/ai";

// Controlled vocabularies from the import playbook. Staff pick from these, they cannot invent values.
export const ALL_CATEGORIES = [...CATEGORIES, ...AI_CATEGORIES.map((c) => c.name)];
export const PROGRAM_TYPES = TYPES;
export const COMMISSION_MODELS = ["Discount on resale", "Referral fee", "Revenue share", "Not published"];
export const FEATURE_TAGS = [
  "Certification", "Co-marketing funds", "Co-selling", "Deal registration", "Directory listing", "Discount on resale",
  "Marketplace listing", "Partner portal", "Referral fee", "Revenue share", "Tiered benefits", "Training",
];

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const hostOf = (url: string) => {
  try { return new globalThis.URL(url).host.replace(/^www\./, ""); } catch { return ""; }
};

export const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "").split("\n").map((x) => x.trim()).filter(Boolean);

// Elena's copy rules: no em or en dashes, no exclamation marks.
export const badCopy = (s: string) => /[–—!]/.test(s);
