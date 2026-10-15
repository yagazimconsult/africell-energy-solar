import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import { WhatsAppChooser } from "@/components/WhatsAppChooser";
import { getContact } from "@/lib/site-settings";
import { EnquiryForm } from "@/components/EnquiryForm";
import { WhatsAppIcon } from "@/components/icons";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} in Aba, Abia State. Call, WhatsApp, email or visit our showroom.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const contact = await getContact();
  const cards = [
    { icon: Phone, title: "Call us", lines: [contact.phone], href: contact.phoneHref, cta: "Call now", image: "/images/site/gen-contact-call.webp" },
    { icon: Mail, title: "Email", lines: [contact.email], href: `mailto:${contact.email}`, cta: "Send email", image: "/images/site/gen-contact-email.webp" },
    // Photo comes with the Google Business Profile; until then a branded map-style header.
    { icon: MapPin, title: "Visit the showroom", lines: [contact.addressLine, `${contact.city}, ${contact.state}`], href: contact.mapUrl, cta: "Get directions", external: true, image: null },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to our Aba team" intro="Questions about a product, a system for your home or business, or an existing installation? We're here to help." crumbs={[{ label: "Contact" }]} />

      <section className="container-x relative z-10 -mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WhatsAppChooser className="card card-hover group flex flex-col overflow-hidden text-left">
          <CardImage image="/images/site/gen-contact-whatsapp.webp" />
          <span className="flex flex-1 flex-col px-6 pb-6">
            <CardIcon whatsapp>
              <WhatsAppIcon className="size-5" />
            </CardIcon>
            <span className="mt-3 block text-[17px] font-bold">WhatsApp</span>
            <span className="mt-1 block text-[14.5px] text-muted">Fastest way to reach our team: purchases, repairs and questions</span>
            <span className="mt-auto block pt-4 text-[14px] font-semibold text-brand">Start chat →</span>
          </span>
        </WhatsAppChooser>
        {cards.map((c) => (
          <a key={c.title} href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="card card-hover group flex flex-col overflow-hidden">
            <CardImage image={c.image} />
            <span className="flex flex-1 flex-col px-6 pb-6">
              <CardIcon>
                <c.icon className="size-5" />
              </CardIcon>
              <h2 className="mt-3 text-[17px] font-bold">{c.title}</h2>
              {c.lines.map((l) => (
                <p key={l} className="mt-1 break-words text-[14.5px] text-muted">
                  {l}
                </p>
              ))}
              <span className="mt-auto pt-4 text-[14px] font-semibold text-brand">{c.cta} →</span>
            </span>
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
            {contact.hours.map((h) => (
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

/** Photo across the top of a contact card; a branded map-style header when there is no photo yet. */
function CardImage({ image }: { image: string | null }) {
  return (
    <span className="relative block aspect-[3/2] w-full overflow-hidden">
      {image ? (
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <span className="sun-glow absolute inset-0">
          <span className="grid-lines absolute inset-0" />
          <MapPin className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-sun drop-shadow-[0_8px_20px_rgb(245_158_11/0.45)]" aria-hidden />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
    </span>
  );
}

/** Round icon badge that overlaps the bottom edge of the card photo. */
function CardIcon({ children, whatsapp = false }: { children: React.ReactNode; whatsapp?: boolean }) {
  return (
    <span className={`relative -mt-6 grid size-12 place-items-center rounded-2xl shadow-card ring-4 ring-white ${whatsapp ? "bg-[#1faa59] text-white" : "bg-white text-brand"}`}>
      {children}
    </span>
  );
}
