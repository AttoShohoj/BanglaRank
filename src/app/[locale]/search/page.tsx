import Link from "next/link";
import { categories, listings } from "@/lib/fixtures";
import { getDict, type Locale } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";

type SP = { q?: string; cat?: string; price?: string; mode?: string; division?: string };

export default function Search({ params, searchParams }: { params: { locale: Locale }; searchParams: SP }) {
  const l = params.locale;
  const d = getDict(l);
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const found = listings.filter((x) =>
    (!q || x.name.bn.toLowerCase().includes(q) || x.name.en.toLowerCase().includes(q)) &&
    (!searchParams.cat || x.category === searchParams.cat) &&
    (!searchParams.price || x.price === searchParams.price) &&
    (!searchParams.mode || (searchParams.mode === "online") === x.online)
  );
  const sel = "w-full rounded border border-line bg-white px-3 py-2";
  return (
    <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
      <form className="space-y-3" aria-label={d.filters}>
        <h2 className="text-lg font-bold">{d.filters}</h2>
        <input type="hidden" name="division" value={searchParams.division ?? ""} />
        <label className="block"><span>{d.search}</span>
          <input name="q" defaultValue={searchParams.q} className={sel} /></label>
        <label className="block"><span>{d.categories}</span>
          <select name="cat" defaultValue={searchParams.cat ?? ""} className={sel}>
            <option value="">{d.any}</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c[l]}</option>)}
          </select></label>
        <label className="block"><span>{d.price}</span>
          <select name="price" defaultValue={searchParams.price ?? ""} className={sel}>
            <option value="">{d.any}</option><option value="free">{d.free}</option><option value="paid">{d.paid}</option>
          </select></label>
        <label className="block"><span>{d.mode}</span>
          <select name="mode" defaultValue={searchParams.mode ?? ""} className={sel}>
            <option value="">{d.any}</option><option value="online">{d.online}</option><option value="offline">{d.offline}</option>
          </select></label>
        <button className="rounded bg-brand px-4 py-2 font-semibold text-white">{d.apply}</button>
      </form>

      <section aria-live="polite">
        <h1 className="text-2xl font-bold">{d.results} ({found.length})</h1>
        {found.length === 0 ? (
          <div className="mt-4 rounded border border-line bg-white p-5">
            <p className="font-semibold">{d.none}</p><p>{d.noneHelp}</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {found.map((x) => (
              <li key={x.slug} className="rounded border border-line bg-white p-4">
                <Link href={`/${l}/l/${x.slug}`} className="text-lg font-semibold text-brand underline">{x.name[l]}</Link>
                <p className="text-sm">
                  {x.price === "free" ? d.free : x.price === "paid" ? d.paid : d.priceUnknown} · {x.online ? d.online : d.offline} · {d.source}: {d.fixture}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
