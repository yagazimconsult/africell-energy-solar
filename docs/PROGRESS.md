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
| Quote: calculator → quote list → small/bulk purchase → WhatsApp customer care → invoice | ✅ Done |
| Maintenance & repair requests → WhatsApp technical team | ✅ Done |
| One WhatsApp number, every message labelled (purchase, maintenance, product, datasheet, general) | ✅ Done |
| Homepage slideshow with smooth image transitions (like Deye) | ✅ Done |
| Premium Africell-branded photos (modern homes, studio shots, showroom, contact cards) | ✅ All 9 live · showroom card waits for Google Business Profile |
| Phone, WhatsApp, email, address | ⏳ Placeholders (by your choice, for now) |
| Online preview link (Vercel) | ⏳ Waiting for you to connect Vercel |
| Domain name | ⏳ Not bought yet |
| Inverter & solar panel datasheets from Lagos | ⏳ Waiting on supplier |

---

## Next up

- "Visit the showroom" card photo and map: when the Google Business Profile is set up.
- See [IMAGE-BRIEFS.md](IMAGE-BRIEFS.md) for the full image plan.

---

## Log

### 2026-10-15 — Contact card images and storage slide
- Contact page cards now have premium Africell images across the top with the icon badge overlapping:
  **WhatsApp** (customer chatting at home, Africell battery behind), **Call us** (customer-care advisor,
  AFRICELL sign and inverter behind), **Email** (laptop with a quote email and an Africell brochure).
- **Visit the showroom** keeps a branded map-style header until the Google Business Profile photos/map.
- New luxury **technical-room** image (Africell inverter + two Africell batteries) added as homepage
  slide 3 ("Quiet, clean power through every outage") and as the LiFePO4 battery guide image.
- All AFRICELL lettering zoom-checked: spelled correctly.

### 2026-10-15 — Viewing locally & connection resilience
- Added **Start website.cmd**: double-click to run the site on this computer (opens http://localhost:3000).
- The site now retries database requests automatically when the internet briefly drops, and shows a
  friendly "We couldn't load this page, Try again" screen instead of a technical error if it is fully offline.

### 2026-10-14 — Slideshow arrows
- Homepage slideshow arrows moved to the sides like Deye's: previous arrow on the left, next arrow on the
  right, centred vertically and larger. On phones and tablets they stay small beside the dots (side arrows
  would cover the headline), and phones can now **swipe** left/right between slides.

### 2026-10-14 — Labelled WhatsApp requests
- One WhatsApp number for everything, but **every message now starts with what the customer wants**:
  🛒 PURCHASE / QUOTE REQUEST · 🔧 MAINTENANCE / REPAIR REQUEST · 💬 PRODUCT ENQUIRY ·
  📄 DATASHEET REQUEST · ❓ GENERAL ENQUIRY.
- General WhatsApp buttons (floating green button, header, footer, mobile menu, Contact page, call-to-action
  bands) now first ask **"What do you need?"** and open WhatsApp with the right label already typed in.
- Buttons that already know the reason (product pages, datasheet requests, quote form, service form,
  sizing calculator) go straight to WhatsApp with the matching label.

### 2026-10-14 — Quote flow and maintenance requests
- **Quote:** the sizing calculator's result (appliances, load, daily energy) now travels to the quote
  page together with the suggested products; quantities can be changed there. The quote form asks for
  **Small purchase or Bulk purchase** and whether **installation** is needed.
- After sending, the customer gets a **reference number** (e.g. Q-1014-4416), a clear "how payment works"
  note (no payment on the website; pay against the invoice sent by our team) and is taken to
  **WhatsApp customer care** with the whole quote already typed in.
- **Maintenance & repair:** new page (Support → Maintenance & Repair) where customers choose the product,
  urgency, describe the problem and pick a visit date; they get a reference (M-…) and continue on
  **WhatsApp with the technical team**. Linked from the menu, footer, Support, Warranty and every
  product page ("Already own one? Request service").
- Every request is saved in the database with its reference and details. No database changes were needed.
- WhatsApp hand-off goes to the Contact page until the real WhatsApp number is added.

### 2026-10-14 — Premium Africell images live
- Generated 5 premium images in the style of the Lagos Africell banners, with every inverter and battery
  drawn from photos of the real Africell units and showing the "Premium AFRICELL" name:
  ultra-modern villa at dusk, Africell product family on studio podiums, modern office with rooftop solar,
  upscale Africell showroom, family at home during a blackout.
- Zoom-checked all AFRICELL lettering: spelled correctly everywhere (the 15kWh battery even reads
  "LiFePO4 BATTERY 51.2V300AH", matching the real label).
- New homepage slideshow: villa → product family → office → showroom. Also updated the Home Solar,
  Shops & SMEs and Commercial pages, the About page, the "Why buy from us" band, two guides and the
  image shown when the site is shared on WhatsApp/social media.
- Removed every one of yesterday's plain images from the site.

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
