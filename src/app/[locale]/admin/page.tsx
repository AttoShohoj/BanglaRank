import AdminClient from "./AdminClient";
import { getCategories, getLocations } from "@/lib/db";
import { getDict, type Locale } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | BanglaRank", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: { locale: Locale } }) {
  const [cats, locations] = await Promise.all([getCategories(), getLocations()]);
  return <AdminClient cats={cats.map((c) => ({ slug: c.slug, name: c.name.bn }))} locations={locations} locale={params.locale} d={getDict(params.locale)} />;
}
