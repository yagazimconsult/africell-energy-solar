// Shapes and helpers for customer-account data (Supabase tables saved_sizings and enquiries).

export interface SizingRecommendation {
  inverter?: string;
  battery?: string;
  panels?: string;
  storageKwh?: string;
  arrayKwp?: string;
}

export interface SavedSizing {
  id: string;
  title: string;
  appliances: Record<string, number>;
  battery_share: number;
  load_kw: number;
  daily_kwh: number;
  recommendation: SizingRecommendation;
  created_at: string;
}

export interface CustomerRequest {
  id: string;
  kind: "contact" | "quote";
  message: string | null;
  items: { name: string; model?: string; qty: number }[];
  status: "new" | "contacted" | "quoted" | "won" | "lost" | "spam";
  created_at: string;
}

/** What the customer sees for each internal status. */
export const REQUEST_STATUS: Record<CustomerRequest["status"], { label: string; tone: string }> = {
  new: { label: "Received", tone: "bg-brand-50 text-brand" },
  contacted: { label: "In progress", tone: "bg-sun-50 text-amber-800" },
  quoted: { label: "Quote sent", tone: "bg-sun-50 text-amber-800" },
  won: { label: "Completed", tone: "bg-green-50 text-green-700" },
  lost: { label: "Closed", tone: "bg-mist text-muted" },
  spam: { label: "Closed", tone: "bg-mist text-muted" },
};

/**
 * The API stores the request type, reference and details at the top of the message:
 * "[QUOTE REQUEST · Ref Q-1014-4821]\nPurchase type: Bulk purchase\n…". Split them back out.
 */
export function parseRequest(message: string | null) {
  const lines = (message ?? "").split("\n");
  const head = lines[0]?.match(/^\[(.+?)(?: · Ref ([QME]-\d{4}-\d{4}))?\]$/);
  const body = head ? lines.slice(1) : lines;
  const details: [string, string][] = [];
  const text: string[] = [];
  for (const line of body) {
    const m = line.match(/^([A-Z][A-Za-z /]{1,40}): (.+)$/);
    if (m && text.length === 0) details.push([m[1], m[2]]);
    else text.push(line);
  }
  const label = head?.[1] ?? "ENQUIRY";
  return {
    label: label.charAt(0) + label.slice(1).toLowerCase(),
    reference: head?.[2] ?? null,
    topic: label.startsWith("MAINTENANCE") ? ("maintenance" as const) : label.startsWith("QUOTE") ? ("purchase" as const) : ("general" as const),
    details,
    text: text.join("\n").trim(),
  };
}

export const formatDay = (iso: string) => new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
