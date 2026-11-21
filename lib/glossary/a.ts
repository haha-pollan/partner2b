import type { Term } from "./types";

export const A: Term[] = [
  {
    slug: "partner-program", term: "Partner program", group: "Programs and models",
    short: "A partner program is a structured offer from a company that lets other businesses resell, refer, integrate with or service its products in return for commissions, discounts, training and support.",
    body: [
      "Most B2B partner programs define who can join, what partners must do, and what they get back. Typical benefits include commissions, resale discounts, deal registration, co-marketing funds, training and a partner portal. Requirements often cover certifications, minimum sales or a signed agreement.",
      "Programs usually have several tracks, such as reseller, referral, technology and services, and many add tiers that unlock better terms as a partner grows. Vendors run them to reach customers they cannot reach alone, and partners join them to add revenue without building a product.",
    ],
    faqs: [
      ["What is a B2B partner program?", "It is a formal arrangement in which a company gives other businesses defined ways to sell, refer or build on its products, with clear rewards and rules for both sides."],
      ["How do I choose a partner program to join?", "Compare the commission model, tier requirements, support and fit with your customers. A directory that shows these side by side makes the comparison faster."],
    ],
    related: ["partner-tiers", "reseller", "referral-partner", "technology-partner", "deal-registration"],
    link: { label: "Compare partner programs", href: "/directory" },
  },
  {
    slug: "b2b-partner", term: "B2B partner", group: "Programs and models",
    short: "A B2B partner is a business that works with another business to sell, refer, build, deliver or market a product or service, with both sides sharing the results.",
    body: [
      "B2B partners come in several kinds. Resellers sell a vendor's product, referral partners send leads, technology partners integrate products, and services partners implement and support them. The relationship is usually formalized in a partner agreement.",
      "The word partner is also used loosely for any company you work with. In partner programs it means a defined role with agreed rewards, such as commission or discounts, and agreed duties, such as certification or reporting.",
    ],
    faqs: [
      ["What does B2B partner mean?", "It means a company that collaborates with another company in a defined way to create revenue, such as reselling, referring, integrating or delivering services."],
      ["How do I find B2B partners?", "Search partner program directories, vendor partner pages, marketplaces and industry events, then compare programs against your customers and capabilities."],
    ],
    related: ["b2b-partnership", "channel-partner", "partner-program", "partner-discovery"],
    link: { label: "Find B2B partner programs", href: "/directory" },
  },
  {
    slug: "b2b-partnership", term: "B2B partnership", group: "Ecosystem and strategy",
    short: "A B2B partnership is an agreement between two companies to create shared value, for example by co-selling, referring customers, integrating products or marketing together.",
    body: [
      "Partnerships range from a simple referral arrangement to a deep alliance with joint products. The best ones start with a clear customer problem that neither company solves alone, and with agreed goals, roles and ways to measure results.",
      "Companies pursue partnerships to reach new customers, shorten sales cycles, fill product gaps and lower acquisition cost. A partnership works when both sides gain, so commercial terms and effort should be balanced from the start.",
    ],
    faqs: [
      ["What are examples of B2B partnerships?", "A software vendor and an agency that implements it, two products that integrate and promote each other, or a company that pays another a fee for referred customers."],
      ["How do you start a B2B partnership?", "Define the shared customer problem, pick partners whose customers overlap with yours, agree on goals and terms, and run a small pilot before scaling."],
    ],
    related: ["strategic-alliance", "partner-ecosystem", "co-marketing", "co-selling"],
  },
  {
    slug: "channel-partner", term: "Channel partner", group: "Sales and channel",
    short: "A channel partner is an independent company that sells, refers or delivers a vendor's products to end customers, instead of the vendor selling directly.",
    body: [
      "Channel partners include resellers, distributors, value-added resellers, system integrators, managed service providers and referral partners. They usually own the customer relationship, add services such as setup and support, and earn margin or commission.",
      "Vendors use channel partners to scale reach without hiring a large direct sales team. The trade-off is less control over the customer experience and the need to manage conflict between direct and partner sales.",
    ],
    faqs: [
      ["What is the difference between a channel partner and a reseller?", "A reseller is one type of channel partner. Channel partner also covers referral partners, distributors, integrators and managed service providers."],
      ["How do channel partners make money?", "Through resale margin, commissions on referred deals, recurring revenue shares or fees for services they add around the product."],
    ],
    related: ["indirect-sales", "reseller", "value-added-reseller", "distributor", "channel-sales"],
    link: { label: "Browse reseller programs", href: "/directory?type=Reseller" },
  },
  {
    slug: "indirect-sales", term: "Indirect sales", group: "Sales and channel",
    short: "Indirect sales means selling through third parties such as resellers, distributors and referral partners, instead of through the company's own sales team.",
    body: [
      "In an indirect model the partner finds the customer, closes the deal or influences it, and the vendor rewards the partner with margin or commission. It extends reach into markets, regions or segments the vendor cannot serve efficiently by itself.",
      "Indirect sales is often combined with direct sales. The usual challenges are channel conflict, partner enablement and visibility into partner-sourced pipeline.",
    ],
    faqs: [
      ["What is the difference between direct and indirect sales?", "Direct sales are made by the vendor's own team. Indirect sales are made through partners who resell, refer or influence the deal."],
      ["When is indirect sales a good model?", "When you need to scale into new regions or segments, when customers need local services, or when partners already own the relationship you want to reach."],
    ],
    related: ["direct-sales", "channel-sales", "channel-partner", "reseller"],
    link: { label: "Compare partner programs", href: "/directory" },
  },
  {
    slug: "direct-sales", term: "Direct sales", group: "Sales and channel",
    short: "Direct sales is a model in which a company sells to customers through its own employees and channels, without intermediaries such as resellers or distributors.",
    body: [
      "The vendor keeps full control of pricing, messaging and the customer relationship, and keeps the entire margin. This suits complex, high-value products and companies that want tight control of the buying experience.",
      "The cost is slower scaling, because reach depends on headcount. Many B2B companies mix direct sales with a partner program so partners cover segments or regions the direct team cannot.",
    ],
    faqs: [
      ["Is direct sales better than indirect sales?", "Neither is better in general. Direct sales gives control, indirect sales gives reach. Most growing B2B companies use both."],
      ["Can direct and indirect sales work together?", "Yes, with clear rules on deal ownership, deal registration and compensation to avoid conflict."],
    ],
    related: ["indirect-sales", "channel-sales", "deal-registration"],
  },
  {
    slug: "channel-sales", term: "Channel sales", group: "Sales and channel",
    short: "Channel sales is revenue generated through partners such as resellers, distributors and referral partners, managed by a channel or partner team at the vendor.",
    body: [
      "A channel sales strategy covers which partner types to recruit, how they are rewarded, how deals are registered and how partners are trained. It sits alongside the direct sales motion rather than replacing it.",
      "Common measures include partner-sourced revenue, partner-influenced revenue, time to first deal and the share of partners that stay active.",
    ],
    faqs: [
      ["What is a channel sales strategy?", "It is the plan for growing revenue through partners: whom to recruit, what to offer them, how to enable them and how to measure results."],
      ["What is the difference between channel sales and indirect sales?", "They are close in meaning. Indirect sales describes the model, and channel sales usually describes the team and program that run it."],
    ],
    related: ["indirect-sales", "channel-partner", "partner-enablement", "partner-pipeline"],
  },
  {
    slug: "reseller", term: "Reseller", group: "Programs and models",
    short: "A reseller is a company that buys or licenses a vendor's product, often at a discount, and sells it to its own customers, usually adding its own pricing, support or services.",
    body: [
      "Reseller programs give partners a discount on list price, so the margin is the difference between the discounted price and the price they charge. Some programs also include deal registration, training and marketing funds.",
      "Resellers tend to own billing and the customer relationship. Variations include value-added resellers, who add services, and white label resellers, who sell under their own brand.",
    ],
    faqs: [
      ["How do resellers make money?", "They earn the margin between the discounted partner price and the price they charge customers, plus any services they sell around the product."],
      ["How is a reseller different from a referral partner?", "A reseller sells and often invoices the customer. A referral partner only introduces leads and is paid a fee when they close."],
    ],
    related: ["value-added-reseller", "referral-partner", "oem-partner", "channel-partner"],
    link: { label: "Browse reseller programs", href: "/directory?type=Reseller" },
  },
  {
    slug: "value-added-reseller", term: "Value-added reseller (VAR)", group: "Programs and models",
    short: "A value-added reseller is a partner that resells a vendor's product together with its own services, such as implementation, customization, integration or support.",
    body: [
      "The added value is what separates a VAR from a plain reseller. Customers buy a complete solution, and the VAR earns margin on the product plus revenue from services.",
      "Vendors favor VARs for complex products that need setup and training. VAR programs often require certifications and a minimum number of trained staff.",
    ],
    faqs: [
      ["What does VAR stand for?", "VAR stands for value-added reseller."],
      ["What is the difference between a VAR and a system integrator?", "A VAR resells products with added services. A system integrator focuses on combining several systems into one working solution and may or may not resell."],
    ],
    related: ["reseller", "system-integrator", "channel-partner"],
    link: { label: "Browse reseller programs", href: "/directory?type=Reseller" },
  },
  {
    slug: "referral-partner", term: "Referral partner", group: "Programs and models",
    short: "A referral partner is a business or individual that recommends a vendor's product to their contacts and earns a fee or commission when a referred lead becomes a customer.",
    body: [
      "Referral programs have the lowest barrier to entry. The partner does not handle billing, delivery or support, they only make the introduction and the vendor closes the deal.",
      "Fees are usually a one-time payment or a percentage of first-year or recurring revenue. Good programs explain how referrals are tracked and how long a referral stays attributed to the partner.",
    ],
    faqs: [
      ["How much do referral partners earn?", "It varies widely by vendor. Models include a flat fee per deal, a percentage of first-year contract value and a recurring share of revenue."],
      ["What is the difference between a referral partner and an affiliate?", "Referral partners usually work in B2B relationships and introduce known contacts, while affiliates typically promote through public links and content to a wider audience."],
    ],
    related: ["referral-program", "reseller", "partner-commission", "revenue-share"],
    link: { label: "Browse referral programs", href: "/directory?type=Referral" },
  },
  {
    slug: "referral-program", term: "Referral program", group: "Programs and models",
    short: "A referral program rewards partners or customers for introducing new business, usually with a fee or commission paid once the referred company signs.",
    body: [
      "B2B referral programs define who can refer, how a referral is registered, how long it is protected and when the reward is paid. Clear tracking rules prevent disputes about who sourced a deal.",
      "They are often the first step in a partner program, because they need little onboarding and no product expertise from the partner.",
    ],
    faqs: [
      ["How does a B2B referral program work?", "A partner registers a lead, the vendor works and closes it, and the partner is paid a fee or commission according to the program terms."],
      ["Do referral programs need a contract?", "Most use a short partner agreement that sets the reward, the attribution period and payment terms."],
    ],
    related: ["referral-partner", "partner-commission", "deal-registration"],
    link: { label: "Browse referral programs", href: "/directory?type=Referral" },
  },
  {
    slug: "technology-partner", term: "Technology partner", group: "Programs and models",
    short: "A technology partner is a company whose product integrates with a vendor's product, so that customers can use both together, often through a listing in the vendor's marketplace.",
    body: [
      "Technology partners usually build integrations, apps or connectors using the vendor's APIs. Benefits can include marketplace listing, co-marketing, technical support and joint go-to-market activity.",
      "The relationship is based on product fit more than on resale. Both sides gain because the integration solves a customer problem that neither product solves alone.",
    ],
    faqs: [
      ["What is the difference between a technology partner and an ISV?", "An ISV is a software company that builds products on a platform. Technology partner is the program label vendors give to ISVs and integrators that build on or integrate with them."],
      ["What do technology partners get?", "Typically API access, technical resources, marketplace visibility and co-marketing opportunities."],
    ],
    related: ["isv", "partner-marketplace", "co-marketing", "partner-program"],
    link: { label: "Browse technology programs", href: "/directory?type=Technology" },
  },
  {
    slug: "isv", term: "ISV (independent software vendor)", group: "Programs and models",
    short: "An ISV is an independent software vendor, a company that builds and sells software that runs on or integrates with another company's platform.",
    body: [
      "Cloud and platform vendors run ISV programs that offer technical resources, marketplace listing and co-selling support. ISVs benefit from the platform's customer base, and the platform benefits from a richer ecosystem.",
      "Joining an ISV program often involves a technical validation or certification of the integration before it can be listed.",
    ],
    faqs: [
      ["What does ISV stand for?", "ISV stands for independent software vendor."],
      ["What is a typical ISV partner benefit?", "Marketplace listing, technical enablement, co-marketing and, at higher tiers, co-selling with the platform's sales team."],
    ],
    related: ["technology-partner", "partner-marketplace", "co-selling"],
    link: { label: "Browse technology programs", href: "/directory?type=Technology" },
  },
  {
    slug: "oem-partner", term: "OEM and white label partner", group: "Programs and models",
    short: "An OEM or white label partner embeds a vendor's technology in its own product or sells it under its own brand, instead of selling it under the vendor's name.",
    body: [
      "OEM arrangements let a company add a capability without building it. The vendor earns licence or usage fees, and the partner presents the result as part of its own offering.",
      "White label programs are common in software, payments and AI, where partners want to offer a full solution under their brand. Agreements cover branding, support responsibilities and pricing.",
    ],
    faqs: [
      ["What is the difference between OEM and white label?", "OEM usually means embedding the vendor's technology inside the partner's product. White label means selling the vendor's product under the partner's brand. In practice the terms overlap."],
      ["Who owns the customer in an OEM deal?", "The partner usually does, which is the main reason vendors and partners agree support and branding terms in advance."],
    ],
    related: ["reseller", "technology-partner", "channel-partner"],
    link: { label: "Browse OEM and white label programs", href: "/directory?type=OEM%20or%20white%20label" },
  },
  {
    slug: "managed-service-provider-(msp)", term: "Managed service provider (MSP)", group: "Programs and models",
    short: "A managed service provider is a company that remotely runs, monitors and supports a customer's IT systems or software for a recurring fee.",
    body: [
      "MSPs take responsibility for ongoing operations such as security, backup, networks, cloud and end-user support. Customers pay a monthly or annual fee instead of managing these tasks in-house.",
      "Vendors run MSP programs because MSPs bundle and resell their products to many small and mid-sized customers. MSP programs often offer multi-tenant management tools, usage-based pricing and monthly billing.",
    ],
    faqs: [
      ["What does an MSP do?", "An MSP manages a customer's IT or software environment under a service agreement, covering tasks such as monitoring, security, updates and support."],
      ["How do MSPs make money from vendor programs?", "They buy or license products at partner rates, bundle them into managed services and earn recurring revenue from customers."],
    ],
    related: ["channel-partner", "reseller", "system-integrator"],
    link: { label: "Browse MSP programs", href: "/directory?type=MSP" },
  },
  {
    slug: "system-integrator", term: "System integrator", group: "Programs and models",
    short: "A system integrator is a services company that combines software, hardware and cloud products into a working solution for a customer, and often implements and supports it.",
    body: [
      "Integrators are valued for technical depth and for knowing the customer's environment. Vendors partner with them to get complex deployments delivered well.",
      "Compensation comes mainly from services revenue, and sometimes from resale margin or referral fees. Vendor programs for integrators often center on certification, delivery quality and joint account planning.",
    ],
    faqs: [
      ["What is the difference between a system integrator and a consultancy?", "An integrator builds and connects systems. A consultancy advises on strategy or process. Many firms do both."],
      ["Do system integrators resell software?", "Some do, and many earn mostly from implementation services, with resale as a secondary stream."],
    ],
    related: ["value-added-reseller", "managed-service-provider-(msp)", "ai-integrator"],
    link: { label: "Browse services programs", href: "/directory?type=Services" },
  },
  {
    slug: "distributor", term: "Distributor", group: "Programs and models",
    short: "A distributor buys products in volume from vendors and sells them on to resellers, usually providing logistics, credit, support and sometimes enablement.",
    body: [
      "In software and technology, distributors form the layer between vendors and resellers. They aggregate many vendors, simplify purchasing and often recruit and support smaller resellers on the vendor's behalf.",
      "Vendors use distributors to reach long-tail resellers and new regions without building direct relationships with each one.",
    ],
    faqs: [
      ["What is the difference between a distributor and a reseller?", "A distributor sells mainly to resellers, while a reseller sells to end customers."],
      ["Why do vendors use distributors?", "To reach many small resellers and new regions efficiently, with the distributor handling logistics, credit and local support."],
    ],
    related: ["reseller", "channel-partner", "value-added-reseller"],
  },
];
