import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { articles, solutions } from "@/data/content";
import { getCatalogue, productHref } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, allProducts } = await getCatalogue();
  const now = new Date();
  const pages = ["", "/products", "/solutions", "/support", "/support/sizing-guide", "/support/faq", "/support/warranty", "/downloads", "/news", "/about", "/contact", "/quote", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${site.url}/products/${c.slug}`, lastModified: now, priority: 0.9 })),
    ...allProducts.map((e) => ({ url: `${site.url}${productHref(e)}`, lastModified: now, priority: 0.8 })),
    ...solutions.map((s) => ({ url: `${site.url}/solutions/${s.slug}`, lastModified: now, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${site.url}/news/${a.slug}`, lastModified: new Date(a.date), priority: 0.5 })),
  ];
}
