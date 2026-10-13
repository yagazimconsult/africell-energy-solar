import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { EnquiryForm } from "@/components/EnquiryForm";
import { WhatsAppIcon } from "@/components/icons";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} in Aba, Abia State. Call, WhatsApp, email or visit our showroom.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const cards = [
    { icon: Phone, title: "Call us", lines: [site.contact.phone], href: site.contact.phoneHref, cta: "Call now" },
    { icon: WhatsAppIcon, title: "WhatsApp", lines: ["Fastest way to reach our team"], href: whatsappLink("Hello Africell Solar Aba,"), cta: "Start chat", external: true },
    { icon: Mail, title: "Email", lines: [site.contact.email], href: `mailto:${site.contact.email}`, cta: "Send email" },
    { icon: MapPin, title: "Visit the showroom", lines: [site.contact.addressLine, `${site.contact.city}, ${site.contact.state}`], href: site.contact.mapUrl, cta: "Get directions", external: true },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to our Aba team" intro="Questions about a product, a system for your home or business, or an existing installation? We're here to help." crumbs={[{ label: "Contact" }]} />

      <section className="container-x relative z-10 -mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <a key={c.title} href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="card card-hover flex flex-col p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand">
              <c.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-[17px] font-bold">{c.title}</h2>
            {c.lines.map((l) => (
              <p key={l} className="mt-1 break-words text-[14.5px] text-muted">
                {l}
              </p>
            ))}
            <span className="mt-auto pt-4 text-[14px] font-semibold text-brand">{c.cta} →</span>
          </a>
        ))}
      </section>

      <section className="container-x grid gap-10 py-16 md:py-24 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-3 text-3xl font-extrabold">How can we help?</h2>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </div>
        <aside className="h-fit rounded-[1.75rem] bg-ink p-8 text-white">
          <Clock className="size-6 text-sun" aria-hidden />
          <h2 className="mt-4 text-xl font-extrabold">Opening hours</h2>
          <dl className="mt-5 divide-y divide-white/10">
            {site.contact.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 py-3 text-[15px]">
                <dt className="text-white/65">{h.days}</dt>
                <dd className="font-semibold">{h.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[14px] leading-relaxed text-white/60">
            Messages sent outside opening hours are answered on the next working day.
          </p>
        </aside>
      </section>
    </>
  );
}
