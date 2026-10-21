import type { Metadata } from "next";
import { site } from "@/config/site";
import { getContact } from "@/lib/site-settings";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

// TODO: have this reviewed for compliance with the Nigeria Data Protection Act 2023 before launch.
export default async function PrivacyPage() {
  const contact = await getContact();
  return (
    <>
      <PageHero title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} />
      <section className="container-x prose-body max-w-3xl py-14">
        <p>This policy explains how {site.name} Aba collects and uses personal information through this website.</p>
        <h2>What we collect</h2>
        <p>When you send an enquiry or quote request we collect the details you provide: your name, phone number, and optionally your email address, location and message. If you contact us on WhatsApp, WhatsApp&apos;s own privacy terms also apply.</p>
        <h2>Customer accounts</h2>
        <p>An account is optional. If you create one, we keep your email address, a securely encrypted password (we cannot see it), your name, phone number, company and town if you add them, the sizing calculations you choose to save, and the quotes and service requests you send while signed in. Only you can see your account in the website; our team uses it to serve you. We never store payment card or bank details.</p>
        <p>You can edit your details at any time under My account. To delete your account and everything saved in it, contact us at {contact.email} or on WhatsApp and we will do so, keeping only records we must hold by law (for example invoices).</p>
        <h2>How we use it</h2>
        <p>We use your details only to respond to your enquiry, prepare quotes and provide after-sales support. We do not sell your information or share it with third parties for marketing.</p>
        <h2>How long we keep it</h2>
        <p>We keep enquiry records for as long as needed to serve you and to meet our legal and accounting obligations.</p>
        <h2>Your rights</h2>
        <p>Under the Nigeria Data Protection Act 2023 you may ask to access, correct or delete your personal data. Contact us at {contact.email}.</p>
        <h2>Cookies</h2>
        <p>This website stores your quote list in your own browser so it is still there when you return. If you sign in, your browser also keeps a sign-in token so you stay signed in until you sign out. It does not use advertising cookies.</p>
      </section>
    </>
  );
}
