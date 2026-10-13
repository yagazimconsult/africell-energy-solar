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
| Phone, WhatsApp, email, address | ⏳ Placeholders (by your choice, for now) |
| Online preview link (Vercel) | ⏳ Waiting for you to connect Vercel |
| Domain name | ⏳ Not bought yet |
| Inverter & solar panel datasheets from Lagos | ⏳ Waiting on supplier |

---

## Log

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
