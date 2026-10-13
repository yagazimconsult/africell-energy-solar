# Africell Energy Solar (Aba) — Website Progress Log

This page is updated after every piece of work, so you can always see what has been done,
what is happening now, and what is next. Newest entries are at the top of the log.

**Current focus:** the Africell website only. (The Deye website and the inventory app come later,
only when you say so.)

---

## Where to see the website

| Where | Link | Notes |
|---|---|---|
| On this computer | http://localhost:3000 | Works while the site is running on this PC. |
| Online preview (any phone or computer) | _Not set up yet_ | Will be a Vercel link once you connect the GitHub repo to Vercel. See "How to get an online preview link" below. |
| Code | https://github.com/yagazimconsult/africell-energy-solar | Every change is committed here with a description. |

---

## Status at a glance

| Area | Status |
|---|---|
| Website design & all pages (Home, Products, Solutions, Support, Download, News, About, Contact, Quote) | ✅ Done |
| Product catalogue: 18 products (3 inverters, 5 batteries, 10 panels) with Deye-style spec tables | ✅ Done |
| Product data stored in Supabase (Africell project) | ✅ Done |
| Enquiry & quote forms saved to Supabase | ✅ Done |
| Sizing calculator (appliances → inverter, battery, panels) | ✅ Done |
| Homepage slideshow with smooth image transitions (like Deye) | ✅ Done |
| Premium Africell-branded photos (modern homes, studio shots, showroom) | ⏳ 6 planned, queued (generator daily limit) |
| Phone, WhatsApp, email, address | ⏳ Placeholders (by your choice, for now) |
| Online preview link (Vercel) | ⏳ Waiting for you to connect Vercel |
| Domain name | ⏳ Not bought yet |
| Inverter & solar panel datasheets from Lagos | ⏳ Waiting on supplier |

---

## Next up (queued — image generator hit its daily limit)

**New image direction (your feedback):** the first generated photos were too plain. All site photos
will be redone as **modern, premium images** (luxury villa, studio product shots, upscale showroom),
and **every inverter and battery shown will be a real Africell unit with "Premium AFRICELL" on it**,
in the style of the Lagos Africell banners. Six images are planned. See
[IMAGE-BRIEFS.md](IMAGE-BRIEFS.md) for each image, where it will be used, and its status.

---

## Log

### 2026-10-13 — Slideshow, scroll animations and our own photos
- Homepage hero is now a Deye-style slideshow: 4 slides that crossfade every 7 seconds with a slow
  zoom, animated headlines, arrows and progress dots. Pauses when you hover; respects phones set to
  "reduce motion".
- Cards and section titles now fade up gently as you scroll.
- Generated 5 original, high-quality photos set in Nigeria (modern Aba home at dusk, utility room with
  inverter and battery, school/clinic campus with rooftop solar, installers on a roof, a showroom).
  Equipment is unbranded and there is no text or logos in them.
- Replaced every house/rooftop/lifestyle photo that came from the Lagos website. Africell product photos
  (inverters, batteries, panels) are still used, since they show the actual products.
- 4 more photos (Aba shop street, family at home during an outage, panel close-up, bungalow at sunset)
  could not be generated today: the image account hit its daily limit. Queued for next time.

### 2026-10-13 — Progress log and preview
- Added this progress log (`docs/PROGRESS.md`).
- Scope confirmed: Africell website only; contact details stay placeholders.

### 2026-10-13 — Connected the website to Supabase
- Created database tables for the catalogue (brand → category → series → product), enquiries,
  site settings (phone/email/address/hours), prices (admin-only) and admin users.
- Security: visitors can only read the published catalogue and submit enquiries.
  Removed a default permission that would have allowed wiping tables. Supabase security check: no issues.
- Loaded all 18 products into the database; the website now reads everything from it
  (changes show on the site within 5 minutes).
- Every enquiry and quote request is now saved, so none are lost.
- Tested: pages load from the database; a test enquiry was stored (marked "spam" as a test);
  invalid phone numbers and spam bots are rejected.

### 2026-10-12 — Code on GitHub
- Pushed the website to `yagazimconsult/africell-energy-solar`; `.env` and secrets excluded.
- Added the project-only Supabase connection.

### 2026-10-11 — Built the Africell website
- Reviewed africellsolar.com and deyeinverter.com; adopted Deye's site structure.
- Pulled product information, images and the logo from africellsolar.com; cleaned the images.
- Found data problems on the Lagos site (identical specs for every solar panel, empty inverter pages);
  only verified figures are shown, the rest say "To be confirmed".
- Built all pages, mobile-friendly, with WhatsApp enquiry buttons and a quote list.

---

## How to get an online preview link

1. Go to https://vercel.com and sign in **with the yagazimconsult GitHub account**.
2. Click **Add New → Project**, choose `africell-energy-solar`, click **Import**.
3. Under **Environment Variables**, add the two values from the `.env` file on this computer:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Click **Deploy**. After a minute or two you get a link like
   `https://africell-energy-solar.vercel.app` that opens on any phone or computer.

After that, every change pushed to GitHub updates the preview link automatically.
