import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { solutions } from "@/data/content";
import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Solar Solutions",
  description: "Solar and battery solutions for homes, shops, offices and institutions in Aba and across Abia State.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="The right system for every building" intro="Every property uses power differently. Choose the solution closest to yours to see how we approach it." crumbs={[{ label: "Solutions" }]} />
      <section className="container-x space-y-6 py-16 md:py-24">
        {solutions.map((s, i) => (
          <Link key={s.slug} href={`/solutions/${s.slug}`} className="card card-hover group grid overflow-hidden md:grid-cols-2">
            <div className={`relative min-h-[280px] ${i % 2 ? "md:order-2" : ""}`}>
              <Image src={s.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-extrabold">{s.name}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{s.summary}</p>
              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                {s.typical.map((t) => (
                  <div key={t.label}>
                    <dt className="text-[11.5px] font-semibold uppercase tracking-wider text-muted">{t.label.replace("Typical ", "")}</dt>
                    <dd className="mt-1 text-[14.5px] font-bold">{t.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="mt-7 inline-flex items-center gap-1.5 font-semibold text-brand">
                Explore solution <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
