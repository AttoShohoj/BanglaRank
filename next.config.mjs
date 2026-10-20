/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/bn", permanent: false },
      ...["admin", "search", "map", "compare", "assistant"].map((p) => ({ source: `/${p}`, destination: `/bn/${p}`, permanent: false })),
    ];
  },
};
export default nextConfig;
