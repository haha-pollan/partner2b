export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const SITE = "https://partner2b.com";
export const ORG = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Partner2B",
  url: SITE,
  logo: `${SITE}/apple-icon.png`,
  email: "hello@partner2b.com",
  description: "Partner2B is a marketing and go-to-market team for B2B tech companies. We accelerate pipeline and re-engineer company-wide workflows with AI, and run a free directory of B2B partner programs.",
};
export const crumbs = (items: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })),
});
