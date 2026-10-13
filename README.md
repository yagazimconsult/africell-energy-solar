# Africell Energy Solar — Aba website

Next.js 15 (App Router) + Tailwind CSS v4 + Supabase. Site architecture follows deyeinverter.com:
📋 **Progress log:** see [docs/PROGRESS.md](docs/PROGRESS.md) for what has been done and what is next.

Home · Products (Brand → Category → Series → Model) · Solutions · Support · Download · News · About Us · Contact.

## Run

```bash
cp .env.example .env   # then fill in the Supabase URL and publishable key
npm install
npm run dev            # http://localhost:3000
npm run build          # production build
```

## Where things live

| What | Where |
|---|---|
| Product catalogue, availability labels | Supabase tables `brands`, `categories`, `product_series`, `products` |
| Phone, WhatsApp, email, address, hours | Supabase table `site_settings` (one row) |
| Enquiries & quote requests | Supabase table `enquiries` |
| Prices (selling + cost, admin-only, history kept) | Supabase table `product_prices` |
| Who is an admin | Supabase table `admin_users` |
| Database schema, security policies, seed data | `supabase/migrations/` |
| Solutions, FAQs, guides/articles | `src/data/content.ts` |
| Product images | `public/images/products` (regenerate with `node scripts/prepare-images.mjs`) |

Pages are pre-rendered and re-read the database at most every **5 minutes**, so admin edits
appear on the site without a redeploy.

### Spec tables
Each series has a `spec_layout` (groups → rows). A row with a `shared` value applies to every
model; otherwise each product supplies its value in `products.spec_values` (keyed by row label).
A missing value displays as "To be confirmed".

## Security model (Row Level Security)

| Table | Public (website visitors) | Admins (signed in + listed in `admin_users`) |
|---|---|---|
| brands, categories, product_series, products | Read **published** rows only | Read / add / edit / delete |
| site_settings | Read | Edit |
| enquiries | **Submit only** — cannot read any enquiry | Read / update status & notes |
| product_prices | No access | Read / add / correct (no deletes) |
| admin_users | No access | Read (changes only via the Supabase dashboard) |

The website uses only the **publishable key**. The service role / secret key must never be used
in this project's frontend.

### Making someone an admin
1. Supabase dashboard → **Authentication → Users → Add user** (email + password).
2. **Authentication → Sign In / Providers**: turn off "Allow new users to sign up".
3. **SQL Editor**: `insert into public.admin_users (user_id) select id from auth.users where email = 'owner@example.com';`

Until the admin area is built, admins edit data in the Supabase **Table Editor**.

## Before launch

- [ ] Real address, phone, WhatsApp number, email and hours in `site_settings`
- [ ] Domain purchased; set `NEXT_PUBLIC_SITE_URL`
- [ ] Written brand-use permission from Africell Energy Solar (Lagos)
- [ ] High-resolution / vector logo from Africell (current file is 350×100 px)
- [ ] Inverter datasheets (all three models): only ratings are published today
- [ ] Per-model solar panel datasheets (source site repeated one model's figures for every wattage)
- [ ] AF-WM-512300-A010 battery datasheet
- [ ] Confirmed warranty terms per product
- [ ] Real photos: showroom, team, installations in Aba
- [ ] Review About page story; legal review of Privacy & Terms (NDPA 2023)
- [ ] Optional email copies of enquiries: set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`
- [ ] Google Business Profile for the Aba showroom
