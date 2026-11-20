/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/post", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
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
