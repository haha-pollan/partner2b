import { redirect } from "next/navigation";

// Corrections now go through the claim flow: only the company behind a program can change its listing.
export default async function Page({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const sp = await searchParams;
  redirect(sp.listing ? `/claim?listing=${encodeURIComponent(sp.listing)}` : "/claim");
}
