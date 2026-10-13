"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/dictionaries";

export default function Header({ locale }: { locale: Locale }) {
  const path = usePathname() || `/${locale}`;
  const rest = path.replace(/^\/(bn|en)/, "");
  const cls = (l: Locale) => `px-2 py-1 rounded ${l === locale ? "bg-brand text-white" : "underline"}`;
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="text-xl font-bold text-brand">BanglaRank</Link>
        <nav aria-label="Language" className="flex gap-1 text-sm">
          <Link href={`/bn${rest}`} lang="bn" aria-current={locale === "bn"} className={cls("bn")}>বাংলা</Link>
          <Link href={`/en${rest}`} lang="en" aria-current={locale === "en"} className={cls("en")}>English</Link>
        </nav>
      </div>
    </header>
  );
}
