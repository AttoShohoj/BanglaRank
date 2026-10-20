import type { MetadataRoute } from "next";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://banglarank.vercel.app";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/bn/admin", "/en/admin", "/api/"] }], sitemap: `${base}/sitemap.xml` };
}
