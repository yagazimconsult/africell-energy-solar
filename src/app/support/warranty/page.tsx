import type { Metadata } from "next";
import { ClipboardCheck, FileCheck2, Phone, ShieldAlert } from "lucide-react";
import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Warranty & After-sales",
  description: "How warranty and after-sales support work for products bought from Africell Energy Solar, Aba.",
  alternates: { canonical: "/support/warranty" },
};

// TODO: replace with the confirmed warranty policy once terms are agreed with the supplier.
const steps = [
  { icon: FileCheck2, title: "Keep your invoice", text: "Your invoice records the product, serial number, date of purchase and the warranty terms that apply. You will need it for any claim." },
  { icon: ClipboardCheck, title: "Install correctly", text: "Use a qualified installer and configure your inverter with the battery's recommended settings. Incorrect installation can void the manufacturer's warranty." },
  { icon: Phone, title: "Contact us first", text: "If something isn't working, contact our Aba team with your invoice and a description or photos. We will diagnose and guide you through next steps." },
];

export default function WarrantyPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="Warranty & after-sales" intro="Buying from a local dealer means you have someone to call. Here is how support works." crumbs={[{ label: "Support", href: "/support" }, { label: "Warranty & after-sales" }]} />
      <section className="container-x max-w-5xl py-16 md:py-20">
        <div className="flex gap-4 rounded-2xl bg-sun-50 p-6 text-amber-900 ring-1 ring-amber-200/70">
          <ShieldAlert className="size-6 shrink-0" aria-hidden />
          <p className="text-[15px] leading-relaxed">
            Warranty periods differ by product and are set by the manufacturer. The exact terms for your purchase are confirmed in writing on your invoice. Ask us before you buy if you would like to see them.
          </p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="card p-7">
              <div className="flex items-center justify-between">
                <s.icon className="size-7 text-brand" aria-hidden />
                <span className="font-display text-3xl font-extrabold text-line">0{i + 1}</span>
              </div>
              <h2 className="mt-5 text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand title="Need help with a product?" text="Contact our Aba team with your invoice details and we will take it from there." />
    </>
  );
}
