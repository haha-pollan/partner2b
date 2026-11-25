"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, logAction, requireStaff, requireSuper } from "@/lib/admin/session";
import { ALL_CATEGORIES, COMMISSION_MODELS, FEATURE_TAGS, PROGRAM_TYPES, badCopy, hostOf, lines, slugify } from "@/lib/admin/programs";

const FIELDS = ["company", "product_note", "product_category", "sub_category", "primary_type", "region", "program_url", "description", "company_description", "requirements"] as const;
const pick = (f: FormData, name: string, allowed: string[]) => f.getAll(name).map(String).filter((v) => allowed.includes(v));

function readProgram(f: FormData): { row: Record<string, unknown> } | { error: string } {
  const row: Record<string, unknown> = {};
  for (const k of FIELDS) row[k] = String(f.get(k) ?? "").trim() || null;
  const company = row.company as string | null;
  const url = row.program_url as string | null;
  if (!company) return { error: "Company is required." };
  if (!url || !/^https?:\/\//i.test(url)) return { error: "Program link must start with https://." };
  if (!ALL_CATEGORIES.includes(String(row.product_category))) return { error: "Choose a category." };
  const types = pick(f, "program_types", PROGRAM_TYPES);
  if (!types.length) return { error: "Choose at least one program type." };
  if (!row.primary_type || !types.includes(String(row.primary_type))) row.primary_type = types[0];
  row.program_types = types;
  const cm = pick(f, "commission_models", COMMISSION_MODELS);
  row.commission_models = cm.length ? cm : ["Not published"];
  row.feature_tags = pick(f, "feature_tags", FEATURE_TAGS);
  row.tiers = lines(f.get("tiers"));
  row.benefits = lines(f.get("benefits"));
  row.how_it_works = lines(f.get("how_it_works"));
  row.region = row.region || "Global";
  row.domain = hostOf(url);
  row.published = f.get("published") === "on";
  const text = [company, row.description, row.company_description, row.requirements, row.product_note, ...(row.tiers as string[]), ...(row.benefits as string[]), ...(row.how_it_works as string[])].join(" ");
  if (badCopy(text)) return { error: "Please remove dashes (use \"to\" or a comma) and exclamation marks from the text." };
  return { row };
}

const back = (path: string, err: string) => redirect(`${path}${path.includes("?") ? "&" : "?"}err=${encodeURIComponent(err)}`);

export async function saveProgram(f: FormData) {
  const staff = await requireStaff();
  const id = Number(f.get("id"));
  if (!Number.isInteger(id) || id < 1) redirect("/admin/programs");
  const path = `/admin/programs/${id}`;
  const parsed = readProgram(f);
  if ("error" in parsed) back(path, parsed.error);
  const row = (parsed as { row: Record<string, unknown> }).row;

  const cur = await db(`programs?id=eq.${id}&select=*&limit=1`);
  const old = cur.ok ? (await cur.json())[0] : null;
  if (!old) redirect("/admin/programs");
  const r = await db(`programs?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
  if (!r.ok) back(path, "Could not save. Please try again.");

  const changed = Object.keys(row).filter((k) => JSON.stringify(row[k]) !== JSON.stringify(old[k]));
  await logAction(staff, "program_update", String(id), `${old.company}: ${changed.join(", ") || "no change"}`);
  revalidatePath("/directory");
  revalidatePath(`/directory/${old.slug}`);
  redirect(`${path}?saved=1`);
}

export async function createProgram(f: FormData) {
  const staff = await requireStaff();
  const from = Number(f.get("from")) || 0;
  const path = `/admin/programs/new${from ? `?from=${from}` : ""}`;
  const parsed = readProgram(f);
  if ("error" in parsed) back(path, parsed.error);
  const row = (parsed as { row: Record<string, unknown> }).row;

  const slug = slugify(String(row.company));
  if (!slug) back(path, "Company name is not valid.");
  const dup = await db(`programs?or=(slug.eq.${encodeURIComponent(slug)},domain.eq.${encodeURIComponent(String(row.domain))})&select=id,company&limit=1`);
  const d = dup.ok ? await dup.json() : [];
  if (d[0]) back(path, `Already in the directory: ${d[0].company} (id ${d[0].id}). Edit that listing instead.`);

  const mx = await db("programs?select=id&order=id.desc&limit=1");
  const next = ((mx.ok ? (await mx.json())[0]?.id : 0) || 0) + 1;
  const ins = await db("programs", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...row, id: next, slug, verification_status: "not_verified", published: false }),
  });
  if (!ins.ok) back(path, "Could not create the listing. Please try again.");
  await logAction(staff, "program_create", String(next), String(row.company));
  if (from) {
    await db(`submissions?id=eq.${from}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "in_review", handled_by: staff.email, handled_at: new Date().toISOString() }) });
  }
  redirect(`/admin/programs/${next}?saved=1`);
}

// Super admin only. Keeps a copy of the row in the log so it can be restored.
export async function deleteProgram(f: FormData) {
  const staff = await requireSuper();
  const id = Number(f.get("id"));
  if (!Number.isInteger(id) || id < 1 || f.get("confirm") !== "on") redirect(`/admin/programs/${id}?err=${encodeURIComponent("Tick the box to confirm.")}`);
  const cur = await db(`programs?id=eq.${id}&select=*&limit=1`);
  const old = cur.ok ? (await cur.json())[0] : null;
  if (!old) redirect("/admin/programs");
  await logAction(staff, "program_delete", String(id), JSON.stringify(old));
  await db(`programs?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  revalidatePath("/directory");
  redirect("/admin/programs");
}
