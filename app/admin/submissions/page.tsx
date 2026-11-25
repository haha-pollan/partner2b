import Link from "next/link";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

const TABS: [string, string][] = [["new", "New"], ["in_review", "In review"], ["added", "Added"], ["rejected", "Rejected"], ["all", "All"]];
const KIND: Record<string, string> = { submit: "Add program", claim: "Claim", report: "Report" };
const LABEL: Record<string, string> = { new: "New", in_review: "In review", added: "Added", rejected: "Rejected" };

type Row = { id: number; created_at: string; kind: string; status: string | null; company: string | null; listing: string | null; name: string | null; email: string | null; replied_at: string | null };

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireStaff();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1><p className="adm-sub">SUPABASE_SERVICE_ROLE_KEY is not set.</p></div>;
  const { tab = "new" } = await searchParams;
  const t = TABS.some(([k]) => k === tab) ? tab : "new";
  const filter = t === "all" ? "" : t === "new" ? "&or=(status.is.null,status.eq.new)" : `&status=eq.${t}`;

  const [rowsRes, countRes] = await Promise.all([
    db(`submissions?select=id,created_at,kind,status,company,listing,name,email,replied_at${filter}&order=created_at.desc&limit=300`),
    db("submissions?select=status&limit=5000"),
  ]);
  const rows: Row[] = rowsRes.ok ? await rowsRes.json() : [];
  const all: { status: string | null }[] = countRes.ok ? await countRes.json() : [];
  const count = (k: string) => (k === "all" ? all.length : all.filter((r) => (k === "new" ? !r.status || r.status === "new" : r.status === k)).length);

  return (
    <div className="adm-card cut">
      <h1>Submissions</h1>
      <p className="adm-sub">Requests from the Add a program, Claim and Report forms.</p>
      <div className="adm-tabs">
        {TABS.map(([k, label]) => (
          <Link key={k} href={`/admin/submissions?tab=${k}`} className={`adm-tab${t === k ? " on" : ""}`}>{label}<span>{count(k)}</span></Link>
        ))}
      </div>
      {rows.length === 0 ? <div className="adm-empty">Nothing here.</div> : (
        <table className="adm-table">
          <thead><tr><th>Date</th><th>Type</th><th>Company or listing</th><th>Person</th><th>Status</th><th>Reply</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const st = r.status || "new";
              return (
                <tr key={r.id}>
                  <td>{r.created_at.slice(0, 10)}</td>
                  <td>{KIND[r.kind] ?? r.kind}</td>
                  <td><Link href={`/admin/submissions/${r.id}`}>{r.company || r.listing || "Open"}</Link></td>
                  <td>{r.name || "-"}</td>
                  <td><span className={`adm-pill ${st}`}>{LABEL[st] ?? st}</span></td>
                  <td>{r.replied_at ? "Sent" : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
