"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useContact } from "@/components/ContactProvider";
import { WhatsAppIcon } from "@/components/icons";
import { inputClass, makeReference, postEnquiry, SentPanel } from "@/components/forms/shared";
import type { SizingSummary } from "@/components/quote/QuoteProvider";

export interface EnquiryItem {
  name: string;
  model?: string;
  qty: number;
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; reference: string; whatsapp: string } | { kind: "error"; message: string };

const PURCHASE_TYPES = [
  { value: "small", label: "Small purchase", hint: "For a home, shop or office" },
  { value: "bulk", label: "Bulk purchase", hint: "Larger quantities, projects or resale" },
] as const;

/**
 * Contact form, or (mode="quote") the quote request: purchase type, installation need and the
 * sizing-calculator estimate travel with the request. No payment is taken on the website: the
 * team confirms prices and sends an invoice, and the conversation continues on WhatsApp.
 */
export function EnquiryForm({
  mode = "contact",
  items = [],
  sizing = null,
  onSent,
}: {
  mode?: "contact" | "quote";
  items?: EnquiryItem[];
  sizing?: SizingSummary | null;
  onSent?: () => void;
}) {
  const quote = mode === "quote";
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", message: "", website: "" });
  const [purchaseType, setPurchaseType] = useState<"small" | "bulk">("small");
  const [installation, setInstallation] = useState<"yes" | "no" | "unsure">("unsure");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { whatsappLink } = useContact();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const itemLines = items.map((i) => `- ${i.qty} × ${i.name}${i.model ? ` (${i.model})` : ""}`);
  const sizingLines = sizing
    ? [`Appliances: ${sizing.appliances.join(", ")}`, `Estimated load: ${sizing.loadKw} kW · Daily energy: ${sizing.dailyKwh} kWh · Battery share: ${sizing.batteryShare}%`]
    : [];
  const purchaseLabel = PURCHASE_TYPES.find((p) => p.value === purchaseType)!.label;
  const installationLabel = { yes: "Yes", no: "No", unsure: "Not sure yet" }[installation];

  const whatsappText = (reference?: string) =>
    [
      "Hello Africell Solar Aba,",
      quote ? `I'd like a quote${reference ? ` (ref ${reference})` : ""}.` : `I'd like to make an enquiry${reference ? ` (ref ${reference})` : ""}.`,
      quote && `Purchase type: ${purchaseLabel}`,
      quote && `Installation needed: ${installationLabel}`,
      itemLines.length > 0 && `\nProducts:\n${itemLines.join("\n")}`,
      sizingLines.length > 0 && `\nSizing estimate:\n${sizingLines.join("\n")}`,
      form.message && `\n${form.message}`,
      form.name && `\nName: ${form.name}`,
      form.location && `Location: ${form.location}`,
    ]
      .filter(Boolean)
      .join("\n");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const reference = makeReference(quote ? "Q" : "E");
    try {
      await postEnquiry({
        ...form,
        items,
        requestType: quote ? "quote" : "contact",
        reference,
        details: quote
          ? { "Purchase type": purchaseLabel, "Installation needed": installationLabel, ...(sizingLines.length ? { "Sizing estimate": sizingLines.join(" | ") } : {}) }
          : {},
      });
      setStatus({ kind: "sent", reference, whatsapp: whatsappLink(whatsappText(reference)) });
      onSent?.();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return quote ? (
      <SentPanel
        reference={status.reference}
        title="Quote request received"
        steps={[
          "Continue on WhatsApp with our customer care team. Your quote details are already filled in.",
          "We confirm current prices, availability and any installation, and agree the details with you.",
          "We send you an invoice. Once payment is confirmed, we arrange pickup or delivery.",
        ]}
        note={<>No payment is made on this website. You only pay against the official invoice sent by our team. Always quote your reference <b>{status.reference}</b>.</>}
        whatsappHref={status.whatsapp}
        whatsappLabel="Continue on WhatsApp with customer care"
      />
    ) : (
      <SentPanel
        reference={status.reference}
        title="Message received"
        steps={["Continue on WhatsApp for the fastest reply, or wait for our team to contact you, usually within one business day."]}
        whatsappHref={status.whatsapp}
        whatsappLabel="Continue on WhatsApp"
      />
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      {quote && (
        <fieldset className="sm:col-span-2">
          <legend className="text-[14px] font-semibold">Type of purchase</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {PURCHASE_TYPES.map((p) => (
              <label
                key={p.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4 ring-1 transition-shadow ${purchaseType === p.value ? "ring-2 ring-brand" : "ring-line hover:ring-slate-300"}`}
              >
                <input type="radio" name="purchaseType" value={p.value} checked={purchaseType === p.value} onChange={() => setPurchaseType(p.value)} className="mt-1 accent-[var(--color-brand)]" />
                <span>
                  <span className="block text-[15px] font-semibold">{p.label}</span>
                  <span className="block text-[13px] text-muted">{p.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className="text-[14px] font-semibold">
        Full name <span className="text-sun-2">*</span>
        <input required autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        Phone / WhatsApp <span className="text-sun-2">*</span>
        <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="080..." value={form.phone} onChange={set("phone")} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        Email <span className="font-normal text-muted">(optional)</span>
        <input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        {quote ? "Delivery / installation location" : "Location"} <span className="font-normal text-muted">(optional)</span>
        <input autoComplete="address-level2" placeholder="e.g. Ogbor Hill, Aba" value={form.location} onChange={set("location")} className={inputClass} />
      </label>

      {quote && (
        <label className="text-[14px] font-semibold sm:col-span-2">
          Do you need installation?
          <select value={installation} onChange={(e) => setInstallation(e.target.value as typeof installation)} className={inputClass}>
            <option value="unsure">Not sure yet, please advise</option>
            <option value="yes">Yes, I need installation</option>
            <option value="no">No, I have my own installer</option>
          </select>
        </label>
      )}

      <label className="text-[14px] font-semibold sm:col-span-2">
        {quote ? "Anything else we should know?" : "What would you like to power?"} <span className="font-normal text-muted">(optional)</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={set("message")}
          className={`${inputClass} h-auto py-3`}
          placeholder={quote ? "e.g. delivery date, budget, other products you need" : "Tell us about your appliances, building or any questions"}
        />
      </label>
      {/* Honeypot: hidden from people, filled by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden />

      {status.kind === "error" && (
        <p role="alert" className="rounded-xl bg-sun-50 px-4 py-3 text-[14px] text-amber-900 sm:col-span-2">
          {status.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" disabled={status.kind === "sending"} className="btn btn-sun flex-1 disabled:opacity-70">
          {status.kind === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          {quote ? "Send quote request" : "Send enquiry"}
        </button>
        <a href={whatsappLink(whatsappText())} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp flex-1">
          <WhatsAppIcon className="size-4" /> Send via WhatsApp instead
        </a>
      </div>
      <p className="text-[12.5px] text-muted sm:col-span-2">
        {quote && "No payment is taken on this website: our team sends you an invoice. "}
        We use your details only to respond to your request. See our <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
