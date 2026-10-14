"use client";

import { useState } from "react";
import { Loader2, Wrench } from "lucide-react";
import { useContact } from "@/components/ContactProvider";
import { waMessage } from "@/config/site";
import { inputClass, makeReference, postEnquiry, SentPanel } from "@/components/forms/shared";

const PRODUCTS = ["Inverter", "Lithium battery", "Solar panels", "Complete solar system", "Other / not sure"];
const URGENCY = [
  { value: "routine", label: "Routine maintenance / check-up" },
  { value: "issue", label: "Fault, but the system still works" },
  { value: "urgent", label: "Urgent: the system is down" },
] as const;

/** Maintenance & repair request: stored with the other enquiries, then handed to the technical team on WhatsApp. */
export function MaintenanceForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    product: defaultProduct || PRODUCTS[3],
    model: "",
    boughtFromUs: "Yes",
    urgency: "issue" as (typeof URGENCY)[number]["value"],
    preferredDate: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<{ kind: "idle" | "sending" } | { kind: "sent"; reference: string; whatsapp: string } | { kind: "error"; message: string }>({ kind: "idle" });
  const { whatsappLink } = useContact();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const urgencyLabel = URGENCY.find((u) => u.value === form.urgency)!.label;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) {
      setStatus({ kind: "error", message: "Please describe the problem or the service you need." });
      return;
    }
    setStatus({ kind: "sending" });
    const reference = makeReference("M");
    const details = {
      Product: form.product,
      "Model / serial": form.model || "Not given",
      "Bought from us": form.boughtFromUs,
      Urgency: urgencyLabel,
      "Preferred visit date": form.preferredDate || "Flexible",
    };
    try {
      await postEnquiry({ name: form.name, phone: form.phone, email: form.email, location: form.location, message: form.message, website: form.website, requestType: "maintenance", reference, details });
      const text = waMessage(
        "maintenance",
        `I need maintenance / repair (ref ${reference}).`,
        ...Object.entries(details).map(([k, v]) => `${k}: ${v}`),
        `\nProblem: ${form.message}`,
        `\nName: ${form.name}`,
        form.location && `Location: ${form.location}`,
      );
      setStatus({ kind: "sent", reference, whatsapp: whatsappLink(text) });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <SentPanel
        reference={status.reference}
        title="Service request received"
        steps={[
          "Continue on WhatsApp with our technical team. Your request details are already filled in.",
          "A technician reviews the problem, may ask for photos or a short video, and confirms a visit time.",
          "Any charges for the visit, parts or labour are agreed with you first and invoiced by our team.",
        ]}
        note={<>Have your invoice or proof of purchase ready if the product may be under warranty. Quote your reference <b>{status.reference}</b>.</>}
        whatsappHref={status.whatsapp}
        whatsappLabel="Continue on WhatsApp with the technical team"
      />
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <label className="text-[14px] font-semibold">
        What needs attention? <span className="text-sun-2">*</span>
        <select value={form.product} onChange={set("product")} className={inputClass}>
          {PRODUCTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="text-[14px] font-semibold">
        Model or serial number <span className="font-normal text-muted">(optional)</span>
        <input value={form.model} onChange={set("model")} placeholder="e.g. LFP-512200" className={inputClass} />
      </label>

      <fieldset className="sm:col-span-2">
        <legend className="text-[14px] font-semibold">How urgent is it?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {URGENCY.map((u) => (
            <label key={u.value} className={`flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-[14px] ring-1 ${form.urgency === u.value ? (u.value === "urgent" ? "ring-2 ring-sun-2" : "ring-2 ring-brand") : "ring-line hover:ring-slate-300"}`}>
              <input type="radio" name="urgency" value={u.value} checked={form.urgency === u.value} onChange={() => setForm((f) => ({ ...f, urgency: u.value }))} className="accent-[var(--color-brand)]" />
              {u.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="text-[14px] font-semibold sm:col-span-2">
        Describe the problem or service needed <span className="text-sun-2">*</span>
        <textarea rows={4} value={form.message} onChange={set("message")} className={`${inputClass} h-auto py-3`} placeholder="e.g. Inverter beeps and shows an error, battery not charging, routine panel cleaning…" />
      </label>

      <label className="text-[14px] font-semibold">
        Bought from Africell Solar Aba?
        <select value={form.boughtFromUs} onChange={set("boughtFromUs")} className={inputClass}>
          <option>Yes</option>
          <option>No</option>
          <option>Not sure</option>
        </select>
      </label>
      <label className="text-[14px] font-semibold">
        Preferred visit date <span className="font-normal text-muted">(optional)</span>
        <input type="date" value={form.preferredDate} onChange={set("preferredDate")} className={inputClass} />
      </label>

      <label className="text-[14px] font-semibold">
        Full name <span className="text-sun-2">*</span>
        <input required autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        Phone / WhatsApp <span className="text-sun-2">*</span>
        <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="080..." value={form.phone} onChange={set("phone")} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        Address / area <span className="font-normal text-muted">(optional)</span>
        <input autoComplete="street-address" placeholder="e.g. Faulks Road, Aba" value={form.location} onChange={set("location")} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        Email <span className="font-normal text-muted">(optional)</span>
        <input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden />

      {status.kind === "error" && (
        <p role="alert" className="rounded-xl bg-sun-50 px-4 py-3 text-[14px] text-amber-900 sm:col-span-2">
          {status.message}
        </p>
      )}

      <button type="submit" disabled={status.kind === "sending"} className="btn btn-sun sm:col-span-2 disabled:opacity-70">
        {status.kind === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Wrench className="size-4" aria-hidden />}
        Request a technician
      </button>
      <p className="text-[12.5px] text-muted sm:col-span-2">
        We use your details only to arrange your service visit. See our <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
