"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ClipboardList, Menu, Phone, Search, X } from "lucide-react";
import { useContact } from "@/components/ContactProvider";

import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icons";
import { useQuote } from "@/components/quote/QuoteProvider";
import { buildNav, type MenuCategory } from "./nav";

export function Header({ categories }: { categories: MenuCategory[] }) {
  const nav = buildNav(categories);
  const contact = useContact();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useQuote();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
    setSearching(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setSearching(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-ink text-[13px] text-white/75 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <p>
            Authorised Africell dealer in <span className="font-semibold text-white">Aba, Abia State</span>
          </p>
          <div className="flex items-center gap-5">
            <a href={contact.phoneHref} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="size-3.5" aria-hidden /> {contact.phone}
            </a>
            <a href={contact.whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
              <WhatsAppIcon className="size-3.5" /> WhatsApp us
            </a>
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`border-b bg-white/95 backdrop-blur transition-shadow ${scrolled ? "border-line shadow-[0_6px_24px_-12px_rgb(10_22_40/0.18)]" : "border-transparent"}`}>
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => (
                <li key={item.label} className="relative" onMouseEnter={() => item.children && enter(item.label)} onMouseLeave={() => item.children && leave()}>
                  {item.children ? (
                    <button
                      type="button"
                      aria-expanded={open === item.label}
                      onClick={() => setOpen(open === item.label ? null : item.label)}
                      className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors ${
                        isActive(item.href) || open === item.label ? "text-brand" : "text-ink/80 hover:text-ink"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`size-3.5 transition-transform ${open === item.label ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block whitespace-nowrap rounded-full px-3.5 py-2 text-[14.5px] font-semibold transition-colors ${
                        isActive(item.href) ? "text-brand" : "text-ink/80 hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.kind === "list" && open === item.label && (
                    <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                      <div className="animate-fade-up rounded-2xl bg-white p-2 shadow-lift ring-1 ring-line">
                        {item.children!.map((c) => (
                          <Link key={c.href} href={c.href} className="block rounded-xl px-4 py-3 hover:bg-mist">
                            <span className="block text-[14.5px] font-semibold text-ink">{c.label}</span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-muted">{c.description}</span>
                          </Link>
                        ))}
                        <Link href={item.href} className="mt-1 block rounded-xl px-4 py-2.5 text-[13px] font-semibold text-brand hover:bg-brand-50">
                          View all {item.label.toLowerCase()} →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearching((s) => !s)}
              className="grid size-10 place-items-center rounded-full text-ink/80 hover:bg-mist hover:text-ink"
            >
              <Search className="size-[18px]" aria-hidden />
            </button>
            <Link href="/quote" aria-label={`Quote list, ${count} items`} className="relative grid size-10 place-items-center rounded-full text-ink/80 hover:bg-mist hover:text-ink">
              <ClipboardList className="size-[18px]" aria-hidden />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-sun-2 px-1 text-[10px] font-bold leading-[18px] text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/quote" className="btn btn-sun ml-1.5 hidden !px-5 !py-2.5 md:inline-flex">
              Get a Quote
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobile}
              onClick={() => setMobile(true)}
              className="grid size-10 place-items-center rounded-full text-ink hover:bg-mist xl:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Products mega menu */}
        {open === "Products" && (
          <div className="absolute inset-x-0 top-full hidden xl:block" onMouseEnter={() => enter("Products")} onMouseLeave={leave}>
            <div className="animate-fade-up border-t border-line bg-white shadow-lift">
              <div className="container-x grid grid-cols-[1fr_1fr_1fr_260px] gap-8 py-8">
                {categories.map((cat) => (
                  <div key={cat.slug}>
                    <Link href={`/products/${cat.slug}`} className="group flex items-center gap-3">
                      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-mist">
                        <Image src={cat.image} alt="" width={56} height={56} className="size-12 object-contain mix-blend-multiply" />
                      </span>
                      <span>
                        <span className="block font-display text-[15px] font-bold text-ink group-hover:text-brand">{cat.name}</span>
                        <span className="block text-[12.5px] leading-snug text-muted">{cat.short}</span>
                      </span>
                    </Link>
                    <div className="mt-4 space-y-3 border-l border-line pl-4">
                      {cat.series.map((s) => (
                        <div key={s.slug}>
                          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted/80">{s.name}</p>
                          <ul className="mt-1.5 space-y-1">
                            {s.products.slice(0, 5).map((p) => (
                              <li key={p.slug}>
                                <Link href={`/products/${cat.slug}/${p.slug}`} className="text-[13.5px] text-ink/80 hover:text-brand">
                                  {p.name}
                                </Link>
                              </li>
                            ))}
                            {s.products.length > 5 && (
                              <li>
                                <Link href={`/products/${cat.slug}`} className="text-[13px] font-semibold text-brand">
                                  + {s.products.length - 5} more
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="sun-glow relative overflow-hidden rounded-2xl p-6 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sun">Not sure what you need?</p>
                  <p className="mt-2 font-display text-lg font-bold leading-snug">Size your system in two minutes.</p>
                  <p className="mt-2 text-[13px] text-white/70">Pick your appliances and get an inverter, battery and panel estimate.</p>
                  <Link href="/support/sizing-guide" className="btn btn-sun mt-5 !px-4 !py-2.5 !text-[13px]">
                    Open sizing guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search panel */}
        {searching && <SearchPanel onClose={() => setSearching(false)} />}
      </div>

      {/* Mobile drawer */}
      {mobile && <MobileMenu nav={nav} onClose={() => setMobile(false)} />}
    </header>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <div className="absolute inset-x-0 top-full border-t border-line bg-white shadow-lift">
      <form
        className="container-x flex items-center gap-3 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/products?q=${encodeURIComponent(q.trim())}`);
          onClose();
        }}
      >
        <Search className="size-5 text-muted" aria-hidden />
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <input
          id="site-search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search inverters, batteries, panels, model numbers…"
          className="h-11 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70"
        />
        <button type="submit" className="btn btn-brand !py-2.5">
          Search
        </button>
        <button type="button" aria-label="Close search" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-mist">
          <X className="size-5" aria-hidden />
        </button>
      </form>
    </div>
  );
}

function MobileMenu({ nav, onClose }: { nav: ReturnType<typeof buildNav>; onClose: () => void }) {
  const contact = useContact();
  const [expanded, setExpanded] = useState<string | null>("Products");
  return (
    <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-lift">
        <div className="flex h-[72px] items-center justify-between border-b border-line px-4">
          <Logo />
          <button type="button" aria-label="Close menu" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-mist">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
          <Link href="/" className="block rounded-xl px-3 py-3 text-[16px] font-semibold">
            Home
          </Link>
          {nav.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  type="button"
                  aria-expanded={expanded === item.label}
                  onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[16px] font-semibold"
                >
                  {item.label}
                  <ChevronDown className={`size-4 transition-transform ${expanded === item.label ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {expanded === item.label && (
                  <div className="mb-2 ml-3 border-l border-line pl-3">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded-lg px-3 py-2.5 text-[15px] text-ink/80">
                        {c.label}
                      </Link>
                    ))}
                    <Link href={item.href} className="block rounded-lg px-3 py-2.5 text-[14px] font-semibold text-brand">
                      View all
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="block rounded-xl px-3 py-3 text-[16px] font-semibold">
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="grid gap-2 border-t border-line p-4">
          <Link href="/quote" className="btn btn-sun w-full">
            Get a Quote
          </Link>
          <a href={contact.whatsappLink("Hello Africell Solar Aba, I'd like to make an enquiry.")} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
            <WhatsAppIcon className="size-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
