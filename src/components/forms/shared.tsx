"use client";

import { useEffect } from "react";
import { CheckCircle2, FileText } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

/** Shared input styling for the site's forms. */
export const inputClass =
  "mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-[15px] ring-1 ring-line outline-none transition-shadow focus:ring-2 focus:ring-brand";

/** Short reference the customer and team can quote on WhatsApp and on the invoice, e.g. Q-1014-4821. */
export function makeReference(prefix: "Q" | "M" | "E") {
  const d = new Date();
  const mmdd = `${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `${prefix}-${mmdd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Sends a form to /api/enquiry; resolves when stored, throws a friendly message otherwise. */
export async function postEnquiry(body: Record<string, unknown>) {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, sourcePage: window.location.pathname }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
}

/**
 * Confirmation after a request is stored: shows the reference, explains what happens next,
 * and hands the customer over to WhatsApp (automatically, with a button as fallback).
 */
export function SentPanel({
  reference,
  title,
  steps,
  whatsappHref,
  whatsappLabel,
  note,
}: {
  reference: string;
  title: string;
  steps: string[];
  whatsappHref: string;
  whatsappLabel: string;
  note?: React.ReactNode;
}) {
  const external = whatsappHref.startsWith("http");

  // Take the customer straight into the WhatsApp chat once a real number is configured.
  useEffect(() => {
    if (!external) return;
    const t = setTimeout(() => window.location.assign(whatsappHref), 2500);
    return () => clearTimeout(t);
  }, [external, whatsappHref]);

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-green-200 sm:p-8" role="status">
      <div className="flex items-start gap-4">
        <CheckCircle2 className="size-10 shrink-0 text-green-600" aria-hidden />
        <div>
          <p className="font-display text-xl font-bold">{title}</p>
          <p className="mt-1 text-[14.5px] text-muted">
            Your reference: <span className="rounded-md bg-mist px-2 py-0.5 font-mono font-bold text-ink">{reference}</span>
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-ink/80">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-bold text-white">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {note && (
        <div className="mt-6 flex gap-3 rounded-xl bg-sun-50 p-4 text-[14px] leading-relaxed text-amber-900">
          <FileText className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div>{note}</div>
        </div>
      )}

      <a href={whatsappHref} {...(external ? { rel: "noopener noreferrer" } : {})} className="btn btn-whatsapp mt-6 w-full">
        <WhatsAppIcon className="size-4" /> {whatsappLabel}
      </a>
      {external && <p className="mt-2 text-center text-[12.5px] text-muted">Opening WhatsApp…</p>}
    </div>
  );
}
