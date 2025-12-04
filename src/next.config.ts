// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

function fromEnvCSV(name: string): string[] {
  return (process.env[name] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** ===== CSP zásady (rozšiřitelné přes env proměnné) ===== */
const SCRIPT_SRC = [
  "'self'",
  "'unsafe-inline'",
  // v devu povolíme eval kvůli React Fast Refresh / HMR
  ...(isProd ? [] : ["'unsafe-eval'"]),
  ...fromEnvCSV("NEXT_PUBLIC_CSP_SCRIPT"),
];

const STYLE_SRC = [
  "'self'",
  "'unsafe-inline'",
  ...fromEnvCSV("NEXT_PUBLIC_CSP_STYLE"),
];

const IMG_SRC = [
  "'self'",
  "data:",
  "blob:",
  // když budeš chtít povolit obecně i externí obrázky v <img>, přidej "https:"
  ...fromEnvCSV("NEXT_PUBLIC_CSP_IMG"),
];

const FONT_SRC = ["'self'", "data:", ...fromEnvCSV("NEXT_PUBLIC_CSP_FONT")];

const CONNECT_SRC = [
  "'self'",
  // Vercel Web Vitals / Analytics (pokud používáš)
  "https://vitals.vercel-insights.com",
  // v devu povolíme websockety a localhost
  ...(isProd ? [] : ["ws:", "http://localhost:*"]),
  ...fromEnvCSV("NEXT_PUBLIC_CSP_CONNECT"),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /** ===== i18n + domain-based routing ===== */
  i18n: {
    locales: ["cs", "en", "de"],
    defaultLocale: "en",
    domains: [
      { domain: "dakutec.cz", defaultLocale: "cs" },
      { domain: "www.dakutec.cz", defaultLocale: "cs" },
      { domain: "dakutec.com", defaultLocale: "en" },
      { domain: "www.dakutec.com", defaultLocale: "en" },
      // { domain: "dakutec.de", defaultLocale: "de" },
    ],
  },

  /** ===== Image optimizer (ponecháno default, klidně rozšiř) ===== */
  images: {
    formats: ["image/avif", "image/webp"],
    // remotePatterns: [] // až budeš brát obrázky z cizích domén, přidej sem
  },

  /** ===== Redirecty: www → apex ===== */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.dakutec.cz" }],
        destination: "https://dakutec.cz/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.dakutec.com" }],
        destination: "https://dakutec.com/:path*",
        permanent: true,
      },
    ];
  },

  /** ===== Bezpečnostní hlavičky včetně CSP ===== */
  async headers() {
    const csp = [
      `default-src 'self'`,
      `script-src ${SCRIPT_SRC.join(" ")}`,
      `style-src ${STYLE_SRC.join(" ")}`,
      `img-src ${IMG_SRC.join(" ")}`,
      `font-src ${FONT_SRC.join(" ")}`,
      `connect-src ${CONNECT_SRC.join(" ")}`,
      `frame-src 'none'`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      // volitelně – v prod prostředí přinutí HTTPS i pro externí zdroje
      ...(isProd ? [`upgrade-insecure-requests`] : []),
    ].join("; ");

    const headers = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      // zapni až bude web běžet **trvale na HTTPS** (Vercel prod)
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
    ];

    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
