import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${site.url}${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1 text-[13px] ${tone === "light" ? "text-white/60" : "text-muted"}`}>
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className={tone === "light" ? "hover:text-white" : "hover:text-ink"}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "light" ? "text-white/90" : "text-ink"}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs: Crumb[];
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="sun-glow relative overflow-hidden text-white">
      <div className="grid-lines absolute inset-0" aria-hidden />
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-25 mix-blend-luminosity" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" aria-hidden />
      <div className="container-x relative py-14 md:py-20">
        <Breadcrumbs items={crumbs} tone="light" />
        {eyebrow && <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-sun">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-3" : "mt-8"} max-w-3xl text-4xl font-extrabold leading-[1.08] md:text-5xl`}>{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  action?: { label: string; href: string };
}) {
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${align === "center" ? "items-center text-center md:flex-col md:items-center" : ""}`}>
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink md:text-[2.5rem]">{title}</h2>
        {intro && <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{intro}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-brand">
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function CtaBand({
  title = "Ready to switch to clean, reliable power?",
  text = "Tell us what you want to power. We will recommend the right system and send a quote.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="sun-glow relative overflow-hidden rounded-[2rem] px-6 py-12 text-white md:px-14 md:py-16">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-sun/30 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">{title}</h2>
            <p className="mt-3 text-[16.5px] text-white/75">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/quote" className="btn btn-sun">
              Request a quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a href={whatsappLink("Hello Africell Solar Aba, I'd like advice on a solar system.")} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
