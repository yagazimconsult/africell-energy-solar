import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-line">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-muted">The page may have moved. Try our product catalogue or get in touch.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn btn-brand">
          Browse products
        </Link>
        <Link href="/contact" className="btn btn-ghost">
          Contact us
        </Link>
      </div>
    </section>
  );
}
