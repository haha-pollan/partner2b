import { db } from "@/lib/admin/session";
import { tidy } from "@/lib/builder2/parse";
import { normaliseUrl } from "@/lib/builder2/intake";
import { allowedByRobots, extract, hostOf, safeGet, skipHost } from "./fetch";
import { askJson, askWithSearch, jsonFrom } from "./llm";
import { ALL_CATEGORIES, KINDS, PARTNER_TYPES, REGIONS, SIZES, SIZE_BANDS, STAGES, SUBTYPES, TYPE_WORDS, pick, pickOne } from "./vocab";

type Source = { id: number; url: string; label: string | null; kind: string; partner_type_hint: string | null; category_hint: string | null; found_count: number };
type QRow = { id: number; domain: string; name: string | null; url: string; source_id: number | null; partner_type_hint: string | null; category_hint: string | null; needs_resolve: boolean; attempts: number; enrich_sources?: { url: string } | null };
export type RunSummary = { sources: number; queued: number; processed: number; added: number; skipped: number; failed: number; note: string };

const DAY = 86_400_000;
const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
const clip = (s: unknown, n: number) => tidy(String(s ?? "")).replace(/\s+/g, " ").trim().slice(0, n);

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) await fn(items[i++]); }));
}

async function known(domains: string[]) {
  const out = new Set<string>();
  for (const part of chunk(domains, 60)) {
    const list = part.map(encodeURIComponent).join(",");
    for (const t of ["companies", "enrich_queue"]) {
      const r = await db(`${t}?select=domain&domain=in.(${list})`);
      if (r.ok) for (const x of (await r.json()) as { domain: string }[]) out.add(x.domain);
    }
  }
  return out;
}

export async function getState() {
  const r = await db("enrich_state?id=eq.1&select=*");
  const rows = r.ok ? await r.json() : [];
  return (rows[0] ?? { paused: false, daily_cap: 300, last_run_at: null, last_run_note: null }) as { paused: boolean; daily_cap: number; last_run_at: string | null; last_run_note: string | null };
}

export async function processedToday() {
  const since = new Date(); since.setUTCHours(0, 0, 0, 0);
  const r = await db(`enrich_queue?select=id&processed_at=gte.${since.toISOString()}&limit=1`, { headers: { Prefer: "count=exact" } });
  return Number((r.headers.get("content-range") || "").split("/")[1]) || 0;
}

// ---------- Stage 1: read a source page and queue the companies listed on it ----------
const HARVEST_SYS = `You read one web page that lists companies: for example a partner finder, a member list, a marketplace listing or a "top companies" list.
Return JSON: {"companies":[{"name":"...","url":"..."}],"next_pages":["..."]}.
Rules:
- Include only companies that appear as listed entries. Skip navigation, the owner of the page, social networks, and generic tools.
- Each url must be copied exactly from the LINKS list: the company's own website if it is linked, otherwise the link to its profile page on this site.
- At most 150 companies. next_pages are links to further pages of the same list (pagination), at most 5, copied exactly from LINKS.
- If the page does not list companies, return {"companies":[],"next_pages":[]}.`;

