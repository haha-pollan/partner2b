import { NextResponse } from "next/server";
import { URL as SB_URL, KEY } from "@/lib/programs";

export const runtime = "nodejs";

// Same pattern as app/api/pipeline-calculator/route.ts: honeypot, per-IP limit, email and consent checks,
// anon-key insert into Supabase, lead saved before anything is unlocked.
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(key, list);
  return list.length > max;
}
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 320;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const clip = (v: unknown, n: number) => { const s = String(v ?? "").trim().slice(0, n); return s || null; };
const small = (v: unknown) => {
  try { const s = JSON.stringify(v ?? null); return s.length <= 6000 ? JSON.parse(s) : null; } catch { return null; }
};
const HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("Something went wrong. Please try again."); }
  if (String(body.website_confirm ?? "").trim()) return fail("Something went wrong. Please try again.");

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(`${ip}:assessment`, 8, HOUR)) return fail("Too many requests. Please try again later.", 429);

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = [clip(body.first_name, 60), clip(body.last_name, 60)].filter(Boolean).join(" ");
  if (!name) return fail("Please enter your first and last name.");
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (body.consent !== true) return fail("Please tick the box so we can show you the full results.");

  try {
    const res = await fetch(`${SB_URL}/rest/v1/assessment_leads`, {
      method: "POST", cache: "no-store",
      headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        email, name: name.slice(0, 200), consent: true,
        inputs: small(body.inputs), results: small(body.results),
        utm_source: clip(body.utm_source, 200), utm_medium: clip(body.utm_medium, 200), utm_campaign: clip(body.utm_campaign, 200),
        referrer: clip(body.referrer, 500),
      }),
    });
    if (!res.ok) { console.error("assessment lead insert failed:", res.status); return fail("We could not save your details. Please try again in a moment.", 502); }
  } catch (e) {
    console.error("assessment lead insert error:", e instanceof Error ? e.message : e);
    return fail("We could not save your details. Please try again in a moment.", 502);
  }
  return NextResponse.json({ ok: true });
}
