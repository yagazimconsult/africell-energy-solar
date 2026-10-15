"use client";

import { useEffect, useRef, useState } from "react";

export interface ProductVideoSource {
  src: string;
  poster: string;
  /** The video was cut out onto pure black: blend it so the site's background shows through. */
  blackBackground?: boolean;
}

/**
 * Silent, looping product turntable video on the site's navy background.
 * Starts only when scrolled into view (saves mobile data) and stays a still image for visitors
 * who prefer reduced motion.
 */
export function ProductVideo({ video, label }: { video: ProductVideoSource; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sun-glow relative aspect-[4/3] overflow-hidden rounded-[1.75rem] ring-1 ring-line">
      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-16 -top-16 size-64 rounded-full bg-sun/25 blur-3xl" aria-hidden />
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={video.poster} alt={label} className={`absolute inset-0 size-full object-contain ${video.blackBackground ? "mix-blend-screen" : "p-4"}`} />
      ) : (
        <video
          ref={ref}
          className={`absolute inset-0 size-full object-contain ${video.blackBackground ? "mix-blend-screen" : "rounded-[1.25rem] p-4"}`}
          src={video.src}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        />
      )}
    </div>
  );
}
