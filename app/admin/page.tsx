import Link from "next/link";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

const DAY = 86_400_000;
const KIND: Record<string, string> = { submit: "Add program", claim: "Claim", report: "Report" };
const TOOLS: [string, string][] = [
  ["assessment_leads", "Assessment"],
  ["calculator_leads", "Pipeline calculator"],
  ["builder_leads", "Program builder"],
  ["playbook_downloads", "Playbook"],
  ["newsletter_subscribers", "Newsletter"],
];

type Sub = { id: number; created_at: string; kind: string; status: string | null; company: string | null; listing: string | null; name: string | null };
type Lead = { created_at: string; email: string };
type Prog = { id: number; slug: string; company: string; description: string | null; company_description: string | null; commission_models: string[] | null; published: boolean };
type Log = { at: string; staff_email: string; action: string; target: string | null };

async function rows<T>(path: string): Promise<T[] | null> {
  try {
    const r = await db(path);
    return r.ok ? ((await r.json()) as T[]) : null;
  } catch { return null; }
}

function ago(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
  return d <= 0 ? "today" : d === 1 ? "1 day" : `${d} days`;
}

export default async function Dashboard() {
  const staff = await requireStaff();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1><p className="adm-sub">SUPABASE_SERVICE_ROLE_KEY is not set.</p></div>;
  const isSuper = staff.role === "super_admin";

  const [subs, progs, log, ...leadSets] = await Promise.all([
    rows<Sub>("submissions?select=id,created_at,kind,status,company,listing,name&order=created_at.asc&limit=5000"),
    rows<Prog>("programs?select=id,slug,company,description,company_description,commission_models,published&limit=2000"),
    rows<Log>(`admin_log?select=at,staff_email,action,target&order=at.desc&limit=8${isSuper ? "" : `&staff_email=eq.${encodeURIComponent(staff.email)}`}`),
    ...TOOLS.map(([t]) => rows<Lead>(`${t}?select=created_at,email&order=created_at.desc&limit=1000`)),
  ]);

  const now = Date.now();
  const waiting = (subs ?? []).filter((s) => !s.status || s.status === "new");
  const published = (progs ?? []).filter((p) => p.published);
  const drafts = (progs ?? []).length - published.length;

  const noDesc = published.filter((p) => !p.description || p.description.trim().length < 40);
  const noCompany = published.filter((p) => !p.company_description || p.company_description.trim().length < 20);
  const noCommission = published.filter((p) => !(p.commission_models ?? []).filter((m) => m !== "Not published").length);
  const needInfo = new Set([...noDesc, ...noCompany].map((p) => p.id)).size;

  // Leads: every tool except the newsletter counts as a lead; subscribers are shown separately
  const leadTools = TOOLS.map(([t, label], i) => ({ t, label, data: leadSets[i] }));
  const leadSources = leadTools.filter((x) => x.t !== "newsletter_subscribers");
  const subscribers = leadTools.find((x) => x.t === "newsletter_subscribers")?.data ?? null;
  const allLeads = leadSources.flatMap((x) => (x.data ?? []).map((l) => ({ ...l, label: x.label })));
  const leads7 = allLeads.filter((l) => now - new Date(l.created_at).getTime() < 7 * DAY).length;
  const latest = [...allLeads].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8);
  const leadsBlocked = leadSources.some((x) => x.data === null);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * DAY).toISOString().slice(0, 10);
    return { d, n: allLeads.filter((l) => l.created_at.slice(0, 10) === d).length };
  });
  const max = Math.max(1, ...days.map((x) => x.n));
  const total30 = days.reduce((a, x) => a + x.n, 0);

  const hello = `Hello, ${staff.name.split(" ")[0]}`;
  const na = (v: number | null | undefined) => (v === null || v === undefined ? "-" : v);

  return (
    <>
      <div className="adm-pagehead">
        <h1>{hello}</h1>
        <p className="adm-sub">What needs you today.</p>
      </div>

      <div className="adm-kpis">
        <Link href="/admin/submissions" className="adm-kpi cut"><span className="adm-kpi-n">{na(subs ? waiting.length : null)}</span><span className="adm-kpi-l">New submissions waiting</span></Link>
        <Link href="/admin/programs?show=published" className="adm-kpi cut"><span className="adm-kpi-n">{na(progs ? published.length : null)}</span><span className="adm-kpi-l">Programs published{progs ? `, ${drafts} in draft` : ""}</span></Link>
        <div className="adm-kpi cut"><span className="adm-kpi-n">{na(leadsBlocked ? null : leads7)}</span><span className="adm-kpi-l">Leads in the last 7 days</span></div>
        <div className="adm-kpi cut"><span className="adm-kpi-n">{na(subscribers ? subscribers.length : null)}</span><span className="adm-kpi-l">Newsletter subscribers</span></div>
        <div className="adm-kpi cut"><span className="adm-kpi-n">{na(progs ? needInfo : null)}</span><span className="adm-kpi-l">Programs missing a description</span></div>
      </div>

      {leadsBlocked && <p className="adm-note">Some lead tables cannot be read yet. Run the grants block at the end of supabase/admin.sql in the Supabase SQL editor.</p>}

      <div className="adm-cols">
        <section className="adm-card cut">
          <div className="adm-card-head"><h2>Needs attention</h2><Link href="/admin/submissions">All submissions</Link></div>
          {!subs ? <div className="adm-empty">Could not load submissions.</div> : waiting.length === 0 ? <div className="adm-empty">No new submissions. All caught up.</div> : (
            <table className="adm-table">
              <thead><tr><th>Waiting</th><th>Type</th><th>Company or listing</th><th>Person</th></tr></thead>
              <tbody>
                {waiting.slice(0, 8).map((s) => (
                  <tr key={s.id}>
                    <td>{ago(s.created_at)}</td>
                    <td>{KIND[s.kind] ?? s.kind}</td>
                    <td><Link href={`/admin/submissions/${s.id}`}>{s.company || s.listing || "Open"}</Link></td>
                    <td>{s.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {waiting.length > 8 && <p className="adm-more">and {waiting.length - 8} more, oldest first</p>}
        </section>

        <section className="adm-card cut">
          <div className="adm-card-head"><h2>Leads, last 30 days</h2><span className="adm-total">{leadsBlocked ? "-" : total30}</span></div>
          <div className="adm-bars" role="img" aria-label="Leads per day over the last 30 days">
            {days.map((x) => (<i key={x.d} title={`${x.d}: ${x.n}`} style={{ height: `${Math.max(x.n ? 8 : 2, (x.n / max) * 100)}%` }} className={x.n ? "on" : ""} />))}
          </div>
          <div className="adm-bars-axis"><span>{days[0].d.slice(5)}</span><span>today</span></div>
        </section>
      </div>

      <div className="adm-cols">
        <section className="adm-card cut">
          <div className="adm-card-head"><h2>Latest leads</h2></div>
          {latest.length === 0 ? <div className="adm-empty">{leadsBlocked ? "Lead tables are not readable yet." : "No leads yet."}</div> : (
            <table className="adm-table">
              <thead><tr><th>When</th><th>Source</th><th>Email</th></tr></thead>
              <tbody>{latest.map((l, i) => (<tr key={i}><td>{ago(l.created_at)}</td><td>{l.label}</td><td>{l.email}</td></tr>))}</tbody>
            </table>
          )}
        </section>

        <section className="adm-card cut">
          <div className="adm-card-head"><h2>Directory to-do</h2><Link href="/admin/programs">Programs</Link></div>
          {!progs ? <div className="adm-empty">Could not load programs.</div> : (
            <ul className="adm-todo">
              <li><b>{noDesc.length}</b> published programs have no or a very short description</li>
              <li><b>{noCompany.length}</b> have no company description</li>
              <li><b>{noCommission.length}</b> do not show commission details</li>
              <li><b>{drafts}</b> are drafts that are not on the site</li>
            </ul>
          )}
        </section>
      </div>

      <section className="adm-card cut">
        <div className="adm-card-head"><h2>{isSuper ? "Recent activity" : "Your recent activity"}</h2></div>
        {!log ? <div className="adm-empty">Activity could not be loaded.</div> : log.length === 0 ? <div className="adm-empty">Nothing yet.</div> : (
          <table className="adm-table">
            <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Item</th></tr></thead>
            <tbody>{log.map((l, i) => (<tr key={i}><td>{ago(l.at)}</td><td>{l.staff_email}</td><td>{l.action}</td><td>{l.target || "-"}</td></tr>))}</tbody>
          </table>
        )}
      </section>
    </>
  );
}
