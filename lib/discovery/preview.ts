// The free preview: one open company per partner type, locked hints for the rest, and the real counts.
// Locked companies are never sent to the visitor: only a region and size hint leave the server.
import { db } from "@/lib/admin/session";
import { matchStrategy, type Match } from "./match";
import type { Strategy } from "./strategy";

export type Open = { name: string; website: string; reason: string; subtype: string | null; directory: string | null };
export type PType = { type: string; role: string; pool: number; open: Open | null; locked: { hint: string; subtype: string | null }[]; moreLocked: number };
export const PREVIEW_V = 2;
export type Preview = { v?: number; total: number; week: number; opened: number; types: PType[]; made_at: string };

const hint = (m: Match) => [m.region ?? "Region not listed", m.size_band ? `${m.size_band} staff` : null].filter(Boolean).join(", ");

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
    // The open card prefers a directory company, so it has a real partner program page to link to.
    const open = t.matches.find((m) => m.program_id && slugs.has(m.program_id)) ?? t.matches[0] ?? null;
    const rest = t.matches.filter((m) => m !== open);
    return {
      type: t.type, role: t.role, pool: t.poolSize,
      open: open ? { name: open.name, website: open.website, reason: open.reason || (open.description ?? "").slice(0, 140), subtype: open.subtype, directory: open.program_id && slugs.get(open.program_id) ? `/directory/${slugs.get(open.program_id)}` : null } : null,
      locked: rest.slice(0, 4).map((m) => ({ hint: hint(m), subtype: m.subtype })),
      moreLocked: Math.max(0, t.poolSize - (open ? 1 : 0) - Math.min(4, rest.length)),
    };
  });
  return { v: PREVIEW_V, total: types.reduce((n, t) => n + t.pool, 0), week: await weekCount(results.map((t) => t.type)), opened: types.filter((t) => t.open).length, types, made_at: new Date().toISOString() };
}

// Reads the saved preview, or builds and saves it the first time.
export async function previewFor(s: Strategy & { preview?: Preview | null }): Promise<Preview> {
  if (s.preview && s.preview.types && s.preview.v === PREVIEW_V) return s.preview;
  const p = await buildPreview(s);
  await db(`builder_strategies?id=eq.${s.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ preview: p, preview_at: p.made_at }) });
  return p;
}
