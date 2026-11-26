"use client";
import { useEffect, useState } from "react";
import { PaywallDialog } from "./SeeMore";

// A slim unlock bar at the bottom of the screen. It shows after the first screen of results
// and hides again when the main unlock block is in view.
export default function StickyCta({ total, strategyId }: { total: string; strategyId: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById("unlock");
    const io = el ? new IntersectionObserver(([e]) => setAtEnd(e.isIntersecting)) : null;
    if (el && io) io.observe(el);
    return () => { window.removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, []);
  const show = scrolled && !atEnd;
  return (
    <>
      <div aria-hidden={!show} style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60, background: "rgba(14,14,16,.94)", borderTop: "2px solid #A8FF5C", transform: show ? "translateY(0)" : "translateY(110%)", transition: "transform .25s ease", padding: "12px var(--margin)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 16, color: "#ECECEE", minWidth: 0 }}><span style={{ color: "#A8FF5C" }}>{total}</span> matches are waiting for you</span>
          <button type="button" tabIndex={show ? 0 : -1} className="btn btn-p btn-sm" style={{ flex: "0 0 auto", padding: "12px 18px" }} onClick={() => setOpen(true)}>Unlock all matches</button>
        </div>
      </div>
      {open ? <PaywallDialog title={`Unlock all ${total} matches`} strategyId={strategyId} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
