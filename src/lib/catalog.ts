import { categories } from "@/data/catalog";
import type { Availability, Category, Product, Series, SpecValue } from "@/data/types";
import type { CardData } from "@/components/product/ProductCard";

export interface ProductEntry {
  product: Product;
  series: Series;
  category: Category;
  /** Column index of this product inside its series spec table. */
  index: number;
}

export const allProducts: ProductEntry[] = categories.flatMap((category) =>
  category.series.flatMap((series) =>
    series.products.map((product, index) => ({ product, series, category, index })),
  ),
);

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  return allProducts.find((e) => e.category.slug === categorySlug && e.product.slug === productSlug);
}

export function productHref(entry: Pick<ProductEntry, "category" | "product">) {
  return `/products/${entry.category.slug}/${entry.product.slug}`;
}

/** Spec value for one model column; shared values apply to every model. */
export function specFor(value: SpecValue | SpecValue[], index: number): SpecValue {
  return Array.isArray(value) ? (value[index] ?? null) : value;
}

/** Same-series siblings first, then products from categories that pair with this one. */
export function relatedProducts(entry: ProductEntry, limit = 4): ProductEntry[] {
  const siblings = allProducts.filter((e) => e.series === entry.series && e.product !== entry.product);
  const nearest = [...siblings].sort((a, b) => Math.abs(a.index - entry.index) - Math.abs(b.index - entry.index));
  return nearest.slice(0, limit);
}

// The sizes most often combined into a complete system, per category.
const systemPicks: Record<string, string[]> = {
  inverters: ["5kva-hybrid-inverter", "10kva-commercial-inverter"],
  "lithium-batteries": ["hy-lfp-512200-10kwh", "hy-lfp-512300-15kwh"],
  "solar-panels": ["gl-mono-550w"],
};

export function compatibleProducts(entry: ProductEntry, limit = 3): ProductEntry[] {
  return entry.category.pairsWith
    .flatMap((slug) => (systemPicks[slug] ?? []).map((p) => getProduct(slug, p)).filter((e): e is ProductEntry => Boolean(e)))
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
