// Single place for the legal entity details. Change here and both pages update.
export const LEGAL = {
  entity: "Bonobee Inc.",
  address: ["1111B South Governors Avenue, STE 99339", "Dover, DE 19904, United States"],
  email: "info@partner2b.com",
  updated: "November 20, 2026",
};

export type Section = { h: string; p: string[] };

export const PRIVACY: Section[] = [
  {
    h: "Who we are",
    p: [
      `Partner2B Directory (partner2b.com/directory) is a free directory of B2B partner programs. It is operated by ${LEGAL.entity}, ${LEGAL.address.join(", ")}. In this policy, "we" and "us" refer to this operator. We are the controller of the personal data described below.`,
    ],
  },
  {
    h: "What we collect",
    p: [
      "Browsing the directory does not require an account, and we do not ask you for any information to read it.",
      "When you use the Submit, Claim or Report forms, we collect what you type into them: your name, work email address, role, the company and program you are writing about, links you provide, and your message. For the Report form, your email address is optional.",
      "Our hosting provider records technical data when you visit, such as your IP address, browser type, pages requested and the time of the request. This is kept in server logs for security and to keep the site running.",
      "The directory itself is built from information that companies publish about their partner programs. It describes companies and their programs, not individuals.",
    ],
  },
  {
    h: "Why we use it and on what basis",
    p: [
      "We use form data to review submissions, verify that a person is authorized to claim a listing, correct or remove information, and reply to you. The basis is our legitimate interest in keeping the directory accurate (GDPR Article 6(1)(f)), and, where you ask us to act on a request, steps taken at your request.",
      "We use server logs to secure and operate the site. The basis is our legitimate interest in doing so.",
      "We do not sell personal data and we do not use it for advertising.",
    ],
  },
  {
    h: "Who we share it with",
    p: [
      "We use service providers to run the site: Vercel for hosting and Supabase for the database where form submissions are stored. They process data on our behalf and only for that purpose. We may also use an email service to send you replies and to notify us of new submissions.",
      "We may disclose data if the law requires it. We do not share form data with other companies for their own use.",
      "If you submit or claim a listing, the program details you provide may be published in the directory. Your name and email address are not published.",
    ],
  },
  {
    h: "International transfers",
    p: [
      "Our providers may process data outside the European Economic Area, including in the United States. Where this happens, we rely on safeguards such as the European Commission's standard contractual clauses or an adequacy decision.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Form submissions are kept for as long as needed to handle your request and for up to 24 months afterwards, unless you ask us to delete them sooner or the law requires us to keep them longer. Server logs are kept for a short period set by our hosting provider.",
    ],
  },
  {
    h: "Cookies",
    p: [
      "We do not use analytics, advertising or tracking cookies. If this changes, we will update this page and ask for your consent where the law requires it.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "You can ask us to give you a copy of your personal data, correct it, delete it, restrict or object to its use, and, where it applies, receive it in a portable format. To do this, write to us at the address below. We will answer within one month.",
      "You also have the right to complain to a data protection authority. In Poland this is the President of the Personal Data Protection Office (UODO). You can also contact the authority in the country where you live or work.",
    ],
  },
  {
    h: "Information about people in the directory",
    p: [
      "If a listing names an individual and you want it corrected or removed, use the Report form or write to us. We will review the request promptly.",
    ],
  },
  {
    h: "Security and children",
    p: [
      "We use reasonable technical and organizational measures to protect the data we hold. The directory is intended for business use and is not aimed at children.",
    ],
  },
  {
    h: "Changes to this policy",
    p: [`We may update this policy. The date at the top of the page shows when it last changed.`],
  },
  {
    h: "Contact",
    p: [
      `${LEGAL.entity}, ${LEGAL.address.join(", ")}. Email: ${LEGAL.email}.`,
    ],
  },
];

export const TERMS: Section[] = [
  {
    h: "About the directory",
    p: [
      `Partner2B Directory (partner2b.com/directory) is a free directory of B2B partner programs, operated by ${LEGAL.entity}, ${LEGAL.address.join(", ")}. By using the site you agree to these terms. If you do not agree, please do not use it.`,
    ],
  },
  {
    h: "Where the information comes from",
    p: [
      "Listings are compiled from information that companies make public, mainly the official pages of their partner programs. We link to the source on each listing. All information in the directory comes from public sources. Partner2B does not independently verify it.",
      "Programs change often. Commission rates, tiers, requirements and availability may be out of date. Always confirm details with the company before you decide anything.",
    ],
  },
  {
    h: "No affiliation",
    p: [
      "Listing a program does not mean that the company endorses Partner2B or that Partner2B endorses the company. Company names, logos and trademarks belong to their owners and are used only to identify them.",
    ],
  },
  {
    h: "Submitting information",
    p: [
      "If you submit a program, claim a listing or send a correction, you confirm that the information is accurate to the best of your knowledge and that you have the right to send it. You allow us to publish and edit the program details you provide as part of the directory.",
      "Please do not send spam, false information, or anything unlawful. We may refuse, edit or remove any submission at our discretion.",
    ],
  },
  {
    h: "Claiming a listing",
    p: [
      "Claiming a listing is free. To claim one, you must be authorized to act for the company. We may ask you to prove this, for example by writing from a company email address, and we may decline or reverse a claim if we cannot confirm it.",
      "Claiming a listing does not give you control over the rest of the site, and it does not buy ranking or placement.",
    ],
  },
  {
    h: "Corrections and removal",
    p: [
      "If something on the site is wrong, or you want a listing changed or removed, use the Report form or write to us. We will review each request and update the listing where it is justified.",
    ],
  },
  {
    h: "Acceptable use",
    p: [
      "You may browse the directory and link to it. Please do not copy it in bulk, scrape it at scale, resell it, or use it in a way that harms the site or other people. Do not try to break or overload the service.",
    ],
  },
  {
    h: "Third-party links",
    p: [
      "The site links to websites run by other companies. We do not control them and are not responsible for their content or practices.",
    ],
  },
  {
    h: "Disclaimer and liability",
    p: [
      `The directory is provided "as is" and "as available", without warranties of any kind, including accuracy, completeness or fitness for a particular purpose. To the extent the law allows, ${LEGAL.entity} is not liable for any indirect or consequential loss, or for loss of profit or business, arising from your use of the site or from relying on a listing.`,
      "Nothing in these terms limits liability that cannot be limited by law, or any mandatory rights you have as a consumer.",
    ],
  },
  {
    h: "Changes",
    p: [
      "We may change the site or these terms. The date at the top of the page shows when they last changed. Continuing to use the site after a change means you accept the new terms.",
    ],
  },
  {
    h: "Governing law",
    p: [
      "These terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law rules. This does not remove any protection that mandatory law in your country gives you.",
    ],
  },
  {
    h: "Contact",
    p: [`${LEGAL.entity}, ${LEGAL.address.join(", ")}. Email: ${LEGAL.email}.`],
  },
];
