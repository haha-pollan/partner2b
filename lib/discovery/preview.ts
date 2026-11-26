// The free preview: one open company per partner type, locked hints for the rest, and the real counts.
// Locked companies are never sent to the visitor: only a region and size hint leave the server.
import { db } from "@/lib/admin/session";
import { matchStrategy } from "./match";
import { llmConfigured } from "@/lib/enrich/llm";
import type { Strategy } from "./strategy";

export type Open = { name: string; website: string; reason: string; subtype: string | null; directory: string | null };
export type PType = { type: string; role: string; pool: number; shown: Open[]; moreLocked: number };
export const PREVIEW_V = 4;
export type Preview = { partial?: boolean; v?: number; total: number; week: number; opened: number; types: PType[]; made_at: string };

async function weekCount(types: string[]): Promise<number> {
  if (!types.length) return 0;
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const r = await db(`companies?select=id&status=eq.approved&created_at=gte.${since}&partner_types=ov.${encodeURIComponent(`{${types.map((t) => `"${t}"`).join(",")}}`)}&limit=1`, { headers: { Prefer: "count=exact" } });
  return r.ok ? Number((r.headers.get("content-range") || "").split("/")[1]) || 0 : 0;
}

export async function buildPreview(s: Strategy): Promise<Preview> {
  const results = await matchStrategy(s, 10);
  const ids = results.flatMap((t) => t.matches.map((m) => m.program_id).filter((x): x is number => !!x));
  const slugs = new Map<number, string>();
  if (ids.length) {
    const r = await db(`programs?select=id,slug&published=eq.true&id=in.(${Array.from(new Set(ids)).join(",")})`);
    for (const p of r.ok ? ((await r.json()) as { id: number; slug: string }[]) : []) slugs.set(p.id, p.slug);
  }
  const types: PType[] = results.map((t) => {
    // The first five matches are shown in full. Everything else in the pool stays behind the paywall.
    const shown: Open[] = t.matches.slice(0, 5).map((m) => ({
      name: m.name, website: m.website, reason: m.reason, subtype: m.subtype,
      directory: m.program_id && slugs.get(m.program_id) ? `/directory/${slugs.get(m.program_id)}` : null,
    }));
    return { type: t.type, role: t.role, pool: t.poolSize, shown, moreLocked: Math.max(0, t.poolSize - shown.length) };
  });
  const partial = llmConfigured() && results.some((t) => t.matches.slice(0, 5).some((m) => !m.ranked));
  return { partial, v: PREVIEW_V, total: types.reduce((n, t) => n + t.pool, 0), week: await weekCount(results.map((t) => t.type)), opened: types.reduce((n, t) => n + t.shown.length, 0), types, made_at: new Date().toISOString() };
}

// Reads the saved preview, or builds and saves it the first time.
export async function previewFor(s: Strategy & { preview?: Preview | null }): Promise<Preview> {
  if (s.preview && s.preview.types && s.preview.v === PREVIEW_V) return s.preview;
  const p = await buildPreview(s);
  // If the model could not rank some cards, show what we have but do not save it, so the next view tries again.
  if (p.partial) return p;
  await db(`builder_strategies?id=eq.${s.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ preview: p, preview_at: p.made_at }) });
  return p;
}
