import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of use | Partner2B",
  description: "Terms of use for partner2b.com, including how listings are compiled from official program pages and how to ask for a correction.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <LegalPage
      title="Terms of use"
      intro="The rules for using partner2b.com, in plain language."
      sections={TERMS}
    />
  );
}
