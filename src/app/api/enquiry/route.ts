import { NextResponse } from "next/server";
import { site } from "@/config/site";

// Receives enquiries and quote requests from the website.
// Email delivery uses Resend (https://resend.com) when RESEND_API_KEY is set.
// Without it the endpoint returns 503 and the form offers WhatsApp instead,
// so no enquiry is ever silently lost. In Phase 4 this will also write the
// enquiry into the central inventory/CRM system.

interface EnquiryBody {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  message?: string;
  items?: { name: string; model?: string; qty: number }[];
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
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const location = clean(body.location, 160);
  const message = clean(body.message, 4000);
  const items = Array.isArray(body.items)
    ? body.items.slice(0, 50).map((i) => ({ name: clean(i?.name, 160), model: clean(i?.model, 80), qty: Math.max(1, Math.min(999, Number(i?.qty) || 1)) }))
    : [];

  if (!name || !/^[+\d][\d\s-]{6,}$/.test(phone)) {
    return NextResponse.json({ error: "Please provide your name and a valid phone number." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please check your email address." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL ?? site.contact.email;
  const from = process.env.ENQUIRY_FROM_EMAIL ?? `Website <noreply@${new URL(site.url).hostname.replace(/^www\./, "")}>`;
  if (!apiKey) {
    return NextResponse.json({ error: "Online enquiries are not yet enabled. Please contact us on WhatsApp." }, { status: 503 });
  }

  const lines = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    email && `Email: ${email}`,
    location && `Location: ${location}`,
    items.length > 0 && `\nProducts:\n${items.map((i) => `- ${i.qty} × ${i.name}${i.model ? ` (${i.model})` : ""}`).join("\n")}`,
    message && `\nMessage:\n${message}`,
  ].filter(Boolean);

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

  if (!res.ok) {
    console.error("Enquiry email failed", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn't send your message. Please contact us on WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
