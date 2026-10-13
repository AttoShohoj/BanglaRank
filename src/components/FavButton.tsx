"use client";
import { useEffect, useState } from "react";

export default function FavButton({ slug, save, saved }: { slug: string; save: string; saved: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try { setOn((JSON.parse(localStorage.getItem("br:favs") || "[]") as string[]).includes(slug)); } catch {}
  }, [slug]);
  const toggle = () => {
    try {
      const cur = JSON.parse(localStorage.getItem("br:favs") || "[]") as string[];
      const next = cur.includes(slug) ? cur.filter((x) => x !== slug) : [...cur, slug];
      localStorage.setItem("br:favs", JSON.stringify(next));
      setOn(next.includes(slug));
    } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={on}
      className={`rounded-full border px-3 py-1 text-sm ${on ? "border-brand bg-brand text-white" : "border-line bg-white"}`}>
      {on ? "★ " + saved : "☆ " + save}
    </button>
  );
}
