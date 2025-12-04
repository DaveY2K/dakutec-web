// src/components/Nav.tsx
import Link from "next/link";
import ActiveLink from "@/components/ActiveLink";
import LangSwitch from "@/components/LangSwitch";
import { getDictionary, type Locale } from "@/i18n";
import HeaderWrap from "@/components/nav/HeaderWrap";
import MobileMenu from "@/components/nav/MobileMenu";
import RfqButton from "@/components/ui/RfqButton";

export default async function Nav({ locale }: { locale: Locale }) {
  const t = await getDictionary(locale);

  const lblHome     = t.nav?.home     ?? "Home";
  const lblServices = t.nav?.services ?? "Services";
  const lblRfq      = t.nav?.rfq      ?? "RFQ";
  const lblContact  = t.nav?.contact  ?? "Contact";
  const brand = (t.meta?.title && t.meta.title.split(" — ")[0]) || "DK CAM Studio";

  const rfqLabel = t.ctaRfq?.buttonLabel ?? lblRfq;

  const labels = { home: lblHome, services: lblServices, rfq: lblRfq, contact: lblContact };

  return (
    <HeaderWrap>
      <div
        className="container-app h-14 flex items-center justify-between
                   supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80
                   text-slate-100 border-b border-white/10 backdrop-blur"
      >
        {/* Brand / logo */}
        <Link
          href={`/${locale}`}
          className="font-semibold tracking-tight truncate max-w-[60%] md:max-w-none"
          aria-label={brand}
        >
          {brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <ActiveLink href={`/${locale}`} exact>{lblHome}</ActiveLink>
          <ActiveLink href={`/${locale}/services`}>{lblServices}</ActiveLink>
          <ActiveLink href={`/${locale}/contact`}>{lblContact}</ActiveLink>

          <LangSwitch locale={locale} />

          {/* RFQ jako jediná primární CTA na desktopu */}
          <RfqButton
            href={`/${locale}/rfq`}
            label={rfqLabel}
            size="sm"
            variant="primary"
            className="ml-1"
          />
        </nav>

        {/* Mobile menu (tlačítko RFQ řeší MobileMenu uvnitř) */}
        <div className="md:hidden">
          <MobileMenu
            locale={locale}
            labels={labels}
            langSwitch={<LangSwitch locale={locale} />}
          />
        </div>
      </div>
    </HeaderWrap>
  );
}
