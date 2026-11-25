import { ALL_CATEGORIES } from "@/lib/admin/programs";
import { REGIONS } from "@/lib/builder2/intake";

// Controlled vocabularies. The model can only pick from these; anything else is dropped in code.
// Partner type names match the Program builder so discovery can filter on them directly.
export const PARTNER_TYPES = ["Technology Partner", "Channel Partner", "Agency Partner", "Strategic Partner", "Community Partner", "AI and Automation Partner"];
export const SUBTYPES = [
  "Software vendor", "Integration partner", "OEM", "Hyperscaler or marketplace", "Reseller or VAR", "Distributor", "Referral or affiliate",
  "Marketing or creative agency", "System integrator", "MSP", "Consultancy", "Community or association", "Media, newsletter or analyst", "AI and automation builder",
];
export const SIZES = ["Small businesses", "Mid-market companies", "Large enterprises"];
export const STAGES = ["Pre-use", "In use", "Post-use"];
export const SIZE_BANDS = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
export const KINDS = ["vendor", "partner_side"];
export { ALL_CATEGORIES, REGIONS };

// Plain words for each partner type, used when asking the model where to look for sources.
export const TYPE_WORDS: Record<string, string> = {
  "Technology Partner": "software vendors with integration or technology partner ecosystems",
  "Channel Partner": "resellers, value added resellers, distributors and referral partners",
  "Agency Partner": "marketing agencies, consultancies, implementation firms and system integrators",
  "Community Partner": "industry communities, associations, newsletters and media",
  "AI and Automation Partner": "AI and automation builders, consultancies and workflow agencies",
};

export const pick = (v: unknown, list: string[]): string[] =>
  (Array.isArray(v) ? v : []).map((x) => String(x).trim()).filter((x) => list.includes(x)).filter((x, i, a) => a.indexOf(x) === i);
export const pickOne = (v: unknown, list: string[]): string | null => {
  const s = String(v ?? "").trim();
  return list.includes(s) ? s : null;
};
