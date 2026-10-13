// Fixed brand details for the Aba website. Contact details (phone, WhatsApp, address,
// hours) live in the Supabase `site_settings` table — see src/lib/site-settings.ts.

export const site = {
  name: "Africell Energy Solar",
  shortName: "Africell Solar Aba",
  tagline: "Premium solar power, delivered and supported in Aba.",
  description:
    "Africell Energy Solar, Aba: hybrid inverters, LiFePO4 lithium batteries and monocrystalline solar panels for homes, shops and businesses across Abia State and the South-East.",
  // TODO: replace with the purchased domain.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.africellsolaraba.com",
  deyeSiteUrl: "", // TODO: link to the Deye website once it is live.
} as const;

export interface Contact {
  businessName: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  /** tel: link, or the contact page while no number is set. */
  phoneHref: string;
  /** International digits only, e.g. 2348012345678. Empty until set. */
  whatsapp: string;
  email: string;
  mapUrl: string;
  hours: { days: string; time: string }[];
  social: Record<string, string>;
}

/** WhatsApp chat link with an optional pre-filled message. Falls back to the contact page until a number is set. */
export function whatsappHref(whatsapp: string, message?: string) {
  if (!whatsapp) return "/contact";
  const base = `https://wa.me/${whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
