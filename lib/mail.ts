// Sends mail from hello@partner2b.com through Resend. Needs RESEND_API_KEY in Vercel and the partner2b.com domain verified in Resend.
// Without the key nothing is sent and the caller gets "skipped", so the site keeps working.
const FROM = process.env.MAIL_FROM || "Partner2B <hello@partner2b.com>";

export type MailResult = "sent" | "skipped" | "failed";

export async function sendMail(m: { to: string; subject: string; text: string; replyTo?: string }): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped";
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ from: FROM, to: [m.to], subject: m.subject, text: m.text, ...(m.replyTo ? { reply_to: m.replyTo } : {}) }),
    });
    return r.ok ? "sent" : "failed";
  } catch { return "failed"; } finally { clearTimeout(timer); }
}
