"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dict, Locale } from "@/i18n/dictionaries";

export default function Header({ locale, d }: { locale: Locale; d: Dict }) {
  const path = usePathname() || `/${locale}`;
  const rest = path.replace(/^\/(bn|en)/, "");
  const pill = (l: Locale) => `rounded-full px-3 py-1 ${l === locale ? "bg-brand text-white" : "text-ink hover:bg-[#E8F3EE]"}`;
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-brand">BanglaRank</Link>
        <nav aria-label="Main" className="hidden gap-5 text-sm font-semibold sm:flex">
          <Link href={`/${locale}/search`}>{d.navSearch}</Link>
          <Link href={`/${locale}/map`}>{d.navMap}</Link>
          <Link href={`/${locale}/compare`}>{d.navCompare}</Link>
        </nav>
        <nav aria-label="Language" className="flex gap-1 rounded-full border border-line p-1 text-sm">
          <Link href={`/bn${rest}`} lang="bn" aria-current={locale === "bn"} className={pill("bn")}>বাংলা</Link>
          <Link href={`/en${rest}`} lang="en" aria-current={locale === "en"} className={pill("en")}>English</Link>
        </nav>
      </div>
    </header>
  );
}
