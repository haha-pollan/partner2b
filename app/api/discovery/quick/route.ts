import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { AUDIENCES, BUILDER_CATEGORIES, REGIONS, normaliseUrl } from "@/lib/builder2/intake";
import { PARTNER_TYPES } from "@/lib/enrich/vocab";
import { saveStrategy, type Strategy } from "@/lib/discovery/strategy";
import { previewFor } from "@/lib/discovery/preview";
import { db } from "@/lib/admin/session";

export const runtime = "nodejs";
export const maxDuration = 120;
const hits = new Map<string, number[]>();
const limited = (k: string, max: number, ms: number) => { const now = Date.now(); const l = (hits.get(k) ?? []).filter((t) => now - t < ms); l.push(now); hits.set(k, l); return l.length > max; };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// Quick start for companies that already know which partners they want: four answers, no PDF, straight to matches.
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return fail("Something went wrong. Try again."); }
  if (String(b.website_confirm ?? "").trim()) return fail("Something went wrong. Try again.");
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(`${ip}:quick`, 6, 3_600_000) || limited("all:quick", 300, 86_400_000)) return fail("Too many requests. Try again later.", 429);

  const url = normaliseUrl(String(b.website ?? ""));
  if (!url) return fail("Please enter your company website, for example yourcompany.com.");
  const category = String(b.category ?? "");
  if (!BUILDER_CATEGORIES.includes(category)) return fail("Please choose what you sell.");
  const audience = String(b.audience ?? "");
  if (!AUDIENCES.includes(audience)) return fail("Please choose who you sell to.");
  const region = String(b.region ?? "");
  if (!REGIONS.includes(region)) return fail("Please choose your main region.");
  const types = Array.isArray(b.types) ? Array.from(new Set(b.types.map(String))).filter((t) => PARTNER_TYPES.includes(t)) : [];
  if (!types.length) return fail("Please choose at least one partner type.");

  let name = "";
  try { const { fetchSite } = await import("@/lib/builder/site"); name = (await fetchSite(url)).name || ""; } catch { /* the host name is used instead */ }
  if (!name) name = new URL(url).hostname.replace(/^www\./, "");

  const s: Strategy = { id: randomUUID(), company_name: name.slice(0, 120), website: url, category, region, audience, goals: [], partner_types: types, profiles: types.map((type) => ({ type, stage: null, role: "", examples: [] })) };
  if (!(await saveStrategy(s))) return fail("Something went wrong. Try again.", 502);
  try { await db("discovery_events", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ strategy_id: s.id, event: "quick_start", detail: types.join(", ").slice(0, 100) }) }); } catch { /* a missing count is fine */ }
  // Build the matches now, so the results page opens straight away.
  try { await previewFor({ ...s, preview: null }); } catch { /* the results page builds it on first view */ }
  return NextResponse.json({ ok: true, key: s.id });
}
