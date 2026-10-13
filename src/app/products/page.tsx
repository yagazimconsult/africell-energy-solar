import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/catalog";
import { allProducts, toCard } from "@/lib/catalog";
import { ProductBrowser } from "@/components/product/ProductBrowser";

import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse Africell hybrid inverters, LiFePO4 lithium batteries and monocrystalline solar panels available from Africell Energy Solar, Aba.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "all" } = await searchParams;
  const cards = allProducts.map(toCard);

  return (
    <>
      <PageHero
        eyebrow="Product centre"
        title="Solar products, engineered to work together"
        intro="Explore our full range of inverters, lithium batteries and solar panels. Open any product for complete specifications, compatible products and a quick way to request a quote."
        crumbs={[{ label: "Products" }]}
      />

      {/* Category overview */}
      <section className="container-x -mt-10 relative z-10 grid gap-4 md:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/products/${cat.slug}`} className="card card-hover group flex items-center gap-4 p-4">
            <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-mist">
              <Image src={cat.image} alt="" fill sizes="80px" className="object-contain mix-blend-multiply p-2" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[17px] font-bold group-hover:text-brand">{cat.name}</span>
              <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{cat.short}</span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-brand">
                {cat.series.length} {cat.series.length === 1 ? "series" : "series"} <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </section>

      <section className="container-x py-14 md:py-20">
        <ProductBrowser
          key={`${q}|${category}`}
          cards={cards}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          initialQuery={q}
          initialCategory={categories.some((c) => c.slug === category) ? category : "all"}
        />
      </section>

      <CtaBand title="Can't find what you need?" text="Tell us what you are looking for. We will advise on the best option or source it for you." />
    </>
  );
}
