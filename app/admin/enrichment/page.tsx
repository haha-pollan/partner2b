import Link from "next/link";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";
import { getState, processedToday } from "@/lib/enrich/run";
import { ALL_CATEGORIES, PARTNER_TYPES } from "@/lib/enrich/vocab";
import { hostOf } from "@/lib/enrich/fetch";
import { addSource, approveConfident, findNow, importDirectory, review, runNow, setCap, toggleSource, togglePause } from "./actions";
import SelectAll from "./SelectAll";
import Submit from "./Submit";

export const dynamic = "force-dynamic";
export const maxDuration = 300;
const PAGE = 50;

type Co = { id: number; domain: string; name: string; website: string; description: string | null; country: string | null; company_kind: string; partner_types: string[]; subtype: string | null; categories: string[]; serves_sizes: string[]; engages_at: string[]; has_program: boolean | null; program_url: string | null; confidence: number | null; status: string; source_url: string | null };
type Src = { id: number; url: string; label: string | null; partner_type_hint: string | null; category_hint: string | null; active: boolean; found_count: number; last_run_at: string | null; last_status: string | null; added_by: string };

async function count(path: string) {
  const r = await db(`${path}${path.includes("?") ? "&" : "?"}select=id&limit=1`, { headers: { Prefer: "count=exact" } });
  return r.ok ? Number((r.headers.get("content-range") || "").split("/")[1]) || 0 : 0;
}
const pillClass = (s: string) => (s === "approved" ? "added" : s === "pending" ? "in_review" : "rejected");
const when = (iso: string | null) => (iso ? iso.slice(0, 16).replace("T", " ") : "never");

