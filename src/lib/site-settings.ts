import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { CATALOGUE_REVALIDATE } from "@/lib/catalog";
import type { Contact } from "@/config/site";

interface SettingsRow {
  business_name: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  phone_display: string;
  phone_e164: string;
  whatsapp_number: string;
  email: string;
  map_url: string;
  hours: Contact["hours"];
  social: Record<string, string>;
}

const loadSettings = unstable_cache(
  async (): Promise<Contact> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("business_name, address_line, city, state, country, phone_display, phone_e164, whatsapp_number, email, map_url, hours, social")
      .eq("id", 1)
      .single<SettingsRow>();
    if (error) throw new Error(`Could not load site settings from Supabase: ${error.message}`);
    return {
      businessName: data.business_name,
      addressLine: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      phone: data.phone_display,
      phoneHref: data.phone_e164 ? `tel:${data.phone_e164}` : "/contact",
      whatsapp: data.whatsapp_number,
      email: data.email,
      mapUrl: data.map_url,
      hours: data.hours,
      social: data.social,
    };
  },
  ["site-settings"],
  { revalidate: CATALOGUE_REVALIDATE, tags: ["site-settings"] },
);

/** Business contact details from the `site_settings` table. */
export const getContact = cache(loadSettings);
