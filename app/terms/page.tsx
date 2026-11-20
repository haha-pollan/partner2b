import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of use | Partner2B Directory",
  description: "The rules for using Partner2B Directory.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <LegalPage
      title="Terms of use"
      intro="The rules for using Partner2B Directory, in plain language."
      sections={TERMS}
    />
  );
}
