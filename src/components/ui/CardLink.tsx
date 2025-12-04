// src/components/ui/CardLink.tsx
import Link from "next/link";
import * as React from "react";
import { cn } from "./cn";

type CardLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function CardLink({ href, className, children, ariaLabel }: CardLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "card-pro block transition group focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] ring-offset-2",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">{children}</div>
        <span
          aria-hidden
          className="opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition"
        >
          →
        </span>
      </div>
    </Link>
  );
}
