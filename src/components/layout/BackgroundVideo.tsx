// src/components/layout/BackgroundVideo.tsx
"use client";

import { useEffect, useState } from "react";

export default function BackgroundVideo() {
  const [enabled, setEnabled] = useState(false);

  // respektuje prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) {
      setEnabled(true);
    }
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {/* video na pozadí – hlavně po stranách */}
      <video
        className="hidden h-full w-full object-cover opacity-35 blur-sm lg:block"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/media/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ztmavený střed, aby obsah byl dobře čitelný */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.0)_0,_rgba(0,0,0,0.85)_55%,_rgba(0,0,0,1)_100%)]" />

      {/* jemné překryvy po stranách, aby panely plynule navazovaly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[rgb(var(--bg))] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[rgb(var(--bg))] via-transparent to-transparent" />
    </div>
  );
}