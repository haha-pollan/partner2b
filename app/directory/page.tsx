import type { Metadata } from "next";
import { getPrograms } from "@/lib/programs";
import { JsonLd, SITE, crumbs } from "@/components/JsonLd";
import { DirectoryView, type SP } from "@/components/DirectoryView";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "B2B partner programs: compare commissions and tiers | Partner2B",
  description: "Browse B2B partner programs: reseller, referral, technology, MSP and OEM. Filter by type, commission model, features and region, with links to official pages.",
  alternates: { canonical: "/directory" },
};

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getPrograms();
  return (<>
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [ { "@type": "CollectionPage", name: "B2B partner programs directory", url: `${SITE}/directory`, description: "Browse B2B partner programs by type, commission model, features and region, with links to official pages.", numberOfItems: all.length }, crumbs([["Partner2B", SITE], ["Directory", `${SITE}/directory`]]) ] }} />
    <DirectoryView sp={sp} pool={all} base="/directory" h1={["Browse partner", "programs"]} sub={`Compare ${all.length} B2B partner programs by commission, tiers and requirements, and find the reseller, referral or MSP program worth joining`} />
  </>);
}
