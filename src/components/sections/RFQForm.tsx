// src/components/sections/RFQForm.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import type { Locale } from "@/i18n";
import RfqButton from "@/components/ui/RfqButton";
type RfqDict = {
  title?: string;
  note?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  files?: string;
  submit?: string;
  success?: string;  // obecná success hláška
  error?: string;    // obecná error hláška
  // volitelné jemnější řetězce (když nejsou, vezme se rfq.error / fallbacky)
  errors?: {
    required?: string;
    email?: string;
    details?: string;
    fileLimit?: string;
    sendFailed?: string;
  };
  ui?: {
    sending?: string;
    drag?: string;
    maxFilesNotice?: string;
  };
};

type Props = { locale: Locale; t?: RfqDict };

type FieldKey = "name" | "email" | "message" | "phone";
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function RFQForm({ locale, t }: Props) {
  const rfq = t ?? {};

  // --- zprávy ze slovníku (bezpečné fallbacky) ---
  const E = {
    required: rfq.errors?.required ?? rfq.error ?? "Please fill required fields",
    email: rfq.errors?.email ?? rfq.error ?? "Invalid email",
    details: rfq.errors?.details ?? rfq.error ?? "Please add details",
    fileLimit: rfq.errors?.fileLimit ?? rfq.error ?? "Too many files or file too large.",
    sendFailed: rfq.errors?.sendFailed ?? rfq.error ?? "Sending failed. Please try again.",
  };
  const UI = {
    sending: rfq.ui?.sending ?? "Sending…",
    drag: rfq.ui?.drag ?? "Drag & drop files here or click to choose",
    maxFilesNotice: rfq.ui?.maxFilesNotice ?? "Max 5 files, up to 15 MB each.",
  };

  // schéma MUSÍ používat lokalizované texty
  const Schema = z.object({
    name: z.string().min(2, E.required),
    email: z.string().email(E.email),
    message: z.string().min(5, E.details),
    phone: z.string().optional(),
  });

  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [fail, setFail] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [fileNames, setFileNames] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(null);
    setFail(null);
    setFieldErrors({});
    setSending(true);

    try {
      const fd = new FormData(e.currentTarget);

      const parsed = Schema.safeParse({
        name: (fd.get("name") ?? "").toString(),
        email: (fd.get("email") ?? "").toString(),
        message: (fd.get("message") ?? "").toString(),
        phone: fd.get("phone") ? fd.get("phone")!.toString() : undefined,
      });

      if (!parsed.success) {
        const errs: FieldErrors = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as FieldKey;
          if (!errs[key]) errs[key] = issue.message;
        }
        setFieldErrors(errs);
        setSending(false);
        return;
      }

      // soubory – limit 5×15MB
      const files = (fd.getAll("files") as File[]).filter(Boolean);
      if (files.length > 5 || files.some((f) => f.size > 15 * 1024 * 1024)) {
        setFail(E.fileLimit);
        setSending(false);
        return;
      }

      // odeslání na API
      const res = await fetch("/api/rfq", { method: "POST", body: fd });
      const data: unknown = await res.json().catch(() => ({}));

      if (!res.ok || !(data as { ok?: boolean })?.ok) {
        throw new Error("SEND_FAILED");
      }

      setOk(rfq.success ?? "Thanks! We’ll get back to you.");
      (e.target as HTMLFormElement).reset();
      setFileNames("");
    } catch {
      setFail(E.sendFailed);
    } finally {
      setSending(false);
    }
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.currentTarget.files ?? []);
    setFileNames(files.map((f) => f.name).join(", "));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6">
      {rfq.note && <p className="muted mb-4">{rfq.note}</p>}

      <div className="grid gap-3">
        <label className="block">
          <span className="muted text-sm">{rfq.name ?? "Full name"}</span>
          <input
            name="name"
            className="input mt-1"
            aria-invalid={!!fieldErrors.name}
            disabled={sending}
            required
          />
          {fieldErrors.name && <p className="help mt-1">{fieldErrors.name}</p>}
        </label>

        <label className="block">
          <span className="muted text-sm">{rfq.email ?? "Email"}</span>
          <input
            name="email"
            type="email"
            className="input mt-1"
            aria-invalid={!!fieldErrors.email}
            disabled={sending}
            required
          />
          {fieldErrors.email && <p className="help mt-1">{fieldErrors.email}</p>}
        </label>

        <label className="block">
          <span className="muted text-sm">{rfq.phone ?? "Phone"}</span>
          <input
            name="phone"
            className="input mt-1"
            aria-invalid={!!fieldErrors.phone}
            disabled={sending}
            placeholder="+420…"
          />
          {fieldErrors.phone && <p className="help mt-1">{fieldErrors.phone}</p>}
        </label>

        <label className="block">
          <span className="muted text-sm">
            {rfq.message ?? "Message / specifications"}
          </span>
          <textarea
            name="message"
            className="textarea mt-1"
            aria-invalid={!!fieldErrors.message}
            disabled={sending}
            required
          />
          {fieldErrors.message && (
            <p className="help mt-1">{fieldErrors.message}</p>
          )}
        </label>

        {/* Files */}
        <div className="mt-2">
          <span className="muted text-sm">
            {rfq.files ?? "Attachments (STEP/PDF etc.)"}
          </span>
          <label className="dropzone mt-2 block cursor-pointer">
            <input
              type="file"
              name="files"
              multiple
              hidden
              onChange={onFilesChange}
              disabled={sending}
            />
            <span>{fileNames || UI.drag}</span>
          </label>
          <p className="help mt-1">{UI.maxFilesNotice}</p>
        </div>

        <div className="mt-4 flex items-center gap-3">
    <RfqButton
  type="submit"
  label={t?.submit ?? "Request a Quote (RFQ)"}
  className="w-full sm:w-auto"
 />

          {ok && <span className="help" role="status">{ok}</span>}
          {fail && <span className="help" role="alert">{fail}</span>}
        </div>
      </div>

      <input type="hidden" name="locale" value={locale} />
    </form>
  );
}
