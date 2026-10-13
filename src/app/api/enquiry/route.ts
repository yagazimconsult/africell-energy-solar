import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { supabase } from "@/lib/supabase";

// Receives enquiries and quote requests from the website and stores them in the Supabase
// `enquiries` table using the publishable key. Row Level Security only lets the public
// insert new enquiries (never read them), so no privileged key is needed here.
// If RESEND_API_KEY is set, a copy is also emailed to the team.

interface EnquiryBody {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  message?: string;
  items?: { name: string; model?: string; qty: number }[];
  sourcePage?: string;
  website?: string; // honeypot
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: EnquiryBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they don't retry.
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40).replace(/\s+/g, " ");
  const email = clean(body.email, 160).toLowerCase();
  const location = clean(body.location, 160);
  const message = clean(body.message, 4000);
  const sourcePage = clean(body.sourcePage, 300);
  const items = Array.isArray(body.items)
    ? body.items.slice(0, 50).map((i) => ({ name: clean(i?.name, 160), model: clean(i?.model, 80) || undefined, qty: Math.max(1, Math.min(999, Number(i?.qty) || 1)) }))
    : [];

  if (!name || !/^[+0-9][0-9 -]{6,39}$/.test(phone)) {
    return NextResponse.json({ error: "Please provide your name and a valid phone number." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please check your email address." }, { status: 422 });
  }

  const { error } = await supabase.from("enquiries").insert({
    kind: items.length ? "quote" : "contact",
    name,
    phone,
    email: email || null,
    location: location || null,
    message: message || null,
    items,
    source_page: sourcePage || null,
  });
  if (error) {
    console.error("Enquiry insert failed", error.message);
    return NextResponse.json({ error: "We couldn't send your message. Please contact us on WhatsApp." }, { status: 502 });
  }

  // Optional email copy; the enquiry is already safely stored, so failures here are only logged.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (apiKey && to) {
    const from = process.env.ENQUIRY_FROM_EMAIL ?? `Website <noreply@${new URL(site.url).hostname.replace(/^www\./, "")}>`;
    const lines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      email && `Email: ${email}`,
      location && `Location: ${location}`,
      items.length > 0 && `\nProducts:\n${items.map((i) => `- ${i.qty} × ${i.name}${i.model ? ` (${i.model})` : ""}`).join("\n")}`,
      message && `\nMessage:\n${message}`,
      sourcePage && `\nSent from: ${site.url}${sourcePage}`,
    ].filter(Boolean);
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email || undefined,
          subject: `${items.length ? "Quote request" : "Website enquiry"} from ${name}`,
          text: lines.join("\n"),
        }),
      });
      if (!res.ok) console.error("Enquiry email failed", res.status);
    } catch (err) {
      console.error("Enquiry email failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
