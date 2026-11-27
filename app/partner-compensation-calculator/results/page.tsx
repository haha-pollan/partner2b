import { Suspense } from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResultsClient } from "./ResultsClient";

export const metadata: Metadata = {
  title: "Your partner compensation budget | Partner2B",
  description: "Your partner compensation budget: commissions, renewals, partner marketing funds and bonuses, and whether it fits your margin.",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (<Suspense fallback={null}><ResultsClient nav={<Nav />} footer={<Footer />} /></Suspense>);
}
