"use client";
import { useState } from "react";

export default function RequestForm({ strategyId, inline }: { strategyId: string; inline?: boolean }) {
  const [email, setEmail] = useState(""); const [consent, setConsent] = useState(false); const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle"); const [err, setErr] = useState("");
  async function send(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) { setErr("Enter a valid email and tick the box."); return; }
    setState("busy");
    try {
      const r = await fetch("/api/discovery/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ strategy_id: strategyId, email, consent, website_confirm: trap }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) { setErr(j.error || "Something went wrong. Try again."); setState("idle"); return; }
      setState("done");
    } catch { setErr("Something went wrong. Try again."); setState("idle"); }
  }
  if (state === "done") return <p style={{ marginTop: inline ? 0 : 26, fontSize: 20 }}>Request received. We will email you at {email}.</p>;
  return (
    <form onSubmit={send} style={{ marginTop: inline ? 0 : 26, display: "grid", gap: 16, maxWidth: inline ? 620 : 560 }}>
      <input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }} name="website_confirm" />
      <div style={inline ? { display: "flex", gap: 12, flexWrap: "wrap" } : { display: "grid", gap: 16 }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" aria-label="Work email" required style={{ background: "#fff", color: "#0A0A0B", border: 0, padding: "16px 18px", fontSize: 18, fontFamily: "inherit", ...(inline ? { flex: "1 1 260px", minWidth: 0 } : {}) }} />
        {inline ? <button type="submit" className="btn btn-s" disabled={state === "busy"}>{state === "busy" ? "Sending" : "Get full access"}</button> : null}
      </div>
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, lineHeight: 1.45, color: inline ? "#B9BABD" : undefined }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: inline ? "#A8FF5C" : "#0A0A0B", flex: "0 0 18px" }} />
        <span>I agree that Partner2B may email me about full access to my matches.</span>
      </label>
      {err ? <p role="alert" style={{ fontSize: 15 }}>{err}</p> : null}
      {inline ? null : <div><button type="submit" className="btn btn-s" disabled={state === "busy"}>{state === "busy" ? "Sending" : "Get full access"}</button></div>}
    </form>
  );
}
