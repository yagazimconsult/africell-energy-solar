import type { Metadata } from "next";
import { getCatalogue, productHref, type ProductEntry } from "@/lib/catalog";
import { PageHero } from "@/components/ui";
import { SizingCalculator, type SizingOption } from "./SizingCalculator";

export const metadata: Metadata = {
  title: "Solar System Sizing Guide",
  description: "Estimate the inverter, lithium battery and solar panels your home or business needs. Free sizing guide from Africell Energy Solar, Aba.",
  alternates: { canonical: "/support/sizing-guide" },
};

const PREFERRED_PANEL_W = 550;

function option(e: ProductEntry, rating: number): SizingOption {
  return { key: `${e.category.slug}/${e.product.slug}`, name: e.product.name, model: e.product.model, href: productHref(e), image: e.product.image, rating };
}

export default async function SizingGuidePage() {
  const { allProducts } = await getCatalogue();

  const inverters = allProducts
    .filter((e) => e.product.facets.powerKva)
    .map((e) => option(e, e.product.facets.powerKva!))
    .sort((a, b) => a.rating - b.rating);
  // Recommend packs from one series so a multi-pack system stays homogeneous.
  const batterySeries = allProducts.find((e) => e.product.facets.capacityKwh)?.series;
  const batteries = allProducts
    .filter((e) => e.series === batterySeries && e.product.facets.capacityKwh)
    .map((e) => option(e, e.product.facets.capacityKwh!))
    .sort((a, b) => a.rating - b.rating);
  const panels = allProducts.filter((e) => e.product.facets.wattage);
  const panelEntry = panels.find((e) => e.product.facets.wattage === PREFERRED_PANEL_W) ?? panels[panels.length - 1];

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Solar system sizing guide"
        intro="Pick the appliances you want to power. We estimate your inverter, battery storage and solar array, and you can send the result straight to our team."
        crumbs={[{ label: "Support", href: "/support" }, { label: "Sizing guide" }]}
      />
      <section className="container-x py-14 md:py-20">
        {inverters.length && batteries.length && panelEntry ? (
          <SizingCalculator inverters={inverters} batteries={batteries} panel={option(panelEntry, panelEntry.product.facets.wattage!)} />
        ) : (
          <p className="text-muted">The sizing guide is temporarily unavailable. Please contact us for help sizing your system.</p>
        )}
      </section>
    </>
  );
}
