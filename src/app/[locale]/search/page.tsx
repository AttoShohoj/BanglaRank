import Link from "next/link";
import ExternalSearch from "@/components/ExternalSearch";
import FavButton from "@/components/FavButton";
import { db, getCategories, searchListings, titleOf } from "@/lib/db";
import { getDict, type Locale } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";
type SP = { q?: string; cat?: string; price?: string; mode?: string; division?: string; sort?: string };

export default async function Search({ params, searchParams }: { params: { locale: Locale }; searchParams: SP }) {
  const l = params.locale;
  const d = getDict(l);
  const cats = await getCategories();
  let found = await searchListings((searchParams.q ?? "").trim(), searchParams.cat || null);
  if (searchParams.price) found = found.filter((x) => x.price_type === searchParams.price);
  if (searchParams.mode) found = found.filter((x) => x.is_online === (searchParams.mode === "online"));
  if (searchParams.sort === "name") found.sort((a, b) => titleOf(a, l).localeCompare(titleOf(b, l), l));
  const f = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2";
  const priceText = (p: string) => (p === "free" ? d.free : p === "paid" ? d.paid : p === "freemium" ? d.freemium : d.priceUnknown);
  return (
    <div className="grid gap-8 md:grid-cols-[15rem_1fr]">
      <form className="h-fit space-y-3 rounded-2xl bg-[#F4F6F3] p-4" aria-label={d.filters}>
        <h2 className="text-lg font-bold">{d.filters}</h2>
        <input type="hidden" name="division" value={searchParams.division ?? ""} />
        <label className="block text-sm">{d.search}<input name="q" defaultValue={searchParams.q} className={f} /></label>
        <label className="block text-sm">{d.categories}
          <select name="cat" defaultValue={searchParams.cat ?? ""} className={f}>
            <option value="">{d.any}</option>
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name[l]}</option>)}
          </select></label>
        <label className="block text-sm">{d.price}
          <select name="price" defaultValue={searchParams.price ?? ""} className={f}>
            <option value="">{d.any}</option><option value="free">{d.free}</option><option value="paid">{d.paid}</option><option value="freemium">{d.freemium}</option>
          </select></label>
        <label className="block text-sm">{d.mode}
          <select name="mode" defaultValue={searchParams.mode ?? ""} className={f}>
            <option value="">{d.any}</option><option value="online">{d.online}</option><option value="offline">{d.offline}</option>
          </select></label>
        <label className="block text-sm">{d.sort}
          <select name="sort" defaultValue={searchParams.sort ?? ""} className={f}>
            <option value="">{d.relevance}</option><option value="name">{d.byName}</option>
          </select></label>
        <button className="w-full rounded-full bg-brand px-4 py-2 font-semibold text-white">{d.apply}</button>
      </form>

      <section aria-live="polite">
        <h1 className="text-2xl font-bold">{d.results} ({found.length})</h1>
        {!db && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-amber-900">{d.dbOff}</p>}
        {found.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-line p-6">
            <p className="font-semibold">{d.none}</p><p>{d.noneHelp}</p>
          </div>
        ) : (
          <form action={`/${l}/compare`} className="mt-4">
            <ul className="space-y-3">
              {found.map((x) => (
                <li key={x.slug} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
                  <input type="checkbox" name="id" value={x.slug} aria-label={`${d.navCompare}: ${titleOf(x, l)}`} className="mt-2 h-5 w-5" />
                  <div className="flex-1">
                    <Link href={`/${l}/l/${x.slug}`} className="text-lg font-semibold text-brand hover:underline">{titleOf(x, l)}</Link>
                    <p className="text-sm text-ink/70">{priceText(x.price_type)} · {x.is_online ? d.online : d.offline} · {d.source}: {x.sources?.name ?? d.noSource}</p>
                  </div>
                  <FavButton slug={x.slug} save={d.save} saved={d.saved} />
                </li>
              ))}
            </ul>
            <div className="sticky bottom-3 mt-4 flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-white">
              <span className="text-sm">{d.compareHelp}</span>
              <button className="rounded-full bg-white px-4 py-1 font-semibold text-ink">{d.compareBtn}</button>
            </div>
          </form>
        )}
        {(searchParams.q ?? "").trim() && <ExternalSearch q={(searchParams.q ?? "").trim()} d={d} />}
      </section>
    </div>
  );
}
