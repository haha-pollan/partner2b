import { Suspense } from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResultsClient } from "./ResultsClient";

export const metadata: Metadata = {
  title: "Your partner program return | Partner2B",
  description: "Your partner ROI: what your partner program returns, the month it pays back and what each customer costs.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResultsClient nav={<Nav />} footer={<Footer />} />
    </Suspense>
  );
}
