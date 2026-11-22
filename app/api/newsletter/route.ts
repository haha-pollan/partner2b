import { NextResponse } from "next/server";
import { URL as SB_URL, KEY } from "@/lib/programs";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(key, list);
  return list.length > max;
}
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 320;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("Something went wrong. Please try again."); }
  if (String(body.website_confirm ?? "").trim()) return NextResponse.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(`${ip}:newsletter`, 6, HOUR)) return fail("Too many requests. Please try again later.", 429);

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (body.consent !== true) return fail("Please tick the box to subscribe.");

  try {
    const res = await fetch(`${SB_URL}/rest/v1/newsletter_subscribers`, {
      method: "POST", cache: "no-store",
      headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ email, consent: true, source: String(body.source ?? "footer").slice(0, 60), referrer: String(body.referrer ?? "").slice(0, 500) || null }),
    });
    // 409 means this email is already subscribed, which is a success for the visitor
    if (!res.ok && res.status !== 409) { console.error("newsletter insert failed:", res.status); return fail("We could not save your email. Please try again in a moment.", 502); }
  } catch (e) {
    console.error("newsletter insert error:", e instanceof Error ? e.message : e);
    return fail("We could not save your email. Please try again in a moment.", 502);
  }
  return NextResponse.json({ ok: true });
}
