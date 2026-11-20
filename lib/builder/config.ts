import { CATEGORIES } from "@/lib/formsConfig";

export const OTHER = "Other or not listed";
export const BUILDER_CATEGORIES = [...CATEGORIES, OTHER];

export type Goal = { id: string; label: string; types: Record<string, number>; features: string[]; kpis: string[]; action: string };
export const GOALS: Goal[] = [
  { id: "pipeline", label: "Generate more qualified pipeline", types: { Referral: 3, Reseller: 2, Services: 1 }, features: ["Deal registration", "Referral fee", "Co-marketing funds"],
    kpis: ["Partner-sourced pipeline value", "Qualified introductions per partner per quarter", "Win rate on partner deals versus direct deals"],
    action: "Set up a one-page deal registration flow so partners know a lead is protected the moment they send it." },
  { id: "regions", label: "Enter new regions or markets", types: { Reseller: 3, Services: 2, Referral: 1 }, features: ["Discount on resale", "Training", "Partner portal"],
    kpis: ["Revenue from new regions through partners", "Active partners per target region", "Time from partner signing to first deal"],
    action: "Shortlist target regions and name the first local partner type to recruit in each one." },
  { id: "leverage", label: "Grow sales without adding more reps", types: { Reseller: 3, Referral: 2, MSP: 1 }, features: ["Discount on resale", "Deal registration", "Partner portal"],
    kpis: ["Share of new revenue closed by partners", "Revenue per active partner", "Sales cost per partner-closed deal"],
    action: "Agree a clear split of who sells and who supports, so partner-closed deals never wait on your sales team." },
  { id: "integrations", label: "Add value through integrations", types: { Technology: 3, Referral: 1 }, features: ["Marketplace listing", "Co-marketing funds", "Training"],
    kpis: ["Live integrations published", "Customers using at least one integration", "Joint leads from technology partners"],
    action: "Publish integration documentation and a listing template so a technology partner can start without a call." },
  { id: "delivery", label: "Add implementation and services capacity", types: { Services: 3, Technology: 1, MSP: 1 }, features: ["Training", "Tiered benefits", "Partner portal"],
    kpis: ["Certified partner consultants", "Projects delivered by partners", "Customer satisfaction on partner-led projects"],
    action: "Define a certification path so you can tell which partners are ready to deliver without your help." },
  { id: "marketplace", label: "Sell through cloud and app marketplaces", types: { Technology: 3, Reseller: 2, Referral: 1 }, features: ["Marketplace listing", "Co-selling", "Discount on resale"],
    kpis: ["Marketplace-sourced revenue", "Co-sell opportunities opened", "Time to list a product on a new marketplace"],
    action: "Choose the first one or two marketplaces to list on and confirm what each one requires from you." },
  { id: "embed", label: "Embed our product in partners' offerings", types: { "OEM or white label": 3, Technology: 2, Reseller: 1 }, features: ["Tiered benefits", "Partner portal", "Training"],
    kpis: ["Partners with a live embedded product", "End customers reached through partners", "Revenue per embedded partner"],
    action: "Write down what partners may rebrand, what stays yours and how usage is measured." },
  { id: "retention", label: "Improve retention and expand accounts", types: { Services: 2, Technology: 2, Referral: 1 }, features: ["Training", "Tiered benefits", "Co-marketing funds"],
    kpis: ["Retention of customers with a partner attached", "Expansion revenue from partner-managed accounts", "Number of accounts served by an active partner"],
    action: "Identify the customer segments where a partner already helps accounts stay and grow, and recruit more of that kind." },
];

export const AUDIENCES = ["Small businesses", "Mid-market companies", "Large enterprises", "A mix of sizes"];
export const SIZES = ["1 to 50 employees", "51 to 200 employees", "201 to 1,000 employees", "More than 1,000 employees"];
export const STAGES = ["No partner program yet", "A few informal partners", "A program with fewer than 20 partners"];
export const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East and Africa", "Global"];

