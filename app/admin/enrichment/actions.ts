"use server";
import { redirect } from "next/navigation";
import { db, logAction, requireStaff, requireSuper } from "@/lib/admin/session";
import { normaliseUrl } from "@/lib/builder2/intake";
import { hostOf, skipHost } from "@/lib/enrich/fetch";
import { fetchAll, findSources, runEnrichment } from "@/lib/enrich/run";
import { ALL_CATEGORIES, PARTNER_TYPES } from "@/lib/enrich/vocab";
import { AI_CATEGORIES } from "@/lib/ai";

const go = (q: Record<string, string>) => redirect(`/admin/enrichment?${new URLSearchParams(q).toString()}`);
const countOf = (r: Response) => Number((r.headers.get("content-range") || "").split("/")[1]) || 0;

export async function review(f: FormData) {
  const staff = await requireStaff();
  const ids = f.getAll("id").map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 200);
  const decision = String(f.get("decision") ?? "");
  if (!ids.length || !["approve", "reject"].includes(decision)) go({ tab: "review" });
  const status = decision === "approve" ? "approved" : "rejected";
  await db(`companies?id=in.(${ids.join(",")})`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status }) });
  await logAction(staff, `companies_${status}`, String(ids.length), ids.slice(0, 20).join(","));
  go({ tab: "review", msg: `${ids.length} ${status}` });
}

export async function approveConfident() {
  const staff = await requireSuper();
  const r = await db("companies?status=eq.pending&confidence=gte.80", { method: "PATCH", headers: { Prefer: "return=minimal,count=exact" }, body: JSON.stringify({ status: "approved" }) });
  await logAction(staff, "companies_approve_confident", String(countOf(r)));
  go({ tab: "review", msg: `${countOf(r)} approved (confidence 80 or more)` });
}

export async function addSource(f: FormData) {
  const staff = await requireStaff();
  const url = normaliseUrl(String(f.get("url") ?? ""));
  if (!url || skipHost(hostOf(url))) return go({ tab: "sources", msg: "Enter a valid page address" });
  const label = String(f.get("label") ?? "").trim().slice(0, 80);
  const t = String(f.get("type") ?? ""), c = String(f.get("category") ?? "");
  const r = await db("enrich_sources", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ url, label: label || null, kind: "list", partner_type_hint: PARTNER_TYPES.includes(t) ? t : null, category_hint: ALL_CATEGORIES.includes(c) ? c : null, added_by: staff.email }) });
  await logAction(staff, "enrich_source_add", url);
  go({ tab: "sources", msg: r.ok ? "Source added. It is read in the next run." : "That page is already a source." });
}

export async function toggleSource(f: FormData) {
  const staff = await requireStaff();
  const id = Number(f.get("id")), active = String(f.get("active")) === "true";
  if (!Number.isInteger(id) || id < 1) go({ tab: "sources" });
  await db(`enrich_sources?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ active }) });
  await logAction(staff, "enrich_source_toggle", String(id), `active=${active}`);
  go({ tab: "sources" });
}

export async function runNow() {
  const staff = await requireSuper();
  const s = await runEnrichment({ maxSeconds: 200 });
  await logAction(staff, "enrich_run", undefined, s.note);
  go({ msg: s.note });
}

export async function findNow() {
  const staff = await requireSuper();
  let note = "";
  try { note = (await findSources()).note; } catch (e) { note = e instanceof Error && e.message === "not_configured" ? "OpenAI key missing" : "Source search failed"; }
  await logAction(staff, "enrich_find_sources", undefined, note);
  go({ tab: "sources", msg: note });
}

export async function setCap(f: FormData) {
  const staff = await requireSuper();
  const cap = Math.max(10, Math.min(3000, Math.round(Number(f.get("cap")) || 300)));
  await db("enrich_state?id=eq.1", { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ daily_cap: cap }) });
  await logAction(staff, "enrich_cap", undefined, String(cap));
  go({ msg: `Daily cap saved: ${cap} companies` });
}

export async function togglePause(f: FormData) {
  const staff = await requireSuper();
  const paused = String(f.get("paused")) === "true";
  await db("enrich_state?id=eq.1", { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ paused }) });
  await logAction(staff, "enrich_pause", undefined, `paused=${paused}`);
  go({ msg: paused ? "Paused. Nothing runs until you resume." : "Resumed" });
}

// Starting set: every published directory program becomes an approved vendor record.
export async function importDirectory() {
  const staff = await requireSuper();
  const rows = await fetchAll<{ id: number; company: string; domain: string | null; product_category: string | null; program_url: string | null }>("programs?select=id,company,domain,product_category,program_url&published=eq.true&order=id.asc");
  const aiPartners = AI_CATEGORIES.some((c) => c.name === "AI integrators and consultancies") ? "AI integrators and consultancies" : "";
  const body = rows.filter((p) => p.domain && p.company).map((p) => {
    const domain = String(p.domain).toLowerCase().replace(/^www\./, "");
    const side = !!aiPartners && p.product_category === aiPartners;
    return {
      domain, name: p.company, website: `https://${domain}`, company_kind: side ? "partner_side" : "vendor",
      partner_types: side ? ["Agency Partner", "AI and Automation Partner"] : ["Technology Partner"], categories: p.product_category ? [p.product_category] : [],
      has_program: true, program_url: p.program_url, program_id: p.id, status: "approved", added_by: "directory", confidence: 100, source_url: "https://partner2b.com/directory",
    };
  });
  let added = 0;
  for (let i = 0; i < body.length; i += 200) {
    const res = await db("companies?on_conflict=domain&select=id", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify(body.slice(i, i + 200)) });
    if (res.ok) added += ((await res.json()) as unknown[]).length;
  }
  await logAction(staff, "enrich_import_directory", String(added));
  go({ msg: `${added} directory programs added as vendors` });
}
