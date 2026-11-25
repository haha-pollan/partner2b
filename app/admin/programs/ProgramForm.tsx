"use client";
import { ALL_CATEGORIES, COMMISSION_MODELS, FEATURE_TAGS, PROGRAM_TYPES } from "@/lib/admin/programs";

export type ProgramValues = {
  id?: number; company?: string; product_note?: string | null; product_category?: string; sub_category?: string | null; program_types?: string[]; primary_type?: string;
  commission_models?: string[]; feature_tags?: string[]; region?: string | null; program_url?: string; description?: string | null; tiers?: string[]; benefits?: string[];
  requirements?: string | null; how_it_works?: string[] | null; company_description?: string | null; published?: boolean;
};

const Checks = ({ name, options, value }: { name: string; options: string[]; value: string[] }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
    {options.map((o) => (
      <label key={o} style={{ display: "flex", gap: 6, alignItems: "center", margin: 0, color: "var(--ink)", fontSize: 15 }}>
        <input type="checkbox" name={name} value={o} defaultChecked={value.includes(o)} /> {o}
      </label>
    ))}
  </div>
);

export function ProgramForm({ action, v, from, submitLabel, isNew }: { action: (f: FormData) => void | Promise<void>; v: ProgramValues; from?: number; submitLabel: string; isNew?: boolean }) {
  // Quick check in the browser so edits are not lost when the text breaks the copy rules.
  const check = (e: React.FormEvent<HTMLFormElement>) => {
    const f = new FormData(e.currentTarget);
    const text = ["company", "description", "company_description", "requirements", "product_note", "tiers", "benefits", "how_it_works"].map((k) => String(f.get(k) ?? "")).join(" ");
    if (/[–—!]/.test(text)) {
      e.preventDefault();
      alert("Please remove dashes (use \"to\" or a comma) and exclamation marks from the text.");
    }
  };
  const lt = (a?: string[] | null) => (a ?? []).join("\n");
  return (
    <form action={action} onSubmit={check} className="adm-box">
      {v.id ? <input type="hidden" name="id" value={v.id} /> : null}
      {from ? <input type="hidden" name="from" value={from} /> : null}
      <label htmlFor="company">Company</label>
      <input id="company" name="company" className="field" defaultValue={v.company ?? ""} required />
      <label htmlFor="product_note">Parent brand or note (optional)</label>
      <input id="product_note" name="product_note" className="field" defaultValue={v.product_note ?? ""} />
      <label htmlFor="program_url">Program link (the program&apos;s own page)</label>
      <input id="program_url" name="program_url" type="url" className="field" defaultValue={v.program_url ?? ""} required />
      <label htmlFor="product_category">Category</label>
      <select id="product_category" name="product_category" className="field" defaultValue={v.product_category ?? ""} required>
        <option value="" disabled>Choose</option>
        {v.product_category && !ALL_CATEGORIES.includes(v.product_category) && <option>{v.product_category}</option>}
        {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <label htmlFor="sub_category">Sub category (optional)</label>
      <input id="sub_category" name="sub_category" className="field" defaultValue={v.sub_category ?? ""} />
      <label>Program types</label>
      <Checks name="program_types" options={PROGRAM_TYPES} value={v.program_types ?? []} />
      <label htmlFor="primary_type">Main type</label>
      <select id="primary_type" name="primary_type" className="field" defaultValue={v.primary_type ?? ""}>
        <option value="">First ticked type</option>
        {PROGRAM_TYPES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <label>Commission models</label>
      <Checks name="commission_models" options={COMMISSION_MODELS} value={v.commission_models ?? []} />
      <label>Features</label>
      <Checks name="feature_tags" options={FEATURE_TAGS} value={v.feature_tags ?? []} />
      <label htmlFor="region">Region</label>
      <input id="region" name="region" className="field" defaultValue={v.region ?? "Global"} />
      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" rows={4} className="field" defaultValue={v.description ?? ""} />
      <label htmlFor="tiers">Tiers (one per line)</label>
      <textarea id="tiers" name="tiers" rows={4} className="field" defaultValue={lt(v.tiers)} />
      <label htmlFor="benefits">Benefits (one per line)</label>
      <textarea id="benefits" name="benefits" rows={5} className="field" defaultValue={lt(v.benefits)} />
      <label htmlFor="how_it_works">How it works (one step per line)</label>
      <textarea id="how_it_works" name="how_it_works" rows={4} className="field" defaultValue={lt(v.how_it_works)} />
      <label htmlFor="company_description">About the company</label>
      <textarea id="company_description" name="company_description" rows={3} className="field" defaultValue={v.company_description ?? ""} />
      <label htmlFor="requirements">Requirements or availability note (optional)</label>
      <textarea id="requirements" name="requirements" rows={2} className="field" defaultValue={v.requirements ?? ""} />
      {!isNew && (
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 18, color: "var(--ink)", fontSize: 16 }}>
          <input type="checkbox" name="published" defaultChecked={!!v.published} /> Published on the website
        </label>
      )}
      <button type="submit" className="btn btn-p" style={{ marginTop: 18 }}>{submitLabel}</button>
    </form>
  );
}
