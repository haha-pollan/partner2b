import type { Metadata } from "next";
import { FormPage } from "@/components/FormPage";
import { getPrograms } from "@/lib/programs";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Submit a program | Partner2B Directory",
  description: "Submit a B2B partner program to the free Partner2B Directory. Share the official program page and we will review it before it goes live.",
  alternates: { canonical: "/submit" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  const listings = all.map((p) => ({ slug: p.slug, label: p.product_note ? `${p.company} ${p.product_note}` : p.company }));
  return <FormPage kind="submit" listings={listings} defaultListing={sp.listing} />;
}
