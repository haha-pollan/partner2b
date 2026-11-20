import type { Metadata } from "next";
import { FormPage } from "@/components/FormPage";
import { getPrograms } from "@/lib/programs";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Claim a listing | Partner2B Directory",
  description: "Run a partner program? Claim your listing on Partner2B Directory for free, correct your terms and keep them current.",
  alternates: { canonical: "/claim" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  const listings = all.map((p) => ({ slug: p.slug, label: p.product_note ? `${p.company} ${p.product_note}` : p.company }));
  return <FormPage kind="claim" listings={listings} defaultListing={sp.listing} />;
}
