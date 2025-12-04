// src/components/sections/Section.tsx
import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  as?: "h1" | "h2";           // kvůli SEO: na stránce použij jednou h1, jinde h2
  eyebrow?: string;           // volitelný horní proužek (CNC • CAD/CAM)
  title: string;
   intro?: string;
  subtitle?: string;
  className?: string;         // extra třídy na <section>
  children?: ReactNode;
};

export default function Section({
  id,
  as = "h1",
  eyebrow,
  title,
  subtitle,
  className = "",
  children,
}: SectionProps) {
  const As = as;

  return (
    <section id={id} className={`container-app py-12 md:py-16 ${className}`}>
      {/* Hlavička sekce – sjednocená pro všechny stránky */}
      <header>
        {eyebrow && (
          <p className="muted mb-2 pl-3 border-l-2 border-[rgb(var(--brand))] shimmer uppercase tracking-wider text-xs sm:text-[0.8rem]">
            {eyebrow}
          </p>
        )}

        <As className="font-semibold tracking-tight text-[rgb(var(--fg))] text-3xl sm:text-4xl">
          {title}
        </As>

        {subtitle && (
          <p className="muted mt-2 max-w-[65ch]">{subtitle}</p>
        )}
      </header>

      {/* Tělo sekce */}
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}
