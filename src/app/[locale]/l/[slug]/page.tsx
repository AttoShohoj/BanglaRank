import Link from "next/link";
import { notFound } from "next/navigation";
import { listings } from "@/lib/fixtures";
import { getDict, type Locale } from "@/i18n/dictionaries";

export default function Detail({ params }: { params: { locale: Locale; slug: string } }) {
  const l = params.locale;
  const d = getDict(l);
  const x = listings.find((i) => i.slug === params.slug);
  if (!x) notFound();
  return (
    <article className="space-y-3">
      <Link href={`/${l}/search`} className="underline">{d.back}</Link>
      <h1 className="text-3xl font-bold">{x.name[l]}</h1>
      <dl className="rounded border border-line bg-white p-4">
        <dt className="font-semibold">{d.price}</dt>
        <dd>{x.price === "free" ? d.free : x.price === "paid" ? d.paid : d.priceUnknown}</dd>
        <dt className="mt-2 font-semibold">{d.mode}</dt>
        <dd>{x.online ? d.online : d.offline}</dd>
        <dt className="mt-2 font-semibold">{d.source}</dt>
        <dd>{d.fixture}</dd>
        <dt className="mt-2 font-semibold">{d.checked}</dt>
        <dd>{d.notChecked}</dd>
      </dl>
    </article>
  );
}
