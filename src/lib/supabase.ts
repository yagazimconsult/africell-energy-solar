import { createClient } from "@supabase/supabase-js";

// Public Supabase client. Uses the publishable key only: every read and write it makes is
// limited by Row Level Security to what an anonymous visitor may do (read the published
// catalogue and site settings, submit enquiries). Never use the service role key here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env and fill them in.");
}

const RETRY_DELAYS_MS = [700, 2000];
const TIMEOUT_MS = 12000;

/**
 * fetch with a timeout and retries on network failures (dropped connections, DNS hiccups).
 * Only reads are retried, so a form submission is never sent twice.
 */
const resilientFetch: typeof fetch = async (input, init) => {
  const method = (init?.method ?? "GET").toUpperCase();
  const retryable = method === "GET" || method === "HEAD";
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(TIMEOUT_MS) });
    } catch (err) {
      if (!retryable || attempt >= RETRY_DELAYS_MS.length) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
    }
  }
};

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: resilientFetch },
});
