import type { Metadata } from "next";
import { getPrograms } from "@/lib/programs";
import { DirectoryView, type SP } from "@/components/DirectoryView";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "B2B partner programs: compare commissions and tiers | Partner2B",
  description: "Browse B2B partner programs: reseller, referral, technology, MSP and OEM. Filter by type, commission model, features and region, with links to official pages.",
};

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  return <DirectoryView sp={sp} pool={all} base="/directory" h1={["Browse partner", "programs"]} sub={`Compare ${all.length} B2B partner programs by commission, tiers and requirements, and find the reseller, referral or MSP program worth joining`} />;
}
