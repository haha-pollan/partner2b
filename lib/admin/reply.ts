// Reply drafts for the submissions inbox. Plain, short, no em dashes.
// People edit the text before opening it in Gmail, then press Send themselves.

type Sub = { kind: string; status: string | null; company: string | null; listing: string | null; first_name: string | null; name: string | null };

export function draftReply(s: Sub, listingUrl: string): { subject: string; body: string } {
  const first = s.first_name || (s.name ? s.name.split(" ")[0] : "") || "there";
  const what = s.company || s.listing || "your program";
  const sign = "\n\nBest regards,\nPartner2B team";

  if (s.kind === "submit" && s.status === "added") {
    return {
      subject: `${what} is now listed on Partner2B`,
      body: `Hi ${first},\n\nThank you for submitting ${what}. The listing is now live: ${listingUrl}\n\nYou can ask us to update it or claim it at any time at https://partner2b.com/claim.${sign}`,
    };
  }
  if (s.kind === "submit" && s.status === "rejected") {
    return {
      subject: `Your submission to Partner2B: ${what}`,
      body: `Hi ${first},\n\nThank you for submitting ${what}. We could not find a public page for the partner program yet. Could you send us the link to the public program page? We will add it to the directory once there is one.${sign}`,
    };
  }
  return {
    subject: `Partner2B: ${what}`,
    body: `Hi ${first},\n\nThank you for your message about ${what} on Partner2B.\n\n${sign.trim()}`,
  };
}

export function gmailLink(to: string, subject: string, body: string): string {
  const q = new URLSearchParams({ view: "cm", fs: "1", authuser: "hello@partner2b.com", to, su: subject, body });
  return `https://mail.google.com/mail/?${q.toString()}`;
}
