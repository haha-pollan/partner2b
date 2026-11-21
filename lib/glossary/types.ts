export type Term = {
  slug: string;
  term: string;
  group: string;
  short: string;
  body: string[];
  faqs: [string, string][];
  related: string[];
  link?: { label: string; href: string };
};
