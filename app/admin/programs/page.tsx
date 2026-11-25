import Link from "next/link";
import { db, requireStaff } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
const PAGE = 50;

type Row = { id: number; slug: string; company: string; product_category: string; primary_type: string; published: boolean };

export default async function Programs({ searchParams }: { searchParams: Promise<{ q?: string; show?: string; p?: string }> }) {
  await requireStaff();
  const { q = "", show = "all", p = "1" } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const term = q.trim().replace(/[%*,()]/g, "");
  let filter = term ? `&company=ilike.*${encodeURIComponent(term)}*` : "";
  if (show === "published") filter += "&published=eq.true";
  if (show === "unpublished") filter += "&published=eq.false";
  const r = await db(`programs?select=id,slug,company,product_category,primary_type,published&order=company.asc&limit=${PAGE}&offset=${(page - 1) * PAGE}${filter}`, { headers: { Prefer: "count=exact" } });
  const rows: Row[] = r.ok ? await r.json() : [];
  const total = Number((r.headers.get("content-range") || "").split("/")[1]) || rows.length;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (np: number) => `/admin/programs?q=${encodeURIComponent(term)}&show=${show}&p=${np}`;

  return (
    <div className="adm-card cut">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div><h1>Programs</h1><p className="adm-sub">{total} listings. View and update program info.</p></div>
        <Link href="/admin/programs/new" className="btn btn-p btn-sm">Add a program</Link>
      </div>
      <form className="adm-tabs" style={{ alignItems: "center" }}>
        <input name="q" defaultValue={term} placeholder="Search by company" className="field" style={{ maxWidth: 280, padding: "8px 14px", fontSize: 15 }} />
        <select name="show" defaultValue={show} className="field" style={{ maxWidth: 170, padding: "8px 14px", fontSize: 15 }}>
          <option value="all">All</option><option value="published">Published</option><option value="unpublished">Unpublished</option>
        </select>
        <button className="btn btn-s btn-sm" type="submit">Search</button>
      </form>
      {rows.length === 0 ? <div className="adm-empty">Nothing found.</div> : (
        <table className="adm-table">
          <thead><tr><th>Company</th><th>Category</th><th>Main type</th><th>Status</th></tr></thead>
          <tbody>{rows.map((x) => (
            <tr key={x.id}>
              <td><Link href={`/admin/programs/${x.id}`}>{x.company}</Link></td>
              <td>{x.product_category}</td><td>{x.primary_type}</td>
              <td><span className={`adm-pill ${x.published ? "added" : "in_review"}`}>{x.published ? "Published" : "Unpublished"}</span></td>
            </tr>
          ))}</tbody>
        </table>
      )}
      <div style={{ display: "flex", gap: 16, marginTop: 18, fontSize: 15 }}>
        {page > 1 && <Link href={qs(page - 1)} style={{ textDecoration: "underline" }}>Previous</Link>}
        <span style={{ color: "var(--g500)" }}>Page {page} of {pages}</span>
        {page < pages && <Link href={qs(page + 1)} style={{ textDecoration: "underline" }}>Next</Link>}
      </div>
    </div>
  );
}
