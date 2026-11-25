"use client";
import { useEffect } from "react";

// Shows a readable message inside the admin instead of the generic crash page.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("admin error:", error); }, [error]);
  return (
    <div className="adm-card cut">
      <h1>Something went wrong</h1>
      <p className="adm-sub">This page could not load. Try again, or sign out and back in.</p>
      <p style={{ fontSize: 14, color: "var(--g500)", overflowWrap: "anywhere" }}>
        Details: {error.message || "unknown"}{error.digest ? ` (code ${error.digest})` : ""}
      </p>
      <button type="button" className="btn btn-p btn-sm" onClick={() => reset()}>Try again</button>
    </div>
  );
}
