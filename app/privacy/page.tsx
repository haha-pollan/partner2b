import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy | Partner2B",
  description: "How Partner2B collects and uses personal data on partner2b.com, including forms, the newsletter, the Program builder and your rights.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="What we collect when you use partner2b.com, why, and what you can do about it."
      sections={PRIVACY}
    />
  );
}
