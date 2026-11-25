import type { Metadata } from "next";
import "./admin.css";
import { getStaff } from "@/lib/admin/session";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Partner2B admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  return (
    <div className="adm">
      <div className="adm-top">
        <div className="adm-brand">Partner2B <b>admin</b></div>
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
