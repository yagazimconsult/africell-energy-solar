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
  /** "contact" | "quote" | "maintenance" */
  requestType?: string;
  /** Short reference shown to the customer (e.g. Q-1014-4821). */
  reference?: string;
  /** Extra labelled details (purchase type, urgency, product…). */
  details?: Record<string, unknown>;
  website?: string; // honeypot
}

const REQUEST_LABELS: Record<string, string> = { quote: "QUOTE REQUEST", maintenance: "MAINTENANCE / REPAIR REQUEST", contact: "ENQUIRY" };

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
  const requestType = body.requestType && body.requestType in REQUEST_LABELS ? body.requestType : "contact";
  const reference = /^[QME]-\d{4}-\d{4}$/.test(String(body.reference ?? "")) ? String(body.reference) : "";
  const details =
    body.details && typeof body.details === "object"
      ? Object.entries(body.details)
          .slice(0, 12)
          .map(([k, v]) => [clean(k, 60), clean(v, 600)] as const)
          .filter(([k, v]) => k && v)
      : [];
  // Request type, reference and details are kept in the message so the team sees everything in one place.
  const message = [
    `[${REQUEST_LABELS[requestType]}${reference ? ` · Ref ${reference}` : ""}]`,
    ...details.map(([k, v]) => `${k}: ${v}`),
    clean(body.message, 3000),
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 4000);
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
    kind: requestType === "quote" || items.length ? "quote" : "contact",
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
          subject: `${REQUEST_LABELS[requestType].toLowerCase().replace(/^./, (c) => c.toUpperCase())}${reference ? ` ${reference}` : ""} from ${name}`,
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
