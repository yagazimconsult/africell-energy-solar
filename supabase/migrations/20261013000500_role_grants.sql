-- Explicit table privileges. This project does not grant API roles access by default,
-- and the defaults it did give included TRUNCATE, which bypasses Row Level Security.
-- RLS policies (previous migrations) still decide which rows each role can touch.

-- Remove dangerous defaults from every public table.
revoke truncate, trigger, references on all tables in schema public from anon, authenticated;

-- Catalogue: everyone may read (RLS limits anon to published rows); signed-in users may write
-- (RLS limits writes to admins).
grant select on public.brands, public.categories, public.product_series, public.products to anon, authenticated;
grant insert, update, delete on public.brands, public.categories, public.product_series, public.products to authenticated;

-- Site settings: everyone reads, admins update (RLS).
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;

-- Prices: signed-in only, admins via RLS. No delete: history is kept.
grant select, insert, update on public.product_prices to authenticated;

-- Admin list: signed-in users may read their own row (RLS). Changes only via the dashboard.
grant select on public.admin_users to authenticated;

-- Enquiries: column-limited insert for everyone, admin read/update — granted in the RLS migration.
