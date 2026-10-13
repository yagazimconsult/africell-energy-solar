// Central business details for the Aba website.
// Every value marked TODO must be replaced with the real Aba details before launch.

export const site = {
  name: "Africell Energy Solar",
  shortName: "Africell Solar Aba",
  tagline: "Premium solar power, delivered and supported in Aba.",
  description:
    "Africell Energy Solar, Aba: hybrid inverters, LiFePO4 lithium batteries and monocrystalline solar panels for homes, shops and businesses across Abia State and the South-East.",
  // TODO: replace with the purchased domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.africellsolaraba.com",

  contact: {
    // TODO: exact street address of the Aba showroom / warehouse.
    addressLine: "Showroom address to be confirmed",
    city: "Aba",
    state: "Abia State",
    country: "Nigeria",
    // TODO: real numbers. Phone in display form, WhatsApp in international digits only.
    phone: "+234 000 000 0000",
    phoneHref: "tel:+2340000000000",
    whatsapp: "2340000000000",
    // TODO: real mailbox on the new domain.
    email: "sales@africellsolaraba.com",
    // TODO: confirm opening hours.
    hours: [
      { days: "Monday – Friday", time: "8:00am – 6:00pm" },
      { days: "Saturday", time: "9:00am – 4:00pm" },
      { days: "Sunday", time: "Closed" },
    ],
    // TODO: Google Maps share link / embed for the showroom.
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Aba%2C+Abia+State%2C+Nigeria",
  },

  social: {
    // TODO: add real profiles when created.
    facebook: "",
    instagram: "",
    tiktok: "",
  },

  deyeSiteUrl: "", // TODO: link to the Deye website once it is live.
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
