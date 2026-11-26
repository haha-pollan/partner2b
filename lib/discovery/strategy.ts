// Turns a finished Program builder strategy into data discovery can match on, and saves it.
// The id is the same key as the PDF, so a strategy and its PDF always belong together.
import { URL as SB_URL } from "@/lib/programs";
import { PARTNER_TYPES, STAGES } from "@/lib/enrich/vocab";
import { storageHeaders } from "@/lib/builder2/store";
import type { Block } from "@/lib/builder2/parse";
import type { Intake } from "@/lib/builder2/intake";

export type Profile = { type: string; stage: string | null; role: string; examples: string[] };
export type Strategy = { id: string; company_name: string | null; website: string | null; category: string | null; region: string | null; audience: string | null; goals: string[]; partner_types: string[]; profiles: Profile[]; created_at?: string };

// The builder names partner types freely ("Agency and Implementation Partners"). Map them to the fixed list by keyword.
export function canonicalType(raw: string): string | null {
  const t = raw.toLowerCase();
  if (/\bai\b|automation/.test(t)) return "AI and Automation Partner";
  if (/technology|integration|oem|hyperscaler|isv|marketplace/.test(t)) return "Technology Partner";
  if (/channel|reseller|var\b|distributor|referral|affiliate/.test(t)) return "Channel Partner";
  if (/agency|agencies|consult|implementation|integrator|msp|services/.test(t)) return "Agency Partner";
  if (/communit|association|media|newsletter|analyst|influencer/.test(t)) return "Community Partner";
  if (/strategic|alliance|joint/.test(t)) return "Strategic Partner";
  return PARTNER_TYPES.find((p) => t.includes(p.toLowerCase().replace(" partner", ""))) ?? null;
}

export function extractStrategy(id: string, intake: Intake, blocks: Block[]): Strategy {
  const profiles: Profile[] = [];
  for (const b of blocks) {
    if (b.kind !== "ecosystem") continue;
    for (const n of b.nodes) {
      const type = canonicalType(n.type);
      if (!type) continue;
      const stage = STAGES.find((s) => n.stage.toLowerCase().includes(s.toLowerCase())) ?? null;
      profiles.push({ type, stage, role: n.role, examples: n.examples });
    }
  }
  // Partner cards and value propositions name types too, so use them when the map is missing a type.
  const types = new Set(profiles.map((p) => p.type));
  for (const b of blocks) {
    const name = b.kind === "vp" ? b.type : b.kind === "partner" ? b.title : "";
    const type = name ? canonicalType(name) : null;
    if (type && !types.has(type)) { types.add(type); profiles.push({ type, stage: null, role: "", examples: [] }); }
  }
  return {
    id, company_name: intake.companyName, website: intake.website, category: intake.category, region: intake.region, audience: intake.audience,
    goals: intake.programGoals, partner_types: Array.from(types), profiles,
  };
}

// Best effort: if saving fails the visitor still gets their report.
export async function saveStrategy(s: Strategy): Promise<boolean> {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/builder_strategies`, {
      method: "POST", cache: "no-store",
      headers: storageHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify(s),
    });
    if (!r.ok) console.error("builder strategy save failed:", r.status);
    return r.ok;
  } catch (e) {
    console.error("builder strategy save failed:", e instanceof Error ? e.message : "");
    return false;
  }
}
