import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

// Light backgrounds use the official Africell Energy Solar logo unchanged.
// Dark backgrounds pair the official sun mark with white type for legibility.
export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-3 ${className}`} aria-label={`${site.name} Aba, home`}>
      {variant === "dark" ? (
        <Image src="/images/brand/logo.png" alt={site.name} width={295} height={68} priority className="h-10 w-auto sm:h-11" />
      ) : (
        <>
          <Image src="/images/brand/logo-mark.png" alt="" width={354} height={272} className="h-10 w-auto" />
          <span className="font-display text-[15px] font-extrabold leading-tight tracking-tight text-white">
            AFRICELL ENERGY
            <span className="block text-leaf">SOLAR</span>
          </span>
        </>
      )}
      <span
        className={`hidden rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] sm:inline-block ${
          variant === "light" ? "bg-white/10 text-white/80" : "bg-sun-50 text-sun-2"
        }`}
      >
        Aba
      </span>
    </Link>
  );
}
