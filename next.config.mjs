/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/post", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
    ];
  },
};
export default nextConfig;
