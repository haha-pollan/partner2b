"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Icon, type IconName } from "./Icon";

function Item({ href, icon, title, desc, onClick }: { href: string; icon: IconName; title: string; desc: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="navitem">
      <span className="navtile"><Icon name={icon} color="#FFFFFF" size={30} /></span>
      <span className="navtxt"><b>{title}</b><span>{desc}</span></span>
      <span className="navarrow" aria-hidden="true">→</span>
    </Link>
  );
}

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
            <Item href="/directory" icon="directory" title="All programs" desc="Compare B2B partner programs side by side" onClick={close} />
            <Item href="/ai" icon="ai" title="AI programs" desc="Partner programs from AI companies" onClick={close} />
          </div>
        </div>
        <Link href="/find-partners" className="ainav" onClick={close}>Find partners</Link>
        <div className={tools ? "navdd ainav open" : "navdd ainav"}>
          <span className="navddrow"><Link href="/ai-tools" className="navddlink" onClick={close}>Free tools</Link><button type="button" className="navddbtn" aria-label="Show free tools menu" aria-expanded={tools} onClick={() => { setTools((o) => !o); setDd(false); setDir(false); }}><span aria-hidden="true" className="navchev">▾</span></button></span>
          <div className="navmenu">
            <Item href="/program-builder" icon="builder" title="Program builder" desc="Get a partner program strategy in 3 minutes" onClick={close} />
            <Item href="/partner-pipeline-calculator" icon="calculator" title="Partner pipeline calculator" desc="See how many partners you need for your goal" onClick={close} />
            <Item href="/partner-roi-calculator" icon="pipeline" title="Partner ROI calculator" desc="See what your partner program returns on its cost" onClick={close} />
            <Item href="/partner-compensation-calculator" icon="calculator" title="Partner compensation budget calculator" desc="Set a commission budget for each partner type" onClick={close} />
            <Item href="/partner-program-assessment" icon="assessment" title="Partner program assessment" desc="Find the two things holding your program back" onClick={close} />
          </div>
        </div>
        <Link href="/services" onClick={close}>Services</Link>
        <div className={dd ? "navdd navddr open" : "navdd navddr"}>
          <button type="button" className="navddbtn" aria-expanded={dd} onClick={() => { setDd((o) => !o); setTools(false); setDir(false); }}>Resources<span aria-hidden="true" className="navchev">▾</span></button>
          <div className="navmenu">
            <Item href="/playbook" icon="playbook" title="Playbook" desc="A free guide to ecosystem-led growth" onClick={close} />
            <Item href="/post" icon="blog" title="Blog" desc="Practical articles on partner programs" onClick={close} />
            <Item href="/glossary" icon="glossary" title="Glossary" desc="Plain definitions of partner program terms" onClick={close} />
          </div>
        </div>
        <Link href="/submit" className="btn btn-o btn-sm" onClick={close}>Submit a program</Link>
      </nav>
    </div>
  );
}
