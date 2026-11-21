import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
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
const clip = (v: unknown, n: number) => { const s = String(v ?? "").trim().slice(0, n); return s || null; };
const HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("Something went wrong. Please try again."); }
  if (String(body.website_confirm ?? "").trim()) return fail("Something went wrong. Please try again.");

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(`${ip}:playbook`, 8, HOUR)) return fail("Too many requests. Please try again later.", 429);

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (body.consent !== true) return fail("Please tick the box so we can send you the playbook.");

  // 1. Save the lead. If this fails we do not hand out the file, so no download goes unrecorded.
  try {
    const res = await fetch(`${SB_URL}/rest/v1/playbook_downloads`, {
      method: "POST", cache: "no-store",
      headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        email, consent: true,
        name: clip(body.name, 200), company: clip(body.company, 200),
        utm_source: clip(body.utm_source, 200), utm_medium: clip(body.utm_medium, 200), utm_campaign: clip(body.utm_campaign, 200),
        referrer: clip(body.referrer, 500),
      }),
    });
    if (!res.ok) { console.error("playbook lead insert failed:", res.status); return fail("We could not save your details. Please try again in a moment.", 502); }
  } catch (e) {
    console.error("playbook lead insert error:", e instanceof Error ? e.message : e);
    return fail("We could not save your details. Please try again in a moment.", 502);
  }

  // 2. Return the PDF. It lives outside /public so it cannot be fetched without the form.
  try {
    const file = await readFile(path.join(process.cwd(), "private", "Partner2B_Playbook_2026.pdf"));
    return new Response(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Partner2B_Ecosystem-Led_Growth_Playbook_2026.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("playbook file read failed:", e instanceof Error ? e.message : e);
    return fail("The file is not available right now. Please try again shortly.", 500);
  }
}
