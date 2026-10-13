import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { QuoteList } from "./QuoteList";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a quote for Africell inverters, lithium batteries and solar panels from Africell Energy Solar, Aba.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Quote request"
        title="Request a quote"
        intro="Send us your product list or tell us what you want to power. We will reply with current pricing, availability and recommendations."
        crumbs={[{ label: "Request a quote" }]}
      />
      <section className="container-x py-14 md:py-20">
        <QuoteList />
      </section>
    </>
  );
}
