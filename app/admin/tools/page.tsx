import Link from "next/link";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";
import { TOOLS } from "@/lib/admin/tools";

export const dynamic = "force-dynamic";
const DAY = 86_400_000;

async function times(table: string): Promise<string[] | null> {
  try {
    const r = await db(`${table}?select=created_at&order=created_at.desc&limit=5000`);
    return r.ok ? ((await r.json()) as { created_at: string }[]).map((x) => x.created_at) : null;
  } catch { return null; }
}

export default async function ToolsOverview() {
  await requireStaff();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1></div>;
  const data = await Promise.all(TOOLS.map((t) => times(t.table)));
  const now = Date.now();
  const cards = TOOLS.map((t, i) => {
    const d = data[i];
    return {
      ...t,
      total: d ? d.length : null,
      w7: d ? d.filter((x) => now - new Date(x).getTime() < 7 * DAY).length : null,
      w30: d ? d.filter((x) => now - new Date(x).getTime() < 30 * DAY).length : null,
      last: d && d[0] ? d[0].slice(0, 10) : null,
    };
  });
  const blocked = cards.some((c) => c.total === null);
  const tones = [1, 0, 2, 0];

  return (
    <>
      <div className="adm-pagehead">
        <h1>Tools</h1>
        <p className="adm-sub">Who used the free tools. A person appears here when they leave an email to see or keep their result.</p>
      </div>
      {blocked && <p className="adm-note cut">Some tool tables cannot be read yet. Run the grants block at the end of supabase/admin.sql in the Supabase SQL editor.</p>}
      <div className="adm-tools">
        {cards.map((c, i) => (
          <Link key={c.slug} href={`/admin/tools/${c.slug}`} className={`adm-kpi cut t${tones[i]} adm-toolcard`}>
            <span className="adm-kpi-l">{c.label}</span>
            <span className="adm-kpi-n">{c.total ?? "-"}</span>
            <span className="adm-kpi-s">{c.w7 ?? "-"} in 7 days, {c.w30 ?? "-"} in 30 days</span>
            <span className="adm-kpi-s">{c.last ? `Last used ${c.last}` : "Not used yet"}</span>
            <span className="adm-kpi-go" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
      <p className="adm-sub" style={{ color: "var(--g300)" }}>Visits that do not leave an email are counted in PostHog, not here.</p>
    </>
  );
}