async function harvest(src: Source): Promise<{ found: number; added: number; note: string }> {
  if (!(await allowedByRobots(src.url))) return { found: 0, added: 0, note: "skipped: blocked by robots.txt" };
  const page = await safeGet(src.url);
  if (!page.ok) return { found: 0, added: 0, note: `error: ${page.error}` };
  const ex = extract(page.html, page.url, 5000);
  const srcHost = hostOf(page.url);
  const linkSet = new Set(ex.links.map((l) => l.href));
  const linksTxt = ex.links.map((l) => `${l.text} | ${l.href}`).join("\n").slice(0, 30_000);
  const out = await askJson<{ companies?: { name?: string; url?: string }[]; next_pages?: string[] }>(HARVEST_SYS, `PAGE TITLE: ${ex.title}\nPAGE TEXT:\n${ex.text}\n\nLINKS (text | url):\n${linksTxt}`);
  const list = (out?.companies ?? []).filter((c) => c?.url && linkSet.has(String(c.url))).slice(0, 150);
  const rows: Record<string, unknown>[] = []; const seen = new Set<string>();
  for (const c of list) {
    const u = new URL(String(c.url)); const host = hostOf(u.toString());
    if (skipHost(host)) continue;
    const profile = host === srcHost || host.endsWith("." + srcHost);
    const domain = profile ? `profile:${host}${u.pathname}` : host;
    if (seen.has(domain)) continue; seen.add(domain);
    rows.push({ domain, name: clip(c.name, 120) || null, url: profile ? u.toString() : u.origin, source_id: src.id, partner_type_hint: src.partner_type_hint, category_hint: src.category_hint, needs_resolve: profile });
  }
  const fresh = new Set(rows.map((r) => r.domain as string));
  for (const d of await known(rows.filter((r) => !r.needs_resolve).map((r) => r.domain as string))) fresh.delete(d);
  const insert = rows.filter((r) => fresh.has(r.domain as string));
  let added = 0;
  for (const part of chunk(insert, 100)) {
    const r = await db("enrich_queue?on_conflict=domain&select=id", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify(part) });
    if (r.ok) added += ((await r.json()) as unknown[]).length;
  }
  const more = (out?.next_pages ?? []).filter((p) => linkSet.has(String(p)) && hostOf(String(p)) === srcHost && String(p) !== src.url).slice(0, 5);
  if (more.length) {
    await db("enrich_sources?on_conflict=url", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(more.map((url) => ({ url, label: `${src.label || srcHost} (more)`, kind: src.kind, partner_type_hint: src.partner_type_hint, category_hint: src.category_hint, added_by: "enrichment" }))) });
  }
  return { found: list.length, added, note: `ok: ${list.length} listed, ${added} new` };
}

// ---------- Stage 2: open each company's own website and classify it ----------
const RESOLVE_SYS = `You are given a company profile page on a directory site and the external links on it. Return JSON {"website":"..."} with the link that is the company's own website, copied exactly from the list, or {"website":null} if none is clearly the company's own site.`;

const CLASSIFY_SYS = `You classify one company from its website for a database of B2B partners. Use only the page content given. Return JSON with these keys:
{"relevant":true|false,"name":"","description":"","country":"","region":"","company_kind":"","partner_types":[],"subtype":"","categories":[],"serves_sizes":[],"serves_industries":"","engages_at":[],"size_band":"","has_program":true|false|null,"program_url":null,"confidence":0}
Rules:
- relevant is true only for a B2B technology company or a B2B service provider (agency, consultancy, integrator, MSP, reseller, community, media) that could work with software vendors as a partner or run its own partner program. Consumer brands, shops, individuals, and unrelated businesses are false.
- description: one plain sentence, at most 200 characters, what the company does. No dashes, no exclamation marks.
- country: the country name of the headquarters if the page shows it, otherwise "".
- region: one of ${JSON.stringify(REGIONS)} or "".
- company_kind: "vendor" if it sells its own software or platform, "partner_side" if it is a services firm, reseller, agency, community or media.
- partner_types: from ${JSON.stringify(PARTNER_TYPES)}. A software vendor is usually "Technology Partner". Add "AI and Automation Partner" only if AI or automation is its product or service. Agencies, consultancies and integrators are "Agency Partner". Resellers, distributors and referral firms are "Channel Partner". Communities, associations, newsletters and media are "Community Partner". "Strategic Partner" only for large platform ecosystems.
- subtype: one of ${JSON.stringify(SUBTYPES)} or "".
- categories: up to 3 from ${JSON.stringify(ALL_CATEGORIES)}, the product space the company works in or serves.
- serves_sizes: from ${JSON.stringify(SIZES)}. serves_industries: at most 120 characters or "".
- engages_at: where the company meets its customers around a software purchase: from ${JSON.stringify(STAGES)} (Pre-use is advice and selection, In use is implementation and daily operation, Post-use is support, optimisation and renewal).
- size_band: one of ${JSON.stringify(SIZE_BANDS)} or "" if the page does not say.
- has_program: true if the links show the company runs a partner, reseller, channel or affiliate program that other companies can join. false if there is clearly none. null if unclear. program_url: copy exactly from PARTNER LINKS, or null.
- confidence: 0 to 100, how sure you are that every field above is right.`;

