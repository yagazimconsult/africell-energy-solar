import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Availability, Category, Product, Series, SpecGroup, SpecValue } from "@/data/types";
import type { CardData } from "@/components/product/ProductCard";

// The brand this website shows. The Deye site will use the same tables with "deye".
export const BRAND_SLUG = "africell";

// How long (seconds) a page may show catalogue data before re-reading the database.
export const CATALOGUE_REVALIDATE = 300;

export interface ProductEntry {
  product: Product;
  series: Series;
  category: Category;
  /** Column index of this product inside its series spec table. */
  index: number;
}

export interface Catalogue {
  categories: Category[];
  allProducts: ProductEntry[];
}

// ---- Database rows -------------------------------------------------------------------------

interface LayoutRow {
  label: string;
  shared?: string | null;
}
interface LayoutGroup {
  title: string;
  rows: LayoutRow[];
}
interface ProductRow {
  slug: string;
  name: string;
  model: string | null;
  chips: string[];
  power_kva: number | null;
  capacity_kwh: number | null;
  wattage: number | null;
  image: string;
  gallery: string[];
  summary: string;
  spec_values: Record<string, string>;
  availability: Availability;
}
interface SeriesRow {
  slug: string;
  name: string;
  tagline: string;
  overview: string[];
  features: Series["features"];
  applications: string[];
  gallery: string[];
  spec_status: Series["specStatus"];
  spec_note: string | null;
  spec_layout: LayoutGroup[];
  settings: LayoutGroup | null;
  guide: NonNullable<Series["guide"]>;
  in_the_box: string[];
  downloads: Series["downloads"];
  products: ProductRow[];
}
interface CategoryRow {
  slug: string;
  name: string;
  singular: string;
  short_description: string;
  description: string;
  image: string | null;
  pairs_with: string[];
  product_series: SeriesRow[];
}

// A row with "shared" applies to every model; otherwise each product supplies its own value.
function toSpecGroups(layout: LayoutGroup[], products: ProductRow[]): SpecGroup[] {
  return layout.map((g) => ({
    title: g.title,
    rows: g.rows.map((r) => ({
      label: r.label,
      value: "shared" in r ? (r.shared ?? null) : products.map((p): SpecValue => p.spec_values?.[r.label] ?? null),
    })),
  }));
}

function toProduct(p: ProductRow): Product {
  return {
    slug: p.slug,
    name: p.name,
    model: p.model ?? undefined,
    chips: p.chips,
    facets: {
      powerKva: p.power_kva ?? undefined,
      capacityKwh: p.capacity_kwh ?? undefined,
      wattage: p.wattage ?? undefined,
    },
    image: p.image,
    gallery: p.gallery.length ? p.gallery : undefined,
    availability: p.availability,
    summary: p.summary,
  };
}

function toCategory(c: CategoryRow): Category {
  return {
    slug: c.slug,
    name: c.name,
    singular: c.singular,
    short: c.short_description,
    description: c.description,
    image: c.image ?? c.product_series[0]?.products[0]?.image ?? "/images/brand/logo-mark.png",
    pairsWith: c.pairs_with,
    series: c.product_series.map((s) => ({
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      overview: s.overview,
      features: s.features,
      applications: s.applications.length ? s.applications : undefined,
      gallery: s.gallery.length ? s.gallery : s.products.map((p) => p.image).slice(0, 1),
      specStatus: s.spec_status,
      specNote: s.spec_note ?? undefined,
      specs: toSpecGroups(s.spec_layout, s.products),
      settings: s.settings ? { title: s.settings.title, rows: s.settings.rows.map((r) => ({ label: r.label, value: r.shared ?? null })) } : undefined,
      guide: s.guide.length ? s.guide : undefined,
      inTheBox: s.in_the_box.length ? s.in_the_box : undefined,
      downloads: s.downloads,
      products: s.products.map(toProduct),
    })),
  };
}

