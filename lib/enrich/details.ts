// Fills in region, company size served, stage and size band for approved companies that miss them.
// Only empty fields are written, so nothing already reviewed is overwritten. Each company is tried once.
import { db } from "@/lib/admin/session";
import { allowedByRobots, extract, hostOf, safeGet } from "./fetch";
import { askJson } from "./llm";
import { REGIONS, SIZES, SIZE_BANDS, STAGES, pick, pickOne } from "./vocab";

type Row = { id: number; website: string; region: string | null; country: string | null; serves_sizes: string[]; engages_at: string[]; size_band: string | null; serves_industries: string | null };
const MISSING = "or=(region.is.null,serves_sizes.eq.{},engages_at.eq.{})";
const clip = (s: unknown, n: number) => String(s ?? "").replace(/\s*[—–]\s*/g, ", ").replace(/\s+/g, " ").trim().slice(0, n);

const SYS = `You read the website of one B2B company and fill in details for a partner database. Use only the page content given. Return JSON:
{"region":"","country":"","serves_sizes":[],"engages_at":[],"size_band":"","serves_industries":""}
- region: where the company mainly sells or operates, one of ${JSON.stringify(REGIONS)}. Use "Global" if it clearly sells worldwide. "" if the page does not show it.
- country: country of the headquarters if shown, else "".
- serves_sizes: the customer sizes it serves, from ${JSON.stringify(SIZES)}. [] if unclear.
- engages_at: where it meets customers around a software purchase, from ${JSON.stringify(STAGES)} (Pre-use is advice and selection, In use is implementation and daily operation, Post-use is support, optimisation and renewal). A software vendor is usually In use. [] if unclear.
- size_band: company headcount, one of ${JSON.stringify(SIZE_BANDS)} or "" if the page does not say.
- serves_industries: at most 120 characters or "".
Never guess from the company name alone.`;

export async function countMissing(): Promise<number> {
  const r = await db(`companies?select=id&status=eq.approved&details_checked_at=is.null&${MISSING}&limit=1`, { headers: { Prefer: "count=exact" } });
  return r.ok ? Number((r.headers.get("content-range") || "").split("/")[1]) || 0 : 0;
}

async function one(c: Row): Promise<boolean> {
  const patch: Record<string, unknown> = { details_checked_at: new Date().toISOString() };
  try {
    const home = new URL(c.website).origin;
    if (hostOf(home) && (await allowedByRobots(home))) {
      const page = await safeGet(home);
      if (page.ok) {
        const ex = extract(page.html, page.url, 4000);
        if (ex.text.length >= 300) {
          const a = await askJson<{ region?: string; country?: string; serves_sizes?: unknown; engages_at?: unknown; size_band?: string; serves_industries?: string }>(SYS, `WEBSITE: ${home}\nTITLE: ${ex.title}\nDESCRIPTION: ${ex.description}\nPAGE TEXT:\n${ex.text}`);
          if (a) {
            const region = pickOne(a.region, REGIONS), sizes = pick(a.serves_sizes, SIZES), stages = pick(a.engages_at, STAGES), band = pickOne(a.size_band, SIZE_BANDS);
            if (!c.region && region) patch.region = region;
            if (!c.country && clip(a.country, 60)) patch.country = clip(a.country, 60);
            if (!c.serves_sizes.length && sizes.length) patch.serves_sizes = sizes;
            if (!c.engages_at.length && stages.length) patch.engages_at = stages;
            if (!c.size_band && band) patch.size_band = band;
            if (!c.serves_industries && clip(a.serves_industries, 120)) patch.serves_industries = clip(a.serves_industries, 120);
          }
        }
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("openai_")) throw e;
  }
  const r = await db(`companies?id=eq.${c.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
  return r.ok && Object.keys(patch).length > 1;
}

// Works in small rounds until the time budget is used. Returns how many companies got new details.
export async function fillDetails(maxMs: number): Promise<{ checked: number; filled: number }> {
  const t0 = Date.now(); let checked = 0, filled = 0;
  while (Date.now() - t0 < maxMs - 40_000) {
    const r = await db(`companies?select=id,website,region,country,serves_sizes,engages_at,size_band,serves_industries&status=eq.approved&details_checked_at=is.null&${MISSING}&order=id.asc&limit=18`);
    const rows: Row[] = r.ok ? await r.json() : [];
    if (!rows.length) break;
    const q = [...rows];
    await Promise.all(Array.from({ length: 6 }, async () => {
      for (let c = q.shift(); c; c = q.shift()) { if (await one(c)) filled++; checked++; }
    }));
  }
  return { checked, filled };
}
