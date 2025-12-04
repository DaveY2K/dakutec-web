"use client";
import { useScrollShadow } from "./useScrollShadow";

export default function HeaderWrap({ children }: { children: React.ReactNode }) {
  const ref = useScrollShadow();

  return (
    <header
      ref={ref}
      role="banner"
      className="navwrap overflow-visible z-40"
    >
      {children}
    </header>
  );
}
