import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about buying solar, choosing an inverter and lithium battery, and after-sales support at Africell Energy Solar, Aba.",
  alternates: { canonical: "/support/faq" },
};

export default function FaqPage() {
  const groups = [...new Set(faqs.map((f) => f.group))];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <PageHero eyebrow="Support" title="Frequently asked questions" crumbs={[{ label: "Support", href: "/support" }, { label: "FAQs" }]} />
      <section className="container-x max-w-4xl py-16 md:py-20">
        {groups.map((g) => (
          <div key={g} className="mb-12">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand">{g}</h2>
            <div className="mt-4 divide-y divide-line rounded-2xl ring-1 ring-line">
              {faqs
                .filter((f) => f.group === g)
                .map((f) => (
                  <details key={f.q} className="group px-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16.5px] font-semibold [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="pb-6 text-[15.5px] leading-relaxed text-ink/75">{f.a}</p>
                  </details>
                ))}
            </div>
          </div>
        ))}
      </section>
      <CtaBand title="Still have a question?" text="Message our team on WhatsApp or request a call back." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
