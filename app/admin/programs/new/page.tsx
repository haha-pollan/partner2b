import Link from "next/link";
import { db, requireStaff } from "@/lib/admin/session";
import { ProgramForm, type ProgramValues } from "../ProgramForm";
import { createProgram } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProgram({ searchParams }: { searchParams: Promise<{ from?: string; err?: string }> }) {
  await requireStaff();
  const { from, err } = await searchParams;
  const sid = Number(from) || 0;
  let v: ProgramValues = { program_types: [], commission_models: [], feature_tags: [], region: "Global", published: false };
  if (sid) {
    const r = await db(`submissions?id=eq.${sid}&select=company,program_url,product_category,program_types,company_description,details&limit=1`);
    const s = r.ok ? (await r.json())[0] : null;
    if (s) v = { ...v, company: s.company ?? "", program_url: s.program_url ?? "", product_category: s.product_category ?? "", program_types: s.program_types ?? [], company_description: s.company_description ?? "" };
  }
  return (
    <div className="adm-card cut">
      <p style={{ margin: "0 0 14px" }}><Link href={sid ? `/admin/submissions/${sid}` : "/admin/programs"} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Back</Link></p>
      <h1>Add a program</h1>
      <p className="adm-sub">Saved as a draft. Check it against the program&apos;s own page, then tick Published when it is ready.</p>
      {err && <p className="adm-err" role="alert">{err}</p>}
      <ProgramForm action={createProgram} v={v} from={sid || undefined} submitLabel="Create draft" isNew />
    </div>
  );
}
