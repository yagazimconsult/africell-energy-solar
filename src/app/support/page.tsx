import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, HelpCircle, ShieldCheck, Wrench } from "lucide-react";
import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Support",
  description: "Sizing guide, FAQs, warranty information and product documentation from Africell Energy Solar, Aba.",
  alternates: { canonical: "/support" },
};

const items = [
  { icon: Calculator, title: "System sizing guide", text: "Estimate the inverter, battery and panels for your load.", href: "/support/sizing-guide" },
  { icon: HelpCircle, title: "Frequently asked questions", text: "Buying, choosing a system and after-sales.", href: "/support/faq" },
  { icon: Wrench, title: "Maintenance & repair", text: "Request our technical team for a repair or check-up.", href: "/support/maintenance" },
  { icon: ShieldCheck, title: "Warranty & after-sales", text: "How warranty and service work with us.", href: "/support/warranty" },
  { icon: FileText, title: "Downloads", text: "Datasheets, settings and manuals.", href: "/downloads" },
];

export default function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="How can we help?" intro="Guidance before you buy and support after installation." crumbs={[{ label: "Support" }]} />
      <section className="container-x grid gap-5 py-16 sm:grid-cols-2 md:py-24">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="card card-hover group flex gap-5 p-7">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand">
              <i.icon className="size-6" aria-hidden />
            </span>
            <span>
              <span className="block text-xl font-bold group-hover:text-brand">{i.title}</span>
              <span className="mt-1.5 block text-[15px] text-muted">{i.text}</span>
              <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-brand">
                Open <ArrowRight className="size-4" aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
