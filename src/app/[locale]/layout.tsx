// app/[locale]/layout.tsx
import { Suspense, type ReactNode } from "react";
import { locales, isLocale, type Locale } from "@/i18n";
import SetHtmlLang from "@/components/SetHtmlLang";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import CookieConsent from "@/components/privacy/CookieConsent";
import BackgroundVideo from "@/components/layout/BackgroundVideo";


// čistě statické chování pro tento segment
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): Array<{ locale: Locale }> {
  return locales.map((l) => ({ locale: l }));
}

type LayoutProps = {
  children: ReactNode;
  // v Next 15 je params Promise
  params: Promise<{ locale?: string }>;
};






export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw = "en" } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

 return (
  <div className="min-h-dvh flex flex-col bg-slate-950 text-slate-100 relative">
    {/* globální pozadí za vším */}
    <BackgroundVideo />

    <SetHtmlLang lang={locale} />

    {/* vlastní obsah, aby byl jistě nad pozadím */}
    <div className="relative z-10 flex min-h-dvh flex-col">
      <Suspense fallback={<div className="h-14" />}>
        <Nav locale={locale} />
      </Suspense>

      <main id="content" className="flex-1">
        {children}
      </main>

      <Suspense fallback={null}>
        <Footer locale={locale} />
      </Suspense>

      {/* Cookie banner je namountovaný globálně */}
      <Suspense fallback={null}>
        <CookieConsent locale={locale} />
      </Suspense>
    </div>
  </div>
);
}