// বাইরের সাইটের সার্চ লিংক। এগুলো শুধু লিংক; কোনো তথ্য কপি বা সংরক্ষণ করা হয় না।
// URL-এর গঠন সময়ের সাথে বদলাতে পারে; কাজ না করলে এখানে ঠিক করুন।
export type Ext = { id: string; label: string; group: "engines" | "markets" | "social" | "maps"; url: (q: string) => string };
const e = encodeURIComponent;
export const externalProviders: Ext[] = [
  { id: "google", label: "Google", group: "engines", url: (q) => `https://www.google.com/search?q=${e(q)}` },
  { id: "bing", label: "Bing", group: "engines", url: (q) => `https://www.bing.com/search?q=${e(q)}` },
  { id: "ddg", label: "DuckDuckGo", group: "engines", url: (q) => `https://duckduckgo.com/?q=${e(q)}` },
  { id: "gmaps", label: "Google Maps", group: "maps", url: (q) => `https://www.google.com/maps/search/${e(q)}` },
  { id: "osm", label: "OpenStreetMap", group: "maps", url: (q) => `https://www.openstreetmap.org/search?query=${e(q)}` },
  { id: "daraz", label: "Daraz", group: "markets", url: (q) => `https://www.daraz.com.bd/catalog/?q=${e(q)}` },
  { id: "bikroy", label: "Bikroy", group: "markets", url: (q) => `https://bikroy.com/en/ads?query=${e(q)}` },
  { id: "startech", label: "Star Tech", group: "markets", url: (q) => `https://www.startech.com.bd/product/search?search=${e(q)}` },
  { id: "ryans", label: "Ryans", group: "markets", url: (q) => `https://www.ryanscomputers.com/search?q=${e(q)}` },
  { id: "pickaboo", label: "Pickaboo", group: "markets", url: (q) => `https://www.pickaboo.com/search/?q=${e(q)}` },
  { id: "fbmarket", label: "Facebook Marketplace", group: "social", url: (q) => `https://www.facebook.com/marketplace/search/?query=${e(q)}` },
  { id: "fb", label: "Facebook", group: "social", url: (q) => `https://www.facebook.com/search/top?q=${e(q)}` },
  { id: "youtube", label: "YouTube", group: "social", url: (q) => `https://www.youtube.com/results?search_query=${e(q)}` },
];
