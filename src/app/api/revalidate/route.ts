import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Refreshes the cached catalogue and site settings immediately after an edit in Supabase,
// instead of waiting up to 5 minutes. Protected by the server-only REVALIDATE_SECRET.
// Usage: open /api/revalidate?secret=<REVALIDATE_SECRET> in a browser.
export async function GET(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = new URL(req.url).searchParams.get("secret");
  if (!secret || given !== secret) {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  }
  revalidateTag("catalogue");
  revalidateTag("site-settings");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, refreshed: ["catalogue", "site-settings"], at: new Date().toISOString() });
}
