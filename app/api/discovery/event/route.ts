import { NextResponse } from "next/server";
import { URL as SB_URL } from "@/lib/programs";
import { storageHeaders, PDF_KEY_RE } from "@/lib/builder2/store";

export const runtime = "nodejs";
const EVENTS = new Set(["page_view", "see_more", "form_start", "card_click"]);
const hits = new Map<string, number[]>();
const limited = (k: string, max: number, ms: number) => { const now = Date.now(); const l = (hits.get(k) ?? []).filter((t) => now - t < ms); l.push(now); hits.set(k, l); return l.length > max; };

// Counts for the demand test. No personal data: only the strategy key, the event name and a short detail.
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip, 120, 3_600_000)) return NextResponse.json({ ok: false }, { status: 429 });
  const event = String(b.event ?? "");
  const id = String(b.strategy_id ?? "");
  if (!EVENTS.has(event) || !PDF_KEY_RE.test(id)) return NextResponse.json({ ok: false }, { status: 400 });
  const detail = typeof b.detail === "string" ? b.detail.slice(0, 100) : null;
  try {
    await fetch(`${SB_URL}/rest/v1/discovery_events`, { method: "POST", cache: "no-store", headers: storageHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify({ strategy_id: id, event, detail }) });
  } catch { /* losing a count is fine */ }
  return NextResponse.json({ ok: true });
}
