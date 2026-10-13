import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleImageClass, articles } from "@/data/content";
import { site } from "@/config/site";
import { Breadcrumbs, CtaBand } from "@/components/ui";

type Params = { params: Promise<{ slug: string }> };

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt, alternates: { canonical: `/news/${a.slug}` }, openGraph: { type: "article", images: [a.image] } };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = articles.filter((x) => x.slug !== a.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.date,
    image: `${site.url}${a.image}`,
    publisher: { "@type": "Organization", name: `${site.name} Aba` },
  };

  return (
    <>
      <article className="container-x max-w-3xl py-10 md:py-14">
        <Breadcrumbs items={[{ label: "News", href: "/news" }, { label: a.title }]} />
        <p className="mt-10 text-[13.5px] text-muted">
          {formatDate(a.date)} · {a.readMinutes} min read
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">{a.title}</h1>
        <p className="mt-5 text-[19px] leading-relaxed text-muted">{a.excerpt}</p>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-mist">
          <Image src={a.image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className={articleImageClass(a.image)} />
        </div>
        <div className="prose-body mt-10 text-[17px]">
          {a.body.map((b, i) => (
            <div key={i}>
              {b.heading && <h2>{b.heading}</h2>}
              <p>{b.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-line pt-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Keep reading</p>
          <ul className="mt-4 space-y-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/news/${o.slug}`} className="text-lg font-bold hover:text-brand">
                  {o.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
