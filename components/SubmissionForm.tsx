"use client";
import { useActionState } from "react";
import Link from "next/link";
import { sendSubmission, type FormState } from "@/app/actions";
import { TYPES, CATEGORIES, ISSUES, type Kind } from "@/lib/formsConfig";

type Opt = { slug: string; label: string };
const init: FormState = { ok: false };

const inputS: React.CSSProperties = { width: "100%", background: "#1C1D20", color: "#ECECEE", border: "1px solid #2A2B2F", borderRadius: 10, padding: "14px 16px", font: "inherit", fontSize: 17 };
const Lbl = ({ t, req }: { t: string; req?: boolean }) => (
  <label style={{ display: "block", fontSize: 15, fontWeight: 800, margin: "22px 0 8px" }}>{t}{req && <span style={{ color: "#A8FF5C" }}> *</span>}</label>
);
const Hint = ({ t }: { t: string }) => <div style={{ marginTop: 8, fontSize: 14, color: "#85868B" }}>{t}</div>;

export function SubmissionForm({ kind, listings, defaultListing }: { kind: Kind; listings: Opt[]; defaultListing?: string }) {
  const [state, action, pending] = useActionState(sendSubmission, init);
  if (state.ok) {
    return (
      <div style={{ padding: "8px 0 24px" }}>
        <div style={{ fontFamily: "'Michroma',sans-serif", fontWeight: 400, fontSize: 19, letterSpacing: 0, color: "#A8FF5C" }}>Thank you. We received it</div>
        <p style={{ marginTop: 14, fontSize: 18, lineHeight: 1.5, color: "#B9BABD" }}>We will review it and get back to you if we need anything else.</p>
        <Link href="/directory" style={{ display: "inline-block", marginTop: 22, background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", padding: "14px 26px", borderRadius: 12 }}>Back to the directory</Link>
      </div>
    );
  }
  const listingSelect = (
    <>
      <Lbl t={kind === "claim" ? "Listing to claim" : "Listing"} req />
      <select name="listing" required defaultValue={defaultListing ?? ""} style={inputS}>
        <option value="" disabled>Choose a listing</option>
        {listings.map((l) => (<option key={l.slug} value={l.slug}>{l.label}</option>))}
      </select>
    </>
  );
  return (
    <form action={action} noValidate={false}>
      <input type="hidden" name="kind" value={kind} />
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}>
        <label>Leave this empty<input name="website_confirm" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {kind === "submit" && (
        <>
          <Lbl t="Company name" req />
          <input name="company" required maxLength={200} placeholder="Company that runs the program" style={inputS} />
          <Lbl t="Official program page" req />
          <input name="program_url" type="url" required maxLength={500} placeholder="https://" style={inputS} />
          <Hint t="Link to the partner page on the company's own website" />
          <Lbl t="Program type" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {TYPES.map((t) => (
              <label key={t} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#1C1D20", border: "1px solid #2A2B2F", borderRadius: 999, padding: "10px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                <input type="checkbox" name="program_types" value={t} style={{ width: 18, height: 18, accentColor: "#A8FF5C" }} />{t}
              </label>
            ))}
          </div>
          <Hint t="Pick all that apply" />
          <Lbl t="Product category" req />
          <select name="product_category" required defaultValue="" style={inputS}>
            <option value="" disabled>Choose one</option>
            {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <Lbl t="What the program offers" />
          <textarea name="details" maxLength={4000} rows={4} placeholder="A sentence or two is enough" style={{ ...inputS, resize: "vertical" }} />
          <Lbl t="Company description" />
          <textarea name="company_description" maxLength={2000} rows={4} placeholder="Two or three sentences on what the company does" style={{ ...inputS, resize: "vertical" }} />
          <Lbl t="Your email" req />
          <input name="email" type="email" required maxLength={320} placeholder="name@company.com" style={inputS} />
          <Hint t="Only used if we need to check a detail" />
        </>
      )}

      {kind === "claim" && (
        <>
          {listingSelect}
          <Lbl t="Your name" req />
          <input name="name" required maxLength={200} style={inputS} />
          <Lbl t="Work email" req />
          <input name="email" type="email" required maxLength={320} placeholder="name@company.com" style={inputS} />
          <Hint t="Use an email on your company's domain so we can confirm you work there" />
          <Lbl t="Your role" />
          <input name="role" maxLength={200} style={inputS} />
          <Lbl t="What should change on the listing" />
          <textarea name="details" maxLength={4000} rows={4} style={{ ...inputS, resize: "vertical" }} />
          <Lbl t="Company description" />
          <textarea name="company_description" maxLength={2000} rows={4} placeholder="Two or three sentences on what the company does" style={{ ...inputS, resize: "vertical" }} />
          <Lbl t="How the program works" />
          <textarea name="how_it_works" maxLength={2000} rows={4} placeholder="The main steps, one per line" style={{ ...inputS, resize: "vertical" }} />
          <Lbl t="Requirements" />
          <textarea name="requirements" maxLength={2000} rows={3} placeholder="What a partner needs to join" style={{ ...inputS, resize: "vertical" }} />
        </>
      )}

      {kind === "report" && (
        <>
          {listingSelect}
          <Lbl t="What is wrong" req />
          <select name="issue" required defaultValue="" style={inputS}>
            <option value="" disabled>Choose one</option>
            {ISSUES.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <Lbl t="The correct information" req />
          <textarea name="details" required maxLength={4000} rows={4} style={{ ...inputS, resize: "vertical" }} />
          <Lbl t="Link to a source" />
          <input name="source_url" type="url" maxLength={500} placeholder="https://" style={inputS} />
          <Hint t="The official page that shows the correct information" />
          <Lbl t="Your email" />
          <input name="email" type="email" maxLength={320} placeholder="name@company.com" style={inputS} />
          <Hint t="Only if you want a reply" />
        </>
      )}

      {kind !== "report" && (
        <label style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 26, fontSize: 16 }}>
          <input type="checkbox" name="confirmed" required style={{ width: 20, height: 20, accentColor: "#A8FF5C" }} />
          {kind === "submit" ? "This link is the official partner page of the company" : "I am authorized to speak for this company"}
        </label>
      )}

      {state.error && <div role="alert" style={{ marginTop: 22, color: "#FF9B9B", fontSize: 16, fontWeight: 700 }}>{state.error}</div>}
      <button type="submit" disabled={pending} style={{ marginTop: 28, background: "#A8FF5C", color: "#0A0A0B", fontWeight: 400, fontFamily: "'Michroma',sans-serif", fontSize: 14, padding: "16px 30px", border: 0, borderRadius: 12, cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
        {kind === "submit" ? "Submit program" : kind === "claim" ? "Request to claim" : "Send correction"}
      </button>
      <p style={{ marginTop: 18, fontSize: 14, color: "#85868B", lineHeight: 1.5 }}>
        We use these details only to review your request. See our <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy policy</Link>.
      </p>
    </form>
  );
}
