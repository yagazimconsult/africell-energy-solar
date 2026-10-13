// Catalogue shape: Category → Series → Product (model), mirroring Deye's architecture.
// This is deliberately close to the future inventory database so the site can
// later read the same structure from the central system without a rebuild.

export type Availability = "in-stock" | "limited" | "on-order" | "enquire";

/** How much of a series' technical data has been verified. */
export type SpecStatus = "verified" | "partial" | "pending";

export type SpecValue = string | null; // null = not yet confirmed

export interface SpecRow {
  label: string;
  /** One value shared by every model, or one value per model (same order as series.products). */
  value: SpecValue | SpecValue[];
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

export interface Feature {
  title: string;
  text: string;
}

export interface GuideSection {
  title: string;
  paragraphs?: string[];
  steps?: string[];
  image?: string;
}

export interface Product {
  slug: string;
  name: string;
  model?: string;
  /** Short spec badges shown on cards and in the product header. */
  chips: string[];
  /** Numeric facets for catalogue filters. */
  facets: {
    powerKva?: number;
    capacityKwh?: number;
    wattage?: number;
  };
  image: string;
  gallery?: string[];
  availability: Availability;
  summary: string;
}

export interface Series {
  slug: string;
  name: string;
  tagline: string;
  overview: string[];
  features: Feature[];
  applications?: string[];
  gallery: string[];
  specStatus: SpecStatus;
  specNote?: string;
  specs: SpecGroup[];
  settings?: SpecGroup;
  guide?: GuideSection[];
  inTheBox?: string[];
  downloads: { title: string; href: string }[];
  products: Product[];
}

export interface Category {
  slug: string;
  name: string;
  singular: string;
  short: string;
  description: string;
  image: string;
  series: Series[];
  /** Category slugs whose products pair well with this one. */
  pairsWith: string[];
}
