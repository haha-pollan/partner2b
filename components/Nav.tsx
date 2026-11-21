"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { aiIsNew } from "@/lib/ai";
import { builderIsNew } from "@/lib/launch";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const close = () => { setOpen(false); setDd(false); };
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
        <Link href="/ai" className="ainav" onClick={close}>AI programs{aiIsNew() ? <span className="newbadge" suppressHydrationWarning>New</span> : null}</Link>
        <Link href="/program-builder" className="ainav" onClick={close}>Program builder{builderIsNew() ? <span className="newbadge" suppressHydrationWarning>New</span> : null}</Link>
        <Link href="/services" onClick={close}>Services</Link>
        <div className={dd ? "navdd open" : "navdd"}>
          <button type="button" className="navddbtn" aria-expanded={dd} onClick={() => setDd((o) => !o)}>Resources<span aria-hidden="true" className="navchev">▾</span></button>
          <div className="navmenu">
            <Link href="/playbook" onClick={close}>Playbook</Link>
            <Link href="/post" onClick={close}>Blog</Link>
            <Link href="/glossary" onClick={close}>Glossary</Link>
          </div>
        </div>
        <Link href="/submit" onClick={close}>Submit a program</Link>
        <Link href="/directory" className="navcta" onClick={close}>Browse directory</Link>
      </nav>
    </div>
  );
}