export default async function Enrichment({ searchParams }: { searchParams: Promise<{ tab?: string; p?: string; q?: string; show?: string; msg?: string }> }) {
  const staff = await requireStaff();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1></div>;
  const { tab = "review", p = "1", q = "", show = "approved", msg = "" } = await searchParams;
  const isSuper = staff.role === "super_admin";
  const page = Math.max(1, Number(p) || 1);

  const [pending, approved, rejected, queued, sources, today, state] = await Promise.all([
    count("companies?status=eq.pending"), count("companies?status=eq.approved"), count("companies?status=eq.rejected"),
    count("enrich_queue?status=eq.queued"), count("enrich_sources?active=eq.true"), processedToday(), getState(),
  ]);

  let rows: Co[] = []; let total = 0; let srcs: Src[] = [];
  if (tab === "sources") {
    const r = await db("enrich_sources?select=*&order=id.desc&limit=200");
    srcs = r.ok ? await r.json() : [];
  } else {
    const term = q.trim().replace(/[%*,()]/g, "");
    const status = tab === "review" ? "pending" : ["approved", "pending", "rejected"].includes(show) ? show : "approved";
    const filter = `&status=eq.${status}${term ? `&name=ilike.*${encodeURIComponent(term)}*` : ""}`;
    const order = tab === "review" ? "confidence.desc.nullslast,id.asc" : "name.asc";
    const r = await db(`companies?select=*&order=${order}&limit=${PAGE}&offset=${(page - 1) * PAGE}${filter}`, { headers: { Prefer: "count=exact" } });
    rows = r.ok ? await r.json() : [];
    total = Number((r.headers.get("content-range") || "").split("/")[1]) || rows.length;
  }
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (np: number) => `/admin/enrichment?tab=${tab}&show=${show}&q=${encodeURIComponent(q)}&p=${np}`;
  const tabLink = (t: string, label: string) => <Link href={`/admin/enrichment?tab=${t}`} className={`btn btn-sm ${tab === t ? "btn-p" : "btn-s"}`}>{label}</Link>;

  return (
    <div className="adm-card cut">
      <h1>Company enrichment</h1>
      <p className="adm-sub">Builds the company database for partner discovery. It reads source pages, opens each company website, and files what it finds for your review. Company facts only, no personal data.</p>
      {msg ? <div className="adm-ok">{msg}</div> : null}

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", margin: "18px 0" }}>
        {[["Approved", approved], ["To review", pending], ["Queued", queued], ["Active sources", sources], ["Checked today", `${today} of ${state.daily_cap}`]].map(([l, n]) => (
          <div key={String(l)}><div className="adm-stat">{n}</div><div className="adm-sub">{l}</div></div>
        ))}
      </div>
      <p className="adm-sub">{state.paused ? "Paused. " : ""}Last run: {when(state.last_run_at)}{state.last_run_note ? `, ${state.last_run_note}` : ""}. The job also runs by itself every night.</p>

      {isSuper ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "14px 0 22px" }}>
          <form action={runNow}><Submit label="Run a batch now" busy="Running, this takes a few minutes" cls="btn-p" /></form>
          <form action={findNow}><Submit label="Find new sources" busy="Searching, about a minute" cls="btn-s" /></form>
          <form action={importDirectory}><Submit label="Add directory vendors" busy="Adding, about a minute" cls="btn-s" /></form>
          <form action={setCap} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input name="cap" type="number" defaultValue={state.daily_cap} min={10} max={3000} className="field" style={{ width: 90, padding: "8px 12px", fontSize: 15 }} aria-label="Daily cap" />
            <Submit label="Save daily cap" busy="Saving" cls="btn-s" />
          </form>
          <form action={togglePause}><input type="hidden" name="paused" value={state.paused ? "false" : "true"} /><Submit label={state.paused ? "Resume" : "Pause"} busy="Saving" cls="btn-s" /></form>
        </div>
      ) : null}

      <div className="adm-tabs">{tabLink("review", `Review (${pending})`)}{tabLink("companies", "Companies")}{tabLink("sources", "Sources")}</div>

      {tab === "sources" ? (
        <>
          <form action={addSource} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            <input name="url" placeholder="Page that lists companies, for example a partner finder" className="field" style={{ minWidth: 320, padding: "8px 14px", fontSize: 15 }} required />
            <input name="label" placeholder="Name (optional)" className="field" style={{ width: 180, padding: "8px 14px", fontSize: 15 }} />
            <select name="type" className="field" style={{ width: 200, padding: "8px 14px", fontSize: 15 }}><option value="">Partner type (optional)</option>{PARTNER_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            <select name="category" className="field" style={{ width: 220, padding: "8px 14px", fontSize: 15 }}><option value="">Category (optional)</option>{ALL_CATEGORIES.map((t) => <option key={t}>{t}</option>)}</select>
            <button className="btn btn-p btn-sm" type="submit">Add source</button>
          </form>
          {srcs.length === 0 ? <div className="adm-empty">No sources yet. Add a page that lists companies, or press Find new sources.</div> : (
            <table className="adm-table">
              <thead><tr><th>Source</th><th>Hints</th><th>Last run</th><th>Found</th><th></th></tr></thead>
              <tbody>{srcs.map((s) => (
                <tr key={s.id}>
                  <td><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>{s.label || hostOf(s.url)}</a><br /><span className="adm-sub">{hostOf(s.url)} · added by {s.added_by}</span></td>
                  <td>{[s.partner_type_hint, s.category_hint].filter(Boolean).join(", ") || "none"}</td>
                  <td>{when(s.last_run_at)}<br /><span className="adm-sub">{s.last_status || ""}</span></td>
                  <td>{s.found_count}</td>
                  <td><form action={toggleSource}><input type="hidden" name="id" value={s.id} /><input type="hidden" name="active" value={s.active ? "false" : "true"} /><button className="btn btn-s btn-sm" type="submit">{s.active ? "Pause" : "Resume"}</button></form></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </>
      ) : (
        <>
          {tab === "companies" ? (
            <form className="adm-tabs" style={{ alignItems: "center" }}>
              <input type="hidden" name="tab" value="companies" />
              <input name="q" defaultValue={q} placeholder="Search by name" className="field" style={{ maxWidth: 260, padding: "8px 14px", fontSize: 15 }} />
              <select name="show" defaultValue={show} className="field" style={{ maxWidth: 160, padding: "8px 14px", fontSize: 15 }}><option value="approved">Approved</option><option value="pending">To review</option><option value="rejected">Rejected</option></select>
              <button className="btn btn-s btn-sm" type="submit">Search</button>
            </form>
          ) : null}
          {tab === "review" && isSuper && pending > 0 ? <form action={approveConfident} style={{ marginBottom: 14 }}><Submit label="Approve everything with confidence 80 or more" busy="Approving" cls="btn-s" /></form> : null}
          {rows.length === 0 ? <div className="adm-empty">{tab === "review" ? "Nothing to review. Run a batch, or add sources." : "Nothing found."}</div> : (
            <form action={review}>
              <table className="adm-table">
                <thead><tr>{tab === "review" ? <th><SelectAll /></th> : null}<th>Company</th><th>Partner type</th><th>Categories</th><th>Serves</th><th>Partner program</th><th>Conf.</th><th>{tab === "review" ? "Source" : "Status"}</th></tr></thead>
                <tbody>{rows.map((c) => (
                  <tr key={c.id}>
                    {tab === "review" ? <td><input type="checkbox" name="id" value={c.id} aria-label={`Select ${c.name}`} /></td> : null}
                    <td><a href={c.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>{c.name}</a><br /><span className="adm-sub">{c.domain}{c.country ? ` · ${c.country}` : ""}</span>{c.description ? <div className="adm-sub">{c.description}</div> : null}</td>
                    <td>{c.partner_types.join(", ")}{c.subtype ? <><br /><span className="adm-sub">{c.subtype}</span></> : null}</td>
                    <td>{c.categories.join(", ") || "none"}</td>
                    <td>{[...c.serves_sizes, ...c.engages_at].join(", ") || "unknown"}</td>
                    <td>{c.has_program ? (c.program_url ? <a href={c.program_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Yes</a> : "Yes") : c.has_program === false ? "No page found" : "Unclear"}</td>
                    <td>{c.confidence ?? ""}</td>
                    <td>{tab === "review" ? (c.source_url ? hostOf(c.source_url) : "") : <span className={`adm-pill ${pillClass(c.status)}`}>{c.status === "pending" ? "To review" : c.status[0].toUpperCase() + c.status.slice(1)}</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
              {tab === "review" ? <div style={{ display: "flex", gap: 10, marginTop: 16 }}><button name="decision" value="approve" className="btn btn-p btn-sm" type="submit">Approve selected</button><button name="decision" value="reject" className="btn btn-s btn-sm" type="submit">Reject selected</button></div> : null}
            </form>
          )}
          <div style={{ display: "flex", gap: 16, marginTop: 18, fontSize: 15 }}>
            {page > 1 && <Link href={qs(page - 1)} style={{ textDecoration: "underline" }}>Previous</Link>}
            <span style={{ color: "var(--g500)" }}>Page {page} of {pages}, {total} companies</span>
            {page < pages && <Link href={qs(page + 1)} style={{ textDecoration: "underline" }}>Next</Link>}
          </div>
        </>
      )}
    </div>
  );
}
