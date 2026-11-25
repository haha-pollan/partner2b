"use server";
import { redirect } from "next/navigation";
import { db, logAction, requireStaff, requireSuper } from "@/lib/admin/session";
import { normaliseUrl } from "@/lib/builder2/intake";
import { hostOf, skipHost } from "@/lib/enrich/fetch";
import { fetchAll, findSources, runEnrichment } from "@/lib/enrich/run";
import { ALL_CATEGORIES, PARTNER_TYPES } from "@/lib/enrich/vocab";
import { slugify } from "@/lib/admin/programs";
import { AI_CATEGORIES } from "@/lib/ai";

const go = (q: Record<string, string>) => redirect(`/admin/enrichment?${new URLSearchParams(q).toString()}`);
const countOf = (r: Response) => Number((r.headers.get("content-range") || "").split("/")[1]) || 0;

type Approved = { id: number; name: string; website: string | null; domain: string; description: string | null; categories: string[]; partner_types: string[]; subtype: string | null; region: string | null; has_program: boolean | null; program_url: string | null; program_id: number | null };

// Directory program types are the ones the directory already uses. Services firms and agencies are "Services".
function directoryTypes(c: Approved): string[] {
  const sub = c.subtype ?? "";
  const out = new Set<string>();
  if (/reseller|distributor/i.test(sub)) out.add("Reseller");
  if (/referral|affiliate/i.test(sub)) out.add("Referral");
  if (/msp/i.test(sub)) out.add("MSP");
  if (/oem/i.test(sub)) out.add("OEM or white label");
  if (c.partner_types.includes("Channel Partner") && !out.size) out.add("Reseller");
  if (c.partner_types.some((t) => t === "Agency Partner" || t === "AI and Automation Partner") || /integrator|consult|agency|builder/i.test(sub)) out.add("Services");
  if (c.partner_types.includes("Technology Partner") || !out.size) out.add("Technology");
  return [...out];
}

// An approved company with a partner program page becomes an unpublished draft in the directory. Staff add the details and publish it from Programs.
async function draftForDirectory(c: Approved): Promise<"drafted" | "exists" | "skipped"> {
  if (c.has_program !== true || !c.program_url || c.program_id || !/^https?:\/\//i.test(c.program_url)) return "skipped";
  let dom = "";
  try { dom = new URL(c.program_url).host.replace(/^www\./, ""); } catch { return "skipped"; }
  const slug = slugify(c.name);
  if (!slug || !dom) return "skipped";
  const dup = await db(`programs?or=(slug.eq.${encodeURIComponent(slug)},domain.eq.${encodeURIComponent(dom)},domain.eq.${encodeURIComponent(c.domain)})&select=id&limit=1`);
  const d = dup.ok ? await dup.json() : [];
  if (d[0]) { await db(`companies?id=eq.${c.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ program_id: d[0].id }) }); return "exists"; }
  const category = c.categories.find((x) => ALL_CATEGORIES.includes(x)) ?? "";
  if (!category) return "skipped";
  const mx = await db("programs?select=id&order=id.desc&limit=1");
  const next = ((mx.ok ? (await mx.json())[0]?.id : 0) || 0) + 1;
  const clean = (t: string | null) => (t ?? "").replace(/[–—]/g, ",").replace(/!/g, ".").trim() || null;
  const types = directoryTypes(c);
  const ins = await db("programs", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({
    id: next, slug, company: c.name, product_category: category, program_types: types, primary_type: types[0], commission_models: ["Not published"], feature_tags: [],
    region: "Global", program_url: c.program_url, domain: dom, description: clean(c.description), company_description: clean(c.description), tiers: [], benefits: [], how_it_works: [],
    verification_status: "not_verified", published: false,
  }) });
  if (!ins.ok) return "skipped";
  await db(`companies?id=eq.${c.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ program_id: next }) });
  return "drafted";
}

async function applyReview(verb: string, ids: number[], f: FormData) {
  const staff = await requireStaff();
  const back = { tab: String(f.get("tab") || "review"), show: String(f.get("show") || "approved"), q: String(f.get("q") || "") };
  ids = ids.filter((n) => Number.isInteger(n) && n > 0).slice(0, 200);
  if (!ids.length || !["approve", "reject"].includes(verb)) return go({ ...back, msg: "Tick at least one company first" });
  const status = verb === "approve" ? "approved" : "rejected";
  const r = await db(`companies?id=in.(${ids.join(",")})&select=id,name,website,domain,description,categories,partner_types,subtype,region,has_program,program_url,program_id`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status }) });
  if (!r.ok) return go({ ...back, msg: `Could not save, nothing was changed (error ${r.status})` });
  const done: Approved[] = await r.json();
  if (!done.length) return go({ ...back, msg: "Nothing was changed, the company was not found" });
  await logAction(staff, `companies_${status}`, String(done.length), done.slice(0, 20).map((c) => c.id).join(","));
  const word = status === "approved" ? "Approved" : "Rejected";
  let drafted = 0;
  if (status === "approved") for (const c of done) if ((await draftForDirectory(c)) === "drafted") drafted++;
  const tail = drafted ? ` ${drafted} draft listing${drafted === 1 ? "" : "s"} added to the directory (Programs, Drafts to publish).` : "";
  return go({ ...back, msg: (done.length === 1 ? `${word}: ${done[0].name}.` : `${word} ${done.length} companies.`) + tail });
}

// Row buttons act on one company, the buttons under the list act on the ticked rows.
export async function reviewOne(verb: string, id: number, f: FormData) { return applyReview(verb, [id], f); }
export async function reviewMany(verb: string, f: FormData) { return applyReview(verb, f.getAll("id").map(Number), f); }

export async function approveConfident() {
  const staff = await requireSuper();
  const r = await db("companies?status=eq.pending&confidence=gte.80&select=id,name,website,domain,description,categories,partner_types,subtype,region,has_program,program_url,program_id", { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status: "approved" }) });
  if (!r.ok) return go({ tab: "review", msg: `Could not save, nothing was changed (error ${r.status})` });
  const done: Approved[] = await r.json();
  let drafted = 0;
  for (const c of done) if ((await draftForDirectory(c)) === "drafted") drafted++;
  await logAction(staff, "companies_approve_confident", String(done.length));
  go({ tab: "review", msg: `${done.length} approved (confidence 80 or more).${drafted ? ` ${drafted} draft listings added to the directory (Programs, Drafts to publish).` : ""}` });
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
