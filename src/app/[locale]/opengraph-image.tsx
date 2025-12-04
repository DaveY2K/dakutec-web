// app/[[locale]]/opengraph-image.tsx   (pokud je locale volitelné)
// nebo
// app/[locale]/opengraph-image.tsx     (pokud je povinné)

import { ImageResponse } from "next/og";
import { getDictionary, type Locale } from "@/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: { locale?: string }; // ⬅️ NE Promise
}) {
  const locale: Locale = (params?.locale ?? "en") as Locale; // ⬅️ bez await
  const t = await getDictionary(locale);

  const eyebrow = t.hero?.eyebrow ?? "CNC • CAD/CAM";
  const title = t.meta?.title ?? "DK CAM Studio";
  const subtitle =
    t.meta?.ogSubtitle ??
    t.meta?.description ??
    "Precision machining • Custom CAM";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(180deg,#0b1220,#0f0f13)",
          color: "white",
          fontSize: 68,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, Segoe UI, Roboto",
          position: "relative",
        }}
      >
        {/* jemná „toolpath“ záře */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(800px 400px at 20% -10%, rgba(39,199,217,.18), transparent), radial-gradient(900px 480px at 120% 0%, rgba(39,199,217,.10), transparent)",
          }}
        />
        <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 16 }}>
          {eyebrow}
        </div>
        <div style={{ lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.8 }}>
          {subtitle}
        </div>
      </div>
    ),
    { width: size.width, height: size.height }
  );
}
