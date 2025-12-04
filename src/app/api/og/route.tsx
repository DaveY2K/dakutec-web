// app/api/og/route.ts
import { ImageResponse } from "next/og";
export const runtime = "edge";

// ⚠️ Ulož si soubor "Inter-SemiBold.ttf" do stejné složky jako tento route.ts
// (app/api/og/Inter-SemiBold.ttf), ať je bundlovaný aplikací.
const interFont = fetch(
  new URL("./Inter-SemiBold.ttf", import.meta.url)
).then(res => res.arrayBuffer()).catch(() => undefined);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "DK CAM Studio").slice(0, 100);
  const fontData = await interFont;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(180deg,#0b1220,#0f0f13)",
          color: "white",
        }}
      >
        {/* cyan „toolpath“ záře */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(800px 400px at 20% -10%, rgba(39,199,217,.18), transparent), radial-gradient(900px 480px at 120% 0%, rgba(39,199,217,.10), transparent)",
          }}
        />

        <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 16 }}>
          CNC • CAD/CAM
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>
          {title}
        </div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.8 }}>
          Precision machining • CAM programming
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Připojíme font (pokud by chyběl, jede to i bez něj)
      fonts: fontData
        ? [{ name: "Inter", data: fontData, weight: 600, style: "normal" }]
        : [],
    }
  );
}
