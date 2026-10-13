import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Calculator, Cpu, Handshake, Home as HomeIcon, MapPin, ShieldCheck, Sun, TrendingUp } from "lucide-react";
import { categories } from "@/data/catalog";
import { articleImageClass, articles, solutions } from "@/data/content";
import { allProducts, toCard } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { CtaBand, SectionHeading } from "@/components/ui";

const featured = ["5kva-hybrid-inverter", "hy-lfp-512200-10kwh", "hy-lfp-512300-15kwh", "gl-mono-550w"]
  .map((slug) => allProducts.find((e) => e.product.slug === slug)!)
  .filter(Boolean);

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src="/images/site/hero-home-night.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[70%_center] opacity-80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/10" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden />
        <div className="container-x grid min-h-[620px] items-center gap-10 py-20 md:min-h-[680px] lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/85 ring-1 ring-white/15 backdrop-blur">
              <MapPin className="size-3.5 text-sun" aria-hidden /> Now in Aba, Abia State
            </p>
            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.1rem]">
              Power that stays on,
              <span className="block bg-gradient-to-r from-amber-300 via-sun to-sun-2 bg-clip-text text-transparent">day and night.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-white/75">
              Africell hybrid inverters, LiFePO4 lithium batteries and monocrystalline solar panels, with honest system sizing and local support from our Aba team.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-sun">
                Explore products <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/support/sizing-guide" className="btn btn-glass">
                <Calculator className="size-4" aria-hidden /> Size my system
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
              {[
                ["5–10kVA", "Hybrid inverters"],
                ["Up to 15kWh", "Per battery pack"],
                ["180–650W", "Solar modules"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-xl font-extrabold text-white sm:text-2xl">{v}</dd>
                  <dd className="mt-1 text-[12.5px] text-white/55">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Product categories */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading
          eyebrow="Products"
          title="Everything you need for a complete solar system"
          intro="Three product families, designed to work together: inverters to convert, batteries to store and panels to generate."
          action={{ label: "View all products", href: "/products" }}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {categories.map((cat) => {
            const count = cat.series.reduce((n, s) => n + s.products.length, 0);
            return (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className={`group relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.75rem] p-7 bg-mist text-ink transition-shadow hover:shadow-lift`}
              >
                <div className="relative z-10">
                  <p className={`text-[12px] font-bold uppercase tracking-[0.14em] text-brand`}>{count} models</p>
                  <h3 className="mt-2 text-2xl font-extrabold">{cat.name}</h3>
                  <p className={`mt-2 max-w-xs text-[14.5px] leading-relaxed text-muted`}>{cat.short}</p>
                </div>
                <div className="relative mt-auto h-56">
                  <Image src={cat.image} alt={cat.name} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-contain mix-blend-multiply object-bottom transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className={`absolute bottom-6 right-6 z-10 grid size-11 place-items-center rounded-full bg-ink text-white transition-transform group-hover:-rotate-45`}>
                  <ArrowRight className="size-5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How a system works */}
      <section className="bg-mist py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="How solar works"
            title="One system, three parts, working together"
            intro="Solar panels generate power by day. The inverter runs your home and charges the battery. The battery keeps you powered through the night and during outages."
            align="center"
          />
          <ol className="mt-14 grid gap-4 md:grid-cols-4">
            {[
              { icon: Sun, title: "Generate", text: "Monocrystalline panels turn sunlight into DC electricity.", href: "/products/solar-panels" },
              { icon: Cpu, title: "Convert", text: "The hybrid inverter's MPPT charger harvests solar and powers your appliances.", href: "/products/inverters" },
              { icon: BatteryCharging, title: "Store", text: "LiFePO4 batteries store surplus energy for evenings and outages.", href: "/products/lithium-batteries" },
              { icon: HomeIcon, title: "Power", text: "Your home or business runs quietly, without generator noise or fumes.", href: "/solutions" },
            ].map((s, i) => (
              <li key={s.title} className="relative">
                <Link href={s.href} className="card card-hover flex h-full flex-col p-6">
                  <span className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-sun-2 text-white shadow-[0_10px_24px_-10px_rgb(249_115_22/0.8)]">
                      <s.icon className="size-6" aria-hidden />
                    </span>
                    <span className="font-display text-4xl font-extrabold text-line">0{i + 1}</span>
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.text}</p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading eyebrow="Popular choices" title="Featured products" action={{ label: "Browse the catalogue", href: "/products" }} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((e) => (
            <ProductCard key={e.product.slug} card={toCard(e)} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <Image src="/images/site/product-family.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.12]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow !text-sun">Why buy from us</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-[2.5rem]">Genuine products. Local people. Straight answers.</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-white/70">
              We are an Aba business. You can visit us, see the equipment, and speak to the same team before and after you buy.
            </p>
            <Link href="/about" className="btn btn-glass mt-8">
              About us <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Genuine Africell products", text: "Sourced directly through Africell Energy Solar's supply chain." },
              { icon: MapPin, title: "Local in Aba", text: "A showroom you can visit, and a team that answers the phone." },
              { icon: Calculator, title: "Honest sizing", text: "We size systems to your real load, not the biggest invoice." },
              { icon: TrendingUp, title: "Built to grow", text: "Parallel-capable inverters and batteries expand with your needs." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur">
                <f.icon className="size-6 text-sun" aria-hidden />
                <h3 className="mt-4 text-[17px] font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading eyebrow="Solutions" title="Systems for every kind of building" action={{ label: "All solutions", href: "/solutions" }} />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {solutions.map((s) => (
            <Link key={s.slug} href={`/solutions/${s.slug}`} className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 text-white">
              <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" aria-hidden />
              <div className="relative">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-sun">{s.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-extrabold">{s.name}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{s.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold">
                  Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sizing guide band */}
      <section className="container-x">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-sun-50 p-8 ring-1 ring-amber-200/60 md:p-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow">Free sizing guide</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">Not sure what size system you need?</h2>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-muted">
              Tell us which appliances you want to run. Our guide estimates the inverter, battery storage and solar array you need, then sends your list to our team for a quote.
            </p>
            <Link href="/support/sizing-guide" className="btn btn-sun mt-8">
              <Calculator className="size-4" aria-hidden /> Start sizing
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              ["Peak load", "≈ 2.4 kW"],
              ["Daily energy", "≈ 9.1 kWh"],
              ["Inverter", "5 kVA"],
              ["Battery", "7.68 kWh"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-white p-5 shadow-card">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">{l}</p>
                <p className="mt-1.5 font-display text-xl font-extrabold text-ink">{v}</p>
              </div>
            ))}
            <p className="col-span-2 text-[12px] text-muted">Example result for a typical 3-bedroom home</p>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="container-x py-20 md:py-28">
        <SectionHeading eyebrow="News & guides" title="Learn before you buy" action={{ label: "All articles", href: "/news" }} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.slug} href={`/news/${a.slug}`} className="card card-hover group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] bg-mist">
                <Image src={a.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className={`${articleImageClass(a.image)} transition-transform duration-500 group-hover:scale-[1.03]`} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[12.5px] text-muted">
                  {new Date(a.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} · {a.readMinutes} min read
                </p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand">{a.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-line px-6 py-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="flex items-center gap-3 text-[15px] text-muted">
            <Handshake className="size-5 shrink-0 text-brand" aria-hidden />
            Independent Aba dealer of Africell Energy Solar products.
          </p>
          <Link href="/about" className="text-[14px] font-semibold text-brand">
            How we work with Africell →
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
