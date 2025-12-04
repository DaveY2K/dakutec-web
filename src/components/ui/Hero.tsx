// src/components/ui/Hero.tsx
import FadeUp from "@/components/ui/FadeUp";
import HeroBeam from "@/components/ui/HeroBeam";
import RfqButton from "@/components/ui/RfqButton";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

export default function Hero(p: Props) {
  return (
    <section className="container-app py-16 md:py-24 beam">
      {/* kurzorový efekt */}
      <HeroBeam />

      {/* skleněný panel + jemná mřížka */}
      <div className="panel pattern-card">
        <div className="relative z-10 mx-auto max-w-3xl p-8 sm:p-12,panel pattern-card">
          <FadeUp>
            {p.eyebrow && (
              <p className="muted mb-3 pl-3 border-l-2 border-[rgb(var(--brand))] shimmer uppercase tracking-wider text-[0.8rem], ">
                {p.eyebrow}
              </p>
            )}

            {p.title && (
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight text-[rgb(var(--fg))]">
                {p.title}
              </h1>
            )}

            {p.subtitle && <p className="mt-4 max-w-[65ch] muted">{p.subtitle}</p>}

            {(p.ctaPrimary || p.ctaSecondary) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {p.ctaPrimary && (
                  <RfqButton
                    href={p.ctaPrimary.href}
                    label={p.ctaPrimary.label}
                    size="lg"
                    variant="primary"      // hlavní CTA = plná
                  />
                )}
                {p.ctaSecondary && (
                  <RfqButton
                    href={p.ctaSecondary.href}
                    label={p.ctaSecondary.label}
                    size="lg"
                    variant="secondary"    // druhá CTA = outline
                  />
                )}
              </div>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
