"use client";
import { useRef, useState } from "react";
import Link from "next/link";

const inputS: React.CSSProperties = { width: "100%", marginTop: 8, background: "#ECECEE", color: "#0A0A0B", border: 0, borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 16 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (
  <label style={{ display: "block", marginTop: 18, fontSize: 14, fontWeight: 400, color: "#4A4B51" }}>
    {t}{req ? <span style={{ color: "#A8FF5C" }}> *</span> : <span style={{ color: "#85868B" }}> (optional)</span>}
  </label>
);

export function PlaybookForm({ id = "download" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const blobUrl = useRef<string>("");

  const save = (url: string) => {
    const a = document.createElement("a");
    a.href = url; a.download = "Partner2B_Ecosystem-Led_Growth_Playbook_2026.pdf";
    document.body.appendChild(a); a.click(); a.remove();
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    if (!consent) { setErr("Please tick the box so we can send you the playbook."); return; }
    setBusy(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const res = await fetch("/api/playbook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, name: [first.trim(), last.trim()].filter(Boolean).join(" "), company, consent, website_confirm: trap,
          utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "",
          referrer: document.referrer,
        }),
      });
      if (!(res.headers.get("content-type") ?? "").includes("application/pdf")) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Something went wrong. Please try again.");
        return;
      }
      const blob = await res.blob();
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = URL.createObjectURL(blob);
      save(blobUrl.current);
      setDone(true);
    } catch {
      setErr("Something went wrong. Please check your connection and try again.");
    } finally { setBusy(false); }
  }

  return (
    <div id={id} className="cut" style={{ background: "#fff", color: "#0A0A0B", padding: "32px 32px 40px", scrollMarginTop: 24 }}>
      {done ? (
        <div role="status">
          <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 22, color: "#A8FF5C", lineHeight: 1.25 }}>Your playbook is downloading</div>
          <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.6, color: "#4A4B51" }}>If nothing happened, use the button below.</p>
          <button type="button" onClick={() => blobUrl.current && save(blobUrl.current)} className="btn btn-p" style={{ marginTop: 20, cursor: "pointer" }}>Download the PDF again</button>
          <div style={{ marginTop: 32, borderTop: "1px solid #2A2B2F", paddingTop: 22, fontSize: 15, lineHeight: 1.6, color: "#4A4B51" }}>
            Next, put it to work: <Link href="/program-builder" style={{ color: "#A8FF5C", textDecoration: "underline" }}>build your partner program strategy</Link> or <Link href="/directory" style={{ color: "#A8FF5C", textDecoration: "underline" }}>browse real partner programs</Link>.
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div style={{ fontFamily: "'Michroma',sans-serif", fontSize: 20, lineHeight: 1.3 }}>Get the free playbook</div>
          <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.55, color: "#4A4B51" }}>Leave your email and the PDF downloads right away.</p>
          <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name="website_confirm" /></label>
          </div>
          <Lbl t="Work email" req />
          <input type="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" autoComplete="email" style={inputS} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "0 14px" }}>
            <div>
              <Lbl t="First name" />
              <input maxLength={100} value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" style={inputS} />
            </div>
            <div>
              <Lbl t="Last name" />
              <input maxLength={100} value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" style={inputS} />
            </div>
          </div>
          <Lbl t="Company" />
          <input maxLength={200} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" style={inputS} />
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 22, fontSize: 14, lineHeight: 1.5, color: "#4A4B51", cursor: "pointer" }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ flex: "0 0 20px", width: 20, height: 20, marginTop: 1, accentColor: "#A8FF5C" }} />
            <span>I agree that Partner2B stores these details to deliver the playbook and to contact me about it. See the <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy policy</Link>.</span>
          </label>
          {err && <div role="alert" style={{ marginTop: 18, color: "#FF9B9B", fontSize: 15 }}>{err}</div>}
          <button type="submit" disabled={busy} className="btn btn-p" style={{ marginTop: 24, width: "100%", cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Preparing your PDF" : "Download the free playbook"}
          </button>
        </form>
      )}
    </div>
  );
}
