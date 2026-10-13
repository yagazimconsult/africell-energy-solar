import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { categories } from "@/data/catalog";
import { allProducts, getCategory, toCard } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { SpecTable } from "@/components/product/SpecTable";
import { CtaBand, PageHero } from "@/components/ui";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cat = getCategory((await params).category);
  if (!cat) return {};
  return {
    title: `${cat.name} in Aba`,
    description: `${cat.description} Available from Africell Energy Solar, Aba.`,
    alternates: { canonical: `/products/${cat.slug}` },
    openGraph: { images: [cat.image] },
  };
}

export default async function CategoryPage({ params }: Params) {
  const cat = getCategory((await params).category);
  if (!cat) notFound();

  return (
    <>
      <PageHero eyebrow={`${cat.series.length} ${cat.series.length === 1 ? "series" : "series"}`} title={cat.name} intro={cat.description} crumbs={[{ label: "Products", href: "/products" }, { label: cat.name }]}>
        {cat.series.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {cat.series.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className="btn btn-glass !py-2.5 !text-[13.5px]">
                {s.name}
              </a>
            ))}
          </div>
        )}
      </PageHero>

      {/* Other categories */}
      <nav aria-label="Product categories" className="border-b border-line bg-white">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/${c.slug}`}
              aria-current={c.slug === cat.slug ? "page" : undefined}
              className={`shrink-0 border-b-2 px-4 py-4 text-[14.5px] font-semibold ${c.slug === cat.slug ? "border-sun-2 text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      {cat.series.map((series) => {
        const entries = allProducts.filter((e) => e.series === series);
        const keyGroup = series.specs[0];
        return (
          <section key={series.slug} id={series.slug} className="scroll-mt-28 border-b border-line py-16 md:py-20">
            <div className="container-x">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
                <div>
                  <p className="eyebrow">{series.products.length} {series.products.length === 1 ? "model" : "models"}</p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-[2.25rem]">{series.name}</h2>
                  <p className="mt-2 text-[17px] font-medium text-brand">{series.tagline}</p>
                  {series.overview.map((p, i) => (
                    <p key={i} className="mt-4 text-[16px] leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {series.features.slice(0, 4).map((f) => (
                      <li key={f.title} className="flex gap-2.5 text-[14.5px] font-medium">
                        <Check className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden />
                        {f.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-mist via-white to-brand-50 ring-1 ring-line">
                  <Image src={series.gallery[0]} alt={series.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain mix-blend-multiply p-10" />
                </div>
              </div>

              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {entries.map((e) => (
                  <ProductCard key={e.product.slug} card={toCard(e)} />
                ))}
              </div>

              {series.products.length > 1 && keyGroup && (
                <div className="mt-12">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <h3 className="text-xl font-extrabold">Compare {series.name} models</h3>
                    <Link href={`/products/${cat.slug}/${series.products[0].slug}#specifications`} className="hidden shrink-0 items-center gap-1 text-[14px] font-semibold text-brand sm:inline-flex">
                      Full specifications <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                  <SpecTable groups={[keyGroup]} products={series.products} categorySlug={cat.slug} />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <CtaBand />
    </>
  );
}
