import { createClient } from "@supabase/supabase-js";

// Public Supabase client. Uses the publishable key only: every read and write it makes is
// limited by Row Level Security to what an anonymous visitor may do (read the published
// catalogue and site settings, submit enquiries). Never use the service role key here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env and fill them in.");
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
