import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy | Partner2B Directory",
  description: "How Partner2B Directory handles personal data.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="What we collect when you use Partner2B Directory, why, and what you can do about it."
      sections={PRIVACY}
    />
  );
}
