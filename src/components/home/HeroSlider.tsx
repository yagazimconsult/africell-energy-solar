"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export interface HeroSlide {
  image: string;
  /** CSS object-position for the photo, e.g. "70% center". */
  focus?: string;
  eyebrow: string;
  title: string;
  highlight: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

const INTERVAL_MS = 7000;

// Deye-style hero carousel: slow crossfade between full-bleed photos with a gentle zoom,
// headline animating in per slide. Pauses on hover/focus, when the tab is hidden, and
// never auto-advances for visitors who prefer reduced motion.
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mq.removeEventListener("change", onChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduced, go, slides.length]);

  const slide = slides[index];

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative isolate overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      {/* Background photos: all stacked, the active one fades in and slowly zooms out. */}
      {slides.map((s, i) => (
        <div
          key={s.image}
          aria-hidden={i !== index}
          className={`absolute inset-0 -z-20 transition-opacity duration-[1400ms] ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectPosition: s.focus ?? "center" }}
            className={`object-cover ${i === index && !reduced ? "animate-ken-burns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/5" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      <div className="container-x grid min-h-[640px] items-center py-20 md:min-h-[720px]">
        <div key={index} className="max-w-2xl" aria-live={paused ? "polite" : "off"}>
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/85 ring-1 ring-white/15 backdrop-blur">
            <MapPin className="size-3.5 text-sun" aria-hidden /> {slide.eyebrow}
          </p>
          <h1 className="animate-fade-up mt-6 text-[2.6rem] font-extrabold leading-[1.04] [animation-delay:120ms] sm:text-6xl lg:text-[4.1rem]">
            {slide.title}
            <span className="block bg-gradient-to-r from-amber-300 via-sun to-sun-2 bg-clip-text text-transparent">{slide.highlight}</span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-[17.5px] leading-relaxed text-white/80 [animation-delay:240ms]">{slide.text}</p>
          <div className="animate-fade-up mt-9 flex flex-wrap gap-3 [animation-delay:360ms]">
            <Link href={slide.primary.href} className="btn btn-sun">
              {slide.primary.label} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href={slide.secondary.href} className="btn btn-glass">
              {slide.secondary.label}
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="container-x absolute inset-x-0 bottom-8 flex items-center justify-between gap-6">
          <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.title} ${s.highlight}`}
                onClick={() => go(i)}
                className="group relative h-1.5 w-12 overflow-hidden rounded-full bg-white/20 sm:w-16"
              >
                {i === index && (
                  <span
                    key={`${index}-${paused}-${reduced}`}
                    className={`absolute inset-y-0 left-0 rounded-full bg-sun ${paused || reduced ? "w-full" : "animate-slide-progress"}`}
                    style={{ animationDuration: `${INTERVAL_MS}ms` }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/20">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/20">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
