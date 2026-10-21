"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase client for the visitor's browser, used for customer accounts. Same publishable key as
// the server client; the signed-in customer's session is kept in their browser, and Row Level
// Security limits them to their own profile, saved calculations and requests.
let client: SupabaseClient | null = null;

export function browserSupabase() {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "africell-aba-auth" },
    });
  }
  return client;
}

/** Access token of the signed-in customer, or null for guests. */
export async function currentAccessToken() {
  try {
    const { data } = await browserSupabase().auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}
