import type { Metadata } from "next";
import "./globals.css";
import { JsonLd, ORG, SITE } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://partner2b.com"),
  title: "Growth and AI transformation for B2B tech | Partner2B",
  description: "Partner2B is a marketing and go-to-market team for B2B tech companies. We accelerate pipeline and re-engineer workflows with AI. Free partner program directory.",
  openGraph: { type: "website", siteName: "Partner2B", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Zen+Dots&family=Michroma&family=IBM+Plex+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [ORG, { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: "Partner2B", publisher: { "@id": `${SITE}/#organization` } }] }} />
        <div className="ground">{children}</div>
      </body>
    </html>
  );
}
