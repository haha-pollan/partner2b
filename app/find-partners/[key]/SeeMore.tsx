"use client";
import { useEffect, useState } from "react";
import RequestForm from "./RequestForm";
import { track } from "./track";

// The paywall popup. For now it holds the access request form; where it leads
// (checkout or account) will be decided later.
export function PaywallDialog({ title, strategyId, partnerType, onClose }: { title: string; strategyId: string; partnerType?: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,10,11,.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
      <div className="cut" style={{ background: "#A8FF5C", color: "#0A0A0B", maxWidth: 640, width: "100%", padding: "34px 36px 40px", position: "relative", ["--c" as string]: "26px" }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 14, right: 18, background: "none", border: 0, fontSize: 28, lineHeight: 1, cursor: "pointer", color: "#0A0A0B" }}>×</button>
        <h2 style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: "clamp(20px,2.4vw,30px)", lineHeight: 1.2, letterSpacing: 0, WebkitTextStroke: "1.5px currentColor" }}>{title}</h2>
        <p style={{ margin: "14px 0 0", fontSize: 18, lineHeight: 1.5 }}>Full access is opening soon: every match with why it fits, when to approach, and your plan board. Leave your email and we will write to you as soon as it is ready.</p>
        <RequestForm strategyId={strategyId} partnerType={partnerType} />
      </div>
    </div>
  );
}

export default function SeeMore({ type, total, strategyId, violet }: { type: string; total: string; strategyId: string; violet?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={violet ? "btn btn-s btn-sm" : "btn btn-p btn-sm"} onClick={() => { track(strategyId, "see_more", type); setOpen(true); }}>See more {type}s</button>
      {open ? <PaywallDialog title={`Request early access to all ${total} ${type}s`} strategyId={strategyId} partnerType={type} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
