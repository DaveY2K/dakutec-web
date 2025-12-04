"use client";
import { useEffect, useRef } from "react";

export function useScrollShadow() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      ref.current.classList.toggle("scrolled", window.scrollY > 6);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}