type Classified = { relevant?: boolean; name?: string; description?: string; country?: string; region?: string; company_kind?: string; partner_types?: unknown; subtype?: string; categories?: unknown; serves_sizes?: unknown; serves_industries?: string; engages_at?: unknown; size_band?: string; has_program?: boolean | null; program_url?: string | null; confidence?: number };

const PARTNER_LINK = /partner|reseller|channel|alliance|affiliate|integrat|ecosystem|marketplace|referral/i;

async function mark(row: QRow, status: "queued" | "done" | "failed" | "skipped", note: string, extra: Record<string, unknown> = {}) {
  await db(`enrich_queue?id=eq.${row.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status, note: note.slice(0, 200), attempts: row.attempts + (status === "queued" ? 1 : 0), processed_at: status === "queued" ? null : new Date().toISOString(), ...extra }) });
}

async function enrichOne(row: QRow, programs: Map<string, number>): Promise<"added" | "skipped" | "failed" | "retry"> {
  let website = row.url;
  if (row.needs_resolve) {
    if (!(await allowedByRobots(row.url))) { await mark(row, "skipped", "profile page blocked by robots.txt"); return "skipped"; }
    const prof = await safeGet(row.url);
    if (!prof.ok) { await mark(row, row.attempts >= 1 ? "failed" : "queued", `profile: ${prof.error}`); return row.attempts >= 1 ? "failed" : "retry"; }
    const ex = extract(prof.html, prof.url, 2500);
    const ext = ex.links.filter((l) => { const h = hostOf(l.href); return h && !skipHost(h) && h !== hostOf(prof.url); });
    const r = await askJson<{ website?: string | null }>(RESOLVE_SYS, `COMPANY: ${row.name ?? ""}\nPAGE TEXT:\n${ex.text}\n\nEXTERNAL LINKS:\n${ext.map((l) => `${l.text} | ${l.href}`).join("\n").slice(0, 8000)}`);
    const w = r?.website && ext.some((l) => l.href === r.website) ? new URL(String(r.website)).origin : "";
    if (!w) { await mark(row, "skipped", "no own website found on profile page"); return "skipped"; }
    const d = hostOf(w);
    if ((await known([d])).size) { await mark(row, "skipped", "already known"); return "skipped"; }
    const u = await db(`enrich_queue?id=eq.${row.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ domain: d, url: w, needs_resolve: false }) });
    if (!u.ok) { await mark(row, "skipped", "already queued"); return "skipped"; }
    website = w; row = { ...row, domain: d, url: w };
  }
  const home = new URL(website).origin; const domain = hostOf(home);
  if (skipHost(domain)) { await mark(row, "skipped", "not a company site"); return "skipped"; }
  if (!(await allowedByRobots(home))) { await mark(row, "skipped", "blocked by robots.txt"); return "skipped"; }
  const page = await safeGet(home);
  if (!page.ok) { const dead = row.attempts >= 1; await mark(row, dead ? "failed" : "queued", `site: ${page.error}`); return dead ? "failed" : "retry"; }
  const ex = extract(page.html, page.url, 5000);
  const pl = ex.links.filter((l) => { const h = hostOf(l.href); return (h === domain || h.endsWith("." + domain)) && (PARTNER_LINK.test(l.text) || PARTNER_LINK.test(new URL(l.href).pathname)); }).slice(0, 15);
  const hints = [row.partner_type_hint && `Hint from the source list: partner type ${row.partner_type_hint}.`, row.category_hint && `Hint from the source list: category ${row.category_hint}.`].filter(Boolean).join(" ");
  const c = await askJson<Classified>(CLASSIFY_SYS, `WEBSITE: ${home}\nNAME FROM LIST: ${row.name ?? ""}\n${hints}\nTITLE: ${ex.title}\nDESCRIPTION: ${ex.description}\nPAGE TEXT:\n${ex.text}\n\nPARTNER LINKS (text | url):\n${pl.map((l) => `${l.text} | ${l.href}`).join("\n")}`);
  if (!c) { await mark(row, row.attempts >= 1 ? "failed" : "queued", "model gave no answer"); return row.attempts >= 1 ? "failed" : "retry"; }
  const types = pick(c.partner_types, PARTNER_TYPES), cats = pick(c.categories, ALL_CATEGORIES).slice(0, 3);
  if (c.relevant === false || !types.length) { await mark(row, "skipped", "not a fit"); return "skipped"; }
  const progOk = c.program_url && pl.some((l) => l.href === c.program_url) ? String(c.program_url) : null;
  const hasProgram = c.has_program === true || c.has_program === false ? c.has_program : null;
  let conf = Math.max(0, Math.min(100, Math.round(Number(c.confidence) || 0)));
  if (ex.text.length < 400) conf = Math.min(conf, 40);
  if (!cats.length) conf = Math.min(conf, 50);
  const body = {
    domain, name: clip(c.name, 120) || row.name || domain, website: home, description: clip(c.description, 220) || null, country: clip(c.country, 60) || null, region: pickOne(c.region, REGIONS),
    company_kind: pickOne(c.company_kind, KINDS) ?? "partner_side", partner_types: types, subtype: pickOne(c.subtype, SUBTYPES), categories: cats, serves_sizes: pick(c.serves_sizes, SIZES),
    serves_industries: clip(c.serves_industries, 120) || null, engages_at: pick(c.engages_at, STAGES), size_band: pickOne(c.size_band, SIZE_BANDS), has_program: hasProgram, program_url: hasProgram ? progOk : null,
    program_id: programs.get(domain) ?? null, source_url: row.enrich_sources?.url ?? null, confidence: conf, status: "pending", added_by: "enrichment", checked_at: new Date().toISOString(),
  };
  const r = await db("companies?on_conflict=domain", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify(body) });
  if (!r.ok) { await mark(row, "failed", `save failed ${r.status}`); return "failed"; }
  await mark(row, "done", "added for review");
  return "added";
}

