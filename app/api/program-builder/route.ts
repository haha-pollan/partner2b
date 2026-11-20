import { NextResponse } from "next/server";
import { getPrograms, URL as SB_URL, KEY } from "@/lib/programs";
import { parseInput, generate, teaser } from "@/lib/builder/engine";
import { fetchSite } from "@/lib/builder/site";
import { buildPdf } from "@/lib/builder/pdf";

export const runtime = "nodejs";
export const maxDuration = 30;

const hits = new Map<string, number[]>();
function limited(ip: string, max: number) {
  const now = Date.now(), win = 60 * 60 * 1000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < win);
  list.push(now); hits.set(ip, list);
  return list.length > max;
}
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 320;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 400 }); }
  if (String(body.website_confirm ?? "").trim()) return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 400 });
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const action = body.action === "unlock" ? "unlock" : "preview";
  if (limited(ip + action, action === "unlock" ? 8 : 20)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again in an hour." }, { status: 429 });

  const parsed = parseInput((body.input ?? {}) as Record<string, unknown>);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const input = parsed.input;

  const email = String(body.email ?? "").trim();
  if (action === "unlock" && (!isEmail(email) || body.consent !== true))
    return NextResponse.json({ ok: false, error: "Please enter a valid email and tick the box to receive your report." }, { status: 400 });

  const [site, programs] = await Promise.all([fetchSite(input.url), getPrograms()]);
  const result = generate(input, site, programs);

  if (action === "preview") return NextResponse.json({ ok: true, teaser: teaser(result) });

  try {
    await fetch(`${SB_URL}/rest/v1/builder_leads`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ email, url: input.url, company_name: result.company.name, category: input.category, goal: input.goal, inputs: input }),
      cache: "no-store",
    });
  } catch { /* the report is still delivered */ }

  const pdf = await buildPdf(result);
  return NextResponse.json({ ok: true, result, pdf: Buffer.from(pdf).toString("base64") });
}
