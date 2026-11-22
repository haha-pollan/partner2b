"use client";
import { useState } from "react";
import Link from "next/link";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    if (!consent) { setErr("Please tick the box to subscribe."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website_confirm: trap, source: "footer", referrer: document.referrer }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) { setErr(j.error || "Something went wrong. Please try again."); return; }
      setDone(true);
    } catch {
      setErr("Something went wrong. Please check your connection and try again.");
    } finally { setBusy(false); }
  }

  if (done) return <p className="newsok" role="status">Thank you, you are subscribed</p>;
  return (
    <form className="newsform" onSubmit={submit} noValidate>
      <div className="newsrow">
        <label htmlFor="news-email" style={{ position: "absolute", left: -9999 }}>Email</label>
        <input id="news-email" type="email" inputMode="email" autoComplete="email" maxLength={320} placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
        <button type="submit" className="btn btn-p btn-sm" disabled={busy}>{busy ? "Sending" : "Subscribe"}</button>
      </div>
      <label className="newsconsent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>I agree to receive the Partner2B newsletter. See the <Link href="/privacy">Privacy policy</Link></span>
      </label>
      {err && <p className="newserr" role="alert">{err}</p>}
    </form>
  );
}
