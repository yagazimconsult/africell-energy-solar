"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQuote } from "@/components/quote/QuoteProvider";
import { EnquiryForm } from "@/components/EnquiryForm";

export function QuoteList() {
  const { items, setQty, remove, clear } = useQuote();

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
      </div>

      <div className="rounded-[1.75rem] bg-mist p-6 md:p-8">
        <h2 className="text-2xl font-extrabold">Your details</h2>
        <p className="mt-1.5 text-[14.5px] text-muted">We will reply with current prices and availability.</p>
        <div className="mt-6">
          <EnquiryForm items={items.map(({ name, model, qty }) => ({ name, model, qty }))} onSent={clear} submitLabel="Request quote" />
        </div>
      </div>
    </div>
  );
}
