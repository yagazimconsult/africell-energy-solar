# Africell Energy Solar — Aba website

Next.js 15 (App Router) + Tailwind CSS v4. Site architecture follows deyeinverter.com:
Home · Products (Category → Series → Model) · Solutions · Support · Download · News · About Us · Contact.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (48 static pages)
```

## Where things live

| What | File |
|---|---|
| Business details (phone, WhatsApp, address, hours, domain) | `src/config/site.ts` |
| Product catalogue (categories, series, models, specs) | `src/data/catalog.ts` |
| Solutions, FAQs, guides/articles | `src/data/content.ts` |
| Product images | `public/images/products` (regenerate with `node scripts/prepare-images.mjs`) |
| Enquiry email endpoint | `src/app/api/enquiry/route.ts` |

Spec values set to `null` display as "To be confirmed". Fill them in as datasheets arrive.

## Before launch

- [ ] Real Aba address, phone, WhatsApp number, email and opening hours in `src/config/site.ts`
- [ ] Domain purchased; set `NEXT_PUBLIC_SITE_URL`
- [ ] Written brand-use permission from Africell Energy Solar (Lagos)
- [ ] High-resolution / vector logo from Africell (current file is 350×100 px)
- [ ] Inverter datasheets (all three models): only ratings are published today
- [ ] Per-model solar panel datasheets (source site repeated one model's figures for every wattage)
- [ ] AF-WM-512300-A010 battery datasheet
- [ ] Confirmed warranty terms per product
- [ ] Real photos: showroom, team, installations in Aba
- [ ] Review About page story; legal review of Privacy & Terms (NDPA 2023)
- [ ] Email delivery: create a Resend account, set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`
- [ ] Google Business Profile for the Aba showroom
