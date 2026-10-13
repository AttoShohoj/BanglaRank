import { getDict, type Locale } from "@/i18n/dictionaries";

export default function MapPage({ params }: { params: { locale: Locale } }) {
  const d = getDict(params.locale);
  const bbox = "88.0,20.5,92.7,26.7";
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{d.mapTitle}</h1>
      <p className="text-sm text-ink/70">{d.mapNote}</p>
      <iframe title={d.mapTitle} loading="lazy" className="h-[28rem] w-full rounded-2xl border border-line"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`} />
      <p className="text-sm">
        {d.mapCredit} ·{" "}
        <a className="text-brand underline" href="https://www.openstreetmap.org/?bbox=88.0,20.5,92.7,26.7" target="_blank" rel="noopener noreferrer">{d.openMap}</a>
      </p>
    </div>
  );
}
