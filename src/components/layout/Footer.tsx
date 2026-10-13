import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getCatalogue } from "@/lib/catalog";
import { getContact } from "@/lib/site-settings";
import { solutions } from "@/data/content";
import { site, whatsappHref } from "@/config/site";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icons";

export async function Footer() {
  const [{ categories }, contact] = await Promise.all([getCatalogue(), getContact()]);
  return (
    <footer className="sun-glow relative overflow-hidden text-white">
      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.3fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/65">
              Africell inverters, lithium batteries and solar panels, sold and supported locally in Aba, Abia State.
            </p>
            <div className="mt-6 flex gap-2">
              <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp !px-4 !py-2.5 !text-[13px]">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
              <a href={contact.phoneHref} className="btn btn-glass !px-4 !py-2.5 !text-[13px]">
                <Phone className="size-4" aria-hidden /> Call us
              </a>
            </div>
          </div>

          <FooterCol title="Products" links={[...categories.map((c) => ({ label: c.name, href: `/products/${c.slug}` })), { label: "All products", href: "/products" }]} />
          <FooterCol title="Solutions" links={solutions.map((s) => ({ label: s.name, href: `/solutions/${s.slug}` }))} />
          <FooterCol
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "News & Guides", href: "/news" },
              { label: "Downloads", href: "/downloads" },
              { label: "FAQs", href: "/support/faq" },
              { label: "Warranty & After-sales", href: "/support/warranty" },
              { label: "Contact", href: "/contact" },
            ]}
          />

          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-sun">Visit us</h3>
            <ul className="mt-5 space-y-3.5 text-[14px] text-white/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden />
                <span>
                  {contact.addressLine}
                  <br />
                  {contact.city}, {contact.state}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden />
                <a href={contact.phoneHref} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden />
                <span>
                  {contact.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-[12.5px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}, Aba. Independent dealer of Africell Energy Solar products.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-sun">{title}</h3>
      <ul className="mt-5 space-y-2.5 text-[14px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-white/75 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
