import "../globals.css";
import { Hind_Siliguri } from "next/font/google";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getDict, isLocale, locales } from "@/i18n/dictionaries";

const font = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata = { title: "BanglaRank", description: "Discovery platform for Bangladesh" };
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const d = getDict(params.locale);
  return (
    <html lang={params.locale} className={font.variable}>
      <body className="bg-white font-sans text-ink">
        <p className="bg-amber-50 px-4 py-1 text-center text-sm text-amber-900">{d.devBanner}</p>
        <Header locale={params.locale} d={d} />
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
