-- Row Level Security.
-- Public (anon): read published catalogue + site settings, submit enquiries. Nothing else.
-- Admins (signed in and listed in admin_users): full read/write on catalogue, prices, enquiries, settings.

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.product_series enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;
alter table public.admin_users enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- Catalogue: published rows for everyone; admins see and edit everything.
do $$
declare t text;
begin
  foreach t in array array['brands', 'categories', 'product_series', 'products'] loop
    execute format('create policy "Public reads published %1$s" on public.%1$I for select to anon using (is_published)', t);
    execute format('create policy "Signed-in read %1$s" on public.%1$I for select to authenticated using (is_published or (select private.is_admin()))', t);
    execute format('create policy "Admins insert %1$s" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "Admins update %1$s" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "Admins delete %1$s" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end $$;

-- Prices: admins only. Public has no access at all.
revoke all on public.product_prices from anon;
create policy "Admins read prices" on public.product_prices for select to authenticated using ((select private.is_admin()));
create policy "Admins add prices" on public.product_prices for insert to authenticated with check ((select private.is_admin()));
create policy "Admins correct prices" on public.product_prices for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Admin list: a signed-in user may see their own row; admins may see all. Changes only via the dashboard.
revoke all on public.admin_users from anon;
create policy "Users see own admin row" on public.admin_users for select to authenticated using (user_id = (select auth.uid()) or (select private.is_admin()));

-- Enquiries: anyone may submit a new one (limited columns); only admins can read or update.
revoke all on public.enquiries from anon, authenticated;
grant insert (kind, name, phone, email, location, message, items, source_page) on public.enquiries to anon, authenticated;
grant select, update on public.enquiries to authenticated;
create policy "Anyone submits enquiries" on public.enquiries for insert to anon, authenticated with check (status = 'new' and admin_notes is null);
create policy "Admins read enquiries" on public.enquiries for select to authenticated using ((select private.is_admin()));
create policy "Admins update enquiries" on public.enquiries for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Site settings: everyone reads; admins update.
revoke insert, delete on public.site_settings from anon, authenticated;
create policy "Public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins update settings" on public.site_settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
