import { NextResponse } from "next/server";
import { compute, fromQuery } from "@/lib/assessment/model";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(key, list);
  return list.length > max;
}
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// Rebuilds the result from the answers on the server, so the PDF can never show a score the model did not produce.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("Something went wrong. Please try again."); }
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(`${ip}:assessment-pdf`, 20, 60 * 60 * 1000)) return fail("Too many requests. Please try again later.", 429);

  const raw = fromQuery(new URLSearchParams(String(body.q ?? "").slice(0, 2000)));
  if (!raw) return fail("We could not read your answers.");
  const r = compute(raw);

  try {
    const { renderAssessmentPdf } = await import("@/lib/assessment/AssessmentPdf");
    const pdf = await renderAssessmentPdf({ raw, r });
    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="Partner2B_Partner_Program_Assessment.pdf"', "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("assessment pdf failed:", e instanceof Error ? e.message : e);
    return fail("We could not create the PDF. Please try again.", 500);
  }
}
