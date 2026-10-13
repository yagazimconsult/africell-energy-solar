import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getCatalogue } from "@/lib/catalog";
import { getContact } from "@/lib/site-settings";
import { whatsappHref } from "@/config/site";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Datasheets, recommended settings and manuals for Africell inverters, lithium batteries and solar panels.",
  alternates: { canonical: "/downloads" },
};

export default async function DownloadsPage() {
  const [{ categories }, contact] = await Promise.all([getCatalogue(), getContact()]);
  return (
    <>
      <PageHero
        eyebrow="Download centre"
        title="Datasheets & manuals"
        intro="Technical documentation for every product series. Where a PDF is not yet published, request it and we will send it to you directly."
        crumbs={[{ label: "Downloads" }]}
      />
      <section className="container-x py-16 md:py-20">
        <div className="overflow-hidden rounded-2xl ring-1 ring-line">
          {categories.flatMap((cat) =>
            cat.series.map((s) => (
              <div key={s.slug} className="flex flex-col gap-4 border-b border-line p-5 last:border-b-0 md:flex-row md:items-center">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                  <Image src={s.gallery[0]} alt="" fill sizes="64px" className="object-contain mix-blend-multiply p-1.5" />
                </span>
                <div className="flex-1">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-muted">{cat.name}</p>
                  <Link href={`/products/${cat.slug}#${s.slug}`} className="text-[17px] font-bold hover:text-brand">
                    {s.name}
                  </Link>
                  <p className="text-[13.5px] text-muted">{s.products.length} models</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.downloads.map((d) => (
                    <a key={d.href} href={d.href} className="btn btn-ghost !py-2.5 !text-[13.5px]">
                      <FileText className="size-4" aria-hidden /> {d.title}
                    </a>
                  ))}
                  {s.settings && (
                    <Link href={`/products/${cat.slug}/${s.products[0].slug}#specifications`} className="btn btn-ghost !py-2.5 !text-[13.5px]">
                      Recommended settings
                    </Link>
                  )}
                  {s.guide && (
                    <Link href={`/products/${cat.slug}/${s.products[0].slug}#installation`} className="btn btn-ghost !py-2.5 !text-[13.5px]">
                      Installation guide
                    </Link>
                  )}
                  <a href={whatsappHref(contact.whatsapp, `Hello, please send me the datasheet and manual for the ${s.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-brand !py-2.5 !text-[13.5px]">
                    Request datasheet
                  </a>
                </div>
              </div>
            )),
          )}
        </div>
      </section>
    </>
  );
}
