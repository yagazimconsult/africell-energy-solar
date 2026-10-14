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

/**
 * Every WhatsApp message starts with a labelled request type, so the team can see at a glance
 * whether a chat is a purchase, a repair, a product question or something else.
 */
export const WA_TOPICS = {
  purchase: { emoji: "🛒", label: "PURCHASE / QUOTE REQUEST", option: "Buy products or get a quote", line: "I'd like to buy solar products / get a quote." },
  maintenance: { emoji: "🔧", label: "MAINTENANCE / REPAIR REQUEST", option: "Maintenance or repair", line: "I need maintenance or a repair for my solar system." },
  product: { emoji: "💬", label: "PRODUCT ENQUIRY", option: "Question about a product", line: "I have a question about one of your products." },
  datasheet: { emoji: "📄", label: "DATASHEET REQUEST", option: "Datasheet or manual", line: "Please send me a product datasheet / manual." },
  general: { emoji: "❓", label: "GENERAL ENQUIRY", option: "Something else", line: "I have an enquiry." },
} as const;

export type WaTopic = keyof typeof WA_TOPICS;

/** Builds a labelled WhatsApp message: request-type header, greeting, then the given lines. */
export function waMessage(topic: WaTopic, ...lines: (string | false | null | undefined)[]) {
  const t = WA_TOPICS[topic];
  const body = lines.filter(Boolean) as string[];
  return [`${t.emoji} *${t.label}*`, "", "Hello Africell Solar Aba,", ...(body.length ? body : [t.line])].join("\n");
}
