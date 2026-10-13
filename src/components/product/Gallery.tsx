"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-mist to-white ring-1 ring-line">
        <Image key={images[active]} src={images[active]} alt={alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="animate-fade-up object-contain mix-blend-multiply p-8 md:p-12" />
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative size-20 shrink-0 overflow-hidden rounded-xl bg-mist transition-shadow ${i === active ? "ring-2 ring-brand" : "ring-1 ring-line hover:ring-slate-300"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain mix-blend-multiply p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
