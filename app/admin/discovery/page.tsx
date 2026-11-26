import { adminConfigured, db, requireStaff } from "@/lib/admin/session";
import { matchStrategy } from "@/lib/discovery/match";
import type { Strategy } from "@/lib/discovery/strategy";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export default async function Discovery({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireStaff();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1></div>;
  const { id = "" } = await searchParams;
  const list = await db("builder_strategies?select=id,company_name,category,region,audience,partner_types,created_at&order=created_at.desc&limit=50");
  const strategies: Pick<Strategy, "id" | "company_name" | "category" | "region" | "audience" | "partner_types" | "created_at">[] = list.ok ? await list.json() : [];
  const tableMissing = !list.ok;

  let strategy: Strategy | null = null; let results: Awaited<ReturnType<typeof matchStrategy>> = [];
  if (id && /^[0-9a-f-]{36}$/.test(id)) {
    const r = await db(`builder_strategies?id=eq.${id}&select=*&limit=1`);
    const rows: Strategy[] = r.ok ? await r.json() : [];
    strategy = rows[0] ?? null;
    if (strategy) results = await matchStrategy(strategy);
  }

  return (
    <>
      <h1>Partner discovery (test)</h1>
      <p className="adm-sub">Pick a saved Program builder strategy to see the companies from our database that match each partner type. This is what visitors will get from the Find my partners button. Staff only.</p>
      {tableMissing ? <div className="adm-card cut"><p>The table for saved strategies does not exist yet. Run supabase/builder_strategies.sql in the Supabase SQL editor.</p></div> : null}
      {!tableMissing && !strategies.length ? <div className="adm-card cut"><p>No strategies saved yet. Every new Program builder run is saved from now on. Run the builder once to test.</p></div> : null}
      {strategies.length ? (
        <div className="adm-card cut" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {strategies.map((s) => (
              <a key={s.id} className={`btn btn-sm ${s.id === id ? "btn-p" : "btn-s"}`} href={`/admin/discovery?id=${s.id}`}>{s.company_name || "Unnamed"}, {(s.created_at || "").slice(0, 10)}</a>
            ))}
          </div>
        </div>
      ) : null}
      {strategy ? (
        <>
          <p className="adm-sub"><b>{strategy.company_name}</b>, {strategy.category}, {strategy.region}, sells to {strategy.audience}. Partner types: {strategy.partner_types.join(", ") || "none found"}.</p>
          {results.map((t) => (
            <div key={t.type} className="adm-card cut" style={{ marginBottom: 16 }}>
              <h2>{t.type}{t.stage ? `, ${t.stage}` : ""}</h2>
              <p className="adm-sub">{t.role ? `${t.role}. ` : ""}{t.examples.length ? `Profiles: ${t.examples.join("; ")}. ` : ""}{t.candidates} approved companies of this type, showing the best {t.matches.length}.</p>
              {t.matches.length ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="adm-table">
                    <thead><tr><th>Company</th><th>Why it fits</th><th>Type</th><th>Partner program</th><th>Score</th></tr></thead>
                    <tbody>
                      {t.matches.map((m) => (
                        <tr key={m.id}>
                          <td><a href={m.website} target="_blank" rel="noopener noreferrer">{m.name}</a></td>
                          <td>{m.reason || m.description?.slice(0, 120) || ""}</td>
                          <td>{m.subtype || ""}</td>
                          <td>{m.has_program ? (m.program_url ? <a href={m.program_url} target="_blank" rel="noopener noreferrer">Yes</a> : "Yes") : m.has_program === false ? "No" : "Unclear"}</td>
                          <td>{m.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p>No approved companies of this type yet.</p>}
            </div>
          ))}
        </>
      ) : null}
    </>
  );
}
