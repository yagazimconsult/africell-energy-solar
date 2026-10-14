import type { Metadata } from "next";
import { BatteryCharging, ClipboardCheck, Cpu, ShieldCheck, Sun, Wrench } from "lucide-react";
import { MaintenanceForm } from "@/components/MaintenanceForm";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Maintenance & Repair",
  description: "Request maintenance or repair for your inverter, lithium battery, solar panels or complete solar system from the Africell Energy Solar technical team in Aba.",
  alternates: { canonical: "/support/maintenance" },
};

const SERVICES = [
  { icon: Cpu, title: "Inverter faults", text: "Error codes, beeping, no output, overload or charging problems." },
  { icon: BatteryCharging, title: "Battery issues", text: "Not charging, short backup time, BMS alarms or wrong inverter settings." },
  { icon: Sun, title: "Solar panels", text: "Low generation, cleaning, damaged cables or connectors, re-mounting." },
  { icon: ClipboardCheck, title: "Routine check-up", text: "A full system health check to keep everything running efficiently." },
];

export default async function MaintenancePage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Maintenance & repair"
        intro="Something not working, or time for a check-up? Tell us about your system and our technical team will get back to you on WhatsApp."
        image="/images/site/gen-showroom-africell.webp"
        crumbs={[{ label: "Support", href: "/support" }, { label: "Maintenance & repair" }]}
      />

      <section className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.35fr]">
        <div>
          <p className="eyebrow">How we can help</p>
          <h2 className="mt-3 text-3xl font-extrabold">Service for your solar system</h2>
          <div className="mt-8 grid gap-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="reveal flex gap-4 rounded-2xl p-5 ring-1 ring-line">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{s.title}</span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">{s.text}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3 rounded-2xl bg-sun-50 p-5 text-[14px] leading-relaxed text-amber-900 ring-1 ring-amber-200/70">
            <ShieldCheck className="size-5 shrink-0" aria-hidden />
            <p>If your product may still be under warranty, keep your invoice ready. Do not open the inverter or battery yourself: it is dangerous and can void the warranty.</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-mist p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold">
            <Wrench className="size-6 text-sun-2" aria-hidden /> Request a technician
          </h2>
          <p className="mt-1.5 text-[14.5px] text-muted">Takes about a minute. You will then continue on WhatsApp with our technical team.</p>
          <div className="mt-6">
            <MaintenanceForm defaultProduct={product} />
          </div>
        </div>
      </section>
    </>
  );
}
