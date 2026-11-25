import type { Metadata } from "next";
import "./admin.css";
import Link from "next/link";
import { getStaff } from "@/lib/admin/session";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Partner2B admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  return (
    <div className="adm">
      <div className="adm-top">
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div className="adm-brand">Partner2B <b>admin</b></div>
          {staff && (<nav style={{ display: "flex", gap: 18, fontSize: 16 }}><Link href="/admin">Submissions</Link><Link href="/admin/programs">Programs</Link></nav>)}
        </div>
        {staff && (
          <form action={logout} className="adm-who">
            <span>{staff.name} · {staff.role === "super_admin" ? "Super admin" : "Staff"}</span>
            <button type="submit">Sign out</button>
          </form>
        )}
      </div>
      {children}
    </div>
  );
}