export type TypeRole = { title: string; short: string; who: string; earns: string; need: string; economics: string; kit: string[] };
export const TYPE_ROLES: Record<string, TypeRole> = {
  Referral: { title: "Referral partners", short: "referral partners", who: "Consultants, advisors and agencies that already advise your buyers and want to introduce you without selling or supporting the product.",
    earns: "A fee on closed deals", need: "A simple introduction form, clear terms and fast follow up",
    economics: "A one-time fee or a share of first-year contract value is the usual model. Typical range in B2B software is 10 to 20 percent.", kit: ["Referral terms in one page", "Introduction form and tracking link"] },
  Reseller: { title: "Resellers and VARs", short: "resellers", who: "Firms that sell your product to their customers, invoice them and often provide first-line support.",
    earns: "A discount on list price or a margin on each sale", need: "Pricing they can quote, deal protection and sales training",
    economics: "A resale discount off list price is the usual model. Typical range in B2B software is 15 to 30 percent, higher for committed partners.", kit: ["Partner price list and quoting guide", "Deal registration rules"] },
  Technology: { title: "Technology partners", short: "technology partners", who: "Software companies whose product sits next to yours in the buyer's stack and who build or list an integration with you.",
    earns: "Shared customers, joint marketing and marketplace visibility", need: "Documentation, a sandbox and a clear co-marketing path",
    economics: "Technology partnerships usually carry no commission. The value is mutual leads, a listing in each other's marketplace and joint campaigns.", kit: ["Integration documentation and sandbox access", "Joint listing and co-marketing template"] },
  Services: { title: "Services and implementation partners", short: "services partners", who: "Systems integrators, consultancies and specialist firms that deploy, customize and train customers on your product.",
    earns: "Project and retainer revenue, plus a referral fee in many programs", need: "Certification, implementation guides and a route to your technical team",
    economics: "Partners earn mainly from their own services. Many programs add a referral fee of 10 to 15 percent on the software they bring in.", kit: ["Certification path and implementation guide", "Escalation route to your technical team"] },
  MSP: { title: "Managed service providers", short: "managed service providers", who: "Providers that run IT or operations for many clients and bundle your product into a monthly service.",
    earns: "Margin on recurring revenue", need: "Multi-client management, flexible billing and support runbooks",
    economics: "A margin on recurring revenue is the usual model. Typical range in B2B software is 20 to 30 percent.", kit: ["Billing and support runbook", "Multi-client management guide"] },
  "OEM or white label": { title: "OEM and white label partners", short: "OEM and white label partners", who: "Companies that embed your product in their own offering under their own brand.",
    earns: "Their own product revenue built on yours", need: "Branding rights, licensing terms and usage measurement",
    economics: "Terms are negotiated, usually per seat, per usage or as a revenue share. Start with two or three design partners before setting a standard model.", kit: ["Branding and licensing pack", "Usage reporting setup"] },
};

export const GROUPS: Record<string, string[]> = {
  finance: ["Payments", "Billing and subscriptions", "Buy now, pay later", "Fraud, risk and compliance", "Identity and KYC", "Banking as a service and card issuing", "Core and digital banking", "Open banking and financial data", "Spend management and AP", "Finance and accounting software", "Payroll and HR"],
  customer: ["Customer service and contact center", "Conversational and voice AI", "Sales and CRM", "Ecommerce and marketing tech", "Content and digital experience"],
  infra: ["Cloud and infrastructure", "Cybersecurity", "Data and analytics", "IT management and DevOps", "Low-code and collaboration"],
  vertical: ["Construction, real estate and field operations", "Life sciences and healthcare"],
};
export const groupOf = (c: string) => Object.keys(GROUPS).find((g) => GROUPS[g].includes(c)) ?? "";

