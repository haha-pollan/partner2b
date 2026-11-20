import type { Program } from "./programs";

const CAT: Record<string, string> = {
  "Payments": "payments",
  "Billing and subscriptions": "billing and subscription management",
  "Buy now, pay later": "buy now, pay later financing",
  "Fraud, risk and compliance": "fraud prevention, risk and compliance",
  "Identity and KYC": "identity verification and KYC",
  "Banking as a service and card issuing": "banking as a service and card issuing",
  "Core and digital banking": "core and digital banking",
  "Open banking and financial data": "open banking and financial data",
  "Spend management and AP": "spend management and accounts payable automation",
  "Finance and accounting software": "finance and accounting software",
  "Payroll and HR": "payroll and HR",
  "Customer service and contact center": "customer service and contact center software",
  "Conversational and voice AI": "conversational and voice AI",
  "Sales and CRM": "sales and CRM software",
  "Cloud and infrastructure": "cloud and infrastructure",
  "Cybersecurity": "cybersecurity",
  "Data and analytics": "data and analytics",
};

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

// Used when a program has no company_description of its own. Built only from
// the listing data, and replaced as soon as the column is filled.
export function companyDescription(p: Program): string {
  if (p.company_description) return p.company_description;
  const cat = CAT[p.product_category] ?? p.product_category.toLowerCase();
  const types = p.program_types.map((t) => t.toLowerCase());
  const where = p.region === "Global" ? " worldwide" : ` in ${p.region}`;
  const parts = [
    `${p.company} provides ${cat} solutions for businesses.`,
    `The ${p.company} partner program is open to ${list(types)} partners${where}.`,
  ];
  if (p.tiers.length) parts.push(`Partners can join as ${list(p.tiers.slice(0, 3))}.`);
  parts.push(`Full details are on the official ${p.company} partner program page.`);
  return parts.join(" ");
}
