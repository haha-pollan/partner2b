import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { URL as SB_URL, KEY as ANON } from "@/lib/programs";

export const AT = "p2b_at";
export const RT = "p2b_rt";
export type Role = "super_admin" | "staff";
export type Staff = { id: string; email: string; name: string; role: Role };

export const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const adminConfigured = () => !!serviceKey();

// Server-only database access with the service key. Never import this in a client component.
export async function db(path: string, init: RequestInit = {}) {
  const key = serviceKey();
  const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json", ...((init.headers as Record<string, string>) || {}) };
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
  return fetch(`${SB_URL}/rest/v1/${path}`, { ...init, headers, cache: "no-store" });
}

export async function getStaff(): Promise<Staff | null> {
  const token = (await cookies()).get(AT)?.value;
  if (!token || !adminConfigured()) return null;
  try {
    const u = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: ANON, Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!u.ok) return null;
    const user = await u.json();
    if (!user?.id) return null;
    const r = await db(`staff?user_id=eq.${encodeURIComponent(user.id)}&active=eq.true&select=name,role&limit=1`);
    if (!r.ok) return null;
    const rows = await r.json();
    if (!rows[0]) return null;
    return { id: user.id, email: user.email, name: rows[0].name || user.email, role: rows[0].role };
  } catch {
    return null;
  }
}

export async function requireStaff(): Promise<Staff> {
  const s = await getStaff();
  if (!s) redirect("/admin/login");
  return s;
}

// Use for anything only the super admin may do (delete, export, settings, prompts, roles).
export async function requireSuper(): Promise<Staff> {
  const s = await requireStaff();
  if (s.role !== "super_admin") redirect("/admin");
  return s;
}

export async function logAction(staff: Staff, action: string, target?: string, detail?: string) {
  try {
    await db("admin_log", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ staff_email: staff.email, action, target: target ?? null, detail: detail ?? null }) });
  } catch {}
}
