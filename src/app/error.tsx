"use client";

import Link from "next/link";
import { RefreshCw, WifiOff } from "lucide-react";

// Shown when a page can't be built, usually because the connection to the product database
// dropped and no saved copy was available. Keeps the site's look and offers a retry.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-sun-50 text-sun-2">
        <WifiOff className="size-8" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold">We couldn&apos;t load this page</h1>
      <p className="mt-3 max-w-md text-muted">This is usually a brief connection problem. Please try again in a moment.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className="btn btn-sun">
          <RefreshCw className="size-4" aria-hidden /> Try again
        </button>
        <Link href="/contact" className="btn btn-ghost">
          Contact us
        </Link>
      </div>
    </section>
  );
}
