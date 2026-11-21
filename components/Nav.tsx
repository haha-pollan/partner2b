"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { aiIsNew } from "@/lib/ai";

export function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="nav">
      <Link href="/" aria-label="Partner2B home" style={{ display: "flex", alignItems: "center" }}>
        <Logo variant="dark" />
      </Link>
      <button type="button" className="navtoggle" aria-expanded={open} aria-controls="navlinks" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="navlinks" className={open ? "navlinks open" : "navlinks"}>
        <Link href="/directory" onClick={close}>Directory</Link>
        <Link href="/ai" onClick={close}>AI programs{aiIsNew() ? <span className="newbadge" suppressHydrationWarning>New</span> : null}</Link>
        <Link href="/services" onClick={close}>Services</Link>
        <Link href="/post" onClick={close}>Blog</Link>
        <Link href="/submit" onClick={close}>Submit a program</Link>
        <Link href="/directory" className="navcta" onClick={close}>Browse directory</Link>
      </nav>
    </div>
  );
}
