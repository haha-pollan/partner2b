import type { Metadata } from "next";
import { FormPage } from "@/components/FormPage";
import { getPrograms } from "@/lib/programs";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Report a correction | Partner2B Directory",
  description: "Spotted a mistake in a partner program listing? Tell us what changed and we will check it against the official program page.",
  alternates: { canonical: "/report" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  const listings = all.map((p) => ({ slug: p.slug, label: p.product_note ? `${p.company} ${p.product_note}` : p.company }));
  return <FormPage kind="report" listings={listings} defaultListing={sp.listing} />;
}
