// Turns the raw images pulled from africellsolar.com (in _source/africell-images)
// into clean, optimised assets under public/images.
// Run with: node scripts/prepare-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "_source/africell-images";
const OUT = "public/images";

const src = (name) => path.join(SRC, name);

// The 640x640 product shots carry the dealer logo in the top-left corner.
// Paint it out with the image's own background colour so cards look clean.
async function removeCornerLogo(file) {
  const img = sharp(src(file));
  const { data } = await img.clone().extract({ left: 630, top: 630, width: 4, height: 4 }).raw().toBuffer({ resolveWithObject: true });
  const [r, g, b] = data;
  const patch = await sharp({ create: { width: 232, height: 86, channels: 3, background: { r, g, b } } }).png().toBuffer();
  return img.composite([{ input: patch, left: 0, top: 0 }]);
}

async function save(pipeline, out, { width = 1600, quality = 82 } = {}) {
  const dest = path.join(OUT, out);
  await mkdir(path.dirname(dest), { recursive: true });
  await pipeline.resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(dest);
  console.log("✓", dest);
}

const jobs = [
  // Brand
  async () => {
    await mkdir(path.join(OUT, "brand"), { recursive: true });
    await sharp(src("2024_10_50-1.png")).toFile(path.join(OUT, "brand/logo.png"));
    await sharp(src("2024_10_400x400-1.png")).trim().toFile(path.join(OUT, "brand/logo-mark.png"));
    console.log("✓ brand logos");
  },

  // Inverters: only marketing thumbnails exist; crop the unit away from the baked-in text.
  // Lift its flat grey (239) studio background to white so it blends like the other shots.
  () => save(sharp(src("2024_11_2024110517444851.jpg")).extract({ left: 245, top: 0, width: 232, height: 319 }).linear(255 / 236, 0), "products/inverter-hybrid.webp"),

  // HY series batteries
  async () => save(await removeCornerLogo("2024_11_2024111112253534.jpg"), "products/hy-300-main.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111112254299.jpg"), "products/hy-300-front.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111112254313.jpg"), "products/hy-300-ports.webp"),
  () => save(sharp(src("2024_11_2024111114250282.jpg")), "products/hy-300-overview.webp"),
  () => save(sharp(src("2024_11_2024111114550430.jpg")), "products/hy-accessories.webp"),
  () => save(sharp(src("2024_11_2024111115031923.jpg")), "products/hy-wiring.webp"),

  async () => save(await removeCornerLogo("2024_11_2024111116192845.jpg"), "products/hy-200-main.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111116192929.jpg"), "products/hy-200-side.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111116193165.jpg"), "products/hy-200-ports.webp"),
  () => save(sharp(src("2024_11_2024111116270546.jpg")), "products/hy-200-overview.webp"),

  async () => save(await removeCornerLogo("2024_11_2024111116500122.jpg"), "products/hy-wall-main.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111116492520.jpg"), "products/hy-wall-front.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111116492517.jpg"), "products/hy-wall-ports.webp"),
  async () => save(await removeCornerLogo("2024_11_2024111116492661.jpg"), "products/hy-wall-terminals.webp"),
  () => save(sharp(src("2024_11_2024111116572996.jpg")), "products/hy-wall-overview.webp"),

  // AF-WM series
  () => save(sharp(src("2024_10_024092715223.jpg")), "products/af-wm-main.webp"),

  // GL-MONO panels
  async () => save(await removeCornerLogo("2024_11_001.jpg"), "products/panel-front.webp"),
  async () => save(await removeCornerLogo("2024_11_002.jpg"), "products/panel-detail.webp"),
  async () => save(await removeCornerLogo("2024_11_003.jpg"), "products/panel-pair.webp"),
  async () => save(await removeCornerLogo("2024_10_005.jpg"), "products/panel-classic.webp"),
  () => save(sharp(src("2024_11_2024110717272356.jpg")), "products/panel-connectors.webp"),

  // Site imagery
  () => save(sharp(src("2024_10_pop1.jpg")), "site/hero-home-night.webp", { width: 1920, quality: 78 }),
  () => save(sharp(src("2024_11_pop3-3.jpg")).extract({ left: 0, top: 270, width: 1920, height: 810 }), "site/product-family.webp", { width: 1920, quality: 80 }),
  () => save(sharp(src("2024_10_18757.jpg")), "site/rooftop-panels.webp"),
  () => save(sharp(src("2024_10_20362.jpg")), "site/africell-sign.webp"),
  () => save(sharp(src("2024_10_26576.jpg")).extract({ left: 0, top: 80, width: 1205, height: 747 }), "site/commercial-rooftop.webp"),
];

for (const job of jobs) await job();
