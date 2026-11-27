"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [tools, setTools] = useState(false);
  const [dir, setDir] = useState(false);
  const close = () => { setOpen(false); setDd(false); setTools(false); setDir(false); };
  return (
    <div className="nav">
      <Link href="/" aria-label="Partner2B home" style={{ display: "flex", alignItems: "center" }}>
        <Logo variant="light" size={22} />
      </Link>
      <button type="button" className="navtoggle" aria-expanded={open} aria-controls="navlinks" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="navlinks" className={open ? "navlinks open" : "navlinks"}>
        <div className={dir ? "navdd ainav open" : "navdd ainav"}>
          <span className="navddrow"><Link href="/directory" className="navddlink" onClick={close}>Directory</Link><button type="button" className="navddbtn" aria-label="Show directory menu" aria-expanded={dir} onClick={() => { setDir((o) => !o); setTools(false); setDd(false); }}><span aria-hidden="true" className="navchev">▾</span></button></span>
          <div className="navmenu">
            <Link href="/directory" onClick={close}>All programs</Link>
            <Link href="/ai" onClick={close}>AI programs</Link>
          </div>
        </div>
        <Link href="/find-partners" className="ainav" onClick={close}>Find partners</Link>
        <div className={tools ? "navdd ainav open" : "navdd ainav"}>
          <span className="navddrow"><Link href="/ai-tools" className="navddlink" onClick={close}>Free tools</Link><button type="button" className="navddbtn" aria-label="Show free tools menu" aria-expanded={tools} onClick={() => { setTools((o) => !o); setDd(false); setDir(false); }}><span aria-hidden="true" className="navchev">▾</span></button></span>
          <div className="navmenu">
            <Link href="/program-builder" onClick={close}>Program builder</Link>
            <Link href="/partner-pipeline-calculator" onClick={close}>Partner pipeline calculator</Link>
            <Link href="/partner-roi-calculator" onClick={close}>Partner ROI calculator</Link>
            <Link href="/partner-compensation-calculator" onClick={close}>Partner compensation budget calculator</Link>
            <Link href="/partner-program-assessment" onClick={close}>Partner program assessment</Link>
          </div>
        </div>
        <Link href="/services" onClick={close}>Services</Link>
        <div className={dd ? "navdd open" : "navdd"}>
          <button type="button" className="navddbtn" aria-expanded={dd} onClick={() => { setDd((o) => !o); setTools(false); setDir(false); }}>Resources<span aria-hidden="true" className="navchev">▾</span></button>
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
