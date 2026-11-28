// The free tools that collect an email. Used by the admin Tools screens.
export type ToolDef = { slug: string; table: string; label: string; what: string; filter?: string };

export const TOOLS: ToolDef[] = [
  { slug: "assessment", table: "assessment_leads", label: "Assessment", what: "Partner program assessment" },
  { slug: "calculator", table: "calculator_leads", label: "Pipeline calculator", what: "Partner pipeline calculator", filter: "tool=eq.partner-pipeline-calculator" },
  { slug: "roi-calculator", table: "calculator_leads", label: "ROI calculator", what: "Partner ROI calculator", filter: "tool=eq.partner-roi-calculator" },
  { slug: "compensation-calculator", table: "calculator_leads", label: "Compensation calculator", what: "Partner compensation budget calculator", filter: "tool=eq.partner-compensation-calculator" },
  { slug: "builder", table: "builder_leads", label: "Program builder", what: "Program builder preview" },
  { slug: "playbook", table: "playbook_downloads", label: "Playbook", what: "Playbook download" },
];

export const toolBySlug = (s: string) => TOOLS.find((t) => t.slug === s);

const human = (k: string) => {
  const t = k.replace(/[_.]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim().toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

// Turn a saved JSON object into short readable lines for the detail view.
export function lines(v: unknown, prefix = "", out: [string, string][] = []): [string, string][] {
  if (out.length >= 40 || v === null || v === undefined || v === "") return out;
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== "object" || x === null)) { out.push([human(prefix), v.join(", ")]); return out; }
    v.slice(0, 12).forEach((x, i) => lines(x, `${prefix} ${i + 1}`, out));
    return out;
  }
  if (typeof v === "object") {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) lines(x, prefix ? `${prefix} ${k}` : k, out);
    return out;
  }
  out.push([human(prefix || "value"), String(v).slice(0, 200)]);
  return out;
}

export function hostOf(u: string | null | undefined): string {
  if (!u) return "-";
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u.slice(0, 40); }
}
