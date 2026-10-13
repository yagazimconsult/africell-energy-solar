import { solutions } from "@/data/content";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  kind?: "products" | "list";
  children?: NavLink[];
}

/** Serialisable category summary for the header's Products mega menu. */
export interface MenuCategory {
  slug: string;
  name: string;
  short: string;
  image: string;
  series: { slug: string; name: string; products: { slug: string; name: string }[] }[];
}

// Top-level structure follows Deye's information architecture:
// Home · Products · Solutions · Support · Download · News · About Us · Contact
export function buildNav(categories: MenuCategory[]): NavItem[] {
  return [
    {
      label: "Products",
      href: "/products",
      kind: "products",
      children: categories.map((c) => ({ label: c.name, href: `/products/${c.slug}`, description: c.short })),
    },
    {
      label: "Solutions",
      href: "/solutions",
      kind: "list",
      children: solutions.map((s) => ({ label: s.name, href: `/solutions/${s.slug}`, description: s.summary })),
    },
    {
      label: "Support",
      href: "/support",
      kind: "list",
      children: [
        { label: "System Sizing Guide", href: "/support/sizing-guide", description: "Estimate the inverter, battery and panels you need." },
        { label: "FAQs", href: "/support/faq", description: "Answers to the questions customers ask most." },
        { label: "Warranty & After-sales", href: "/support/warranty", description: "How warranty and service work with us." },
      ],
    },
    { label: "Download", href: "/downloads" },
    { label: "News", href: "/news" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
}
