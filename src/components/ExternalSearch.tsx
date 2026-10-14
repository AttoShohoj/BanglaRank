import { externalProviders } from "@/lib/external";
import type { Dict } from "@/i18n/dictionaries";

export default function ExternalSearch({ q, d }: { q: string; d: Dict }) {
  const groups: [string, "engines" | "markets" | "social" | "maps"][] = [
    [d.grpEngines, "engines"], [d.grpMarkets, "markets"], [d.grpSocial, "social"], [d.grpMaps, "maps"],
  ];
  return (
    <aside className="mt-8 rounded-2xl bg-[#F4F6F3] p-5" aria-label={d.extTitle}>
      <h2 className="font-bold">{d.extTitle}</h2>
      <p className="text-sm text-ink/70">{d.extIntro}</p>
      {groups.map(([title, g]) => (
        <div key={g} className="mt-3">
          <p className="text-sm font-semibold">{title}</p>
          <ul className="mt-1 flex flex-wrap gap-2 text-sm">
            {externalProviders.filter((p) => p.group === g).map((p) => (
              <li key={p.id}>
                <a href={p.url(q)} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-line bg-white px-4 py-2 hover:border-brand">{p.label} ↗</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
