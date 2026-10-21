import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <>
      <PageHero title="Choose a new password" crumbs={[{ label: "My account", href: "/account" }, { label: "New password" }]} />
      <section className="container-x py-14 md:py-20">
        <ResetPasswordForm />
      </section>
    </>
  );
}
