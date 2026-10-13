// DEV FIXTURES: আসল ব্যবসা বা তথ্য নয়। Phase 2-তে ডাটাবেজ দিয়ে বদলানো হবে।
export type Listing = {
  slug: string; category: string; name: { bn: string; en: string };
  price: "free" | "paid" | "unknown"; online: boolean;
};
export const categories = [
  { slug: "products", icon: "🛍️", bn: "পণ্য", en: "Products" },
  { slug: "services", icon: "🛠️", bn: "সেবা", en: "Services" },
  { slug: "free-tools", icon: "💡", bn: "ফ্রি টুল", en: "Free tools" },
  { slug: "places", icon: "📍", bn: "জায়গা", en: "Places" },
  { slug: "public-info", icon: "🏛️", bn: "সরকারি তথ্য", en: "Public information" },
  { slug: "education", icon: "🎓", bn: "শিক্ষা", en: "Education" },
];
const mk = (n: number, category: string, price: Listing["price"], online: boolean): Listing => ({
  slug: `sample-${n}`, category, price, online,
  name: { bn: `নমুনা listing ${n} (পরীক্ষামূলক)`, en: `Sample listing ${n} (test)` },
});
export const listings: Listing[] = [
  mk(1, "products", "unknown", true), mk(2, "services", "paid", false), mk(3, "free-tools", "free", true),
  mk(4, "education", "free", true), mk(5, "places", "unknown", false), mk(6, "public-info", "free", true),
];
