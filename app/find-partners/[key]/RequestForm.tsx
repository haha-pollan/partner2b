"use client";
import { useState } from "react";
import { track } from "./track";

const WHEN = ["This month", "This quarter", "Just exploring"];
const PAY = ["Yes", "Maybe", "Only if free"];

function Chips({ label, options, value, onPick, dark }: { label: string; options: string[]; value: string; onPick: (v: string) => void; dark: boolean }) {
  return (
    <div role="group" aria-label={label}>
      <div style={{ fontSize: 15, marginBottom: 8, color: dark ? "#B9BABD" : "#1C1D20" }}>{label} <span style={{ opacity: 0.7 }}>(optional)</span></div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => {
          const on = value === o;
          return (
            <button key={o} type="button" aria-pressed={on} onClick={() => onPick(on ? "" : o)} style={{ cursor: "pointer", fontFamily: "inherit", fontSize: 15, padding: "8px 14px", border: 0, borderRadius: 999, background: on ? (dark ? "#A8FF5C" : "#0A0A0B") : dark ? "#2A2B30" : "rgba(10,10,11,.12)", color: on ? (dark ? "#0A0A0B" : "#A8FF5C") : dark ? "#ECECEE" : "#0A0A0B" }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function RequestForm({ strategyId, inline, partnerType }: { strategyId: string; inline?: boolean; partnerType?: string }) {
  const [email, setEmail] = useState(""); const [consent, setConsent] = useState(false); const [trap, setTrap] = useState("");
  const [when, setWhen] = useState(""); const [pay, setPay] = useState(""); const [started, setStarted] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle"); const [err, setErr] = useState("");
  async function send(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) { setErr("Enter a valid email and tick the box."); return; }
    setState("busy");
    try {
      const r = await fetch("/api/discovery/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ strategy_id: strategyId, email, consent, website_confirm: trap, when_needed: when || undefined, would_pay: pay || undefined, partner_type: partnerType }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) { setErr(j.error || "Something went wrong. Try again."); setState("idle"); return; }
      setState("done");
    } catch { setErr("Something went wrong. Try again."); setState("idle"); }
  }
  if (state === "done") {
    return (
      <div style={{ marginTop: inline ? 0 : 26 }}>
        <p style={{ fontSize: 20, lineHeight: 1.45 }}>Request received. We sent a confirmation to {email}.</p>
        <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.5, color: inline ? "#B9BABD" : "#1C1D20" }}>Full access is opening soon and you will be among the first to get it. Want to tell us what you need? <a href="mailto:hello@partner2b.com?subject=Partner%20discovery%2015%20minute%20call" style={{ textDecoration: "underline" }}>Write to us for a 15 minute call</a>.</p>
      </div>
    );
  }
  return (
    <form onSubmit={send} style={{ marginTop: inline ? 0 : 26, display: "grid", gap: 16, maxWidth: inline ? 620 : 560 }}>
      <input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }} name="website_confirm" />
      <div style={inline ? { display: "flex", gap: 12, flexWrap: "wrap" } : { display: "grid", gap: 16 }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => { if (!started) { setStarted(true); track(strategyId, "form_start", partnerType); } }} placeholder="name@company.com" aria-label="Work email" required style={{ background: "#fff", color: "#0A0A0B", border: 0, padding: "16px 18px", fontSize: 18, fontFamily: "inherit", ...(inline ? { flex: "1 1 260px", minWidth: 0 } : {}) }} />
        {inline ? <button type="submit" className="btn btn-s" disabled={state === "busy"}>{state === "busy" ? "Sending" : "Request early access"}</button> : null}
      </div>
      <Chips label="When do you need partners?" options={WHEN} value={when} onPick={setWhen} dark={!!inline} />
      <Chips label="Would you pay for full access?" options={PAY} value={pay} onPick={setPay} dark={!!inline} />
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, lineHeight: 1.45, color: inline ? "#B9BABD" : undefined }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: inline ? "#A8FF5C" : "#0A0A0B", flex: "0 0 18px" }} />
        <span>I agree that Partner2B may email me about early access to my matches.</span>
      </label>
      {err ? <p role="alert" style={{ fontSize: 15 }}>{err}</p> : null}
      {inline ? null : <div><button type="submit" className="btn btn-s" disabled={state === "busy"}>{state === "busy" ? "Sending" : "Request early access"}</button></div>}
    </form>
  );
}
