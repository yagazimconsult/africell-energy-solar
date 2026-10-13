import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator } from "lucide-react";
import { solutions } from "@/data/content";
import { getCatalogue, getCategory } from "@/lib/catalog";
import { CtaBand, PageHero } from "@/components/ui";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const sol = solutions.find((x) => x.slug === slug);
  if (!sol) return {};
  return { title: `${sol.name} Solar Solutions in Aba`, description: sol.summary, alternates: { canonical: `/solutions/${sol.slug}` }, openGraph: { images: [sol.image] } };
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const s = solutions.find((x) => x.slug === slug);
  if (!s) notFound();
  const catalogue = await getCatalogue();

  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.name} intro={s.summary} image={s.image} crumbs={[{ label: "Solutions", href: "/solutions" }, { label: s.name }]} />

      <section className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow">Our approach</p>
          {s.intro.map((t, i) => (
            <p key={i} className="mt-4 text-[17px] leading-relaxed text-ink/80">
              {t}
            </p>
          ))}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {s.needs.map((n) => (
              <div key={n.title} className="card p-5">
                <h2 className="text-[16px] font-bold">{n.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-[1.75rem] bg-mist p-7">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Typical system</h2>
          <dl className="mt-4 divide-y divide-line">
            {s.typical.map((t) => (
              <div key={t.label} className="flex justify-between gap-4 py-3.5">
                <dt className="text-[14.5px] text-muted">{t.label}</dt>
                <dd className="text-[15px] font-bold">{t.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] text-muted">Every system is sized to your actual load. These are common starting points, not fixed packages.</p>
          <Link href="/support/sizing-guide" className="btn btn-sun mt-6 w-full">
            <Calculator className="size-4" aria-hidden /> Estimate my system
          </Link>
        </aside>
      </section>

      <section className="bg-mist py-16 md:py-20">
        <div className="container-x">
          <h2 className="text-3xl font-extrabold">Products for this solution</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {s.categories.map((slug) => {
              const c = getCategory(catalogue, slug);
              if (!c) return null;
              return (
                <Link key={slug} href={`/products/${slug}`} className="card card-hover group flex items-center gap-5 p-5">
                  <span className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                    <Image src={c.image} alt="" fill sizes="96px" className="object-contain mix-blend-multiply p-2" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold group-hover:text-brand">{c.name}</span>
                    <span className="mt-1 block text-[13.5px] leading-snug text-muted">{c.short}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand">
                      View range <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
