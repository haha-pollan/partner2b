"use client";
import { useState } from "react";

export function FiltersToggle({ children, active }: { children: React.ReactNode; active: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? "sidewrap open" : "sidewrap"}>
      <button type="button" className="filtbtn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? "Hide filters" : active > 0 ? `Show filters (${active} active)` : "Show filters"}
      </button>
      <div className="sidebody">{children}</div>
    </div>
  );
}
