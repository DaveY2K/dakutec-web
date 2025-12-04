// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tady můžeš logovat do Sentry apod.
    // console.error(error);
  }, [error]);

  return (
    <main className="container-app py-16">
  <div className="container-app">
    …
  </div>
</main>
  );
}
