"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = { label: string; href?: string; badge?: number; soon?: boolean };
type Group = { title: string; items: Item[]; superOnly?: boolean };

export default function Sidebar({ isSuper, newSubmissions, name, role, logout }: { isSuper: boolean; newSubmissions: number; name: string; role: string; logout: () => Promise<void> }) {
  const path = usePathname() || "";
  const [open, setOpen] = useState(false);

  const groups: Group[] = [
    { title: "Overview", items: [{ label: "Dashboard", href: "/admin" }] },
    { title: "Inbox", items: [{ label: "Submissions", href: "/admin/submissions", badge: newSubmissions }, { label: "Leads", soon: true }] },
    { title: "Directory", items: [{ label: "Programs", href: "/admin/programs" }, { label: "Data quality", soon: true }] },
    { title: "Content", items: [{ label: "Blog articles", soon: true }, { label: "Subscribers", soon: true }] },
    { title: "Vendors", items: [{ label: "Vendor accounts", soon: true }, { label: "Claims", soon: true }] },
    { title: "Admin", superOnly: true, items: [{ label: "Team and roles", soon: true }, { label: "Activity log", soon: true }, { label: "Import and export", soon: true }, { label: "Settings and prompts", soon: true }] },
  ];

  const active = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/"));

  return (
    <aside className={`adm-side${open ? " open" : ""}`}>
      <div className="adm-side-head">
        <Link href="/admin" className="adm-brand">Partner2B <b>admin</b></Link>
        <button type="button" className="adm-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav className="adm-nav" onClick={() => setOpen(false)}>
        {groups.filter((g) => !g.superOnly || isSuper).map((g) => (
          <div key={g.title} className="adm-group">
            <div className="adm-group-title">{g.title}</div>
            {g.items.map((i) =>
              i.href ? (
                <Link key={i.label} href={i.href} className={`adm-item${active(i.href) ? " on" : ""}`}>
                  <span>{i.label}</span>
                  {i.badge ? <em className="adm-badge">{i.badge}</em> : null}
                </Link>
              ) : (
                <span key={i.label} className="adm-item off" title="Coming soon"><span>{i.label}</span><em className="adm-soon">Soon</em></span>
              )
            )}
          </div>
        ))}
      </nav>
      <form action={logout} className="adm-side-foot">
        <div className="adm-user"><b>{name}</b><span>{role === "super_admin" ? "Super admin" : "Staff"}</span></div>
        <button type="submit">Sign out</button>
      </form>
    </aside>
  );
}
