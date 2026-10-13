/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/bn", permanent: false }];
  },
};
export default nextConfig;
