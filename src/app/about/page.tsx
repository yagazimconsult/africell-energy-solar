import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Handshake, MapPin, ShieldCheck, Target, Truck } from "lucide-react";
import { site } from "@/config/site";
import { CtaBand, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.name}, Aba: an independent Aba business supplying genuine Africell inverters, lithium batteries and solar panels across Abia State.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Bringing premium solar to Aba" intro="An independent, Aba-based business supplying genuine Africell solar products, with the local support that a long-term investment deserves." image="/images/site/gen-showroom-africell.webp" crumbs={[{ label: "About us" }]} />

      <section className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Local business. Proven products.</h2>
          {/* TODO: owner to review and personalise this story (founding year, team, location). */}
          <p className="mt-5 text-[17px] leading-relaxed text-ink/80">
            {site.name} Aba was set up to give homes and businesses in Aba and the wider South-East direct access to Africell solar products, without the trip to Lagos.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-ink/80">
            We source our inverters, lithium batteries and solar panels from Africell Energy Solar and hold stock at our own warehouse in Aba. We run our own business, serve our own customers, and stand behind every sale with local advice and support.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-mist">
          <Image src="/images/site/gen-product-family.webp" alt="The Africell Premium range: hybrid inverter, wall and floor-standing lithium batteries and solar panels" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-mist py-16 md:py-24">
        <div className="container-x grid gap-5 md:grid-cols-2">
          <div className="card p-8">
            <Target className="size-7 text-brand" aria-hidden />
            <h2 className="mt-4 text-2xl font-extrabold">Our mission</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">To make reliable, clean power accessible to every home and business in Aba, with honest advice, genuine products and support you can count on.</p>
          </div>
          <div className="card p-8">
            <Eye className="size-7 text-brand" aria-hidden />
            <h2 className="mt-4 text-2xl font-extrabold">Our vision</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">To be the South-East&apos;s most trusted name in solar energy: the first call for homeowners, traders and institutions moving away from generators.</p>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <p className="eyebrow">How we work</p>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">What you can expect from us</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Genuine supply", text: "Products sourced through Africell Energy Solar's supply chain." },
            { icon: Truck, title: "Stock in Aba", text: "Our own warehouse in Aba, so you are not waiting on Lagos." },
            { icon: Handshake, title: "Honest advice", text: "Systems sized to your real needs, explained in plain language." },
            { icon: MapPin, title: "Local support", text: "A team you can visit and call, before and after you buy." },
          ].map((v) => (
            <div key={v.title} className="card p-6">
              <v.icon className="size-6 text-sun-2" aria-hidden />
              <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x">
        <div className="rounded-2xl border border-line p-6 text-[14px] leading-relaxed text-muted md:p-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink">About the Africell brand</h2>
          <p className="mt-3">
            Africell Energy Solar manufactures and supplies solar panels, inverters and lithium batteries, with operations in Nigeria and other African markets. {site.name} Aba is an independently owned and operated business that sells Africell products in Aba and Abia State.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
