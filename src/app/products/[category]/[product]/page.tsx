import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, BadgeCheck, Check, FileText, MapPin, Package, Phone, ShieldCheck, Wrench } from "lucide-react";

const SERVICE_PRODUCT: Record<string, string> = { inverters: "Inverter", "lithium-batteries": "Lithium battery", "solar-panels": "Solar panels" };
import { site, whatsappHref } from "@/config/site";
import { getContact } from "@/lib/site-settings";
import { availabilityLabel, compatibleProducts, getCatalogue, getProduct, productHref, relatedProducts, toCard } from "@/lib/catalog";
import { Gallery } from "@/components/product/Gallery";
import { SpecTable } from "@/components/product/SpecTable";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton";
import { WhatsAppIcon } from "@/components/icons";
import { Breadcrumbs, CtaBand } from "@/components/ui";

type Params = { params: Promise<{ category: string; product: string }> };

export async function generateStaticParams() {
  const { allProducts } = await getCatalogue();
  return allProducts.map((e) => ({ category: e.category.slug, product: e.product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, product } = await params;
  const entry = getProduct(await getCatalogue(), category, product);
  if (!entry) return {};
  const { product: p, category: c } = entry;
  const title = p.model ? `${p.name} (${p.model})` : p.name;
  return {
    title,
    description: `${p.summary} ${p.chips.join(" · ")}. Available from ${site.name}, Aba.`,
    alternates: { canonical: productHref(entry) },
    openGraph: { title, images: [p.image], type: "website" },
    other: { "product:category": c.name },
  };
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "specifications", label: "Specifications" },
  { id: "installation", label: "Installation" },
  { id: "downloads", label: "Downloads" },
  { id: "system", label: "Build a system" },
];

export default async function ProductPage({ params }: Params) {
  const { category, product } = await params;
  const [catalogue, contact] = await Promise.all([getCatalogue(), getContact()]);
  const entry = getProduct(catalogue, category, product);
  if (!entry) notFound();

  const { product: p, series, category: cat, index } = entry;
  const url = `${site.url}${productHref(entry)}`;
  const gallery = p.gallery ?? series.gallery;
  const related = relatedProducts(catalogue, entry);
  const compatible = compatibleProducts(catalogue, entry);
  const hasGuide = Boolean(series.guide?.length);
  const visibleSections = sections.filter((s) => (s.id === "installation" ? hasGuide : true));
  const enquiry = `Hello Africell Solar Aba, I'm interested in the ${p.name}${p.model ? ` (${p.model})` : ""}. Please send me a quote and availability.\n${url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.model ? { model: p.model, mpn: p.model } : {}),
    brand: { "@type": "Brand", name: "Africell" },
    category: cat.name,
    description: p.summary,
    image: gallery.map((g) => `${site.url}${g}`),
    url,
  };

  return (
    <>
      <div className="border-b border-line bg-mist/60">
        <div className="container-x py-4">
          <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: cat.name, href: `/products/${cat.slug}` }, { label: p.name }]} />
        </div>
      </div>

      {/* Product header */}
      <section className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Gallery images={gallery} alt={p.name} />

        <div className="lg:pt-4">
          <Link href={`/products/${cat.slug}#${series.slug}`} className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand hover:text-brand-600">
            {series.name}
          </Link>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-[1.1] md:text-[2.6rem]">{p.name}</h1>
          {p.model && (
            <p className="mt-2 text-[15px] text-muted">
              Model <span className="font-semibold text-ink">{p.model}</span> · Brand <span className="font-semibold text-ink">Africell</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {p.chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>

          <p className="mt-6 text-[16.5px] leading-relaxed text-ink/80">{p.summary}</p>

          <p className={`mt-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${p.availability === "in-stock" ? "bg-green-50 text-green-700" : "bg-sun-50 text-amber-800"}`}>
            <span className={`size-2 rounded-full ${p.availability === "in-stock" ? "bg-green-500" : "bg-sun"}`} aria-hidden />
            {availabilityLabel[p.availability]}
          </p>

          {series.products.length > 1 && (
            <div className="mt-7">
              <p className="text-[13px] font-semibold text-muted">Other models in this series</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {series.products.map((sp, i) => (
                  <Link
                    key={sp.slug}
                    href={`/products/${cat.slug}/${sp.slug}`}
                    aria-current={i === index ? "page" : undefined}
                    className={`rounded-xl px-3.5 py-2 text-[13.5px] font-semibold ring-1 transition-colors ${i === index ? "bg-ink text-white ring-ink" : "bg-white text-ink/80 ring-line hover:ring-slate-400"}`}
                  >
                    {sp.chips[0]}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <AddToQuoteButton item={{ key: `${cat.slug}/${p.slug}`, name: p.name, model: p.model, href: productHref(entry), image: p.image }} className="w-full" />
            <a href={whatsappHref(contact.whatsapp, enquiry)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
              <WhatsAppIcon className="size-4" /> Enquire on WhatsApp
            </a>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <a href={contact.phoneHref} className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted hover:text-ink">
              <Phone className="size-4" aria-hidden /> Or call {contact.phone}
            </a>
            <Link href={`/support/maintenance?product=${encodeURIComponent(SERVICE_PRODUCT[cat.slug] ?? "")}`} className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted hover:text-ink">
              <Wrench className="size-4" aria-hidden /> Already own one? Request service
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[14px] sm:grid-cols-3">
            {[
              { icon: BadgeCheck, text: "Genuine Africell product" },
              { icon: MapPin, text: "Sold & supported in Aba" },
              { icon: Wrench, text: "Free sizing advice" },
            ].map((t) => (
              <li key={t.text} className="flex items-center gap-2.5 font-medium text-ink/80">
                <t.icon className="size-5 shrink-0 text-brand" aria-hidden />
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* In-page navigation */}
      <nav aria-label="Product sections" className="sticky top-[72px] z-30 border-y border-line bg-white/95 backdrop-blur md:top-[108px]">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto">
          {visibleSections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 px-4 py-3.5 text-[14px] font-semibold text-muted hover:text-ink">
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container-x space-y-20 py-16 md:space-y-24 md:py-20">
        {/* Overview */}
        <section id="overview" className="scroll-mt-40 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-3 text-3xl font-extrabold">{series.tagline}</h2>
            {series.overview.map((t, i) => (
              <p key={i} className="mt-4 text-[16.5px] leading-relaxed text-ink/75">
                {t}
              </p>
            ))}
          </div>
          {series.applications && (
            <div className="rounded-2xl bg-mist p-7">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Ideal for</h3>
              <ul className="mt-4 space-y-3">
                {series.applications.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-[15.5px] font-semibold">
                    <span className="grid size-6 place-items-center rounded-full bg-white text-leaf ring-1 ring-line">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-40">
          <p className="eyebrow">Features & benefits</p>
          <h2 className="mt-3 text-3xl font-extrabold">Why choose the {series.name}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {series.features.map((f, i) => (
              <div key={f.title} className="card p-6">
                <span className="font-display text-sm font-extrabold text-sun-2">0{i + 1}</span>
                <h3 className="mt-3 text-[17px] font-bold">{f.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specifications */}
        <section id="specifications" className="scroll-mt-40">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Technical data</p>
              <h2 className="mt-3 text-3xl font-extrabold">Specifications</h2>
            </div>
            {series.products.length > 1 && <p className="text-[14px] text-muted">All {series.products.length} models shown. This model is highlighted.</p>}
          </div>

          {series.specNote && (
            <div className={`mt-6 flex gap-3 rounded-2xl p-4 text-[14px] leading-relaxed ${series.specStatus === "verified" ? "bg-brand-50 text-navy-2" : "bg-sun-50 text-amber-900"}`}>
              {series.specStatus === "verified" ? <ShieldCheck className="size-5 shrink-0" aria-hidden /> : <AlertCircle className="size-5 shrink-0" aria-hidden />}
              <p>{series.specNote}</p>
            </div>
          )}

          <div className="mt-6">
            <SpecTable groups={series.specs} products={series.products} activeIndex={index} categorySlug={cat.slug} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {series.settings && (
              <div>
                <h3 className="mb-3 text-lg font-extrabold">{series.settings.title}</h3>
                <SpecTable groups={[{ ...series.settings, title: "Settings" }]} products={[p]} categorySlug={cat.slug} />
                <p className="mt-2 text-[13px] text-muted">Configure your inverter or charger with these values before switching on.</p>
              </div>
            )}
            {series.inTheBox && (
              <div>
                <h3 className="mb-3 text-lg font-extrabold">What&apos;s in the box</h3>
                <ul className="grid gap-2 rounded-2xl p-5 ring-1 ring-line sm:grid-cols-2">
                  {series.inTheBox.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[14.5px]">
                      <Package className="size-4 shrink-0 text-brand" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Installation guide */}
        {hasGuide && (
          <section id="installation" className="scroll-mt-40">
            <p className="eyebrow">Installation & operation</p>
            <h2 className="mt-3 text-3xl font-extrabold">Installation and operation guide</h2>
            <p className="mt-3 max-w-2xl text-[15px] text-muted">A summary for reference. Installation should be carried out by a qualified technician.</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {series.guide!.map((g) => (
                <div key={g.title} className="card p-6 md:p-7">
                  <h3 className="text-lg font-bold">{g.title}</h3>
                  {g.paragraphs?.map((t, i) => (
                    <p key={i} className="mt-3 text-[14.5px] leading-relaxed text-ink/75">
                      {t}
                    </p>
                  ))}
                  {g.steps && (
                    <ol className="mt-4 space-y-3">
                      {g.steps.map((s, i) => (
                        <li key={i} className="flex gap-3 text-[14.5px] leading-relaxed text-ink/75">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-bold text-white">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  )}
                  {g.image && (
                    <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-xl bg-mist">
                      <Image src={g.image} alt={`${g.title} diagram`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain mix-blend-multiply" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Downloads */}
        <section id="downloads" className="scroll-mt-40">
          <p className="eyebrow">Documentation</p>
          <h2 className="mt-3 text-3xl font-extrabold">Downloads</h2>
          {series.downloads.length > 0 ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {series.downloads.map((d) => (
                <li key={d.href}>
                  <a href={d.href} className="card card-hover flex items-center gap-3 p-5 font-semibold">
                    <FileText className="size-5 text-brand" aria-hidden /> {d.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-mist p-6 md:flex-row md:items-center md:justify-between">
              <p className="flex gap-3 text-[15px] text-ink/80">
                <FileText className="size-5 shrink-0 text-brand" aria-hidden />
                The datasheet and user manual for this product are available on request.
              </p>
              <a
                href={whatsappHref(contact.whatsapp, `Hello, please send me the datasheet and manual for the ${p.name}${p.model ? ` (${p.model})` : ""}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost shrink-0"
              >
                Request documents
              </a>
            </div>
          )}
        </section>

        {/* Build a system */}
        <section id="system" className="scroll-mt-40">
          <p className="eyebrow">Build a complete system</p>
          <h2 className="mt-3 text-3xl font-extrabold">Works well with</h2>
          <p className="mt-3 max-w-2xl text-[15.5px] text-muted">
            Pair this {cat.singular.toLowerCase()} with matching components. Our team will confirm compatibility and sizing for your installation.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {compatible.map((e) => (
              <ProductCard key={e.product.slug} card={toCard(e)} />
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section>
            <p className="eyebrow">Alternatives</p>
            <h2 className="mt-3 text-3xl font-extrabold">Other {series.name} models</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((e) => (
                <ProductCard key={e.product.slug} card={toCard(e)} />
              ))}
            </div>
          </section>
        )}
      </div>

      <CtaBand title={`Interested in the ${p.name}?`} text="Get current pricing and availability, and advice on the right components for your system." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
