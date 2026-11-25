"use client";
import { useState } from "react";
import { gmailLink } from "@/lib/admin/reply";

export function ReplyBox({ to, subject, body, listingUrl }: { to: string; subject: string; body: string; listingUrl: string }) {
  const [text, setText] = useState(body);
  const [su, setSu] = useState(subject);
  const [link, setLink] = useState(listingUrl);
  const finalBody = listingUrl ? text.replace(listingUrl, link) : text;
  return (
    <div>
      {listingUrl && (<><label htmlFor="rl">Listing link</label><input id="rl" className="field" value={link} onChange={(e) => setLink(e.target.value)} /></>)}
      <label htmlFor="rs">Subject</label>
      <input id="rs" className="field" value={su} onChange={(e) => setSu(e.target.value)} />
      <label htmlFor="rb">Message</label>
      <textarea id="rb" className="field" rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      <a className="btn btn-p" style={{ marginTop: 14, display: "inline-block" }} href={gmailLink(to, su, finalBody)} target="_blank" rel="noopener noreferrer">Open in Gmail</a>
    </div>
  );
}
