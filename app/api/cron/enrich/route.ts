import { NextResponse } from "next/server";
import { runEnrichment } from "@/lib/enrich/run";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Called by the Vercel cron (see vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: Request) {
  const secret = (process.env.CRON_SECRET || "").trim();
  if (!secret) return NextResponse.json({ ok: false, error: "CRON_SECRET is not set" }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const summary = await runEnrichment({ maxSeconds: 270, autoFind: true });
  return NextResponse.json({ ok: true, ...summary });
}
