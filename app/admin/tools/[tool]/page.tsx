import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";
import { hostOf, lines, toolBySlug } from "@/lib/admin/tools";

export const dynamic = "force-dynamic";
const PAGE = 50;
type Row = Record<string, unknown> & { id?: number; created_at: string; email: string; name?: string | null };

export default async function ToolPage({ params, searchParams }: { params: Promise<{ tool: string }>; searchParams: Promise<{ q?: string; p?: string }> }) {
  await requireStaff();
  const { tool } = await params;
  const t = toolBySlug(tool);
  if (!t) notFound();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1></div>;
  const { q = "", p = "1" } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const term = q.trim().replace(/[%*,()]/g, "");
  const toolFilter = t.filter ? `&${t.filter}` : "";
  const filter = toolFilter + (term ? `&email=ilike.*${encodeURIComponent(term)}*` : "");
  const r = await db(`${t.table}?select=*&order=created_at.desc&limit=${PAGE}&offset=${(page - 1) * PAGE}${filter}`, { headers: { Prefer: "count=exact" } });
  const rows: Row[] = r.ok ? await r.json() : [];
  const total = Number((r.headers.get("content-range") || "").split("/")[1]) || rows.length;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (np: number) => `/admin/tools/${t.slug}?q=${encodeURIComponent(term)}&p=${np}`;

  return (
    <div className="adm-card cut">
      <p style={{ margin: "0 0 14px" }}><Link href="/admin/tools" className="adm-link">Back to tools</Link></p>
      <h1>{t.label}</h1>
      <p className="adm-sub">{r.ok ? `${total} ${total === 1 ? "person" : "people"} used this tool.` : "This table cannot be read yet. Run the grants block at the end of supabase/admin.sql."} Click a row to see what they entered.</p>
      <form className="adm-tabs" style={{ alignItems: "center" }}>
        <input name="q" defaultValue={term} placeholder="Search by email" className="field" style={{ maxWidth: 280 }} />
        <button className="btn btn-s btn-sm" type="submit">Search</button>
      </form>
      {rows.length === 0 ? <div className="adm-empty">{r.ok ? "Nobody yet." : "No access."}</div> : (
        <div className="adm-use">
          <div className="adm-use-h"><span>Date</span><span>Name</span><span>Email</span><span>Company or type</span><span>Source</span></div>
          {rows.map((x, i) => {
            const detail = [
              ...lines(x.inputs, "inputs"), ...lines(x.results, "results"),
              ...(["url", "category", "goal", "playbook"] as const).flatMap((k) => (x[k] ? ([[k, String(x[k])]] as [string, string][]) : [])),
            ].filter(([k]) => k !== "Pdf key").map(([k, v]) => [k.replace(/^Inputs |^Results /, (m) => (m === "Inputs " ? "" : "Result: ")), v] as [string, string]);
            const pdfKey = t.slug === "builder" ? String((x.inputs as Record<string, unknown> | null)?.pdf_key || "") : "";
            const extra: [string, string][] = [
              ["Campaign", [x.utm_source, x.utm_medium, x.utm_campaign].filter(Boolean).join(" / ")],
              ["Came from", String(x.referrer || "")],
            ].filter(([, v]) => v) as [string, string][];
            const company = String(x.company || x.company_name || x.company_type || "-");
            return (
              <details key={x.id ?? i} className="adm-use-r">
                <summary>
                  <span>{x.created_at.slice(0, 10)}</span>
                  <span>{x.name || "-"}</span>
                  <span>{x.email}</span>
                  <span>{company}</span>
                  <span>{String(x.utm_source || hostOf(x.referrer as string) || "-")}</span>
                </summary>
                {t.slug === "builder" && (
                  <p style={{ margin: "10px 0 0" }}>
                    {pdfKey ? <a className="btn btn-s btn-sm" href={`/admin/tools/builder-pdf/${pdfKey}`} target="_blank" rel="noreferrer">Open the PDF that was sent</a> : <span className="adm-sub">No PDF was saved for this entry.</span>}
                  </p>
                )}
                <dl className="adm-dl adm-use-d">
                  {[...detail, ...extra].length === 0 ? <Fragment><dt>Details</dt><dd>Nothing else was saved.</dd></Fragment> : [...detail, ...extra].map(([k, v], j) => (<Fragment key={j}><dt>{k}</dt><dd>{v}</dd></Fragment>))}
                </dl>
              </details>
            );
          })}
        </div>
      )}
      {pages > 1 && (
        <div className="adm-tabs" style={{ marginTop: 18 }}>
          {page > 1 && <Link className="adm-tab" href={qs(page - 1)}>Previous</Link>}
          <span className="adm-tab on">Page {page} of {pages}</span>
          {page < pages && <Link className="adm-tab" href={qs(page + 1)}>Next</Link>}
        </div>
      )}
    </div>
  );
}
