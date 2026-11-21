import type { Term } from "./types";

export const B: Term[] = [
  {
    slug: "market-development-funds-mdf", term: "Market development funds (MDF)", group: "Marketing and funds",
    short: "Market development funds, or MDF, are money that a vendor gives partners to pay for marketing and sales activities that promote the vendor's products, such as events, campaigns and lead generation.",
    body: [
      "MDF is usually earned or allocated based on a partner's tier, sales performance or an approved plan. Partners submit a proposal for an activity, run it, and claim reimbursement with proof of execution, such as invoices and campaign results.",
      "Vendors use MDF to make partners invest in demand generation, and partners use it to share marketing cost. It is also called marketing development funds, co-op funds or partner marketing funds, and the exact name and rules differ by vendor.",
      "Good MDF programs set clear eligibility rules, approved activity types, claim deadlines and reporting requirements, and measure return through partner-sourced pipeline.",
    ],
    faqs: [
      ["What does MDF stand for?", "MDF stands for market development funds. Some vendors call them marketing development funds."],
      ["How does MDF work?", "A vendor allocates funds to a partner, the partner proposes and runs approved marketing activities, and the vendor reimburses all or part of the cost after proof of execution."],
      ["What is the difference between MDF and co-op funds?", "Both fund partner marketing. Co-op funds are usually accrued as a percentage of the partner's sales, while MDF may be allocated by tier or a plan. Vendors use the terms differently."],
    ],
    related: ["mdf-program-management", "co-op-mdf", "co-marketing", "partner-marketing", "partner-tiers"],
    link: { label: "Programs with co-marketing funds", href: "/directory?feat=Co-marketing%20funds" },
  },
  {
    slug: "mdf-program-management", term: "MDF program management", group: "Marketing and funds",
    short: "MDF program management is the process of designing, allocating, approving, tracking and reporting on market development funds so that partner marketing spend produces measurable results.",
    body: [
      "It covers setting fund budgets by partner or tier, defining approved activities, reviewing proposals, verifying proof of performance and paying claims. Many companies use partner relationship management software to automate these steps.",
      "Strong programs measure return, for example the pipeline and revenue that funded activities create, and shift budget toward partners and activities that perform.",
    ],
    faqs: [
      ["What does MDF program management include?", "Budgeting, partner eligibility, proposal approval, claims and reimbursement, fraud checks and reporting on return."],
      ["How do you measure MDF return?", "Compare the pipeline and revenue from funded activities with the funds spent, by partner and by activity type."],
    ],
    related: ["market-development-funds-mdf", "co-op-mdf", "prm", "partner-portal"],
    link: { label: "Programs with co-marketing funds", href: "/directory?feat=Co-marketing%20funds" },
  },
  {
    slug: "co-op-mdf", term: "Co-op MDF", group: "Marketing and funds",
    short: "Co-op MDF is partner marketing money that accrues as a percentage of a partner's sales and is later used to co-fund approved marketing activities.",
    body: [
      "Under a co-op model a partner earns, for example, a small percentage of purchases into a fund. The partner can then claim reimbursement for approved marketing spend up to that balance, often with the vendor paying a share of each activity.",
      "The model links marketing support to sales results and keeps budgets predictable. Rules on expiry, eligible activities and brand use are set in the program terms.",
    ],
    faqs: [
      ["How is co-op MDF different from regular MDF?", "Co-op MDF is earned through sales, while other MDF can be allocated by tier, plan or discretion."],
      ["Does co-op MDF expire?", "Often yes. Programs typically set a period in which accrued funds must be claimed."],
    ],
    related: ["market-development-funds-mdf", "mdf-program-management", "co-marketing"],
  },
  {
    slug: "co-marketing", term: "Co-marketing", group: "Marketing and funds",
    short: "Co-marketing is a joint marketing effort between two or more companies that share cost, content and audience to promote a common offer, such as a webinar, report or campaign.",
    body: [
      "Partners combine their audiences and credibility to reach more of the right buyers than either could alone. Typical activities include co-branded content, webinars, events, joint case studies and email campaigns.",
      "Success depends on a shared target audience, clear roles, agreed lead sharing and measurable goals. Many vendors support co-marketing through templates and funding such as MDF.",
    ],
    faqs: [
      ["What is an example of co-marketing?", "Two companies host a joint webinar for an audience they share, split the cost and share the leads."],
      ["What is the difference between co-marketing and co-selling?", "Co-marketing is joint promotion to create demand. Co-selling is working together on specific deals to close them."],
    ],
    related: ["co-selling", "market-development-funds-mdf", "partner-marketing", "cross-selling"],
    link: { label: "Programs with co-marketing funds", href: "/directory?feat=Co-marketing%20funds" },
  },
  {
    slug: "co-selling", term: "Co-selling", group: "Sales and channel",
    short: "Co-selling is when a vendor and a partner work together on a specific sales opportunity, sharing account insight, introductions and effort to win the deal.",
    body: [
      "Co-selling typically starts with shared account mapping, then joint outreach and meetings with the customer. Cloud marketplaces and platform vendors formalize it with programs that let partner and vendor sellers collaborate and, in some cases, credit each other.",
      "It works best when deal registration, roles and compensation are clear, so partner and vendor sellers do not compete for the same deal.",
    ],
    faqs: [
      ["What is co-selling in partnerships?", "It is joint selling by a vendor and a partner to win a shared opportunity, with coordinated outreach and clear roles."],
      ["How do you start co-selling?", "Map overlapping accounts, agree on deal registration and credit rules, pick a few target accounts and run joint account plans."],
    ],
    related: ["co-marketing", "deal-registration", "isv", "partner-pipeline"],
    link: { label: "Programs with co-selling", href: "/directory?feat=Co-selling" },
  },
  {
    slug: "cross-selling", term: "Cross-selling", group: "Sales and channel",
    short: "Cross-selling is offering an existing customer an additional product or service that complements what they already buy, either your own or a partner's.",
    body: [
      "In partnerships, cross-selling often means each partner presenting the other's offer to its own customers. Because the customer already trusts the seller, the conversion rate tends to be higher than cold outreach.",
      "To work, the offers need a clear fit, and both companies need an agreed way to introduce, track and reward the cross-sell.",
    ],
    faqs: [
      ["What is the difference between cross-selling and upselling?", "Cross-selling adds a different, complementary product. Upselling moves the customer to a higher tier or more expensive version of the same product."],
      ["How do partners cross-sell?", "Each partner introduces the other's offer to its customers, supported by shared content and a simple referral or revenue share arrangement."],
    ],
    related: ["co-selling", "referral-partner", "co-marketing"],
  },
  {
    slug: "deal-registration", term: "Deal registration", group: "Partner operations",
    short: "Deal registration is a process that lets a partner formally claim a sales opportunity with a vendor, which protects the partner from conflict and often secures better pricing or commission.",
    body: [
      "A partner submits details about the customer and the opportunity. If the vendor approves, the deal is protected for a set period, so no other partner or the vendor's own sellers compete for it on the same terms.",
      "Deal registration builds trust in a channel because partners know their prospecting effort will be rewarded. It also gives the vendor visibility into partner-sourced pipeline.",
    ],
    faqs: [
      ["Why is deal registration important?", "It protects partners from channel conflict, rewards them for sourcing opportunities and gives the vendor a clear view of partner pipeline."],
      ["How long does deal registration last?", "Protection periods vary by program, commonly a few months, with options to extend while the deal is active."],
    ],
    related: ["channel-partner", "co-selling", "partner-pipeline", "partner-tiers"],
    link: { label: "Programs with deal registration", href: "/directory?feat=Deal%20registration" },
  },
  {
    slug: "partner-tiers", term: "Partner tiers", group: "Partner operations",
    short: "Partner tiers are levels within a partner program, such as registered, silver, gold and platinum, where higher levels require more performance and unlock better benefits.",
    body: [
      "Tiers are usually earned through revenue, certifications, customer satisfaction or a combination. Benefits grow with the tier and can include higher margins, more marketing funds, deal protection, support and co-selling.",
      "Tiering gives partners a clear path to invest and be rewarded, and helps vendors focus resources on the partners who contribute most.",
    ],
    faqs: [
      ["What are partner tiers?", "They are levels in a partner program that link a partner's commitment and results to the benefits they receive."],
      ["How do partners move up a tier?", "By meeting the program's requirements for sales, certifications, customers or revenue within a given period."],
    ],
    related: ["partner-program", "market-development-funds-mdf", "deal-registration", "partner-enablement"],
    link: { label: "Programs with tiered benefits", href: "/directory?feat=Tiered%20benefits" },
  },
  {
    slug: "partner-portal", term: "Partner portal", group: "Partner operations",
    short: "A partner portal is a secure website where partners access training, sales and marketing assets, deal registration, leads, commissions and support from a vendor.",
    body: [
      "It is the central workspace for a partner program. Partners log in to register deals, download collateral, take courses, track payouts and open support requests.",
      "Portals are often built on partner relationship management software. A good portal reduces the effort of working with the vendor and raises partner activity.",
    ],
    faqs: [
      ["What is a partner portal used for?", "Deal registration, enablement content, marketing assets, lead distribution, reporting and commission tracking."],
      ["Do you need a partner portal to run a program?", "Small programs can start with simple tools. A portal becomes valuable as the number of partners and processes grows."],
    ],
    related: ["prm", "partner-enablement", "deal-registration", "mdf-program-management"],
    link: { label: "Programs with a partner portal", href: "/directory?feat=Partner%20portal" },
  },
  {
    slug: "prm", term: "Partner relationship management (PRM)", group: "Partner operations",
    short: "Partner relationship management, or PRM, is software and process for recruiting, onboarding, enabling, managing and measuring partners in one system.",
    body: [
      "A PRM platform typically includes a partner portal, deal registration, lead distribution, content and training, MDF management, commissions and analytics. It connects with the CRM so partner activity appears next to direct sales.",
      "PRM helps companies scale a program beyond spreadsheets and email, and gives partners one place to work with the vendor.",
    ],
    faqs: [
      ["What does PRM stand for?", "PRM stands for partner relationship management."],
      ["What is the difference between PRM and CRM?", "CRM manages customers and prospects. PRM manages partners and the deals they source or influence, and usually integrates with CRM."],
    ],
    related: ["partner-portal", "partner-pipeline", "mdf-program-management", "ai-powered-prm"],
  },
  {
    slug: "partner-onboarding", term: "Partner onboarding", group: "Partner operations",
    short: "Partner onboarding is the process of getting a new partner ready to sell or deliver, including agreements, access, training, certification and a first plan.",
    body: [
      "Strong onboarding shortens the time to first deal. It usually includes a welcome kit, portal access, product training, a named contact and a clear first goal such as registering a deal in 30 days.",
      "Programs that skip onboarding often end up with many signed but inactive partners, which is why activation is tracked next to recruitment.",
    ],
    faqs: [
      ["What should partner onboarding include?", "Agreement and access, product and sales training, marketing assets, a point of contact and an initial plan with a first milestone."],
      ["How long should partner onboarding take?", "Long enough to cover the essentials and short enough to reach a first deal quickly. Many programs aim for a few weeks."],
    ],
    related: ["partner-enablement", "partner-activation", "partner-recruitment"],
  },
  {
    slug: "partner-enablement", term: "Partner enablement", group: "Partner operations",
    short: "Partner enablement is the training, content and tools that help partners understand, sell, deliver and support a vendor's products effectively.",
    body: [
      "Enablement covers product and sales training, certifications, playbooks, demo environments, battle cards and co-branded assets. It is most effective when tied to the partner's role and tier.",
      "Vendors measure it by completed certifications, time to first deal and partner-sourced revenue per trained partner.",
    ],
    faqs: [
      ["What is partner enablement?", "It is everything a vendor provides so that partners can sell and deliver its products with confidence, such as training, content and tools."],
      ["How do you measure enablement success?", "Through certification rates, time to first deal and revenue per enabled partner."],
    ],
    related: ["partner-onboarding", "partner-portal", "partner-activation", "partner-tiers"],
  },
  {
    slug: "partner-activation", term: "Partner activation", group: "Partner operations",
    short: "Partner activation is the work of turning a signed partner into an active one that registers deals, refers leads or generates revenue.",
    body: [
      "Many programs sign more partners than they activate. Activation tactics include a first-deal plan, joint calls, targeted campaigns, small incentives and regular check-ins by a partner manager.",
      "Common measures are the share of partners that log a deal within a set time, active partners per quarter and revenue per activated partner.",
    ],
    faqs: [
      ["What is the difference between partner onboarding and activation?", "Onboarding prepares the partner. Activation gets the partner to produce results such as a first deal."],
      ["How do you activate inactive partners?", "Re-engage with a joint plan, a clear offer, enablement for their gaps and a named contact who follows up."],
    ],
    related: ["partner-onboarding", "partner-recruitment", "partner-manager", "partner-enablement"],
  },
  {
    slug: "partner-recruitment", term: "Partner recruitment", group: "Partner operations",
    short: "Partner recruitment is the process of identifying, approaching and signing new partners that fit a program's ideal partner profile.",
    body: [
      "Recruitment starts with defining the ideal partner: type, size, customers, geography and capabilities. Teams then source candidates through directories, events, customer referrals, marketplaces and outbound outreach.",
      "Recruiting for fit, rather than for volume, tends to give better activation and retention. A clear value proposition for partners is the most important part of the pitch.",
    ],
    faqs: [
      ["How do you recruit partners?", "Define the ideal partner, build a target list, pitch a clear partner value proposition and make joining simple."],
      ["What makes a partner program attractive to recruit for?", "Fair economics, clear requirements, strong enablement and a real pipeline of customers to work on together."],
    ],
    related: ["partner-discovery", "partner-onboarding", "partner-activation", "partner-program"],
    link: { label: "See how programs are structured", href: "/directory" },
  },
  {
    slug: "partner-manager", term: "Partner manager", group: "Partner operations",
    short: "A partner manager is the person responsible for recruiting, enabling and growing revenue with a set of partners, acting as their main contact at the vendor.",
    body: [
      "The role blends sales, marketing and relationship skills. Partner managers build joint business plans, run enablement, resolve conflicts, coordinate with internal teams and track partner performance.",
      "Titles include partner manager, channel manager, alliance manager and partner account manager. Success is usually measured by partner-sourced and partner-influenced revenue.",
    ],
    faqs: [
      ["What does a partner manager do?", "They recruit and onboard partners, plan and run joint activities, remove obstacles and track results."],
      ["What skills does a partner manager need?", "Relationship building, commercial judgment, cross-team coordination, storytelling and comfort with pipeline and program metrics."],
    ],
    related: ["partner-activation", "partner-recruitment", "strategic-alliance", "partner-pipeline"],
  },
  {
    slug: "partner-commission", term: "Partner commission", group: "Programs and models",
    short: "Partner commission is the payment a partner earns for referring or closing a sale, usually a percentage of deal value or a fixed fee.",
    body: [
      "Commission models include a one-time percentage of first-year value, a recurring percentage for a set time, a flat fee per referral and a discount on resale. Programs state which deals qualify and when payment is made.",
      "Partners should compare not only the rate but also the base it applies to, the duration and how deals are attributed.",
    ],
    faqs: [
      ["What is a typical partner commission?", "It varies widely by industry and program, so compare the actual terms of each program rather than relying on an average."],
      ["Is commission the same as revenue share?", "Not always. Commission is often a one-time payment, while revenue share is usually recurring for as long as the customer pays."],
    ],
    related: ["revenue-share", "referral-partner", "reseller"],
    link: { label: "Compare commission models", href: "/directory" },
  },
  {
    slug: "revenue-share", term: "Revenue share", group: "Programs and models",
    short: "Revenue share is an arrangement in which a partner receives a percentage of the revenue a customer generates for the vendor, often for as long as the customer stays.",
    body: [
      "It aligns incentives over time, since the partner earns while the customer remains active. It is common in software subscriptions, payments and marketplaces.",
      "Key terms to check are the percentage, the base it applies to, any duration cap and what happens if the partner relationship ends.",
    ],
    faqs: [
      ["What is a revenue share partnership?", "A partnership in which a partner is paid a percentage of the revenue from customers it brings or serves."],
      ["How is revenue share different from a referral fee?", "A referral fee is usually a one-time payment. A revenue share continues as the customer keeps paying."],
    ],
    related: ["partner-commission", "referral-partner", "technology-partner"],
    link: { label: "Programs with revenue share", href: "/directory?feat=Revenue%20share" },
  },
  {
    slug: "partner-pipeline", term: "Partner pipeline", group: "Partner operations",
    short: "Partner pipeline is the value of sales opportunities that partners source or influence, tracked through the stages from registered deal to closed.",
    body: [
      "Teams separate partner-sourced pipeline, where the partner found the opportunity, from partner-influenced pipeline, where the partner helped move a deal. Both matter, but they are credited and compensated differently.",
      "Tracking it well needs consistent deal registration, CRM fields for partner attribution and regular pipeline reviews with each partner.",
    ],
    faqs: [
      ["What is partner-sourced pipeline?", "Opportunities that a partner originated and registered."],
      ["What is partner-influenced pipeline?", "Opportunities the vendor sourced, where a partner contributed meaningfully to progress or closing."],
    ],
    related: ["deal-registration", "prm", "partner-led-growth", "channel-sales"],
  },
  {
    slug: "partner-marketing", term: "Partner marketing", group: "Marketing and funds",
    short: "Partner marketing is the practice of promoting a company through its partners, and promoting the partner program itself to recruit, enable and activate partners.",
    body: [
      "It includes co-marketing campaigns, partner content and enablement, marketing funds, partner newsletters and joint events. The goal is partner-sourced and partner-influenced revenue.",
      "Partner marketers also run the program's own marketing, such as a partner landing page, recruitment campaigns and success stories.",
    ],
    faqs: [
      ["What does a partner marketer do?", "Builds joint campaigns and assets with partners, manages marketing funds and promotes the program to attract and activate partners."],
      ["How is partner marketing different from channel marketing?", "The terms overlap. Channel marketing usually refers to marketing through resellers and distributors, and partner marketing covers all partner types."],
    ],
    related: ["co-marketing", "market-development-funds-mdf", "partner-enablement", "partner-marketplace"],
  },
  {
    slug: "partner-network", term: "Partner network", group: "Ecosystem and strategy",
    short: "A partner network is the group of companies that a vendor works with to sell, deliver, integrate or support its products, usually organized through a partner program.",
    body: [
      "A network can include resellers, referral partners, technology partners, integrators and managed service providers. The vendor supports them with a program, a portal, enablement and shared marketing.",
      "Networks grow in value as partners add reach and capabilities. The term is often used interchangeably with partner ecosystem, though a network focuses on the relationships and an ecosystem on how all parties create value together.",
    ],
    faqs: [
      ["What is a partner network?", "The set of companies working with a vendor under a partner program to sell, build or deliver its products."],
      ["How do you build a partner network?", "Define partner types, recruit for fit, make joining simple, enable partners and reward results."],
    ],
    related: ["partner-ecosystem", "partner-program", "partner-recruitment", "channel-partner"],
    link: { label: "Browse partner programs", href: "/directory" },
  },
  {
    slug: "partner-ecosystem", term: "Partner ecosystem", group: "Ecosystem and strategy",
    short: "A partner ecosystem is the connected set of partners, customers, platforms and technologies that create and capture value together around a company's products.",
    body: [
      "Unlike a simple list of resellers, an ecosystem includes many partner types that depend on one another, such as integrators, app developers, resellers, marketplaces and communities. Value comes from how they interact.",
      "Companies build ecosystems to widen their offer, reach more customers and become harder to replace. Running one requires shared standards, fair economics, clear governance and ways to measure contribution.",
    ],
    faqs: [
      ["What is a partner ecosystem?", "A network of different kinds of partners, together with customers and platforms, that jointly create more value than the company could alone."],
      ["What is the difference between a partner ecosystem and a partner program?", "A program is the vendor's structured offer to partners. An ecosystem is the wider web of relationships and value that the program helps create."],
    ],
    related: ["partner-network", "partner-led-growth", "partner-marketplace", "strategic-alliance"],
  },
  {
    slug: "partner-discovery", term: "Partner discovery", group: "Ecosystem and strategy",
    short: "Partner discovery is the process of finding companies that would make good partners, by searching directories, marketplaces, customer overlap and vendor partner pages.",
    body: [
      "Teams discover partners by looking at who their customers already use, who serves similar buyers, and which vendors run programs that fit their business. Directories and marketplaces speed this up by showing programs side by side.",
      "Good discovery compares fit, such as customer overlap, capabilities and program terms, before outreach begins.",
    ],
    faqs: [
      ["How do you find the right partners?", "Start from your ideal customer, look for companies that serve the same buyers without competing, and compare their programs and terms."],
      ["What tools help with partner discovery?", "Partner program directories, marketplaces, partner locators, intent data and ecosystem mapping tools."],
    ],
    related: ["partner-recruitment", "ai-partner-discovery", "partner-marketplace", "b2b-partner"],
    link: { label: "Search partner programs", href: "/directory" },
  },
  {
    slug: "partner-marketplace", term: "Partner marketplace", group: "Ecosystem and strategy",
    short: "A partner marketplace is an online platform where partners list, find and sell products or integrations, often run by a software vendor or a cloud provider.",
    body: [
      "For technology partners, a marketplace listing gives visibility to a vendor's customers and a simple way to buy. For customers, it offers vetted integrations and consolidated billing.",
      "Marketplaces also support co-selling, since sales teams can see partner offers next to their own. Listing usually requires technical validation and an agreement.",
    ],
    faqs: [
      ["What is a partner marketplace?", "A platform where partners publish offers or integrations that customers of the host company can discover and buy."],
      ["Why list on a marketplace?", "To reach the host's customers, simplify buying and qualify for co-selling and co-marketing."],
    ],
    related: ["technology-partner", "isv", "ai-partner-marketplace", "partner-ecosystem"],
    link: { label: "Programs with marketplace listing", href: "/directory?feat=Marketplace%20listing" },
  },
  {
    slug: "strategic-alliance", term: "Strategic alliance", group: "Ecosystem and strategy",
    short: "A strategic alliance is a long-term agreement between two companies to pursue shared goals while staying independent, often through joint products, shared go-to-market or combined resources.",
    body: [
      "Alliances go deeper than a standard reseller or referral arrangement. They may include joint roadmaps, shared customers, executive sponsorship and common commercial goals.",
      "They suit situations in which neither party can reach a goal alone and the benefits justify the investment of time and trust. Clear governance and exit terms keep them healthy.",
    ],
    faqs: [
      ["What is the difference between a strategic alliance and a partnership?", "A strategic alliance is a deeper, longer-term form of partnership with shared goals and significant joint investment."],
      ["What is an alliance manager?", "A person who builds and runs strategic relationships with a small number of important partners."],
    ],
    related: ["b2b-partnership", "partner-manager", "partner-ecosystem", "co-selling"],
  },
  {
    slug: "partner-led-growth", term: "Partner-led growth", group: "Ecosystem and strategy",
    short: "Partner-led growth is a go-to-market strategy in which a company relies on partners as a primary source of customers, revenue and expansion.",
    body: [
      "Instead of treating partners as an add-on to direct sales, a company designs its product, pricing and teams around partner motions such as referral, resale, integration and co-selling.",
      "Metrics include partner-sourced and partner-influenced revenue, the share of new customers that come through partners and partner retention.",
    ],
    faqs: [
      ["What is partner-led growth?", "A strategy that makes partners a core growth channel for acquiring and expanding customers."],
      ["How do you start partner-led growth?", "Pick one or two partner motions, define the ideal partner, set up deal registration and enablement, and measure partner-sourced revenue."],
    ],
    related: ["go-to-market-(gtm)-strategy", "partner-ecosystem", "partner-pipeline", "channel-sales"],
  },
  {
    slug: "go-to-market-(gtm)-strategy", term: "Go-to-market (GTM) strategy", group: "Ecosystem and strategy",
    short: "A go-to-market strategy is the plan for how a company brings a product to customers, covering target market, positioning, pricing, channels and sales and marketing approach.",
    body: [
      "Partners are one of the channels in a GTM plan. A partner GTM motion defines which partner types to use, what they sell or refer, how they are rewarded and how the vendor supports them.",
      "A good GTM plan connects the market, the offer and the channel. Testing with a small set of partners before scaling reduces risk.",
    ],
    faqs: [
      ["What is a go-to-market strategy?", "A plan that defines who you sell to, what you offer, how you position it and through which channels."],
      ["How do partners fit into a GTM strategy?", "They extend reach and add services or integrations, through motions such as reselling, referral and co-selling."],
    ],
    related: ["partner-led-growth", "channel-sales", "co-marketing", "partner-program"],
  },
];
