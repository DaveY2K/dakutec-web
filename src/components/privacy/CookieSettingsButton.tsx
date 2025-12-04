// src/components/privacy/CookieSettingsButton.tsx
"use client";

import { Cookie } from "lucide-react";

type Props = {
  label?: string;              // z i18n slovníku
  variant?: "icon" | "pill";
};

export default function CookieSettingsButton({
  label,
  variant = "icon",
}: Props) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-cookie-banner"));
    }
  };

  const showLabel = variant === "pill";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        variant === "pill"
          ? "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          : [
              "inline-flex items-center justify-center",
              "rounded-full border border-white/15",
              "bg-zinc-900/80",
              "p-2.5",
              "shadow-md shadow-cyan-500/20",
              "hover:shadow-cyan-400/40 hover:border-cyan-300",
              "hover:bg-zinc-900",
              "hover:-translate-y-0.5",
              "transition-transform duration-150"
            ].join(" ")
      }
      aria-label={label ?? "Cookie settings"}
    >
      <Cookie className="h-4 w-4" aria-hidden="true" />
      {showLabel && (
        <span className="whitespace-nowrap text-xs text-zinc-300">
          {label}
        </span>
      )}
    </button>
  );
}
