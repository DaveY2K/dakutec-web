// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await cookies();                         // 👈 await
  const lang = store.get("locale")?.value ?? "en";       // fallback


  
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
