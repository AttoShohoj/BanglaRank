import { createClient } from "@supabase/supabase-js";

// সেটিংয়ের ছোট ভুল (স্পেস, কোটেশন, https:// না থাকা, শেষে /) নিজে ঠিক করে নেয়।
const clean = (v?: string) => (v ?? "").trim().replace(/^["']|["']$/g, "").trim();
function normalizeUrl(v?: string): string | null {
  let u = clean(v).replace(/\/+$/, "");
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try { new URL(u); return u; } catch { return null; }
}
const url = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// ঠিকানা বা key ভুল হলে build ভাঙবে না; db = null হলে সাইট "ডাটাবেজ সংযুক্ত নয়" দেখাবে।
export const db = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export type Listing = {
  id: string; slug: string; title_bn: string | null; title_en: string | null;
  description_bn: string | null; description_en: string | null;
  price_type: "free" | "paid" | "freemium" | "unknown"; is_online: boolean;
  official_url: string | null; source_url: string | null; last_checked_at: string | null;
  sources: { name: string } | null;
  listing_categories: { categories: { slug: string } | null }[];
};
export type Category = { slug: string; name: { bn: string; en: string } };
export const icons: Record<string, string> = {
  products: "🛍️", services: "🛠️", "free-tools": "💡", places: "📍", "public-info": "🏛️", education: "🎓", healthcare: "🩺",
};
export const titleOf = (x: Listing, l: "bn" | "en") => (l === "bn" ? x.title_bn ?? x.title_en : x.title_en ?? x.title_bn) ?? x.slug;
export const descOf = (x: Listing, l: "bn" | "en") => (l === "bn" ? x.description_bn ?? x.description_en : x.description_en ?? x.description_bn);

export async function getCategories(): Promise<Category[]> {
  if (!db) return [];
  const { data, error } = await db.from("categories").select("slug, category_translations(locale, name)").eq("status", "active").order("slug");
  if (error || !data) return [];
  return (data as unknown as { slug: string; category_translations: { locale: "bn" | "en"; name: string }[] }[]).map((c) => {
    const n = (loc: "bn" | "en") => c.category_translations.find((t) => t.locale === loc)?.name ?? c.slug;
    return { slug: c.slug, name: { bn: n("bn"), en: n("en") } };
  });
}

const FULL = "*, sources(name), listing_categories(categories(slug))";
export async function getListingsBySlugs(slugs: string[]): Promise<Listing[]> {
  if (!db || slugs.length === 0) return [];
  const { data } = await db.from("listings").select(FULL).in("slug", slugs).eq("status", "published");
  const rows = (data ?? []) as unknown as Listing[];
  return slugs.map((s) => rows.find((r) => r.slug === s)).filter((r): r is Listing => !!r);
}
export async function searchListings(q: string, cat: string | null): Promise<Listing[]> {
  if (!db) return [];
  const { data, error } = await db.rpc("search_listings", { q, cat });
  if (error || !data) return [];
  return getListingsBySlugs((data as { slug: string }[]).map((r) => r.slug));
}
