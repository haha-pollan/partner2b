import { NextResponse } from "next/server";
import { URL as SB_URL } from "@/lib/programs";
import { storageHeaders, PDF_KEY_RE } from "@/lib/builder2/store";

export const runtime = "nodejs";
const hits = new Map<string, number[]>();
const limited = (k: string, max: number, ms: number) => { const now = Date.now(); const l = (hits.get(k) ?? []).filter((t) => now - t < ms); l.push(now); hits.set(k, l); return l.length > max; };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : null);

const WHEN = ["This month", "This quarter", "Just exploring"];
const PAY = ["Yes", "Maybe", "Only if free"];

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return fail("Something went wrong. Try again."); }
  if (String(b.website_confirm ?? "").trim()) return fail("Something went wrong. Try again.");
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip, 8, 3_600_000)) return fail("Too many requests. Try again later.", 429);
  const email = String(b.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320 || b.consent !== true) return fail("Enter a valid email and tick the box.");
  const id = String(b.strategy_id ?? "");
  const strategyId = PDF_KEY_RE.test(id) ? id : null;
  const when = pick(b.when_needed, WHEN), pay = pick(b.would_pay, PAY);
  const ptype = typeof b.partner_type === "string" ? b.partner_type.slice(0, 60) : null;

  try {
    const r = await fetch(`${SB_URL}/rest/v1/discovery_requests`, {
      method: "POST", cache: "no-store",
      headers: storageHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ strategy_id: strategyId, email, when_needed: when, would_pay: pay, partner_type: ptype }),
    });
    if (!r.ok) return fail("Something went wrong. Try again.", 502);
  } catch { return fail("Something went wrong. Try again.", 502); }

  return NextResponse.json({ ok: true });
}
