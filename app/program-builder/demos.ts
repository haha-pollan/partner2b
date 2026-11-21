// Test intakes for trying the builder. Open /program-builder?demo=jumio (or stripe, coinbase). Figures are invented for testing.
export const DEMOS: Record<string, Record<string, unknown>> = {
  jumio: {
    website: "jumio.com", companyName: "Jumio", category: "Identity and KYC",
    offeringSummary: "Identity verification and KYC platform that checks government IDs, runs liveness detection and screens against watchlists through one API.",
    keyFeatures: "Document verification, biometric liveness, AML screening", differentiators: "One API for onboarding and ongoing screening, with a long track record with regulated banks and payment firms.",
    deliveryModel: "Software with onboarding", competitors: "Onfido, Persona, Veriff, Sumsub",
    endUser: "Compliance analyst reviewing customer onboarding", primaryBuyer: "Head of compliance or risk", audience: "Mid-market companies",
    industriesServed: "Banks, fintech, crypto, marketplaces", region: "North America", pricing: "Annual contract based on verification volume, from $40,000 per year",
    acvLow: 40000, acvHigh: 150000, currency: "USD", stage: "A program with fewer than 20 partners",
    programGoals: ["Generate partner-sourced pipeline", "Expand into new geographies or segments", "Accelerate adoption or usage"], year1PartnerRevenueTarget: 1500000, partnerRevenueSharePercent: 25,
  },
  stripe: {
    website: "stripe.com", companyName: "Stripe", category: "Payments",
    offeringSummary: "Payments infrastructure for internet businesses, with APIs for accepting payments, billing, marketplaces and fraud prevention.",
    keyFeatures: "Payments API, Billing, Connect for marketplaces", differentiators: "Developer-first APIs and documentation, with fraud tools and global payment methods built in.",
    deliveryModel: "Self-serve software", competitors: "Adyen, Checkout.com, Braintree",
    endUser: "Software engineer integrating checkout and billing", primaryBuyer: "Head of payments or engineering", audience: "A mix of sizes",
    industriesServed: "SaaS, marketplaces, e-commerce", region: "Global", pricing: "Per transaction fees, with custom pricing at volume",
    acvLow: 20000, acvHigh: 120000, currency: "USD", stage: "A program with fewer than 20 partners",
    programGoals: ["Generate partner-sourced pipeline", "Add delivery or implementation capacity", "Accelerate adoption or usage"], year1PartnerRevenueTarget: 5000000, partnerRevenueSharePercent: 20,
  },
  coinbase: {
    website: "coinbase.com", companyName: "Coinbase", category: "Payments",
    offeringSummary: "Crypto infrastructure for businesses, covering custody, trading through Prime, wallets and a developer platform for stablecoin and onchain payments.",
    keyFeatures: "Institutional custody, Prime trading, developer platform and wallets", differentiators: "A regulated, publicly listed crypto company with deep liquidity and secure custody.",
    deliveryModel: "Software plus implementation services", competitors: "Fireblocks, Circle, BitGo",
    endUser: "Treasury or product engineer building crypto features", primaryBuyer: "Head of product or treasury", audience: "Large enterprises",
    industriesServed: "Fintech, brokers, enterprises", region: "North America", pricing: "Custom contracts, platform and volume based",
    acvLow: 50000, acvHigh: 300000, currency: "USD", stage: "No partner program yet",
    programGoals: ["Build ecosystem visibility", "Generate partner-sourced pipeline", "Add delivery or implementation capacity"], year1PartnerRevenueTarget: 3000000, partnerRevenueSharePercent: 15,
  },
};
