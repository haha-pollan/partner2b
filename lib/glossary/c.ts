import type { Term } from "./types";

export const C: Term[] = [
  {
    slug: "ai-partner-program", term: "AI partner program", group: "AI and agents",
    short: "An AI partner program is a partner program run by an AI vendor that lets agencies, consultancies, resellers and technology companies sell, build on or implement its AI products in return for commissions, discounts, training and support.",
    body: [
      "Model providers, agent platforms, voice AI companies and AI infrastructure vendors increasingly run partner programs, because most buyers need help choosing, integrating and operating AI. Partners fill that gap with implementation, change management and domain expertise.",
      "Typical benefits are referral fees, reseller discounts, revenue share, partner-specific pricing, technical enablement and co-marketing. Requirements often include certifications and proof of customer projects.",
    ],
    faqs: [
      ["What is an AI partner program?", "A structured program through which AI vendors work with agencies, consultancies and resellers that sell, implement or build on their AI products."],
      ["Who can join an AI partner program?", "Usually agencies, consultancies, system integrators, resellers and software companies. Each program sets its own requirements."],
    ],
    related: ["ai-integrator", "ai-reseller", "ai-agent-marketplace", "ai-partner-marketplace"],
    link: { label: "Browse AI partner programs", href: "/ai" },
  },
  {
    slug: "ai-partner-marketplace", term: "AI partner marketplace", group: "AI and agents",
    short: "An AI partner marketplace is a platform where AI vendors, agents, models and integrations are listed so that businesses and partners can discover, compare and buy them.",
    body: [
      "Cloud providers, model platforms and agent platforms run marketplaces where partners publish AI apps, agents and connectors. Buyers get a curated choice, and partners get access to the host's customers.",
      "Listing often supports co-selling and consolidated billing. It differs from a general software marketplace by focusing on models, agents, data tools and AI services.",
    ],
    faqs: [
      ["What is an AI partner marketplace?", "A marketplace for AI products, agents and services, run by a platform vendor or an independent directory, where buyers and partners find each other."],
      ["How do I list an AI product in a marketplace?", "Join the host's partner program, complete any technical review, and publish a listing with pricing and documentation."],
    ],
    related: ["partner-marketplace", "ai-agent-marketplace", "ai-partner-program", "ai-partner-discovery"],
    link: { label: "Browse AI partner programs", href: "/ai" },
  },
  {
    slug: "ai-partner-discovery", term: "AI partner discovery", group: "AI and agents",
    short: "AI partner discovery is finding partners with the help of AI, or finding partners inside the AI ecosystem, by comparing programs, capabilities and customer fit.",
    body: [
      "It has two meanings. One is using AI tools to find and rank potential partners from large sets of data. The other is finding the right AI vendors and AI service firms to partner with, which is where a directory of AI partner programs helps.",
      "Either way, the best results come from clear criteria: customer overlap, capabilities, program terms and the effort required to join.",
    ],
    faqs: [
      ["How can AI help find partners?", "AI can scan company data, match customer overlap and rank candidates, which shortens the list that a person then reviews."],
      ["Where can I find AI vendors with partner programs?", "In a directory of AI partner programs that compares commission, tiers and requirements, or on each vendor's own partner page."],
    ],
    related: ["partner-discovery", "ai-partner-marketplace", "ai-partner-program"],
    link: { label: "Browse AI partner programs", href: "/ai" },
  },
  {
    slug: "agentic-ai", term: "Agentic AI", group: "AI and agents",
    short: "Agentic AI is artificial intelligence that can plan, make decisions and take actions toward a goal with limited human direction, often by using tools, data and other software.",
    body: [
      "Unlike a chatbot that only answers, an agentic system can break a goal into steps, call tools such as search, databases and business applications, check its results and continue until the task is done.",
      "For businesses, agentic AI creates demand for implementation partners, because deploying agents safely needs integration, governance and process design. It also changes partner work itself, for example by automating research, outreach and reporting.",
    ],
    faqs: [
      ["What is agentic AI?", "AI that can pursue goals by planning steps and using tools, rather than only answering single prompts."],
      ["How is agentic AI different from generative AI?", "Generative AI produces content in response to a prompt. Agentic AI uses generative models to act, deciding what to do next and carrying out multi-step tasks."],
    ],
    related: ["ai-agent", "ai-agents-in-partner-programs", "model-context-protocol-mcp", "ai-governance"],
    link: { label: "Browse AI agent platforms", href: "/ai/agents" },
  },
  {
    slug: "ai-agent", term: "AI agent", group: "AI and agents",
    short: "An AI agent is a software system that uses an AI model to pursue a goal, deciding on steps and using tools and data to complete tasks for a user or business.",
    body: [
      "Agents range from a support assistant that resolves tickets to a research agent that gathers and summarizes information. They combine a model with instructions, memory, tools and guardrails.",
      "Many agent platforms run partner programs so agencies and consultancies can build, deploy and manage agents for clients, earning referral fees, reseller margin or services revenue.",
    ],
    faqs: [
      ["What is an AI agent?", "A system that uses an AI model to carry out tasks toward a goal, using tools and data, with some independence."],
      ["Can agencies resell AI agents?", "Yes, many agent platforms offer agency, reseller or referral programs for partners that build and manage agents for clients."],
    ],
    related: ["agentic-ai", "ai-agent-marketplace", "ai-agents-in-partner-programs", "ai-partner-program"],
    link: { label: "Browse AI agent platforms", href: "/ai/agents" },
  },
  {
    slug: "ai-agents-in-partner-programs", term: "AI agents in partner programs", group: "AI and agents",
    short: "AI agents in partner programs are agents that automate partner work such as finding partners, onboarding, answering partner questions, registering deals and reporting, and also the AI agent products that partners resell.",
    body: [
      "On the operations side, agents can answer partner questions from program documentation, draft joint plans, flag inactive partners and summarize pipeline. This lets small partner teams manage more partners.",
      "On the commercial side, agent platforms use partner programs to reach customers through agencies, who configure, integrate and run agents for clients. Both directions are growing, and both need clear rules on data, accuracy and human oversight.",
    ],
    faqs: [
      ["How can AI agents help partner managers?", "By handling routine questions, preparing reports, tracking deal status and surfacing partners that need attention, so managers focus on relationships."],
      ["What should partner teams check before using AI agents?", "Data access, accuracy of answers, approval steps for actions and how results are logged and reviewed."],
    ],
    related: ["agentic-ai", "ai-powered-prm", "partner-manager", "ai-agent"],
    link: { label: "Browse AI agent platforms", href: "/ai/agents" },
  },
  {
    slug: "ai-agent-marketplace", term: "AI agent marketplace", group: "AI and agents",
    short: "An AI agent marketplace is a catalog where ready-made AI agents and agent components are listed so that businesses and partners can find, evaluate and deploy them.",
    body: [
      "Agent marketplaces let developers and partners publish agents for tasks such as support, sales research and finance, and let buyers deploy them with little setup. Hosts include model providers, cloud platforms and agent platforms.",
      "For partners, listing is a way to reach buyers, and some marketplaces share revenue with publishers. Buyers should check security, data handling and support terms.",
    ],
    faqs: [
      ["What is an AI agent marketplace?", "A place to discover and deploy pre-built AI agents, usually run by an AI or cloud platform."],
      ["How do publishers earn on agent marketplaces?", "Through usage fees, subscriptions or revenue share, depending on the marketplace's terms."],
    ],
    related: ["ai-partner-marketplace", "ai-agent", "partner-marketplace"],
    link: { label: "Browse AI partner programs", href: "/ai" },
  },
  {
    slug: "ai-integrator", term: "AI integrator", group: "AI and agents",
    short: "An AI integrator is a services company that selects, connects and deploys AI products into a customer's systems and processes, often as a partner of AI vendors.",
    body: [
      "Integrators handle data preparation, integration with existing software, security review, change management and ongoing operations. Vendors rely on them to turn products into working solutions.",
      "Programs for AI integrators usually offer certification, technical support, partner pricing and referrals. Revenue comes mostly from project and managed services.",
    ],
    faqs: [
      ["What does an AI integrator do?", "Deploys AI into a customer's environment, connecting it to data and systems and making it work in real processes."],
      ["How do AI integrators work with vendors?", "As certified partners that implement the vendor's products and sometimes resell or refer them."],
    ],
    related: ["system-integrator", "ai-partner-program", "ai-reseller"],
    link: { label: "AI integrators and consultancies", href: "/ai/integrators" },
  },
  {
    slug: "ai-reseller", term: "AI reseller", group: "AI and agents",
    short: "An AI reseller is a company that sells AI software, models or platform usage to its own customers, usually at partner pricing and with added services.",
    body: [
      "Resellers package AI tools with implementation, training and support. Programs may offer discounts, usage credits, white label options and shared revenue.",
      "Because AI usage is often metered, reseller terms to check include how usage is billed, minimum commitments and who owns the customer relationship.",
    ],
    faqs: [
      ["Can I resell AI tools?", "Yes, where the vendor has a reseller or agency program. Terms differ, so read the program's requirements and billing model."],
      ["What is white label AI?", "AI offered under the partner's own brand, built on the vendor's technology."],
    ],
    related: ["reseller", "oem-partner", "ai-partner-program"],
    link: { label: "Browse AI partner programs", href: "/ai" },
  },
  {
    slug: "ai-powered-prm", term: "AI-powered PRM", group: "AI and agents",
    short: "AI-powered PRM is partner relationship management software that uses AI to match partners, predict performance, automate tasks and answer questions about the program.",
    body: [
      "Features include partner matching, lead routing, content recommendations, automated onboarding steps and summaries of partner activity. The goal is to scale program management without scaling headcount.",
      "Teams should check data quality and keep people in charge of decisions that affect partner compensation.",
    ],
    faqs: [
      ["What can AI do in a PRM?", "Match partners to opportunities, automate routine tasks, summarize activity and answer partner questions from program content."],
      ["Does AI replace partner managers?", "No. It handles routine work so partner managers can spend more time on relationships and strategy."],
    ],
    related: ["prm", "ai-agents-in-partner-programs", "partner-portal"],
  },
  {
    slug: "model-context-protocol-mcp", term: "Model Context Protocol (MCP)", group: "AI and agents",
    short: "The Model Context Protocol, or MCP, is an open standard that lets AI applications connect to external tools and data sources in a consistent way.",
    body: [
      "Instead of building a custom integration for every tool, a developer exposes a tool through an MCP server, and any MCP-compatible AI application can use it. Anthropic introduced the protocol, and many vendors now support it.",
      "For partners and software companies, MCP is a new integration path: products that offer an MCP server can be used directly by AI agents, which makes them easier to include in agent workflows.",
    ],
    faqs: [
      ["What does MCP stand for?", "MCP stands for Model Context Protocol."],
      ["Why does MCP matter for partners?", "It lowers the cost of connecting products to AI agents, which can make integrations and technology partnerships faster to build."],
    ],
    related: ["agentic-ai", "ai-agent", "technology-partner"],
    link: { label: "Browse AI agent platforms", href: "/ai/agents" },
  },
  {
    slug: "ai-governance", term: "AI governance", group: "AI and agents",
    short: "AI governance is the set of policies, controls and responsibilities that organizations use to make sure AI systems are secure, compliant, fair and used as intended.",
    body: [
      "It covers risk assessment, data privacy, model and agent permissions, monitoring, audit trails and regulatory compliance. As agents take actions, governance includes defining what they may do without human approval.",
      "AI governance and security vendors run partner programs so consultancies and integrators can help customers put controls in place.",
    ],
    faqs: [
      ["What is AI governance?", "The framework of rules and controls for responsible, secure and compliant use of AI."],
      ["Who needs AI governance?", "Any organization that deploys AI, especially where AI handles sensitive data or takes actions."],
    ],
    related: ["agentic-ai", "ai-integrator", "ai-partner-program"],
    link: { label: "AI security and governance programs", href: "/ai/security" },
  },
  {
    slug: "vector-database", term: "Vector database", group: "AI and agents",
    short: "A vector database stores data as numerical representations called embeddings, so that AI applications can quickly find information that is similar in meaning to a query.",
    body: [
      "Vector databases power retrieval for AI applications, such as searching company documents so that an assistant can answer with relevant context. They are a core part of many AI stacks.",
      "Vendors in this category often run partner programs for consultancies and developers who build retrieval and agent applications for clients.",
    ],
    faqs: [
      ["What is a vector database used for?", "Semantic search and retrieval for AI applications, such as giving an AI assistant access to relevant documents."],
      ["Why do vector database vendors have partner programs?", "Building AI applications needs implementation skills, so vendors work with consultancies and developers to reach customers."],
    ],
    related: ["ai-integrator", "ai-agent", "ai-partner-program"],
    link: { label: "Vector databases and data for AI", href: "/ai/vector-databases" },
  },
  {
    slug: "mlops", term: "MLOps", group: "AI and agents",
    short: "MLOps is the set of practices and tools for building, deploying, monitoring and maintaining machine learning models in production reliably.",
    body: [
      "It brings software engineering discipline to machine learning: versioning data and models, automating training and deployment, and monitoring performance over time.",
      "AI infrastructure and MLOps vendors work with partners that implement platforms for customers, and offer programs with training, technical support and referral or resale terms.",
    ],
    faqs: [
      ["What does MLOps stand for?", "MLOps combines machine learning and operations."],
      ["Who partners with MLOps vendors?", "Consultancies, integrators and cloud partners that deploy and run machine learning platforms for customers."],
    ],
    related: ["ai-integrator", "vector-database", "ai-partner-program"],
    link: { label: "AI infrastructure and MLOps programs", href: "/ai/infrastructure" },
  },
];
