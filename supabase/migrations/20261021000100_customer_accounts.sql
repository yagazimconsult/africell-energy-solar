-- Customer accounts (optional for visitors): profile, saved sizing calculations, and a link from
-- enquiries to the signed-in customer who sent them. Guests keep using every form unchanged.
-- Customers can only ever see and change their own rows; admins can read everything.

-- ── Profiles ────────────────────────────────────────────────────────────────────────────────
create table public.customer_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (full_name is null or char_length(btrim(full_name)) between 1 and 120),
  phone text check (phone is null or phone ~ '^[+0-9][0-9 -]{6,39}$'),
  company_name text check (company_name is null or char_length(company_name) <= 160),
  buyer_type text not null default 'retail' check (buyer_type in ('retail', 'bulk')),
  city text check (city is null or char_length(city) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger customer_profiles_updated_at before update on public.customer_profiles for each row execute function private.set_updated_at();

-- Creates the profile when someone registers, from the details typed on the sign-up form.
-- Invalid values are dropped rather than blocking the registration.
create function private.handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name text := nullif(left(btrim(coalesce(meta ->> 'full_name', '')), 120), '');
  v_phone text := nullif(left(btrim(coalesce(meta ->> 'phone', '')), 40), '');
  v_company text := nullif(left(btrim(coalesce(meta ->> 'company_name', '')), 160), '');
  v_type text := case when meta ->> 'buyer_type' = 'bulk' then 'bulk' else 'retail' end;
begin
  if v_phone is not null and v_phone !~ '^[+0-9][0-9 -]{6,39}$' then
    v_phone := null;
  end if;
  insert into public.customer_profiles (id, full_name, phone, company_name, buyer_type)
  values (new.id, v_name, v_phone, v_company, v_type)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_customer() from public, anon, authenticated;

create trigger on_auth_user_created_customer
  after insert on auth.users
  for each row execute function private.handle_new_customer();

-- ── Saved sizing calculations ───────────────────────────────────────────────────────────────
create table public.saved_sizings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 80),
  -- {applianceId: quantity} so the calculator can be reopened exactly as it was.
  appliances jsonb not null check (jsonb_typeof(appliances) = 'object' and pg_column_size(appliances) <= 4000),
  battery_share smallint not null check (battery_share between 0 and 100),
  load_kw numeric(8, 2) not null check (load_kw >= 0),
  daily_kwh numeric(8, 1) not null check (daily_kwh >= 0),
  -- Snapshot of the suggested inverter / battery / panels at the time of saving.
  recommendation jsonb not null default '{}' check (jsonb_typeof(recommendation) = 'object' and pg_column_size(recommendation) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index saved_sizings_user_created_idx on public.saved_sizings (user_id, created_at desc);
create trigger saved_sizings_updated_at before update on public.saved_sizings for each row execute function private.set_updated_at();

-- Keeps one account from filling the table.
create function private.limit_saved_sizings()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.saved_sizings where user_id = new.user_id) >= 100 then
    raise exception 'You have reached the limit of 100 saved calculations. Please delete some first.';
  end if;
  return new;
end;
$$;

create trigger saved_sizings_limit before insert on public.saved_sizings for each row execute function private.limit_saved_sizings();

-- ── Link enquiries to the signed-in customer ───────────────────────────────────────────────
-- Filled automatically from the sign-in token (null for guests); the website never sends it.
alter table public.enquiries add column user_id uuid default auth.uid() references auth.users (id) on delete set null;
create index enquiries_user_created_idx on public.enquiries (user_id, created_at desc) where user_id is not null;

-- ── Row Level Security ─────────────────────────────────────────────────────────────────────
alter table public.customer_profiles enable row level security;
alter table public.saved_sizings enable row level security;

revoke all on public.customer_profiles, public.saved_sizings from anon, authenticated;

-- Profiles: created by the trigger above; customers read and edit their own.
grant select on public.customer_profiles to authenticated;
grant update (full_name, phone, company_name, buyer_type, city) on public.customer_profiles to authenticated;
create policy "Customers read own profile" on public.customer_profiles for select to authenticated using (id = (select auth.uid()));
create policy "Admins read profiles" on public.customer_profiles for select to authenticated using ((select private.is_admin()));
create policy "Customers update own profile" on public.customer_profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Saved calculations: fully private to their owner.
grant select, delete on public.saved_sizings to authenticated;
grant insert (title, appliances, battery_share, load_kw, daily_kwh, recommendation) on public.saved_sizings to authenticated;
grant update (title) on public.saved_sizings to authenticated;
create policy "Customers read own sizings" on public.saved_sizings for select to authenticated using (user_id = (select auth.uid()));
create policy "Customers add own sizings" on public.saved_sizings for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Customers rename own sizings" on public.saved_sizings for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Customers delete own sizings" on public.saved_sizings for delete to authenticated using (user_id = (select auth.uid()));

-- Enquiries: signed-in customers may read their own requests, but never the team's internal notes.
-- Table-wide SELECT is replaced with every column except admin_notes.
revoke select on public.enquiries from authenticated;
grant select (id, kind, name, phone, email, location, message, items, source_page, status, created_at, updated_at, user_id) on public.enquiries to authenticated;
create policy "Customers read own enquiries" on public.enquiries for select to authenticated using (user_id = (select auth.uid()));
