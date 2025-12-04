"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export default function ActiveLink({
  href,
  exact,
  className,
  children,
}: PropsWithChildren<{ href: string; exact?: boolean; className?: string }>) {
  const pathname = usePathname() || "/";
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const base = "btn";
  const active = isActive ? " bg-white/10" : "";
  const extra = className ? ` ${className}` : "";
  return (
    <Link
      href={href}
      className={base + active + extra}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive ? "true" : undefined}
    >
      {children}
    </Link>
  );
}
