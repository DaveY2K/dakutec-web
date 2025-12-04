// src/components/ui/Section.tsx
import type { ReactNode } from "react";
import type { Locale } from "@/i18n";

type SectionProps = {
  children: ReactNode;
  className?: string;
  locale?: Locale; // volitelné, ať to nevyžaduje Services apod.
  t?: unknown;
};

export default function Section({ children, className }: SectionProps) {
  return (
    <section className={["container-app py-12", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
