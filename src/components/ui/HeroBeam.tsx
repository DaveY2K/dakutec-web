"use client";
import { useEffect } from "react";

/** Přidá CSS proměnné --mx/--my podle pozice kurzoru (v %) */
export default function HeroBeam() {
  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      root.style.setProperty("--mx", `${x}%`);
      root.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}