// Cached across requests; refreshed at most every CATALOGUE_REVALIDATE seconds.
const loadCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select(
        `slug, name, singular, short_description, description, image, pairs_with,
         brand:brands!inner(slug),
         product_series(slug, name, tagline, overview, features, applications, gallery, spec_status, spec_note,
           spec_layout, settings, guide, in_the_box, downloads, sort_order,
           products(slug, name, model, chips, power_kva, capacity_kwh, wattage, image, gallery, summary,
             spec_values, availability, sort_order))`,
      )
      .eq("brand.slug", BRAND_SLUG)
      .order("sort_order")
      .order("sort_order", { referencedTable: "product_series" })
      .order("sort_order", { referencedTable: "product_series.products" });
    if (error) throw new Error(`Could not load the catalogue from Supabase: ${error.message}`);
    return (data as unknown as CategoryRow[]).map(toCategory);
  },
  ["catalogue", BRAND_SLUG],
  { revalidate: CATALOGUE_REVALIDATE, tags: ["catalogue"] },
);

/** The full catalogue for this request. Object identity is stable within one request. */
export const getCatalogue = cache(async (): Promise<Catalogue> => {
  const categories = await loadCategories();
  const allProducts = categories.flatMap((category) =>
    category.series.flatMap((series) => series.products.map((product, index) => ({ product, series, category, index }))),
  );
  return { categories, allProducts };
});

// ---- Helpers ---------------------------------------------------------------------------------

export function getCategory(cat: Catalogue, slug: string) {
  return cat.categories.find((c) => c.slug === slug);
}

export function getProduct(cat: Catalogue, categorySlug: string, productSlug: string) {
  return cat.allProducts.find((e) => e.category.slug === categorySlug && e.product.slug === productSlug);
}

export function productHref(entry: Pick<ProductEntry, "category" | "product">) {
  return `/products/${entry.category.slug}/${entry.product.slug}`;
}

/** Spec value for one model column; shared values apply to every model. */
export function specFor(value: SpecValue | SpecValue[], index: number): SpecValue {
  return Array.isArray(value) ? (value[index] ?? null) : value;
}

/** Same-series siblings, nearest in size first. */
export function relatedProducts(cat: Catalogue, entry: ProductEntry, limit = 4): ProductEntry[] {
  return cat.allProducts
    .filter((e) => e.series === entry.series && e.product !== entry.product)
    .sort((a, b) => Math.abs(a.index - entry.index) - Math.abs(b.index - entry.index))
    .slice(0, limit);
}

// The sizes most often combined into a complete system, per category.
const systemPicks: Record<string, string[]> = {
  inverters: ["5kva-hybrid-inverter", "10kva-commercial-inverter"],
  "lithium-batteries": ["hy-lfp-512200-10kwh", "hy-lfp-512300-15kwh"],
  "solar-panels": ["gl-mono-550w"],
};

export function compatibleProducts(cat: Catalogue, entry: ProductEntry, limit = 3): ProductEntry[] {
  return entry.category.pairsWith
    .flatMap((slug) => {
      const picks = (systemPicks[slug] ?? []).map((p) => getProduct(cat, slug, p)).filter((e): e is ProductEntry => Boolean(e));
      // Fall back to the first products of the category if the picks were renamed or unpublished.
      return picks.length ? picks : cat.allProducts.filter((e) => e.category.slug === slug).slice(0, 1);
    })
    .slice(0, limit);
}

export const availabilityLabel: Record<Availability, string> = {
  "in-stock": "In stock in Aba",
  limited: "Limited stock",
  "on-order": "Available on order",
  enquire: "Contact us for availability",
};

export function searchText(entry: ProductEntry) {
  const { product, series, category } = entry;
  return [product.name, product.model, product.chips.join(" "), series.name, category.name].join(" ").toLowerCase();
}

export function toCard(entry: ProductEntry): CardData {
  const { product, category, series } = entry;
  return {
    key: `${category.slug}/${product.slug}`,
    href: productHref(entry),
    name: product.name,
    model: product.model,
    chips: product.chips,
    image: product.image,
    label: category.singular,
    categorySlug: category.slug,
    seriesName: series.name,
    facets: product.facets,
    search: searchText(entry),
  };
}
