import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import CookieSettingsButton  from "@/components/privacy/CookieSettingsButton";



const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DK CAM Studio",
  url: SITE,
  logo: `${SITE}/favicon.ico`,
  sameAs: [] as string[],
};
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />



type Props = { locale: Locale };

export default async function Footer({ locale }: Props) {
  const t = await getDictionary(locale);
  const year = new Date().getFullYear();

  const brand = t.meta?.title ?? "DK CAM Studio";
  const tagline = t.meta?.description ?? "CNC • CAD/CAM • Prototyping • Toolpath Optimization";

  return (
    <footer className="border-t border-[rgb(var(--line))] mt-16">
      <div className="container-app py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href={`/${locale}`} className="font-semibold text-lg">
            {brand}
          </Link>
          <p className="mt-3 muted">{tagline}</p>

          <div className="mt-5 flex gap-3">
            <a
              href="mailto:davidkuhejda@gmail.com"
              className="btn"
              aria-label={t.footer?.social?.email ?? "Email"}
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">{t.footer?.social?.email ?? "Email"}</span>
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label={t.footer?.social?.github ?? "GitHub"}
            >
              <FaGithub className="h-4 w-4" />
              <span className="hidden sm:inline">{t.footer?.social?.github ?? "GitHub"}</span>
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label={t.footer?.social?.linkedin ?? "LinkedIn"}
            >
              <FaLinkedin className="h-4 w-4" />
              <span className="hidden sm:inline">{t.footer?.social?.linkedin ?? "LinkedIn"}</span>
            </a>

            <a
              href="https://wa.me/420000000000" // TODO: doplň číslo v E.164 BEZ plus
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label={t.footer?.social?.whatsapp ?? "WhatsApp"}
            >
              <FaWhatsapp className="h-4 w-4" />
              <span className="hidden sm:inline">{t.footer?.social?.whatsapp ?? "WhatsApp"}</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-medium">{t.footer?.links ?? "Links"}</h4>
          <ul className="space-y-2 muted">
            <li><Link href={`/${locale}/services`}>{t.footer?.services ?? "Services"}</Link></li>
            <li><Link href={`/${locale}/rfq`}>{t.ctaRfq.buttonLabel ?? "Request a Quote"}</Link></li>
            <li><Link href={`/${locale}/contact`}>{t.footer?.contact ?? "Contact"}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-medium">{t.footer?.legal ?? "Legal"}</h4>
          <ul className="space-y-2 muted">
            <li><Link href={`/${locale}/privacy`}>{t.privacy?.title ?? "Privacy"}</Link></li>
            <li><Link href={`/${locale}/terms`}>{t.terms?.title ?? "Terms"}</Link></li>
          </ul>
        </div>
      </div>


<p className="text-sm text-slate-400">
  {/* …ostatní texty… */}
  
  <CookieSettingsButton label="Nastavení cookies" />
</p>

      <div className="border-t border-[rgb(var(--line))]">
        <div className="container-app py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs muted">
            © {year} {brand}. {t.footer?.rights ?? "All rights reserved."}
          </p>
          <p className="text-xs muted">
            {t.footer?.madeby ?? "Made by"} DK.
          </p>
        </div>
      </div>
    </footer>
  );
}
