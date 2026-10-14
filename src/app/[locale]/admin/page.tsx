import AdminClient from "./AdminClient";
import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | BanglaRank", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const cats = await getCategories();
  return <AdminClient cats={cats.map((c) => ({ slug: c.slug, name: c.name.bn }))} />;
}
