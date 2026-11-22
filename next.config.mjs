/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: { "/api/program-builder": ["./node_modules/pdfkit/**/*", "./node_modules/@react-pdf/**/*"], "/api/playbook": ["./private/**/*"] },
  async redirects() {
    return [
      { source: "/blog", destination: "/post", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/list-program", destination: "/submit", permanent: true },
      { source: "/form", destination: "/submit", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/post/direct-vs.-sales-best-model-for-b2b-growth", destination: "/post/direct-vs.-indirect-sales-best-model-for-b2b-growth", permanent: true },
      { source: "/post/direct-vs-indirect-sales-best-model-for-b2b-growth", destination: "/post/direct-vs.-indirect-sales-best-model-for-b2b-growth", permanent: true },
      { source: "/post/41-must-know-facts-above-partnerships-that-every-founder-will-love", destination: "/post/41-must-know-facts-about-partnerships-that-every-founder-will-love", permanent: true },
      { source: "/post/the-best-places-to-find-partners-and-what-most-platforms-get-wrong", destination: "/post/the-best-places-to-find-b2b-partners-and-what-most-platforms-get-wrong", permanent: true },
      { source: "/post/the-importance-of-b2b-partnerships-for-growth", destination: "/post/the-importance-of-b2b-partnerships-for-business-growth", permanent: true },
      { source: "/post/your-guide-to-market-development-funds-mdf", destination: "/post/your-guide-to-marketing-development-funds-mdf", permanent: true },
      { source: "/post/revolut-spain-integrates-bizum-reaches-3-5-million-customers", destination: "/post", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "hub.partner2b.com" }],
        destination: "https://partner2b.com/directory",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
