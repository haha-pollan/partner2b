// Copy for the AI partner tools hub (search and answer engines read this).
// The visible page and the FAQPage markup both use these strings, so they always match.

export const UPDATED_ISO = "2026-11-24";
export const UPDATED_LABEL = "24 November 2026";

export const SHORT_ANSWER =
  "Free partner program tools help a B2B tech or AI company decide what to build, how many partners to approach and what to fix when a program stalls. Partner2B has four live tools: a program builder that writes your partner program strategy, a pipeline calculator that shows how many partners to reach out to for a revenue goal, an ROI calculator that shows what your program returns and when it pays back, and an assessment that finds the two things holding your program back. All four are free to start.";

export type Tool = {
  n: string;
  name: string;
  href: string;
  promise: string;
  best: string;
  enter: string;
  get: string;
  ai: boolean;
  cta: string;
};

export const TOOLS: Tool[] = [
  {
    n: "01",
    name: "Partner pipeline calculator",
    href: "/partner-pipeline-calculator",
    promise: "Find out how many partners to reach out to for your revenue goal",
    best: "You know your revenue target but not how many partner companies it takes to reach it",
    enter: "Revenue goal, average deal size and sales cycle",
    get: "How many partner companies to list and reach out to, how many to sign and the timing milestones",
    ai: false,
    cta: "Open the calculator",
  },
  {
    n: "02",
    name: "Partner program assessment",
    href: "/partner-program-assessment",
    promise: "Find out in 3 minutes why your partner program is not performing",
    best: "Partners joined, but the revenue did not follow",
    enter: "Answers to 16 short statements, no company name",
    get: "The two things holding your program back and the first fix for each",
    ai: false,
    cta: "Start the assessment",
  },
  {
    n: "03",
    name: "Program builder",
    href: "/program-builder",
    promise: "Get a partner program strategy written for your company in minutes",
    best: "You are starting a partner program, or rebuilding one from scratch",
    enter: "A few questions about your company, product and goals",
    get: "A partner program strategy as a PDF in your own branding: partner types, tiers, commercial model, KPIs and a 90-day plan",
    ai: true,
    cta: "Open the builder",
  },
];

export const ROI_TOOL: Tool = {
  n: "04",
  name: "Partner ROI calculator",
  href: "/partner-roi-calculator",
  promise: "Find out what your partner program returns and when it pays back",
  best: "You run a partner program and need to know whether it pays off, or you need to make the case for it",
  enter: "Deal size, active partners, commission and monthly program cost",
  get: "Your return on investment, the month the program pays back, the cost of each customer and a chart of cost against return",
  ai: false,
  cta: "Open the calculator",
};
TOOLS.push(ROI_TOOL);

export const WHAT_IS = [
  "Partner program tools are small, focused tools that help you plan, size and fix a partner program before you spend money on software or hire a team. They answer one question each, for example what to build, how many partners you need to approach, or why partners are not selling.",
  "They are different from partner relationship management (PRM) software. PRM software runs a program you already have: portals, deal registration, payouts. The tools on this page work earlier and alongside it. They help you decide what the program should be, how big the outreach has to be and where it leaks, so the software you pick later has something worth running.",
];

export const TOGETHER: { t: string; d: string }[] = [
  { t: "You have no program yet", d: "Start with the program builder to get partner types, tiers and a first 90 days. Then run the pipeline calculator to see how many partner companies you need to approach to reach your revenue goal." },
  { t: "You have a program that is not performing", d: "Start with the assessment to find the two bottlenecks. Fix those first, then use the calculator to check whether your outreach is big enough, and use the builder if the program needs to be redesigned." },
  { t: "You need a number for your plan or your board", d: "Use the pipeline calculator. Every assumption can be edited, so you can show a conservative case and an ambitious case and explain what each one needs." },
];

export const LEVERS: { t: string; d: string; link: { label: string; href: string } }[] = [
  { t: "Sign the right partners", d: "An efficient program starts with a clear profile of the partner you want. Companies that match the profile already serve your buyers, so they have a reason to sell for you. Without the profile, outreach brings in partners who sign and never sell.", link: { label: "Partner recruitment", href: "/glossary/partner-recruitment" } },
  { t: "Offer more than commission", d: "Partners are running their own business. Commission alone rarely gives them a reason to start, so the offer has to help them grow: leads, a product their clients ask for, or a way to win bigger deals.", link: { label: "Partner tiers", href: "/glossary/partner-tiers" } },
  { t: "Get new partners to a first deal", d: "Activation is where most programs lose revenue. A new partner needs a clear first step, a short plan for the first 90 days and a ready pitch, otherwise the signature is the last thing they do.", link: { label: "Partner activation", href: "/glossary/partner-activation" } },
  { t: "Market to partners at two stages", d: "Partners need marketing twice: to find and join your program, and to promote you to their own clients after they join. Many programs invest in neither, which leaves too few leads going in and too little selling coming out.", link: { label: "Partner pipeline", href: "/glossary/partner-pipeline" } },
  { t: "Measure partner revenue", d: "When one person owns the program and partner-sourced revenue is visible, problems show up in weeks and not in months. Track how many partners are active, how much pipeline each one brings and how long the first deal takes.", link: { label: "Browse the directory", href: "/directory" } },
];

