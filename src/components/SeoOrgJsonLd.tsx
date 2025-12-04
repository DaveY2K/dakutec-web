// src/components/SeoOrgJsonLd.tsx
export default function SeoOrgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DK CAM Studio",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
    email: "mailto:davidkuhejda@gmail.com",
    telephone: "+420000000000",
    logo: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com") + "/logo.png",
    sameAs: [
      "https://github.com/…",
      "https://www.linkedin.com/in/…",
    ],
  };
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
