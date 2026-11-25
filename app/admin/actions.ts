"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { URL as SB_URL, KEY as ANON } from "@/lib/programs";
import { AT, RT, cookieOpts, db, keyProblem, logAction, requireStaff } from "@/lib/admin/session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, f: FormData): Promise<LoginState> {
  const email = String(f.get("email") ?? "").trim().toLowerCase();
  const password = String(f.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { error: "The admin is not set up yet." };
  const kp = keyProblem();
  if (kp) return { error: `Setup problem: ${kp}` };
  const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!r.ok) return { error: "Wrong email or password." };
  const d = await r.json();
  const sr = await db(`staff?user_id=eq.${encodeURIComponent(d.user.id)}&active=eq.true&select=role&limit=1`);
  if (!sr.ok) {
    console.error("admin login: staff lookup failed", sr.status);
    return { error: "Setup problem: the server key is not accepted. Check SUPABASE_SERVICE_ROLE_KEY in Vercel." };
  }
  const rows = await sr.json();
  if (!rows[0]) return { error: "This account does not have access to the admin." };
  const jar = await cookies();
  jar.set(AT, d.access_token, cookieOpts(60 * 60 * 24 * 14));
  jar.set(RT, d.refresh_token, cookieOpts(60 * 60 * 24 * 14));
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(AT);
  jar.delete(RT);
  redirect("/admin/login");
}

const STATUSES = ["new", "in_review", "added", "rejected"];

export async function updateSubmission(f: FormData) {
  const staff = await requireStaff();
  const id = Number(f.get("id"));
  const status = String(f.get("status") ?? "");
  const note = String(f.get("note") ?? "").slice(0, 4000);
  if (!Number.isInteger(id) || id < 1 || !STATUSES.includes(status)) redirect("/admin");
  await db(`submissions?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status, internal_note: note || null, handled_by: staff.email, handled_at: new Date().toISOString() }),
  });
  await logAction(staff, "submission_update", String(id), `status=${status}`);
  redirect(`/admin/submissions/${id}?saved=1`);
}

export async function markReplied(f: FormData) {
  const staff = await requireStaff();
  const id = Number(f.get("id"));
  if (!Number.isInteger(id) || id < 1) redirect("/admin");
  await db(`submissions?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ replied_at: new Date().toISOString(), replied_by: staff.email }),
  });
  await logAction(staff, "submission_replied", String(id));
  redirect(`/admin/submissions/${id}?saved=1`);
}
