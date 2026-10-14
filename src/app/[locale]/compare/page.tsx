import Link from "next/link";
import { getCategories, getListingsBySlugs, titleOf } from "@/lib/db";
import { getDict, type Locale } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function Compare({ params, searchParams }: { params: { locale: Locale }; searchParams: { id?: string | string[] } }) {
  const l = params.locale;
  const d = getDict(l);
  const ids = ([] as string[]).concat(searchParams.id ?? []).slice(0, 3);
  const items = await getListingsBySlugs(ids);
  const cats = await getCategories();
  if (items.length < 2) {
    return (
      <div className="rounded-2xl border border-line p-6">
        <h1 className="text-2xl font-bold">{d.navCompare}</h1>
        <p className="mt-2">{d.compareNone}</p>
        <Link href={`/${l}/search`} className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-white">{d.navSearch}</Link>
      </div>
    );
  }
  const price = (p: string) => (p === "free" ? d.free : p === "paid" ? d.paid : p === "freemium" ? d.freemium : d.priceUnknown);
  const rows: [string, (x: (typeof items)[number]) => string][] = [
    [d.category, (x) => x.listing_categories.map((lc) => cats.find((c) => c.slug === lc.categories?.slug)?.name[l]).filter(Boolean).join(", ") || "-"],
    [d.price, (x) => price(x.price_type)],
    [d.mode, (x) => (x.is_online ? d.online : d.offline)],
    [d.source, (x) => x.sources?.name ?? d.noSource],
    [d.checked, (x) => (x.last_checked_at ? new Date(x.last_checked_at).toLocaleDateString(l === "bn" ? "bn-BD" : "en-GB") : d.notChecked)],
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{d.navCompare}</h1>
      <p className="text-sm text-ink/70">{d.compareNote}</p>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left">
          <thead className="bg-[#F4F6F3]"><tr>
            <th className="p-3">{d.attribute}</th>
            {items.map((x) => <th key={x.slug} className="p-3"><Link href={`/${l}/l/${x.slug}`} className="text-brand underline">{titleOf(x, l)}</Link></th>)}
          </tr></thead>
          <tbody>{rows.map(([label, fn]) => (
            <tr key={label} className="border-t border-line"><th scope="row" className="p-3 font-semibold">{label}</th>
              {items.map((x) => <td key={x.slug} className="p-3">{fn(x)}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
