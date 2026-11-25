import Link from "next/link";
import { notFound } from "next/navigation";
import { db, requireStaff } from "@/lib/admin/session";
import { draftReply } from "@/lib/admin/reply";
import { markReplied, updateSubmission } from "../../actions";
import { ReplyBox } from "./ReplyBox";

export const dynamic = "force-dynamic";

type Sub = Record<string, unknown> & { id: number; kind: string; status: string | null; company: string | null; listing: string | null; first_name: string | null; name: string | null; email: string | null; internal_note: string | null; replied_at: string | null; replied_by: string | null; handled_by: string | null };

const FIELDS: [string, string][] = [
  ["created_at", "Received"], ["kind", "Type"], ["company", "Company"], ["listing", "Listing"], ["program_url", "Program link"], ["product_category", "Category"],
  ["program_types", "Program types"], ["name", "Name"], ["email", "Email"], ["role", "Role"], ["issue", "Issue"], ["source_url", "Source link"],
  ["details", "Details"], ["company_description", "About the company"], ["how_it_works", "How it works"], ["requirements", "Requirements"],
];
const KIND: Record<string, string> = { submit: "Add program", claim: "Claim", report: "Report" };
const isUrl = (v: string) => /^https?:\/\//i.test(v);

export default async function SubmissionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireStaff();
  const { id } = await params;
  const { saved } = await searchParams;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) notFound();
  const r = await db(`submissions?id=eq.${n}&select=*&limit=1`);
  const rows: Sub[] = r.ok ? await r.json() : [];
  const s = rows[0];
  if (!s) notFound();

  // Find the real listing link when the company is already in the directory.
  let listingUrl = "";
  const co = s.company || s.listing;
  if (co) {
    const pr = await db(`programs?company=ilike.${encodeURIComponent(co.replace(/[%*,()]/g, ""))}&select=slug&limit=1`);
    const p = pr.ok ? await pr.json() : [];
    const slug = p[0]?.slug || co.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    listingUrl = `https://partner2b.com/directory/${slug}`;
  }
  const draft = draftReply(s, listingUrl);
  const st = s.status || "new";

  return (
    <div className="adm-card cut">
      <p style={{ margin: "0 0 14px" }}><Link href="/admin" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Back to submissions</Link></p>
      <h1>{s.company || s.listing || "Submission"}</h1>
      <p className="adm-sub">{KIND[s.kind] ?? s.kind} · #{s.id}{s.handled_by ? ` · last handled by ${s.handled_by}` : ""}</p>
      {saved && <div className="adm-ok">Saved</div>}
      <div className="adm-grid">
        <div>
          <dl className="adm-dl">
            {FIELDS.map(([k, label]) => {
              const v = s[k];
              const text = Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v);
              if (!text) return null;
              return (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{label}</dt>
                  <dd>{k === "created_at" ? text.slice(0, 16).replace("T", " ") : k === "kind" ? KIND[text] ?? text : isUrl(text) ? <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : text}</dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div>
          <form action={updateSubmission} className="adm-box">
            <h2>Status</h2>
            <input type="hidden" name="id" value={s.id} />
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={st} className="field">
              <option value="new">New</option>
              <option value="in_review">In review</option>
              <option value="added">Added</option>
              <option value="rejected">Rejected</option>
            </select>
            <label htmlFor="note">Internal note</label>
            <textarea id="note" name="note" rows={4} defaultValue={s.internal_note ?? ""} className="field" />
            <button type="submit" className="btn btn-p btn-sm" style={{ marginTop: 14 }}>Save</button>
          </form>
          <div className="adm-box">
            <h2>Reply</h2>
            {s.email ? (
              <>
                <ReplyBox to={s.email} subject={draft.subject} body={draft.body} listingUrl={listingUrl} />
                <form action={markReplied} style={{ marginTop: 14 }}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="btn btn-s btn-sm">{s.replied_at ? "Mark as replied again" : "Mark as replied"}</button>
                  {s.replied_at && <span style={{ marginLeft: 12, color: "var(--g500)", fontSize: 14 }}>Replied {s.replied_at.slice(0, 10)}{s.replied_by ? ` by ${s.replied_by}` : ""}</span>}
                </form>
              </>
            ) : <p style={{ margin: 0, color: "var(--g500)" }}>No email address was left.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
