"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard, type CardData } from "./ProductCard";

interface CategoryOption {
  slug: string;
  name: string;
}

type RangeKey = "powerKva" | "capacityKwh" | "wattage";

const ranges: Record<string, { key: RangeKey; label: string; options: { label: string; min: number; max: number }[] }> = {
  inverters: {
    key: "powerKva",
    label: "Power",
    options: [
      { label: "Up to 5kVA", min: 0, max: 5 },
      { label: "5–10kVA", min: 5.01, max: 10 },
    ],
  },
  "lithium-batteries": {
    key: "capacityKwh",
    label: "Capacity",
    options: [
      { label: "Under 8kWh", min: 0, max: 8 },
      { label: "8kWh and above", min: 8, max: 999 },
    ],
  },
  "solar-panels": {
    key: "wattage",
    label: "Wattage",
    options: [
      { label: "Under 400W", min: 0, max: 399 },
      { label: "400–499W", min: 400, max: 499 },
      { label: "500W and above", min: 500, max: 9999 },
    ],
  },
};

export function ProductBrowser({
  cards,
  categories,
  initialQuery = "",
  initialCategory = "all",
}: {
  cards: CardData[];
  categories: CategoryOption[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [range, setRange] = useState<number | null>(null);
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");

  const rangeDef = category !== "all" ? ranges[category] : undefined;

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    let list = cards.filter((c) => (category === "all" || c.categorySlug === category) && terms.every((t) => c.search.includes(t)));
    if (rangeDef && range !== null) {
      const r = rangeDef.options[range];
      list = list.filter((c) => {
        const v = c.facets[rangeDef.key];
        return v !== undefined && v >= r.min && v <= r.max;
      });
    }
    if (sort !== "default") {
      const metric = (c: CardData) => c.facets.powerKva ?? c.facets.capacityKwh ?? c.facets.wattage ?? 0;
      list = [...list].sort((a, b) => (sort === "asc" ? metric(a) - metric(b) : metric(b) - metric(a)));
    }
    return list;
  }, [cards, query, category, range, rangeDef, sort]);

  const selectCategory = (slug: string) => {
    setCategory(slug);
    setRange(null);
  };

  const hasFilters = query || category !== "all" || range !== null;

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-3 shadow-card ring-1 ring-line md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-xl bg-mist px-4">
          <Search className="size-5 text-muted" aria-hidden />
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, model or rating, e.g. 10kWh, 550W, LFP-512300"
            className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-muted/70"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="text-muted hover:text-ink">
              <X className="size-4" aria-hidden />
            </button>
          )}
        </label>
        <label className="flex items-center gap-2 text-[14px] text-muted md:pr-2">
          <SlidersHorizontal className="size-4" aria-hidden />
          <span className="sr-only md:not-sr-only">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-11 rounded-xl bg-mist px-3 font-semibold text-ink outline-none">
            <option value="default">Recommended</option>
            <option value="asc">Rating: low to high</option>
            <option value="desc">Rating: high to low</option>
          </select>
        </label>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product category">
        {[{ slug: "all", name: "All products" }, ...categories].map((c) => {
          const active = category === c.slug;
          const n = c.slug === "all" ? cards.length : cards.filter((x) => x.categorySlug === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectCategory(c.slug)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-colors ${active ? "bg-ink text-white" : "bg-mist text-ink/75 hover:bg-line"}`}
            >
              {c.name} <span className={active ? "text-white/60" : "text-muted"}>({n})</span>
            </button>
          );
        })}
      </div>

      {rangeDef && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-muted">{rangeDef.label}:</span>
          {rangeDef.options.map((o, i) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={range === i}
              onClick={() => setRange(range === i ? null : i)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ring-1 transition-colors ${range === i ? "bg-brand text-white ring-brand" : "bg-white text-ink/75 ring-line hover:ring-slate-300"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-[14px] text-muted">
        <p aria-live="polite">
          Showing <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? "product" : "products"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              selectCategory("all");
            }}
            className="font-semibold text-brand"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((c, i) => (
            <ProductCard key={c.key} card={c} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-mist px-6 py-16 text-center">
          <p className="font-display text-xl font-bold">No products match your search</p>
          <p className="mt-2 text-muted">Try a different term, or ask us directly. We may be able to source it for you.</p>
        </div>
      )}
    </div>
  );
}
