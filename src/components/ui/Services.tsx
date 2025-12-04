// src/components/ui/Services.tsx
import Link from "next/link";

type Locale = "cs" | "en" | "de";

type Item = {
  title?: string;
  description?: string;
  slug?: string; // volitelný slug pro detail
  href?: string; // přímý link má přednost
};

const MORE_FALLBACK: Record<Locale, string> = {
  cs: "Detail služby →",
  en: "View details →",
  de: "Mehr Details →",
};

export default function Services({
  title,
  intro,
  items,
  locale,
  moreLabel,
}: {
  title?: string;
  intro?: string;
  items: Item[];
  locale?: Locale;
  /** Volitelné přepsání textu „více“ */
  moreLabel?: string;
}) {
  if (!items || items.length === 0) return null;

  const more = moreLabel || (locale ? MORE_FALLBACK[locale] : "Learn more →");

  return (
    <section className="container-app py-12">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {intro && <p className="muted mt-2">{intro}</p>}

      <ul role="list" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const safeSlug = it.slug?.toString().trim();
          const href =
            it.href ??
            (locale && safeSlug
              ? `/${locale}/services/${encodeURIComponent(safeSlug)}`
              : undefined);

          const key = it.slug || it.title || String(i);
          const label = `${it.title ?? ""} — ${more}`.trim();
          const isLink = Boolean(href);

          return (
            <li key={key} className="h-full">
              <div
                className={[
    "panel pattern pattern-card",
    "relative h-full p-5 sm:p-6 group transition",
    "border border-[rgb(var(--line))]",
    "hover:border-[rgb(var(--brand))]/50",
    "focus-within:border-[rgb(var(--brand))]/70",
  ].join(" ")}
              >





                
                {it.title && (
                  <h3 className="font-medium text-[rgb(var(--fg))]">
                    {it.title}
                  </h3>
                )}

                {it.description && (
                  <p className="mt-1 muted">{it.description}</p>
                )}

                {isLink && (
                  <>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 group-hover:text-slate-200">
                      <span>{more}</span>
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* stretched-link: celá karta je klikací */}
                    <Link
                      href={href!}
                      aria-label={label}
                      className="absolute inset-0 rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))]/60"
                    />
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
