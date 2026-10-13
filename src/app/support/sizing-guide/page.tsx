import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { SizingCalculator } from "./SizingCalculator";

export const metadata: Metadata = {
  title: "Solar System Sizing Guide",
  description: "Estimate the inverter, lithium battery and solar panels your home or business needs. Free sizing guide from Africell Energy Solar, Aba.",
  alternates: { canonical: "/support/sizing-guide" },
};

export default function SizingGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Solar system sizing guide"
        intro="Pick the appliances you want to power. We estimate your inverter, battery storage and solar array, and you can send the result straight to our team."
        crumbs={[{ label: "Support", href: "/support" }, { label: "Sizing guide" }]}
      />
      <section className="container-x py-14 md:py-20">
        <SizingCalculator />
      </section>
    </>
  );
}
