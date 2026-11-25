import Link from "next/link";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";
import { Toby } from "@/components/Toby";
import { TOOLS as TOOL_DEFS } from "@/lib/admin/tools";

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

async function count(table: string): Promise<number | null> {
  try {
    const r = await db(`${table}?select=id&limit=1`, { headers: { Prefer: "count=exact" } });
    if (!r.ok) return null;
    const n = Number((r.headers.get("content-range") || "").split("/")[1]);
    return Number.isFinite(n) ? n : null;
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

  const [toolCounts, subs, progs, log, ...leadSets] = await Promise.all([
    Promise.all(TOOL_DEFS.map((t) => count(t.table))),
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

  // Leads: every tool except the newsletter counts as a lead; subscribers are shown separately
  const leadTools = TOOLS.map(([t, label], i) => ({ t, label, data: leadSets[i] }));
  const leadSources = leadTools.filter((x) => x.t !== "newsletter_subscribers");
  const subscribers = leadTools.find((x) => x.t === "newsletter_subscribers")?.data ?? null;
  const allLeads = leadSources.flatMap((x) => (x.data ?? []).map((l) => ({ ...l, label: x.label })));
  const leads7 = allLeads.filter((l) => now - new Date(l.created_at).getTime() < 7 * DAY).length;
  const latest = [...allLeads].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6);
  const leadsBlocked = leadSources.some((x) => x.data === null);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * DAY).toISOString().slice(0, 10);
    return { d, n: allLeads.filter((l) => l.created_at.slice(0, 10) === d).length };
  });
  const max = Math.max(1, ...days.map((x) => x.n));
  const total30 = days.reduce((a, x) => a + x.n, 0);

  const toolUse = TOOL_DEFS.map((t, i) => ({ ...t, n: toolCounts[i] }));
  const toolTotal = toolUse.some((t) => t.n === null) ? null : toolUse.reduce((a, t) => a + (t.n ?? 0), 0);
  const toolMax = Math.max(1, ...toolUse.map((t) => t.n ?? 0));

  const hour = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Warsaw" })) % 24;
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = staff.name.split(" ")[0];
  const na = (v: number | null | undefined) => (v === null || v === undefined ? "-" : v);
  const oldest = waiting[0];
  const say = !subs
    ? "I could not load the inbox. Check the connection and reload."
    : waiting.length > 0
    ? `${waiting.length === 1 ? "One new submission is" : `${waiting.length} new submissions are`} waiting. Start with ${oldest.company || oldest.listing || "the oldest one"}.`
    : drafts > 0
    ? `The inbox is clear. ${drafts} ${drafts === 1 ? "draft waits" : "drafts wait"} to be published.`
    : "The inbox is clear and the directory looks tidy.";

  const kpis: { label: string; n: number | string; sub?: string; href?: string; tone: number; rot: number }[] = [
    { label: "New submissions", n: na(subs ? waiting.length : null), href: "/admin/submissions", tone: 1, rot: -1.2 },
    { label: "Programs live", n: na(progs ? published.length : null), href: "/admin/programs?show=published", tone: 0, rot: 0.9 },
    { label: "Tool leads, 7 days", n: na(leadsBlocked ? null : leads7), href: "/admin/tools", tone: 2, rot: -0.7 },
    { label: "Subscribers", n: na(subscribers ? subscribers.length : null), tone: 0, rot: 1.1 },
    { label: "Drafts to publish", n: na(progs ? drafts : null), href: "/admin/programs?show=unpublished", tone: 1, rot: -0.9 },
  ];

  return (
    <>
      <div className="adm-hero">
        <div>
          <h1>{greet}, <span className="hl">{first}</span></h1>
          <p className="adm-tapes ptapes" aria-label="Today in numbers">
            <span className="pt pt1">{na(subs ? waiting.length : null)} to review</span>
            <span className="pt pt2">{na(leadsBlocked ? null : leads7)} new leads this week</span>
          </p>
        </div>
        <div className="adm-toby" aria-hidden="false">
          <div className="adm-bubble">{say}</div>
          <div className="adm-slot cut" aria-hidden="true"><Toby height={150} rows={26} glasses animate={false} /></div>
        </div>
      </div>

      <div className="adm-kpis">
        {kpis.map((k) => {
          const inner = (
            <>
              <span className="adm-kpi-l">{k.label}</span>
              <span className="adm-kpi-n">{k.n}</span>
              {k.sub && <span className="adm-kpi-s">{k.sub}</span>}
              {k.href && <span className="adm-kpi-go" aria-hidden="true">→</span>}
            </>
          );
          const st = { transform: `rotate(${k.rot}deg)` };
          return k.href ? (
            <Link key={k.label} href={k.href} className={`adm-kpi cut t${k.tone}`} style={st}>{inner}</Link>
          ) : (
            <div key={k.label} className={`adm-kpi cut t${k.tone}`} style={st}>{inner}</div>
          );
        })}
      </div>

      {leadsBlocked && <p className="adm-note cut">Some lead tables cannot be read yet. Run the grants block at the end of supabase/admin.sql in the Supabase SQL editor.</p>}

      <div className="adm-cols">
        <section className="adm-card cut">
          <div className="adm-card-head"><h2>Needs attention</h2><Link href="/admin/submissions">View all</Link></div>
          {!subs ? <div className="adm-empty">Could not load submissions.</div> : waiting.length === 0 ? <div className="adm-empty">No new submissions. All caught up.</div> : (
            <div className="adm-rows">
              {waiting.slice(0, 6).map((s) => (
                <Link key={s.id} href={`/admin/submissions/${s.id}`} className="adm-row cut">
                  <span className="adm-row-t"><b>{s.company || s.listing || "Open"}</b><span>{KIND[s.kind] ?? s.kind}{s.name ? `, ${s.name}` : ""}</span></span>
                  <span className="adm-row-w">{ago(s.created_at)}</span>
                  <span className="adm-row-go" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          )}
          {waiting.length > 6 && <p className="adm-more">and {waiting.length - 6} more, oldest first</p>}
        </section>

        <section className="adm-card dark cut">
          <div className="adm-card-head"><h2>Leads, 30 days</h2></div>
          <div className="adm-stat">{leadsBlocked ? "-" : total30}</div>
          <div className="adm-bars" role="img" aria-label="Leads per day over the last 30 days">
            {days.map((x) => (<i key={x.d} title={`${x.d}: ${x.n}`} style={{ height: `${Math.max(x.n ? 8 : 2, (x.n / max) * 100)}%` }} className={x.n ? "on" : ""} />))}
          </div>
          <div className="adm-bars-axis"><span>{days[0].d.slice(5)}</span><span>today</span></div>
        </section>
      </div>

      <div className="adm-cols">
        <section className="adm-card cut">
          <div className="adm-card-head"><h2>Tool use</h2><Link href="/admin/tools">All tools</Link></div>
          <div className="adm-tu-total"><span className="adm-tu-n cut">{toolTotal ?? "-"}</span><span className="adm-tu-l">uses in total, all tools</span></div>
          <div className="adm-tu">
            {toolUse.map((t) => (
              <Link key={t.slug} href={`/admin/tools/${t.slug}`} className="adm-tu-row">
                <span className="adm-tu-name">{t.label}</span>
                <span className="adm-tu-bar"><i style={{ width: `${t.n ? Math.max(4, (t.n / toolMax) * 100) : 0}%` }} /></span>
                <span className="adm-tu-v">{t.n ?? "-"}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="adm-card lime cut">
          <div className="adm-card-head"><h2>Directory to-do</h2><Link href="/admin/programs">Programs</Link></div>
          {!progs ? <div className="adm-empty">Could not load programs.</div> : (
            <ul className="adm-todo">
              <li><b>{noDesc.length}</b> without a description</li>
              <li><b>{noCompany.length}</b> without an "About the company" text</li>
              <li><b>{noCommission.length}</b> without commission details</li>
              <li><b>{drafts}</b> drafts, not on the site</li>
            </ul>
          )}
          <Link href="/admin/programs" className="adm-cta">Open programs</Link>
        </section>
      </div>

      <section className="adm-card cut">
          <div className="adm-card-head"><h2>Latest tool users</h2><Link href="/admin/tools">All tools</Link></div>
        {latest.length === 0 ? <div className="adm-empty">{leadsBlocked ? "Lead tables are not readable yet." : "No leads yet."}</div> : (
          <table className="adm-table">
            <thead><tr><th>When</th><th>Source</th><th>Email</th></tr></thead>
            <tbody>{latest.map((l, i) => (<tr key={i}><td>{ago(l.created_at)}</td><td>{l.label}</td><td>{l.email}</td></tr>))}</tbody>
          </table>
        )}
      </section>

      <section className="adm-card dark cut">
        <div className="adm-card-head"><h2>{isSuper ? "Recent activity" : "Your activity"}</h2></div>
        {!log ? <div className="adm-empty">Activity could not be loaded.</div> : log.length === 0 ? <div className="adm-empty">Nothing yet.</div> : (
          <ul className="adm-log">
            {log.map((l, i) => (<li key={i}><span className="w">{ago(l.at)}</span><span>{l.staff_email}</span><span>{l.action}</span><span>{l.target || "-"}</span></li>))}
          </ul>
        )}
      </section>
    </>
  );
}
