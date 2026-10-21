import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { AccountClient } from "./AccountClient";

export const metadata: Metadata = {
  title: "My Account",
  description: "Sign in to save your solar sizing calculations and follow your quotes and service requests.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Customer account"
        title="My account"
        intro="Save your sizing calculations, follow your quotes and service requests, and re-order faster. An account is optional: every form on the site works without one."
        crumbs={[{ label: "My account" }]}
      />
      <section className="container-x py-14 md:py-20">
        <AccountClient />
      </section>
    </>
  );
}