// ---------- Stage 3: find new source pages where our coverage is thinnest ----------
export async function findSources(): Promise<{ added: number; note: string }> {
  const r = await db("companies?select=categories,partner_types&status=neq.rejected&limit=20000");
  const rows: { categories: string[]; partner_types: string[] }[] = r.ok ? await r.json() : [];
  const count = new Map<string, number>();
  for (const x of rows) for (const cat of x.categories) for (const t of x.partner_types) count.set(`${cat}|${t}`, (count.get(`${cat}|${t}`) ?? 0) + 1);
  const combos = ALL_CATEGORIES.flatMap((cat) => Object.keys(TYPE_WORDS).map((t) => ({ cat, t, n: count.get(`${cat}|${t}`) ?? 0 }))).sort((a, b) => a.n - b.n || Math.random() - 0.5);
  const pickc = combos[Math.floor(Math.random() * Math.min(5, combos.length))];
  const text = await askWithSearch(`Find up to 6 public web pages that list companies of this kind: ${TYPE_WORDS[pickc.t]}, working in or serving the "${pickc.cat}" space. Good pages are partner finder or solution provider directories run by software vendors, marketplace listing pages, industry association member lists and published lists of top companies. Do not return a single company's home page, blog posts about one company, or pages that need a login. Answer with JSON only: {"sources":[{"url":"https://...","label":"short name"}]}`);
  const j = jsonFrom(text) as { sources?: { url?: string; label?: string }[] } | null;
  const items = (j?.sources ?? []).map((s) => ({ url: normaliseUrl(String(s.url ?? "")), label: clip(s.label, 80) })).filter((s): s is { url: string; label: string } => !!s.url && !skipHost(hostOf(s.url))).slice(0, 6);
  let added = 0;
  if (items.length) {
    const res = await db("enrich_sources?on_conflict=url&select=id", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify(items.map((s) => ({ url: s.url, label: s.label || null, kind: "list", partner_type_hint: pickc.t, category_hint: pickc.cat, added_by: "enrichment" }))) });
    if (res.ok) added = ((await res.json()) as unknown[]).length;
  }
  return { added, note: `looked for ${TYPE_WORDS[pickc.t]} in ${pickc.cat}: ${added} new source${added === 1 ? "" : "s"}` };
}

