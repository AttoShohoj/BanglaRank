// DEV FIXTURES: এগুলো আসল ব্যবসা বা তথ্য নয়। Phase 2-তে ডাটাবেজ দিয়ে বদলানো হবে।
export type Listing = {
  slug: string; category: string; name: { bn: string; en: string };
  price: "free" | "paid" | "unknown"; online: boolean;
};
export const categories = [
  { slug: "products", bn: "পণ্য", en: "Products" },
  { slug: "services", bn: "সেবা", en: "Services" },
  { slug: "free-tools", bn: "ফ্রি টুল", en: "Free tools" },
  { slug: "places", bn: "জায়গা", en: "Places" },
  { slug: "public-info", bn: "সরকারি তথ্য", en: "Public information" },
  { slug: "education", bn: "শিক্ষা", en: "Education" },
];
export const listings: Listing[] = [
  { slug: "sample-product", category: "products", name: { bn: "নমুনা পণ্য (পরীক্ষামূলক)", en: "Sample product (test)" }, price: "unknown", online: true },
  { slug: "sample-service", category: "services", name: { bn: "নমুনা সেবা (পরীক্ষামূলক)", en: "Sample service (test)" }, price: "paid", online: false },
  { slug: "sample-free-tool", category: "free-tools", name: { bn: "নমুনা ফ্রি টুল (পরীক্ষামূলক)", en: "Sample free tool (test)" }, price: "free", online: true },
];
