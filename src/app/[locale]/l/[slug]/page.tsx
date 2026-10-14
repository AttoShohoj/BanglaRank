import Link from "next/link";
import { notFound } from "next/navigation";
import { descOf, getListingsBySlugs, titleOf } from "@/lib/db";
import { getDict, type Locale } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function Detail({ params }: { params: { locale: Locale; slug: string } }) {
  const l = params.locale;
  const d = getDict(l);
  const [x] = await getListingsBySlugs([params.slug]);
  if (!x) notFound();
  const price = x.price_type === "free" ? d.free : x.price_type === "paid" ? d.paid : x.price_type === "freemium" ? d.freemium : d.priceUnknown;
  return (
    <article className="space-y-4">
      <Link href={`/${l}/search`} className="underline">{d.back}</Link>
      <h1 className="text-3xl font-bold">{titleOf(x, l)}</h1>
      {descOf(x, l) && <p className="text-lg">{descOf(x, l)}</p>}
      {x.official_url && (
        <a href={x.official_url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-brand px-5 py-2 font-semibold text-white">{d.openSite}</a>
      )}
      <dl className="rounded-2xl border border-line bg-white p-4">
        <dt className="font-semibold">{d.price}</dt><dd>{price}</dd>
        <dt className="mt-2 font-semibold">{d.mode}</dt><dd>{x.is_online ? d.online : d.offline}</dd>
        <dt className="mt-2 font-semibold">{d.source}</dt><dd>{x.sources?.name ?? d.noSource}</dd>
        <dt className="mt-2 font-semibold">{d.checked}</dt>
        <dd>{x.last_checked_at ? new Date(x.last_checked_at).toLocaleDateString(l === "bn" ? "bn-BD" : "en-GB") : d.notChecked}</dd>
      </dl>
    </article>
  );
}