// ---------- The job ----------
export async function runEnrichment(opts: { maxSeconds: number; autoFind?: boolean }): Promise<RunSummary> {
  const t0 = Date.now(); const left = () => opts.maxSeconds * 1000 - (Date.now() - t0);
  const s: RunSummary = { sources: 0, queued: 0, processed: 0, added: 0, skipped: 0, failed: 0, note: "" };
  const state = await getState();
  const save = async (note: string) => { s.note = note; await db("enrich_state?id=eq.1", { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_run_at: new Date().toISOString(), last_run_note: note.slice(0, 300) }) }); return s; };
  if (state.paused) return save("paused, nothing run");

  const stale = new Date(Date.now() - 14 * DAY).toISOString();
  const dr = await db(`enrich_sources?active=eq.true&or=(last_run_at.is.null,last_run_at.lt.${stale})&order=last_run_at.asc.nullsfirst&limit=3&select=*`);
  const due: Source[] = dr.ok ? await dr.json() : [];
  for (const src of due) {
    if (left() < 90_000) break;
    let res: { found: number; added: number; note: string };
    try { res = await harvest(src); } catch (e) { if (e instanceof Error && e.message === "not_configured") return save("OpenAI key missing"); res = { found: 0, added: 0, note: `error: ${e instanceof Error ? e.message : "failed"}` }; }
    await db(`enrich_sources?id=eq.${src.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ last_run_at: new Date().toISOString(), last_status: res.note.slice(0, 200), found_count: src.found_count + res.added }) });
    s.sources++; s.queued += res.added;
  }

  const pr = await db("programs?select=id,domain&limit=5000");
  const programs = new Map<string, number>();
  if (pr.ok) for (const p of (await pr.json()) as { id: number; domain: string | null }[]) if (p.domain) programs.set(String(p.domain).toLowerCase().replace(/^www\./, ""), p.id);

  let capLeft = state.daily_cap - (await processedToday());
  let moreQueued = true;
  while (left() > 45_000 && capLeft > 0) {
    const take = Math.min(18, capLeft);
    const qr = await db(`enrich_queue?status=eq.queued&attempts=lt.3&order=id.asc&limit=${take}&select=*,enrich_sources(url)`);
    const rows: QRow[] = qr.ok ? await qr.json() : [];
    if (!rows.length) { moreQueued = false; break; }
    try {
      await pool(rows, 6, async (row) => {
        let out: "added" | "skipped" | "failed" | "retry";
        try { out = await enrichOne(row, programs); } catch (e) { if (e instanceof Error && e.message.startsWith("openai_")) throw e; await mark(row, row.attempts >= 1 ? "failed" : "queued", "unexpected error"); out = row.attempts >= 1 ? "failed" : "retry"; }
        s.processed++; if (out === "added") s.added++; else if (out === "skipped") s.skipped++; else if (out === "failed") s.failed++;
      });
    } catch (e) { return save(`stopped: ${e instanceof Error ? e.message : "OpenAI error"}; ${s.added} added`); }
    capLeft -= rows.length;
  }

  let found = "";
  if (opts.autoFind && !moreQueued && !due.length && left() > 60_000) {
    try { found = `; ${(await findSources()).note}`; } catch { found = "; source search failed"; }
  }
  return save(`${s.sources} source page${s.sources === 1 ? "" : "s"} read, ${s.queued} queued, ${s.added} added for review, ${s.skipped} skipped, ${s.failed} failed${capLeft <= 0 ? ", daily cap reached" : ""}${found}`);
}
