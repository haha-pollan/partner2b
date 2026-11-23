"use server";
import { URL, KEY } from "@/lib/programs";
import { TYPES, CATEGORIES, ISSUES, type Kind } from "@/lib/formsConfig";

export type FormState = { ok: boolean; error?: string };

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUrl = (v: string) => { try { const u = new globalThis.URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; } };

export async function sendSubmission(_prev: FormState, f: FormData): Promise<FormState> {
  // Honeypot: real people leave this empty
  if (s(f, "website_confirm")) return { ok: true };
  const kind = s(f, "kind") as Kind;
  if (!["submit", "claim", "report"].includes(kind)) return { ok: false, error: "Something went wrong. Please try again." };

  const row: Record<string, unknown> = { kind };
  const first = s(f, "first_name").slice(0, 100), last = s(f, "last_name").slice(0, 100);
  const fullName = [first, last].filter(Boolean).join(" ");
  if (first || last) Object.assign(row, { first_name: first || null, last_name: last || null, name: fullName });
  const email = s(f, "email");
  const details = s(f, "details");
  const need = (cond: boolean) => cond;

  if (kind === "submit") {
    const company = s(f, "company"), url = s(f, "program_url"), cat = s(f, "product_category");
    const types = f.getAll("program_types").map(String).filter((t) => TYPES.includes(t));
    if (!need(!!company && isUrl(url) && CATEGORIES.includes(cat) && !!first && !!last && isEmail(email) && f.get("confirmed") === "on"))
      return { ok: false, error: "Please fill in the required fields, including your first and last name, with a valid link and email, and tick the confirmation." };
    Object.assign(row, { company, program_url: url, product_category: cat, program_types: types, details, company_description: s(f, "company_description"), email, confirmed: true });
  } else if (kind === "claim") {
    const listing = s(f, "listing");
    if (!need(!!listing && !!first && !!last && isEmail(email) && f.get("confirmed") === "on"))
      return { ok: false, error: "Please fill in the required fields, including your first and last name, with a valid email, and tick the confirmation." };
    Object.assign(row, { listing, email, role: s(f, "role"), details, company_description: s(f, "company_description"), how_it_works: s(f, "how_it_works"), requirements: s(f, "requirements"), confirmed: true });
  } else {
    const listing = s(f, "listing"), issue = s(f, "issue"), src = s(f, "source_url");
    if (!need(!!listing && ISSUES.includes(issue) && !!details && (!src || isUrl(src)) && (!email || isEmail(email))))
      return { ok: false, error: "Please fill in the required fields. Links must start with https:// and the email must be valid." };
    Object.assign(row, { listing, issue, details, source_url: src || null, email: email || null });
  }

  try {
    const res = await fetch(`${URL}/rest/v1/submissions`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: "We could not save this. Please try again in a moment." };
  } catch {
    return { ok: false, error: "We could not save this. Please try again in a moment." };
  }
  return { ok: true };
}
