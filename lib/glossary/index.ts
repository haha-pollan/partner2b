import type { Term } from "./types";
import { A } from "./a";
import { B } from "./b";
import { C } from "./c";

export type { Term };
export const TERMS: Term[] = [...A, ...B, ...C];
export const GROUPS = ["Programs and models", "Sales and channel", "Partner operations", "Marketing and funds", "Ecosystem and strategy", "AI and agents"];
export const termBySlug = (s: string) => {
  let d = s;
  try { d = decodeURIComponent(s); } catch {}
  return TERMS.find((t) => t.slug === d);
};
export const termHref = (slug: string) => `/glossary/${slug}`;
