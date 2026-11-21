import type { Metadata } from "next";
import { getPrograms } from "@/lib/programs";
import { DirectoryView, type SP } from "@/components/DirectoryView";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Partner2B Directory: browse B2B partner programs",
  description: "Search B2B partner programs, reseller programs, referral programs and MSP programs. Filter by type, product category, commission model, features and region.",
};

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  return <DirectoryView sp={sp} pool={all} base="/directory" h1={["Browse partner", "programs"]} sub={`${all.length} public B2B programs. Every listing links to its official page`} />;
}