export const ARCHETYPES: Record<string, string[]> = {
  "Payments": ["Ecommerce and SaaS platforms that need embedded payments", "Accounting and ERP consultancies advising on payment flows", "Independent software vendors in retail, hospitality and marketplaces"],
  "Billing and subscriptions": ["Subscription ecommerce agencies", "SaaS finance consultancies and fractional finance firms", "ERP and CRM implementation partners"],
  "Buy now, pay later": ["Ecommerce platform agencies and checkout specialists", "Payment service providers and gateways", "Retail technology integrators"],
  "Fraud, risk and compliance": ["Payment service providers and acquirers", "Compliance and audit consultancies", "Core banking and fintech integrators"],
  "Identity and KYC": ["Fintech and neobank integrators", "Compliance and regtech consultancies", "Onboarding and workflow platform vendors"],
  "Banking as a service and card issuing": ["Fintech product studios and agencies", "Core banking vendors and integrators", "Compliance and licensing advisors"],
  "Core and digital banking": ["Banking systems integrators", "Digital experience agencies for financial institutions", "Fintech vendors that connect to the core"],
  "Open banking and financial data": ["Lending and personal finance app builders", "Accounting and ERP software vendors", "Fintech consultancies and integrators"],
  "Spend management and AP": ["Accounting firms and bookkeeping practices", "ERP consultants", "Corporate card and banking providers"],
  "Finance and accounting software": ["Accounting and advisory firms", "ERP implementation partners", "Vertical software vendors that need finance workflows"],
  "Payroll and HR": ["HR consultancies and employer-of-record firms", "Accounting firms serving growing teams", "HR and recruiting software vendors"],
  "Customer service and contact center": ["Contact center integrators and outsourcers", "CRM implementation partners", "Telephony and communications platforms"],
  "Conversational and voice AI": ["Contact center and customer experience integrators", "AI consultancies and automation agencies", "CRM and communications platforms"],
  "Sales and CRM": ["CRM implementation and revenue operations consultancies", "Sales data and enablement vendors", "Marketing automation agencies"],
  "Cloud and infrastructure": ["Managed service providers and cloud consultancies", "Systems integrators", "Cloud marketplace resellers and distributors"],
  "Cybersecurity": ["Managed security service providers", "IT resellers and VARs", "Compliance and audit firms"],
  "Data and analytics": ["Data engineering consultancies", "Cloud and business intelligence implementation partners", "Vertical software vendors that embed analytics"],
  "IT management and DevOps": ["Managed service providers", "DevOps and cloud consultancies", "IT resellers and distributors"],
  "Low-code and collaboration": ["Digital transformation consultancies", "Business process and workflow agencies", "Systems integrators"],
  "Content and digital experience": ["Web and digital experience agencies", "Ecommerce platform integrators", "Marketing technology consultancies"],
  "Ecommerce and marketing tech": ["Ecommerce and growth agencies", "Platform integrators and developers", "Marketing and CRM consultancies"],
  "Construction, real estate and field operations": ["Industry software resellers and integrators", "Industry consultancies and advisors", "Adjacent software vendors such as accounting and project controls"],
  "Life sciences and healthcare": ["Life sciences consultancies and research organizations", "Healthcare IT integrators", "Regulated-industry software vendors"],
  [OTHER]: ["Consultancies and agencies that serve your buyers", "Software vendors adjacent to your product", "Resellers and integrators in your target market"],
};
export const AUDIENCE_ARCHETYPE: Record<string, string> = {
  "Small businesses": "Managed service providers, accountants and local consultancies that serve small businesses",
  "Mid-market companies": "Specialist regional consultancies that serve mid-market buyers",
  "Large enterprises": "Global and regional systems integrators with enterprise accounts",
};
export const CATEGORY_TYPE_BIAS: Record<string, Record<string, number>> = {
  "Cybersecurity": { MSP: 1 }, "Cloud and infrastructure": { MSP: 1 }, "IT management and DevOps": { MSP: 1 },
  "Payments": { Technology: 1 }, "Billing and subscriptions": { Technology: 1 }, "Open banking and financial data": { Technology: 1 },
  "Conversational and voice AI": { Technology: 1 }, "Data and analytics": { Technology: 1 },
  "Construction, real estate and field operations": { Reseller: 1 }, "Life sciences and healthcare": { Services: 1 },
};
