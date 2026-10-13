import Link from "next/link";
import { categories } from "@/lib/fixtures";
import { divisions, getDict, type Locale } from "@/i18n/dictionaries";

export default function Home({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const d = getDict(l);
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold md:text-4xl">{d.tagline}</h1>
        <p className="mt-2 text-lg">{d.sub}</p>
        <form action={`/${l}/search`} className="mt-6 grid gap-3 md:grid-cols-[1fr_14rem_auto]" role="search">
          <label className="block">
            <span className="sr-only">{d.search}</span>
            <input name="q" placeholder={d.placeholder} className="w-full rounded border border-line bg-white px-3 py-3" />
          </label>
          <label className="block">
            <span className="sr-only">{d.location}</span>
            <select name="division" className="w-full rounded border border-line bg-white px-3 py-3" defaultValue="">
              <option value="">{d.allBd}</option>
              {divisions.map((v) => <option key={v.en} value={v.en}>{v[l]}</option>)}
            </select>
          </label>
          <button className="rounded bg-brand px-6 py-3 font-semibold text-white">{d.search}</button>
        </form>
        <p className="mt-2 text-sm">{d.locNote}</p>
      </section>

      <section aria-labelledby="cats">
        <h2 id="cats" className="text-xl font-bold">{d.categories}</h2>
        <p className="text-sm">{d.catNote}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/${l}/search?cat=${c.slug}`} className="inline-block rounded-full border border-line bg-white px-4 py-2 hover:border-brand">{c[l]}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded border border-line bg-white p-5" aria-labelledby="ai">
        <h2 id="ai" className="text-xl font-bold">{d.aiTitle}</h2>
        <p>{d.aiBody}</p>
      </section>
    </div>
  );
}
