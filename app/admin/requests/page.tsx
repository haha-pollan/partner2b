import { revalidatePath } from "next/cache";
import { adminConfigured, db, requireStaff } from "@/lib/admin/session";
import { gmailLink } from "@/lib/admin/reply";

export const dynamic = "force-dynamic";

type Req = { id: number; strategy_id: string | null; email: string; created_at: string; when_needed: string | null; would_pay: string | null; partner_type: string | null; email_status: string | null; contacted_at: string | null };
type Ev = { strategy_id: string | null; event: string; detail: string | null; created_at: string };

async function markContacted(fd: FormData) {
  "use server";
  await requireStaff();
  const id = Number(fd.get("id"));
  if (!Number.isInteger(id)) return;
  await db(`discovery_requests?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ contacted_at: new Date().toISOString() }) });
  revalidatePath("/admin/requests");
}

const DAY = 86_400_000;

export default async function Requests() {
  await requireStaff();
  if (!adminConfigured()) return <div className="adm-card cut"><h1>Setup needed</h1></div>;
  const [rr, er] = await Promise.all([
    db("discovery_requests?select=*&order=created_at.desc&limit=300"),
    db("discovery_events?select=strategy_id,event,detail,created_at&order=created_at.desc&limit=20000"),
  ]);
  if (!rr.ok) return <div className="adm-card cut"><h1>Setup needed</h1><p>Run supabase/discovery_requests_v2.sql in the Supabase SQL editor.</p></div>;
  const reqs: Req[] = await rr.json();
  const events: Ev[] = er.ok ? await er.json() : [];

  const ids = Array.from(new Set(reqs.map((r) => r.strategy_id).filter((x): x is string => !!x)));
  const names = new Map<string, string>();
  if (ids.length) {
    const sr = await db(`builder_strategies?select=id,company_name&id=in.(${ids.join(",")})`);
    for (const s of sr.ok ? ((await sr.json()) as { id: string; company_name: string | null }[]) : []) names.set(s.id, s.company_name || "Unnamed");
  }

  const now = Date.now();
  const ev = (days: number, name: string) => events.filter((e) => e.event === name && now - new Date(e.created_at).getTime() < days * DAY).length;
  const rq = (days: number) => reqs.filter((r) => now - new Date(r.created_at).getTime() < days * DAY).length;
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "n/a");
  const steps: [string, number, number][] = [["Page opened", ev(7, "page_view"), ev(30, "page_view")], ["Clicked See more", ev(7, "see_more"), ev(30, "see_more")], ["Started the form", ev(7, "form_start"), ev(30, "form_start")], ["Sent a request", rq(7), rq(30)]];
  const clicks = new Map<string, number>();
  for (const e of events) if (e.event === "card_click" && e.detail) { const t = e.detail.split(":")[0]; clicks.set(t, (clicks.get(t) ?? 0) + 1); }
  const pay = (v: string) => reqs.filter((r) => r.would_pay === v).length;

  return (
    <>
      <div className="adm-pagehead">
        <h1>Early access requests</h1>
        <p className="adm-sub">People who asked for full partner discovery. This is the demand test: do visitors want it, how soon, and would they pay. Counts include staff visits to the visitor page.</p>
      </div>

      <div className="adm-card cut" style={{ marginBottom: 16 }}>
        <h2>Funnel</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="adm-table">
            <thead><tr><th>Step</th><th>Last 7 days</th><th>Last 30 days</th><th>Share of page opens (30 days)</th></tr></thead>
            <tbody>{steps.map(([n, a, b]) => <tr key={n}><td>{n}</td><td>{a}</td><td>{b}</td><td>{pct(b, steps[0][2])}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="adm-sub" style={{ marginTop: 12 }}>Would pay: yes {pay("Yes")}, maybe {pay("Maybe")}, only if free {pay("Only if free")}, no answer {reqs.length - pay("Yes") - pay("Maybe") - pay("Only if free")}. Card clicks by type: {clicks.size ? Array.from(clicks.entries()).map(([k, v]) => `${k} ${v}`).join(", ") : "none yet"}.</p>
      </div>

      <div className="adm-card cut">
        <h2>Requests ({reqs.length})</h2>
        {reqs.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="adm-table">
              <thead><tr><th>Date</th><th>Email</th><th>Company</th><th>Needs partners</th><th>Would pay</th><th>Asked about</th><th>Auto email</th><th></th></tr></thead>
              <tbody>
                {reqs.map((r) => (
                  <tr key={r.id}>
                    <td>{r.created_at.slice(0, 10)}</td>
                    <td>{r.email}</td>
                    <td>{r.strategy_id ? <a href={`/find-partners/${r.strategy_id}`} target="_blank" rel="noopener noreferrer">{names.get(r.strategy_id) || "Results"}</a> : ""}</td>
                    <td>{r.when_needed || ""}</td>
                    <td>{r.would_pay || ""}</td>
                    <td>{r.partner_type || ""}</td>
                    <td>{r.email_status || ""}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <a className="btn btn-sm btn-s" href={gmailLink(r.email, "Your Partner2B early access", `Hi,\n\nThank you for your interest in Partner2B partner discovery. I would love to hear what you are looking for. Do you have 15 minutes this week for a short call?\n\nBest regards,\nPartner2B team`)} target="_blank" rel="noopener noreferrer">Reply</a>{" "}
                      {r.contacted_at ? <span>Contacted {r.contacted_at.slice(0, 10)}</span> : <form action={markContacted} style={{ display: "inline" }}><input type="hidden" name="id" value={r.id} /><button className="btn btn-sm btn-p" type="submit">Mark contacted</button></form>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>No requests yet.</p>}
      </div>
    </>
  );
}
