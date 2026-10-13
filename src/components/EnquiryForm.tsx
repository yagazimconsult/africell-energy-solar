"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

export interface EnquiryItem {
  name: string;
  model?: string;
  qty: number;
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function EnquiryForm({ items = [], onSent, submitLabel = "Send enquiry" }: { items?: EnquiryItem[]; onSent?: () => void; submitLabel?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const whatsappText = () => {
    const parts = [
      "Hello Africell Solar Aba,",
      items.length ? `I'd like a quote for:\n${items.map((i) => `- ${i.qty} × ${i.name}${i.model ? ` (${i.model})` : ""}`).join("\n")}` : "I'd like to make an enquiry.",
      form.message && `\n${form.message}`,
      form.name && `\nName: ${form.name}`,
      form.location && `Location: ${form.location}`,
    ];
    return parts.filter(Boolean).join("\n");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus({ kind: "sent" });
      onSent?.();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center ring-1 ring-green-200">
        <CheckCircle2 className="mx-auto size-10 text-green-600" aria-hidden />
        <p className="mt-4 font-display text-xl font-bold">Thank you, we have received your request</p>
        <p className="mt-2 text-muted">Our Aba team will contact you shortly, usually within one business day.</p>
      </div>
    );
  }

  const input = "mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-[15px] ring-1 ring-line outline-none transition-shadow focus:ring-2 focus:ring-brand";

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <label className="text-[14px] font-semibold">
        Full name <span className="text-sun-2">*</span>
        <input required autoComplete="name" value={form.name} onChange={set("name")} className={input} />
      </label>
      <label className="text-[14px] font-semibold">
        Phone / WhatsApp <span className="text-sun-2">*</span>
        <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="080..." value={form.phone} onChange={set("phone")} className={input} />
      </label>
      <label className="text-[14px] font-semibold">
        Email <span className="font-normal text-muted">(optional)</span>
        <input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={input} />
      </label>
      <label className="text-[14px] font-semibold">
        Location <span className="font-normal text-muted">(optional)</span>
        <input autoComplete="address-level2" placeholder="e.g. Ogbor Hill, Aba" value={form.location} onChange={set("location")} className={input} />
      </label>
      <label className="text-[14px] font-semibold sm:col-span-2">
        What would you like to power? <span className="font-normal text-muted">(optional)</span>
        <textarea rows={4} value={form.message} onChange={set("message")} className={`${input} h-auto py-3`} placeholder="Tell us about your appliances, building or any questions" />
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
          {submitLabel}
        </button>
        <a href={whatsappLink(whatsappText())} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp flex-1">
          <WhatsAppIcon className="size-4" /> Send via WhatsApp instead
        </a>
      </div>
      <p className="text-[12.5px] text-muted sm:col-span-2">
        We use your details only to respond to your enquiry. See our <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
