import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

// Where the word "SOLAR" ends inside the official logo image (measured from public/images/brand/logo.png):
// it spans the lower line of the wordmark and ends at ~61% of the image width.
const SOLAR_END_X = "60.7%";
const SOLAR_MID_Y = "79.5%";

// Light backgrounds use the official Africell Energy Solar logo unchanged, with the "Aba" tag set
// right after the word SOLAR. Dark backgrounds pair the official sun-and-globe symbol with white type.
export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  if (variant === "light") {
    return (
      <Link href="/" className={`flex shrink-0 items-center gap-3 ${className}`} aria-label={`${site.name} Aba, home`}>
        <Image src="/images/brand/logo-mark.png" alt="" width={354} height={163} className="h-10 w-auto" />
        <span className="font-display text-[15px] font-extrabold leading-tight tracking-tight text-white">
          AFRICELL ENERGY
          <span className="flex items-center gap-2">
            <span className="text-leaf">SOLAR</span>
            <AbaTag tone="light" />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`relative block shrink-0 ${className}`} aria-label={`${site.name} Aba, home`}>
      <Image src="/images/brand/logo.png" alt={site.name} width={295} height={68} priority className="h-10 w-auto sm:h-11" />
      <span className="absolute -translate-y-1/2" style={{ left: `calc(${SOLAR_END_X} + 7px)`, top: SOLAR_MID_Y }}>
        <AbaTag tone="dark" />
      </span>
    </Link>
  );
}

function AbaTag({ tone }: { tone: "dark" | "light" }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-[3px] text-[9.5px] font-extrabold uppercase leading-none tracking-[0.18em] sm:text-[10px] ${
        tone === "light" ? "bg-white/12 text-sun ring-1 ring-white/15" : "bg-sun-50 text-sun-2 ring-1 ring-amber-200/70"
      }`}
    >
      Aba
    </span>
  );
}
