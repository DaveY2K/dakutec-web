// app/robots.ts
import type { MetadataRoute } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: [`${SITE}/sitemap.xml`],
    host: SITE,
  };
}
