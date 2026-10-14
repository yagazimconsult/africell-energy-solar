"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { WA_TOPICS, waMessage, type WaTopic } from "@/config/site";
import { useContact } from "@/components/ContactProvider";
import { WhatsAppIcon } from "@/components/icons";

const CHOICES: { topic: WaTopic; formHref?: string; formLabel?: string }[] = [
  { topic: "purchase", formHref: "/quote", formLabel: "or use the quote form" },
  { topic: "maintenance", formHref: "/support/maintenance", formLabel: "or use the service form" },
  { topic: "product" },
  { topic: "general" },
];

/**
 * A WhatsApp button that first asks what the customer needs, then opens WhatsApp with a message
 * that starts with the matching request label (purchase, maintenance, product question…).
 */
export function WhatsAppChooser({ className = "", children, ariaLabel }: { className?: string; children: React.ReactNode; ariaLabel?: string }) {
  const [open, setOpen] = useState(false);
  const { whatsappLink } = useContact();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-label={ariaLabel} onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="wa-chooser-title">
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="animate-fade-up relative w-full max-w-md rounded-t-[1.75rem] bg-white p-6 text-ink shadow-lift sm:rounded-[1.75rem]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#1faa59] text-white">
                  <WhatsAppIcon className="size-6" />
                </span>
                <div>
                  <h2 id="wa-chooser-title" className="font-display text-lg font-extrabold">
                    What do you need?
                  </h2>
                  <p className="text-[13.5px] text-muted">We&apos;ll open WhatsApp with your request labelled.</p>
                </div>
              </div>
              <button ref={closeRef} type="button" aria-label="Close" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-mist">
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <ul className="mt-5 space-y-2">
              {CHOICES.map(({ topic, formHref, formLabel }) => {
                const t = WA_TOPICS[topic];
                const href = whatsappLink(waMessage(topic));
                return (
                  <li key={topic}>
                    <a
                      href={href}
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 ring-1 ring-line transition-colors hover:bg-mist hover:ring-slate-300"
                    >
                      <span className="text-xl" aria-hidden>
                        {t.emoji}
                      </span>
                      <span className="flex-1 text-[15px] font-semibold">{t.option}</span>
                      <ChevronRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </a>
                    {formHref && (
                      <Link href={formHref} onClick={() => setOpen(false)} className="ml-12 mt-1 inline-block text-[12.5px] font-semibold text-brand hover:underline">
                        {formLabel} →
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
