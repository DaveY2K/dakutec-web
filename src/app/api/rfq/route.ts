// app/api/rfq/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "RFQ_TO_EMAIL",
] as const;

function ensureEnv() {
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

export async function POST(req: Request) {
  try {
    ensureEnv();

    const form = await req.formData();

    const name = (form.get("name") ?? "").toString().trim();
    const email = (form.get("email") ?? "").toString().trim();
    const phone = (form.get("phone") ?? "").toString().trim();
    const message = (form.get("message") ?? "").toString().trim();
    const locale = (form.get("locale") ?? "en").toString().trim() as
      | "cs"
      | "en"
      | "de";

    const files = form
      .getAll("files")
      .filter((v): v is File => v instanceof File && v.size > 0);

    // základní kontrola – RFQForm už validuje na frontendu, ale tady mít taky něco
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // 465 = SSL
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const subjectPrefix =
      locale === "cs"
        ? "[DK CAM Studio] Nová poptávka z webu"
        : locale === "de"
        ? "[DK CAM Studio] Neue Anfrage von der Website"
        : "[DK CAM Studio] New RFQ from website";

    const lines = [
      `Name: ${name}`,
      `E-mail: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      `Locale: ${locale}`,
      "",
      "Message:",
      message,
    ].filter(Boolean);

    // přílohy (STEP, PDF…) – převod File → Buffer
    const attachments =
      files.length > 0
        ? await Promise.all(
            files.map(async (file) => ({
              filename: file.name,
              content: Buffer.from(await file.arrayBuffer()),
              contentType: file.type || "application/octet-stream",
            })),
          )
        : [];

    await transporter.sendMail({
      from: `"DK CAM Studio" <${process.env.SMTP_USER!}>`,
      to: process.env.RFQ_TO_EMAIL!,
      replyTo: email,
      subject: subjectPrefix,
      text: lines.join("\n"),
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("RFQ API error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to send RFQ e-mail. Please try again later.",
      },
      { status: 500 },
    );
  }
}
