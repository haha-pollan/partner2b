import { buildEconomics } from "@/lib/builder2/economics";
import { NextResponse } from "next/server";
import { URL as SB_URL, KEY } from "@/lib/programs";
import { parseIntake, normaliseUrl } from "@/lib/builder2/intake";
import { fetchBrand, cleanBrand } from "@/lib/builder2/brand";
import { generateStrategy } from "@/lib/builder2/ai";
import { parse, looksComplete } from "@/lib/builder2/parse";

export const runtime = "nodejs";
export const maxDuration = 300;

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now); hits.set(key, list);
  return list.length > max;
}
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 320;
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const DAY = 24 * 60 * 60 * 1000, HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return fail("Something went wrong. Please try again."); }
  if (String(body.website_confirm ?? "").trim()) return fail("Something went wrong. Please try again.");
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

  if (body.action === "prefill") {
    if (limited(`${ip}:prefill`, 30, HOUR)) return fail("Too many requests. Please try again later.", 429);
    const url = normaliseUrl(String(body.website ?? ""));
    if (!url) return fail("Please enter a valid company website.");
    const { fetchSite } = await import("@/lib/builder/site");
    const [site, brand] = await Promise.all([fetchSite(url), fetchBrand(url)]);
    return NextResponse.json({ ok: true, name: site.name, description: site.description, color: brand.color, logo: brand.logo });
  }

  // generate
  const email = String(body.email ?? "").trim();
  if (!isEmail(email) || body.consent !== true) return fail("Please enter a valid email and tick the box to receive your report.");
  if (limited(`${ip}:gen`, 6, HOUR) || limited("all:gen", Number(process.env.BUILDER_DAILY_CAP || 150), DAY)) return fail("We have reached today's limit for new strategies. Please try again tomorrow.", 429);
  const parsed = parseIntake((body.input ?? {}) as Record<string, unknown>);
  if (!parsed.ok) return fail(parsed.error);
  const { intake, vertical, acvAverage } = parsed;
  const brand = cleanBrand((body.brand ?? {}) as { color?: unknown; logo?: unknown });

  try {
    await fetch(`${SB_URL}/rest/v1/builder_leads`, {
      method: "POST", cache: "no-store",
      headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ email, url: intake.website, company_name: intake.companyName, category: intake.category, goal: intake.programGoals.join("; "), inputs: intake }),
    });
  } catch { /* the report is still delivered */ }

  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 270_000);
  try {
    let blocks = [] as ReturnType<typeof parse>;
    for (let attempt = 0; attempt < 2; attempt++) {
      const text = await generateStrategy(intake, vertical, acvAverage, ctl.signal);
      blocks = parse(text);
      if (looksComplete(blocks)) break;
      blocks = [];
    }
    if (!blocks.length) return fail("The strategy did not come out complete. Please try again.", 502);
    const { renderPlan } = await import("@/lib/builder2/PlanPdf");
    const pdf = await renderPlan({ title: `${intake.companyName} partner program strategy`, company: intake.companyName, accent: brand.color || "#5B3FE0", logo: brand.logo, blocks, econ: buildEconomics(intake, vertical, acvAverage).chart, sharePercent: intake.partnerRevenueSharePercent, contactName: intake.contactName, website: intake.website, goals: intake.programGoals, category: intake.category, region: intake.region, audience: intake.audience });
    return NextResponse.json({ ok: true, company: intake.companyName, pdf: pdf.toString("base64") });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "not_configured") return fail("The builder is not switched on yet.", 503);
    if (ctl.signal.aborted) return fail("This took longer than expected. Please try again.", 504);
    console.error("program-builder failed:", msg);
    return NextResponse.json({ ok: false, error: "Something went wrong while writing your strategy. Please try again.", detail: msg.slice(0, 80) }, { status: 502 });
  } finally { clearTimeout(timer); }
}
