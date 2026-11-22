import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://partner2b.com"),
  title: "Partner2B Directory: B2B partner programs",
  description: "Free directory of B2B partner programs and channel partner programs. Compare reseller, referral and technology programs, tiers and commissions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Zen+Dots&family=Michroma&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><div className="ground">{children}</div></body>
    </html>
  );
}