export const AUDIENCE: { t: string; d: string }[] = [
  { t: "Founders and CEOs", d: "You believe partners can bring revenue, but you do not know where to start or how big the job is." },
  { t: "Heads of marketing and growth", d: "You were handed the partner channel and need a plan, a number and a way to explain it to your team." },
  { t: "Partner and channel managers", d: "You run a program that is not delivering and need to find the real cause before you ask for budget." },
];

export const TRUST: { t: string; d: string }[] = [
  { t: "Free to start", d: "All four tools are free to start. The pipeline and ROI calculators show the headline numbers without an email, and the assessment shows your first bottleneck right away. To see the full result and download the PDF, you leave your name and email." },
  { t: "Private by design", d: "The assessment never asks for a company name, so you can answer honestly about a program that is not working. The calculator and the assessment are rule based and do not use AI." },
  { t: "AI only in the builder", d: "The program builder is the one tool that uses AI. It sends the company details you enter to OpenAI so that it can write your report. You can read how we handle your data in the privacy policy." },
];

export const WANTS: { label: string; tool: string; href: string }[] = [
  { label: "I am starting a partner program", tool: "Program builder", href: "/program-builder" },
  { label: "I need a number for my plan", tool: "Partner pipeline calculator", href: "/partner-pipeline-calculator" },
  { label: "I want to know if my program pays off", tool: "Partner ROI calculator", href: "/partner-roi-calculator" },
  { label: "My partner program is not performing", tool: "Partner program assessment", href: "/partner-program-assessment" },
];

export const COMING = "Six more tools are in development, and we build them one at a time. Tell us which one would help you most and it moves up the list.";

export const FAQ: { q: string; a: string }[] = [
  {
    q: "What free tools can I use to plan a partner program?",
    a: "Partner2B offers four free tools: a program builder that writes a partner program strategy, a pipeline calculator that shows how many partners to reach out to for a revenue goal, an ROI calculator that shows what a program returns and when it pays back, and an assessment that finds why a program is not performing. Each one answers a single question and takes minutes.",
  },
  {
    q: "How many partners do I need to reach my revenue goal?",
    a: "It depends on your average deal size, your sales cycle and how many deals a typical partner brings. The partner pipeline calculator turns your revenue goal into the number of partner companies to list and reach out to, and every assumption can be edited.",
  },
  {
    q: "How do I know if my partner program is working?",
    a: "Check whether partners that signed are active, how much pipeline each one brings and how long the first deal takes. If partners join but stay silent, the free partner program assessment shows which two areas hold the program back.",
  },
  {
    q: "How do I build a partner program from scratch?",
    a: "Define the partners you want, an offer that gives them more than commission, tiers, the commercial model, the measures you will track and a plan for the first 90 days. The program builder produces all of this as a PDF strategy from a few questions about your company.",
  },
  {
    q: "What is the difference between partner program tools and PRM software?",
    a: "PRM software runs a program you already have, with partner portals, deal registration and payouts. Partner program tools help you decide what the program should be, how big the outreach must be and what is holding it back. Most companies need the tools first and the software later.",
  },
  {
    q: "Do the tools use AI?",
    a: "The program builder uses AI to write your report and sends the company details you enter to OpenAI for that purpose. The pipeline calculator and the partner program assessment are rule based and do not use AI.",
  },
  {
    q: "Are the tools really free, and do I need to share my company name?",
    a: "Yes, they are free to start. The assessment does not ask for a company name. To see a full result and download a PDF, you leave your name and email.",
  },
  {
    q: "Which tool should I start with?",
    a: "If you have no program, start with the program builder. If you have a program that is not performing, start with the assessment. If you need a number for a plan, start with the pipeline calculator. If you want to know whether your program pays off, start with the ROI calculator.",
  },
];

export const RELATED: { label: string; href: string }[] = [
  { label: "Partner program", href: "/glossary/partner-program" },
  { label: "Partner activation", href: "/glossary/partner-activation" },
  { label: "Partner recruitment", href: "/glossary/partner-recruitment" },
  { label: "Partner tiers", href: "/glossary/partner-tiers" },
  { label: "AI partner programs", href: "/ai" },
  { label: "Browse the directory", href: "/directory" },
];
