// Copy for the public assessment page (search and answer engines read this).
// The visible page and the FAQPage markup both use these strings, so they always match.

export const UPDATED_ISO = "2026-11-23";
export const UPDATED_LABEL = "23 November 2026";

export const SHORT_ANSWER =
  "A partner program usually does not perform because partners signed up but never started selling, not because there are too few partners. The cause sits in one of eight places: partner fit, the offer, partner earnings, how you attract partners, onboarding, enablement, co-selling, or ownership and tracking. Most programs have two weak spots that hold the rest back. The free assessment finds yours in about 3 minutes.";

export const STATS: { n: string; l: string; s: string; href: string }[] = [
  { n: "30 to 50%", l: "of new partners activate in a managed program", s: "Unifyr Channel Atlas 2026, via Introw", href: "https://docs.introw.io/headless/agentic-use-cases/activation" },
  { n: "45 to 50 days", l: "average wait for a partner's first sale", s: "PartnerStack", href: "https://partnerstack.com/articles/why-partners-dont-activate-and-what-that-says-about-your-program" },
  { n: "80%", l: "of channel revenue comes from 20% of partners", s: "Forrester", href: "https://www.forrester.com/blogs/when-is-it-time-to-fire-a-channel-partner" },
];

// One entry per assessment area, in the same order as AREAS.
export const REASONS: { q: string; d: string }[] = [
  { q: "Are you signing the wrong partners?", d: "Without a clear profile of the partner you want, you sign companies that never sell for you." },
  { q: "Is there more in it than commission?", d: "Partners want to grow their own business, so a commission alone gives them little reason to start." },
  { q: "Do partner earnings match the effort?", d: "Long waits for a first payout and small earnings make good partners drift away after signing." },
  { q: "Are you waiting for partners to apply?", d: "Good partners are busy and rarely look for your program, so the ones you want must be invited." },
  { q: "Do new partners know their first 90 days?", d: "Without a clear plan and a first lead goal, most new partners never bring a first deal." },
  { q: "Can partners sell for you without guessing?", d: "Partners need a ready pitch, answers to objections and proof, and they need to feel promoted." },
  { q: "Do you work deals together with partners?", d: "Deals stall when partners and your own sales team do not agree who owns the deal and who helps." },
  { q: "Does one person own it and see the revenue?", d: "When nobody owns the program and partner revenue is invisible, problems stay hidden for months." },
];

export const SIGNS: { sign: string; means: string; look: string }[] = [
  { sign: "Partners join but stay silent", means: "They signed, then had no clear first step or reason to start", look: "Onboarding, enablement, offer" },
  { sign: "Partners bring leads but few deals close", means: "The leads are weak, or nobody helps partners close them", look: "Enablement, co-selling, fit" },
  { sign: "Deals are small or slow", means: "The partners are the wrong size, or have little to gain", look: "Fit, economics, enablement" },
  { sign: "Partners leave or fade away", means: "Earnings arrive too late or are too small to stay for", look: "Economics, offer, operations and tracking" },
  { sign: "Too few partners join", means: "Good partners are not invited, or see little in it for them", look: "Attracting partners, offer, fit" },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Why is my partner program not generating revenue?",
    a: "Most often because partners joined but never became active. Revenue needs a partner who knows who to approach, has a pitch to use and earns something worth the effort. Check eight areas: fit, offer, economics, how you attract partners, onboarding, enablement, co-selling, and ownership and tracking. The free assessment shows which two hold yours back.",
  },
  {
    q: "Why do partners go quiet after they sign?",
    a: "Signing is a decision and starting is a habit, and nothing in the program builds it. Partners go quiet when the first step is unclear, the first earnings are far away, or they have nothing ready to send a customer. PartnerStack puts the average time to a partner's first sale at 45 to 50 days, so a plan for the first 90 days matters.",
  },
  {
    q: "What is a good partner activation rate?",
    a: "Partner activation rate is the share of signed partners who reach a first lead or deal. The Unifyr Channel Atlas 2026 reports 30 to 50% for newly signed partners in programs that manage activation, and under 20% where nobody does. Define active in your own terms, such as a first registered deal within 90 days, and measure it by where each partner came from.",
  },
  {
    q: "How long does a partner program take to show results?",
    a: "Expect a first partner lead or deal within about three months of signing, and longer where sales cycles are long. According to Introw, partners who register a first deal within 90 days are three to four times more likely to still be active after a year, so the first 90 days decide a lot.",
  },
  {
    q: "How do I audit a partner program?",
    a: "Check the program from signing to revenue: who you invite, what the offer and earnings are, how new partners start, what they can send a customer, how deals are worked together, and whether one person owns the program and sees the revenue. Then count the partners who produced revenue in the last 90 days against everyone signed. The Partner2B assessment covers this in 16 statements.",
  },
  {
    q: "Is it normal that a few partners bring most of the revenue?",
    a: "Yes, but it is not a target. Forrester notes that at least 80% of channel revenue typically comes from 20% of partners. The useful question is whether the other partners are inactive because of the program or because they were never a fit. Fix activation first, then decide who to let go.",
  },
  {
    q: "Is the partner program assessment free and private?",
    a: "Yes. It is free, takes about 3 minutes and does not ask for a company name. You see your first bottleneck right away. To see the full result and download a PDF, you leave your name and email.",
  },
];

export const RELATED: { label: string; href: string }[] = [
  { label: "Partner activation", href: "/glossary/partner-activation" },
  { label: "Partner onboarding", href: "/glossary/partner-onboarding" },
  { label: "Partner enablement", href: "/glossary/partner-enablement" },
  { label: "Deal registration", href: "/glossary/deal-registration" },
  { label: "Partner pipeline calculator", href: "/partner-pipeline-calculator" },
  { label: "Browse the directory", href: "/directory" },
];
