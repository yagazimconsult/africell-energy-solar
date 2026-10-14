import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { site } from "@/config/site";
import { getCatalogue } from "@/lib/catalog";
import { getContact } from "@/lib/site-settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { ContactProvider } from "@/components/ContactProvider";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import type { MenuCategory } from "@/components/layout/nav";
import "./globals.css";

// Pages are pre-rendered and refreshed from Supabase at most every 5 minutes.
export const revalidate = 300;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Aba | Inverters, Lithium Batteries & Solar Panels`,
    template: `%s | ${site.name} Aba`,
  },
  description: site.description,
  applicationName: site.shortName,
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: `${site.name} Aba`,
    images: [{ url: "/images/site/gen-villa.webp", width: 2000, height: 1131 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ categories }, contact] = await Promise.all([getCatalogue(), getContact()]);

  const menu: MenuCategory[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    short: c.short,
    image: c.image,
    series: c.series.map((s) => ({ slug: s.slug, name: s.name, products: s.products.map((p) => ({ slug: p.slug, name: p.name })) })),
  }));

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: `${site.name} Aba`,
    url: site.url,
    logo: `${site.url}/images/brand/logo.png`,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine,
      addressLocality: contact.city,
      addressRegion: contact.state,
      addressCountry: "NG",
    },
  };

  return (
    <html lang="en-NG" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-[100] rounded-md bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <ContactProvider contact={contact}>
          <QuoteProvider>
            <Header categories={menu} />
            <main id="main">{children}</main>
            <Footer />
            <FloatingWhatsApp />
          </QuoteProvider>
        </ContactProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
