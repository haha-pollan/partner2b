import { Suspense } from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResultsClient } from "./ResultsClient";

export const metadata: Metadata = {
  title: "Your partner program result | Partner2B",
  description: "Your partner program assessment result: your score, the two things holding your program back and what to fix first.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResultsClient nav={<Nav />} footer={<Footer />} />
    </Suspense>
  );
}
