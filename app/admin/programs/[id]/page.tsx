import Link from "next/link";
import { notFound } from "next/navigation";
import { db, requireStaff } from "@/lib/admin/session";
import { ProgramForm, type ProgramValues } from "../ProgramForm";
import { deleteProgram, saveProgram } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProgram({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; err?: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;
  const { saved, err } = await searchParams;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) notFound();
  const r = await db(`programs?id=eq.${n}&select=*&limit=1`);
  const p: (ProgramValues & { slug: string }) | undefined = r.ok ? (await r.json())[0] : undefined;
  if (!p) notFound();
  return (
    <div className="adm-card cut">
      <p style={{ margin: "0 0 14px" }}><Link href="/admin/programs" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Back to programs</Link></p>
      <h1>{p.company}</h1>
      <p className="adm-sub">#{p.id} · {p.published ? <a href={`https://partner2b.com/directory/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>View on the website</a> : "Not published yet"}. Changes show on the website within about 10 minutes.</p>
      {saved && <div className="adm-ok">Saved</div>}
      {err && <p className="adm-err" role="alert">{err}</p>}
      <ProgramForm action={saveProgram} v={p} submitLabel="Save changes" />
      {staff.role === "super_admin" && (
        <form action={deleteProgram} className="adm-box">
          <h2>Delete this program</h2>
          <input type="hidden" name="id" value={p.id} />
          <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink)", fontSize: 15 }}><input type="checkbox" name="confirm" /> I understand this removes the listing from the database</label>
          <button type="submit" className="btn btn-s btn-sm" style={{ marginTop: 12 }}>Delete</button>
        </form>
      )}
    </div>
  );
}
