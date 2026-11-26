import { NextResponse } from "next/server";
import { URL as SB_URL } from "@/lib/programs";
import { storageHeaders, PDF_KEY_RE } from "@/lib/builder2/store";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";
const hits = new Map<string, number[]>();
const limited = (k: string, max: number, ms: number) => { const now = Date.now(); const l = (hits.get(k) ?? []).filter((t) => now - t < ms); l.push(now); hits.set(k, l); return l.length > max; };
const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : null);

const WHEN = ["This month", "This quarter", "Just exploring"];
const PAY = ["Yes", "Maybe", "Only if free"];
const SITE = "https://partner2b.com";

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

  let rowId: number | null = null;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/discovery_requests`, {
      method: "POST", cache: "no-store",
      headers: storageHeaders({ "Content-Type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify({ strategy_id: strategyId, email, when_needed: when, would_pay: pay, partner_type: ptype }),
    });
    if (!r.ok) return fail("Something went wrong. Try again.", 502);
    const rows = await r.json().catch(() => []);
    rowId = Array.isArray(rows) && rows[0]?.id ? Number(rows[0].id) : null;
  } catch { return fail("Something went wrong. Try again.", 502); }

  // Automatic emails: a confirmation to the visitor and a note to the team mailbox. Failures never block the request.
  let status = "skipped";
  try {
    let company = "";
    if (strategyId) {
      const s = await fetch(`${SB_URL}/rest/v1/builder_strategies?id=eq.${strategyId}&select=company_name&limit=1`, { cache: "no-store", headers: storageHeaders() });
      const rows = s.ok ? await s.json() : [];
      company = rows?.[0]?.company_name ?? "";
    }
    const link = strategyId ? `${SITE}/find-partners/${strategyId}` : `${SITE}/ai-tools`;
    const toVisitor = await sendMail({
      to: email,
      subject: "Your Partner2B early access request",
      text: `Hi,\n\nThank you for requesting early access to your partner matches on Partner2B. We have your request.\n\nFull access is opening soon. We will write to you as soon as it is ready, and you will be among the first to get it.\n\nYour matches are here any time: ${link}\n\nIf you want to tell us what you need from partner discovery, just reply to this email. A 15 minute call is welcome too.\n\nBest regards,\nPartner2B team`,
    });
    await sendMail({
      to: "hello@partner2b.com", replyTo: email,
      subject: `New early access request: ${email}`,
      text: `Email: ${email}\nCompany: ${company || "not known"}\nPartner type clicked: ${ptype || "none"}\nWhen they need partners: ${when || "not answered"}\nWould pay for full access: ${pay || "not answered"}\nTheir results: ${link}\n\nAll requests: ${SITE}/admin/requests`,
    });
    status = toVisitor;
  } catch { status = "failed"; }
  if (rowId) {
    try { await fetch(`${SB_URL}/rest/v1/discovery_requests?id=eq.${rowId}`, { method: "PATCH", cache: "no-store", headers: storageHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }), body: JSON.stringify({ email_status: status }) }); } catch { /* the request itself is saved */ }
  }
  return NextResponse.json({ ok: true });
}
