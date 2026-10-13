"use client";

import { createContext, useContext } from "react";
import { whatsappHref, type Contact } from "@/config/site";

const ContactContext = createContext<Contact | null>(null);

/** Makes the business contact details (from Supabase) available to client components. */
export function ContactProvider({ contact, children }: { contact: Contact; children: React.ReactNode }) {
  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const contact = useContext(ContactContext);
  if (!contact) throw new Error("useContact must be used inside ContactProvider");
  return { ...contact, whatsappLink: (message?: string) => whatsappHref(contact.whatsapp, message) };
}
