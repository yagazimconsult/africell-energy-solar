import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articleImageClass, articles } from "@/data/content";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "News & Guides",
  description: "Solar buying guides, product explainers and news from Africell Energy Solar, Aba.",
  alternates: { canonical: "/news" },
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

export default function NewsPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <PageHero eyebrow="News & guides" title="Solar, explained" intro="Practical guides to help you choose, size and look after your solar system." crumbs={[{ label: "News" }]} />
      <section className="container-x py-16 md:py-20">
        <Link href={`/news/${lead.slug}`} className="card card-hover group grid overflow-hidden md:grid-cols-2">
          <div className="relative min-h-[260px] bg-mist">
            <Image src={lead.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className={articleImageClass(lead.image)} />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-[13px] text-muted">
              {formatDate(lead.date)} · {lead.readMinutes} min read
            </p>
            <h2 className="mt-3 text-3xl font-extrabold group-hover:text-brand">{lead.title}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{lead.excerpt}</p>
          </div>
        </Link>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((a) => (
            <Link key={a.slug} href={`/news/${a.slug}`} className="card card-hover group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/9] bg-mist">
                <Image src={a.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className={articleImageClass(a.image)} />
              </div>
              <div className="p-7">
                <p className="text-[13px] text-muted">
                  {formatDate(a.date)} · {a.readMinutes} min read
                </p>
                <h2 className="mt-2 text-xl font-bold group-hover:text-brand">{a.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
