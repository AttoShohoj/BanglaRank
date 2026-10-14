import Link from "next/link";
import { getCategories, icons } from "@/lib/db";
import { divisions, getDict, type Locale } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: { locale: Locale } }) {
  const l = params.locale;
  const d = getDict(l);
  const categories = await getCategories();
  const feats = [
    { href: "map", t: d.featMap, b: d.featMapBody, i: "🗺️" },
    { href: "compare", t: d.featCompare, b: d.featCompareBody, i: "⚖️" },
    { href: "search", t: d.featSave, b: d.featSaveBody, i: "⭐" },
  ];
  return (
    <div className="space-y-14">
      <section className="rounded-3xl bg-gradient-to-br from-[#E8F3EE] via-white to-[#F1F7FB] px-5 py-12 text-center md:px-12 md:py-16">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{d.tagline}</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-ink/70">{d.sub}</p>
        <form action={`/${l}/search`} role="search" className="mx-auto mt-8 grid max-w-3xl gap-2 rounded-3xl bg-white p-2 shadow-lg ring-1 ring-line md:grid-cols-[1fr_12rem_auto] md:rounded-full">
          <label><span className="sr-only">{d.search}</span>
            <input name="q" placeholder={d.placeholder} className="w-full rounded-full px-5 py-3 outline-none" /></label>
          <label><span className="sr-only">{d.location}</span>
            <select name="division" defaultValue="" className="w-full rounded-full bg-[#F4F6F3] px-4 py-3">
              <option value="">{d.allBd}</option>
              {divisions.map((v) => <option key={v.en} value={v.en}>{v[l]}</option>)}
            </select></label>
          <button className="rounded-full bg-brand px-8 py-3 font-semibold text-white hover:opacity-90">{d.search}</button>
        </form>
        <p className="mt-3 text-sm text-ink/60">{d.locNote}</p>
      </section>

      <section aria-labelledby="cats">
        <h2 id="cats" className="text-2xl font-bold">{d.categories}</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/${l}/search?cat=${c.slug}`} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm hover:border-brand hover:shadow-md">
                <span className="text-2xl" aria-hidden>{icons[c.slug] ?? "📂"}</span><span className="font-semibold">{c.name[l]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {feats.map((f) => (
          <Link key={f.href + f.t} href={`/${l}/${f.href}`} className="rounded-2xl bg-[#F4F6F3] p-5 hover:bg-[#E8F3EE]">
            <span className="text-2xl" aria-hidden>{f.i}</span>
            <h3 className="mt-2 font-bold">{f.t}</h3><p className="text-sm text-ink/70">{f.b}</p>
          </Link>
        ))}
      </section>

      <section aria-labelledby="ai" className="rounded-2xl border border-dashed border-line p-5">
        <h2 id="ai" className="font-bold">{d.aiTitle}</h2><p className="text-ink/70">{d.aiBody}</p>
        <Link href={`/${l}/assistant`} className="mt-2 inline-block rounded-full bg-brand px-5 py-2 font-semibold text-white">{d.navAssistant}</Link>
      </section>
    </div>
  );
}
