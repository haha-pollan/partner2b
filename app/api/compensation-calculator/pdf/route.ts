import { NextResponse } from "next/server";
import { compute } from "@/lib/comp/model";
import { fromQuery, toInputs } from "@/lib/comp/params";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(key, list);
  return list.length > max;
}
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// Rebuilds the numbers from the inputs on the server, so the PDF can never show figures the model did not produce.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("Something went wrong. Please try again."); }
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(`${ip}:compensation-pdf`, 20, 60 * 60 * 1000)) return fail("Too many requests. Please try again later.", 429);

  const q = String(body.q ?? "").slice(0, 2000);
  const raw = fromQuery(new URLSearchParams(q));
  if (!raw) return fail("We could not read your inputs.");
  const inputs = toInputs(raw);
  const r = compute(inputs);
  if (!r.ok) return fail(r.message);

  try {
    const { renderOnePager } = await import("@/lib/comp/OnePagerPdf");
    const pdf = await renderOnePager({ inputs, r });
    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="Partner2B_Partner_Compensation_Budget_One-pager.pdf"', "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("compensation pdf failed:", e instanceof Error ? e.message : e);
    return fail("We could not create the PDF. Please try again.", 500);
  }
}
