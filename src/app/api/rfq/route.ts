// src/app/api/rfq/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const runtime = "nodejs";
export const preferredRegion = ["fra1"]; // Frankfurt (EU)

export const runtime = "nodejs";
export const preferredRegion = "fra1";


// jednoduché escapování textu pro HTML
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isFileLike(value: FormDataEntryValue): value is File {
  if (typeof value === "string") return false; // tady se union zúží na File
  return typeof value.arrayBuffer === "function" && typeof value.name === "string";
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");
    const locale = String(formData.get("locale") ?? "en");

    // --- Soubory z FormData ----------------------------------------------
    const entries = formData.getAll("files"); // (string | File)[]
    const files = entries.filter(isFileLike);

    const attachments = await Promise.all(
      files.map(async (file, index) => {
        const buf = Buffer.from(await file.arrayBuffer());
        const filename = file.name?.trim()
          ? file.name
          : `attachment-${index + 1}.bin`;

        return {
          filename,
          content: buf,
          contentType: file.type || "application/octet-stream",
        };
      }),
    );

    // --- Nodemailer transport --------------------------------------------
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to =
      process.env.RFQ_TO_EMAIL || process.env.SMTP_USER || "info@dakutec.com";

    if (!host || !user || !pass) {
      console.error("RFQ API error: missing SMTP env vars");
      return NextResponse.json(
        { ok: false, error: "SMTP config missing" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
      authMethod: "LOGIN",
  tls: { servername: host },
    });

    const subjectBase =
      locale === "cs"
        ? "Poptávka z webu"
        : locale === "de"
          ? "Anfrage von der Website"
          : "RFQ from website";

    const subject = `${subjectBase} – ${name || email || "unknown"}`;

    const textBody = [
      `${subjectBase}`,
      "",
      `Name:  ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      `Locale: ${locale}`,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const htmlBody = `
      <div style="background:#020617;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:720px;margin:0 auto;background:#020617;border-radius:16px;border:1px solid #1f2937;padding:24px;color:#e5e7eb;">
          <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;">
            ${esc(subjectBase)}
          </h1>
          <p style="margin:0 0 20px;color:#9ca3af;font-size:14px;">
            A new request for quote was submitted via the RFQ form on <strong>dakutec.com</strong>.
          </p>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>
              <tr>
                <td style="padding:6px 8px;color:#9ca3af;width:140px;">Name</td>
                <td style="padding:6px 8px;color:#e5e7eb;">${esc(name || "—")}</td>
              </tr>
              <tr>
                <td style="padding:6px 8px;color:#9ca3af;">Email</td>
                <td style="padding:6px 8px;color:#e5e7eb;">${esc(email || "—")}</td>
              </tr>
              <tr>
                <td style="padding:6px 8px;color:#9ca3af;">Phone</td>
                <td style="padding:6px 8px;color:#e5e7eb;">${esc(phone || "—")}</td>
              </tr>
              <tr>
                <td style="padding:6px 8px;color:#9ca3af;">Locale</td>
                <td style="padding:6px 8px;color:#e5e7eb;">${esc(locale)}</td>
              </tr>
              <tr>
                <td style="padding:6px 8px;color:#9ca3af;vertical-align:top;">Message</td>
                <td style="padding:6px 8px;color:#e5e7eb;white-space:pre-wrap;">${esc(
                  message || "—",
                )}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top:24px;color:#9ca3af;font-size:12px;line-height:1.5;">
            Attachments are included in this e-mail, if the customer uploaded any files (STEP, PDF, etc.).
          </p>

          <p style="margin-top:12px;color:#6b7280;font-size:11px;border-top:1px solid #1f2937;padding-top:12px;">
            This message was generated automatically by the RFQ form on dakutec.com.
          </p>
        </div>
      </div>
    `;

   await transporter.sendMail({
  from: `"DakuTec RFQ" <${user}>`,
  to,
  replyTo: email || undefined,
  subject,
  text: textBody,
  html: htmlBody,
  attachments,
});

return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    console.error("RFQ API error:", err);
    return NextResponse.json(
      { ok: false, error: "SEND_FAILED" },
      { status: 500 },
    );
  }
}
