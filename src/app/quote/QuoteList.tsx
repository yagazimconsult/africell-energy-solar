"use client";

import Image from "next/image";
import Link from "next/link";
import { Calculator, Minus, Plus, Trash2 } from "lucide-react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { EnquiryForm } from "@/components/EnquiryForm";

export function QuoteList() {
  const { items, sizing, setQty, remove, clear, setSizing } = useQuote();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Your products</h2>
          {items.length > 0 && (
            <button type="button" onClick={clear} className="text-[13.5px] font-semibold text-muted hover:text-ink">
              Clear list
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-mist p-8 text-center">
            <p className="font-semibold">Your quote list is empty</p>
            <p className="mt-1.5 text-[14.5px] text-muted">Add products from the catalogue, or just describe what you need in the form.</p>
            <Link href="/products" className="btn btn-brand mt-5">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-line rounded-2xl ring-1 ring-line">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-4 p-4">
                <Link href={i.href} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <Image src={i.image} alt="" fill sizes="80px" className="object-contain mix-blend-multiply p-1.5" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={i.href} className="font-semibold leading-snug hover:text-brand">
                    {i.name}
                  </Link>
                  {i.model && <p className="text-[13px] text-muted">{i.model}</p>}
                  <div className="mt-2 inline-flex items-center rounded-full ring-1 ring-line">
                    <button type="button" aria-label={`Decrease quantity of ${i.name}`} onClick={() => setQty(i.key, i.qty - 1)} className="grid size-8 place-items-center rounded-full hover:bg-mist">
                      <Minus className="size-3.5" aria-hidden />
                    </button>
                    <span className="w-8 text-center text-[14px] font-semibold" aria-live="polite">
                      {i.qty}
                    </span>
                    <button type="button" aria-label={`Increase quantity of ${i.name}`} onClick={() => setQty(i.key, i.qty + 1)} className="grid size-8 place-items-center rounded-full hover:bg-mist">
                      <Plus className="size-3.5" aria-hidden />
                    </button>
                  </div>
                </div>
                <button type="button" aria-label={`Remove ${i.name}`} onClick={() => remove(i.key)} className="grid size-9 place-items-center rounded-full text-muted hover:bg-mist hover:text-ink">
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {sizing ? (
          <div className="mt-6 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand/15">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-2 font-semibold text-navy-2">
                <Calculator className="size-4" aria-hidden /> Your sizing estimate
              </p>
              <button type="button" onClick={() => setSizing(null)} className="text-[13px] font-semibold text-muted hover:text-ink">
                Remove
              </button>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-[14px]">
              <div>
                <dt className="text-muted">Running load</dt>
                <dd className="font-bold">{sizing.loadKw} kW</dd>
              </div>
              <div>
                <dt className="text-muted">Daily energy</dt>
                <dd className="font-bold">{sizing.dailyKwh} kWh</dd>
              </div>
            </dl>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">{sizing.appliances.join(", ")}</p>
            <p className="mt-2 text-[12.5px] text-muted">Sent with your request so our team can confirm the right system.</p>
          </div>
        ) : (
          <Link href="/support/sizing-guide" className="mt-6 flex items-center gap-3 rounded-2xl p-5 ring-1 ring-line transition-colors hover:bg-mist">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun-50 text-sun-2">
              <Calculator className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">Not sure what you need?</span>
              <span className="block text-[13.5px] text-muted">Use the sizing calculator, then add the suggested system here.</span>
            </span>
          </Link>
        )}
      </div>

      <div className="rounded-[1.75rem] bg-mist p-6 md:p-8">
        <h2 className="text-2xl font-extrabold">Your details</h2>
        <p className="mt-1.5 text-[14.5px] text-muted">Choose small or bulk purchase. We confirm prices and availability on WhatsApp, then send you an invoice. No payment is taken on this website.</p>
        <div className="mt-6">
          <EnquiryForm mode="quote" items={items.map(({ name, model, qty }) => ({ name, model, qty }))} sizing={sizing} onSent={clear} />
        </div>
      </div>
    </div>
  );
}
