import type { ProductVideoSource } from "@/components/product/ProductVideo";

// Turntable videos shown on the category pages, keyed by product-series slug.
// Each video was checked frame by frame so the right product goes with the right series.
// blackBackground: background removed onto black; the site's navy shows through (no re-encoding).
export const seriesVideos: Record<string, ProductVideoSource> = {
  // Africell Premium hybrid inverter (white, round display, side vents).
  "premium-hybrid-inverters": { src: "/videos/africell-inverter.mp4", poster: "/videos/africell-inverter-poster.webp", blackBackground: true },
  // Africell wall-mounted LiFePO4 battery (white with blue sides, handle, small display).
  "hy-series": { src: "/videos/africell-battery.mp4", poster: "/videos/africell-battery-poster.webp", blackBackground: true },
  // Monocrystalline solar panel on a stand.
  "gl-mono-series": { src: "/videos/africell-panel.mp4", poster: "/videos/africell-panel-poster.webp", blackBackground: true },
};
