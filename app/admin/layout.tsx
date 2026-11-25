import type { Metadata } from "next";
import "./admin.css";
import { adminConfigured, db, getStaff } from "@/lib/admin/session";
import { logout } from "./actions";
import Sidebar from "./Sidebar";

export const metadata: Metadata = { title: "Partner2B admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function newCount(): Promise<number> {
  if (!adminConfigured()) return 0;
  try {
    const r = await db("submissions?select=id&or=(status.is.null,status.eq.new)&limit=1", { headers: { Prefer: "count=exact" } });
    if (!r.ok) return 0;
    return Number((r.headers.get("content-range") || "").split("/")[1]) || 0;
  } catch { return 0; }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  if (!staff) return <div className="adm adm-plain">{children}</div>;
  const n = await newCount();
  return (
    <div className="adm-shell">
      <Sidebar isSuper={staff.role === "super_admin"} newSubmissions={n} name={staff.name} role={staff.role} logout={logout} />
      <main className="adm-main">{children}</main>
    </div>
  );
}
