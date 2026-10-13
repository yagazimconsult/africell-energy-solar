"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useQuote, type QuoteItem } from "./QuoteProvider";

export function AddToQuoteButton({ item, className = "" }: { item: Omit<QuoteItem, "qty">; className?: string }) {
  const { add, has } = useQuote();
  const added = has(item.key);

  if (added) {
    return (
      <Link href="/quote" className={`btn btn-ghost ${className}`}>
        <Check className="size-4 text-leaf" aria-hidden /> In your quote list
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => add(item)} className={`btn btn-brand ${className}`}>
      <Plus className="size-4" aria-hidden /> Add to quote
    </button>
  );
}
