import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://banglarank.vercel.app";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/search", "/map", "/compare", "/assistant"].flatMap((p) => ["bn", "en"].map((l) => ({ url: `${base}/${l}${p}` })));
  const { data } = db ? await db.from("listings").select("slug, created_at").eq("status", "published") : { data: [] };
  const rows = (data ?? []) as { slug: string; created_at: string }[];
  return [...pages, ...rows.flatMap((r) => ["bn", "en"].map((l) => ({ url: `${base}/${l}/l/${r.slug}`, lastModified: r.created_at })))];
}
