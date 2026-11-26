// Finds companies in our own database that fit a saved strategy. A lookup plus one cheap model call: no web search at run time.
import { db } from "@/lib/admin/session";
import { askJson, llmConfigured } from "@/lib/enrich/llm";
import type { Profile, Strategy } from "./strategy";

type Co = { id: number; name: string; website: string; description: string | null; region: string | null; company_kind: string; partner_types: string[]; subtype: string | null; categories: string[]; serves_sizes: string[]; engages_at: string[]; has_program: boolean | null; program_url: string | null; program_id: number | null };
export type Match = { id: number; name: string; website: string; description: string | null; subtype: string | null; has_program: boolean | null; program_url: string | null; program_id: number | null; score: number; reason: string };
export type TypeResult = { type: string; stage: string | null; role: string; examples: string[]; candidates: number; matches: Match[] };

const COLS = "id,name,website,description,region,company_kind,partner_types,subtype,categories,serves_sizes,engages_at,has_program,program_url,program_id";
const SHORTLIST = 25;

// Cheap, explainable score used to shortlist before the model ranks.
function score(c: Co, s: Strategy, p: Profile): number {
  let n = 0;
  if (s.category && c.categories.includes(s.category)) n += 3;
  if (s.region && (c.region === s.region || c.region === "Global")) n += 2;
  else if (!c.region) n += 1;
  if (s.audience && s.audience !== "A mix of sizes" && c.serves_sizes.includes(s.audience)) n += 2;
  if (p.stage && c.engages_at.includes(p.stage)) n += 1;
  if (c.has_program) n += 1;
  return n;
}

async function ask(s: Strategy, p: Profile, list: (Co & { score: number })[], limit: number): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  if (!llmConfigured() || !list.length) return out;
  const sys = "You match companies to a partner profile for a vendor building a partner program. Use only the facts given. Pick the best fits and give each a reason of at most 18 words that names the specific fit. Never invent facts about a company. Answer with JSON only: {\"picks\":[{\"id\":number,\"reason\":string}]} ordered best first.";
  const user = JSON.stringify({
    vendor: { name: s.company_name, category: s.category, region: s.region, sells_to: s.audience, goals: s.goals },
    wanted_partner: { type: p.type, stage: p.stage, role: p.role, examples: p.examples },
    pick: limit,
    companies: list.map((c) => ({ id: c.id, name: c.name, what: (c.description || "").slice(0, 220), subtype: c.subtype, categories: c.categories.slice(0, 4), serves: c.serves_sizes, region: c.region })),
  });
  try {
    const r = await askJson<{ picks?: { id: number; reason: string }[] }>(sys, user);
    for (const x of r?.picks ?? []) if (typeof x.id === "number" && typeof x.reason === "string") out.set(x.id, x.reason.replace(/\s*[—–]\s*/g, ", ").slice(0, 160));
  } catch { /* fall back to the score order */ }
  return out;
}

export async function matchStrategy(s: Strategy, perType = 10): Promise<TypeResult[]> {
  const profiles = s.profiles.length ? s.profiles : s.partner_types.map((type) => ({ type, stage: null, role: "", examples: [] as string[] }));
  const results: TypeResult[] = [];
  for (const p of profiles) {
    const r = await db(`companies?select=${COLS}&status=eq.approved&partner_types=cs.${encodeURIComponent(`{"${p.type}"}`)}&order=id.desc&limit=1000`);
    const all: Co[] = r.ok ? await r.json() : [];
    // Never recommend the vendor to itself.
    const host = (s.website || "").replace(/^https?:\/\/(www\.)?/, "").split("/")[0].toLowerCase();
    const pool = all.filter((c) => !host || !c.website.toLowerCase().includes(host)).map((c) => ({ ...c, score: score(c, s, p) }));
    pool.sort((a, b) => b.score - a.score || a.id - b.id);
    const short = pool.slice(0, SHORTLIST);
    const picked = await ask(s, p, short, perType);
    const ordered = picked.size ? short.filter((c) => picked.has(c.id)).sort((a, b) => [...picked.keys()].indexOf(a.id) - [...picked.keys()].indexOf(b.id)) : short;
    const matches: Match[] = ordered.slice(0, perType).map((c) => ({ id: c.id, name: c.name, website: c.website, description: c.description, subtype: c.subtype, has_program: c.has_program, program_url: c.program_url, program_id: c.program_id, score: c.score, reason: picked.get(c.id) ?? "" }));
    results.push({ type: p.type, stage: p.stage, role: p.role, examples: p.examples, candidates: all.length, matches });
  }
  return results;
}
