"use client";
import { useState } from "react";
import type { Dict, Locale } from "@/i18n/dictionaries";
import type { Loc } from "@/lib/db";

export default function LocationPicker({ locations, locale, d, initial }: { locations: Loc[]; locale: Locale; d: Dict; initial?: string }) {
  const byId = new Map(locations.map((x) => [x.id, x]));
  const chain = (id?: string) => { const out: Loc[] = []; let c = id ? byId.get(id) : undefined; while (c) { out.unshift(c); c = c.parent_id ? byId.get(c.parent_id) : undefined; } return out; };
  const start = chain(initial);
  const [div, setDiv] = useState(start.find((x) => x.level === "division")?.id ?? "");
  const [dist, setDist] = useState(start.find((x) => x.level === "district")?.id ?? "");
  const [upz, setUpz] = useState(start.find((x) => x.level === "upazila")?.id ?? "");
  const name = (x: Loc) => (locale === "bn" ? x.name_bn ?? x.name_en : x.name_en ?? x.name_bn) ?? "";
  const list = (level: string, parent: string) => locations.filter((x) => x.level === level && (level === "division" || x.parent_id === parent)).sort((a, b) => name(a).localeCompare(name(b), locale));
  const cls = "w-full rounded-full bg-[#F4F6F3] px-4 py-3";
  return (
    <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
      <input type="hidden" name="loc" value={upz || dist || div} />
      <label><span className="sr-only">{d.location}</span>
        <select value={div} onChange={(e) => { setDiv(e.target.value); setDist(""); setUpz(""); }} className={cls}>
          <option value="">{d.allBd}</option>{list("division", "").map((x) => <option key={x.id} value={x.id}>{name(x)}</option>)}</select></label>
      <label><span className="sr-only">{d.district}</span>
        <select value={dist} disabled={!div} onChange={(e) => { setDist(e.target.value); setUpz(""); }} className={cls}>
          <option value="">{d.allDistricts}</option>{div && list("district", div).map((x) => <option key={x.id} value={x.id}>{name(x)}</option>)}</select></label>
      <label><span className="sr-only">{d.upazila}</span>
        <select value={upz} disabled={!dist} onChange={(e) => setUpz(e.target.value)} className={cls}>
          <option value="">{d.allUpazilas}</option>{dist && list("upazila", dist).map((x) => <option key={x.id} value={x.id}>{name(x)}</option>)}</select></label>
      <button type="button" onClick={() => { setDiv(""); setDist(""); setUpz(""); }} className="rounded-full border border-line px-4 py-3 text-sm">{d.resetLoc}</button>
    </div>
  );
}
