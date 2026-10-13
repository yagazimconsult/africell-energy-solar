import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

// TODO: have these terms reviewed by the business's legal adviser before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Use" crumbs={[{ label: "Terms" }]} />
      <section className="container-x prose-body max-w-3xl py-14">
        <p>By using this website you agree to these terms.</p>
        <h2>Product information</h2>
        <p>Product descriptions and specifications are based on information published by the manufacturer and are provided for guidance. Specifications may change. Always confirm the exact model, specification and price with our team before you buy.</p>
        <h2>Prices and availability</h2>
        <p>Prices are provided on request and are valid for the period stated on your quote. Availability shown on this website is indicative and confirmed at the time of order.</p>
        <h2>Sizing estimates</h2>
        <p>The sizing guide gives an estimate only. A final system design is confirmed by our team based on your actual requirements.</p>
        <h2>Trademarks</h2>
        <p>Africell and the Africell logo are trademarks of their respective owner and are used by {site.name} Aba as a dealer of Africell products.</p>
      </section>
    </>
  );
}
