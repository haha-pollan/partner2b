"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { aiIsNew } from "@/lib/ai";
import { assessIsNew, builderIsNew, calcIsNew } from "@/lib/launch";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [tools, setTools] = useState(false);
  const close = () => { setOpen(false); setDd(false); setTools(false); };
  return (
    <div className="nav">
      <Link href="/" aria-label="Partner2B home" style={{ display: "flex", alignItems: "center" }}>
        <Logo variant="light" size={22} />
      </Link>
      <button type="button" className="navtoggle" aria-expanded={open} aria-controls="navlinks" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="navlinks" className={open ? "navlinks open" : "navlinks"}>
        <Link href="/directory" onClick={close}>Browse directory</Link>
        <Link href="/ai" className="ainav" onClick={close}>AI programs{aiIsNew() ? <span className="newbadge" suppressHydrationWarning>New</span> : null}</Link>
        <div className={tools ? "navdd ainav open" : "navdd ainav"}>
          <span className="navddrow"><Link href="/ai-tools" className="navddlink" onClick={close}>Free tools{builderIsNew() || calcIsNew() || assessIsNew() ? <span className="newbadge" suppressHydrationWarning>New</span> : null}</Link><button type="button" className="navddbtn" aria-label="Show free tools menu" aria-expanded={tools} onClick={() => { setTools((o) => !o); setDd(false); }}><span aria-hidden="true" className="navchev">▾</span></button></span>
          <div className="navmenu">
            <Link href="/program-builder" onClick={close}>Program builder{builderIsNew() ? <span className="newbadge navitembadge" suppressHydrationWarning>New</span> : null}</Link>
            <Link href="/partner-pipeline-calculator" onClick={close}>Partner pipeline calculator{calcIsNew() ? <span className="newbadge navitembadge" suppressHydrationWarning>New</span> : null}</Link>
            <Link href="/partner-program-assessment" onClick={close}>Partner program assessment{assessIsNew() ? <span className="newbadge navitembadge" suppressHydrationWarning>New</span> : null}</Link>
          </div>
        </div>
        <Link href="/services" onClick={close}>Services</Link>
        <div className={dd ? "navdd open" : "navdd"}>
          <button type="button" className="navddbtn" aria-expanded={dd} onClick={() => { setDd((o) => !o); setTools(false); }}>Resources<span aria-hidden="true" className="navchev">▾</span></button>
          <div className="navmenu">
            <Link href="/playbook" onClick={close}>Playbook</Link>
            <Link href="/post" onClick={close}>Blog</Link>
            <Link href="/glossary" onClick={close}>Glossary</Link>
          </div>
        </div>
        <Link href="/submit" className="btn btn-o btn-sm" onClick={close}>Submit a program</Link>
      </nav>
    </div>
  );
}
