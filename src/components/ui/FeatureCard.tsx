// src/components/ui/FeatureCard.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type FeatureCardProps = {
  /** Malý label nahoře (např. MATERIALS, CAM, Robotics & automation) */
  eyebrow?: string;
  /** Hlavní text / title karty */
  title: string;
  /** Popis / sekundární text */
  description?: string;
  /** Volitelný odkaz ve footru (např. "Service details") */
  href?: string;
  hrefLabel?: string;
  /** Extra obsah (ikonka apod.) */
  icon?: ReactNode;
  className?: string;
};

export default function FeatureCard({
  eyebrow,
  title,
  description,
  href,
  hrefLabel,
  icon,
  className,
}: FeatureCardProps) {
  const content = (
    <div
      className={clsx(
        "panel pattern-card h-full flex flex-col justify-between rounded-2xl p-5 sm:p-6",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[rgb(160,160,160)]">
          {icon && <span className="inline-flex items-center">{icon}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>

        <h3 className="text-base sm:text-lg font-semibold tracking-tight">
          {title}
        </h3>

        {description && (
          <p className="muted text-sm sm:text-[0.95rem] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {href && (
        <div className="mt-4 pt-3 border-t border-[rgb(var(--line))] text-sm">
          <span className="inline-flex items-center gap-1 text-[rgb(160,160,160)]">
            <span>{hrefLabel ?? "Details"}</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))] rounded-2xl"
      >
        {content}
      </Link>
    );
  }

  return content;
}
