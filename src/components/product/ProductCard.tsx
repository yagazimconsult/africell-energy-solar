import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** The minimal, serialisable shape a card (and the client-side catalogue) needs. Built by toCard() in lib/catalog. */
export interface CardData {
  key: string;
  href: string;
  name: string;
  model?: string;
  chips: string[];
  image: string;
  label: string;
  categorySlug: string;
  seriesName: string;
  facets: { powerKva?: number; capacityKwh?: number; wattage?: number };
  search: string;
}

export function ProductCard({ card: c, priority = false }: { card: CardData; priority?: boolean }) {
  return (
    <Link href={c.href} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3.4] bg-gradient-to-b from-mist to-white">
        <Image
          src={c.image}
          alt={c.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain mix-blend-multiply p-6 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-line backdrop-blur">
          {c.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {c.model && <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">{c.model}</p>}
        <h3 className="mt-1 font-display text-[17px] font-bold leading-snug text-ink group-hover:text-brand">{c.name}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.chips.slice(0, 3).map((chip) => (
            <span key={chip} className="chip !text-[11.5px]">
              {chip}
            </span>
          ))}
        </div>
        <span className="mt-auto flex items-center gap-1 pt-5 text-[14px] font-semibold text-brand">
          View details <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
