import { Suspense } from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResultsClient } from "./ResultsClient";

export const metadata: Metadata = {
  title: "Your partner pipeline | Partner2B",
  description: "Your partner pipeline: how many partner companies to list, reach out to and sign to hit your revenue goal.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResultsClient nav={<Nav />} footer={<Footer />} />
    </Suspense>
  );
}
