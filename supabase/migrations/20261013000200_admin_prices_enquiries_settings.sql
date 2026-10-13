-- Admin users, prices (admin-only), enquiries (public submit, admin read) and site settings.

-- Who is an admin. Rows are added by the owner in the Supabase dashboard; no API policy allows inserts.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- True when the signed-in user is listed in admin_users. Lives in the non-exposed private schema.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

-- Price history: every change is a new row, nothing is overwritten.
create table public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  selling_price numeric(14, 2) not null check (selling_price >= 0),
  cost_price numeric(14, 2) check (cost_price >= 0),
  currency text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  effective_from timestamptz not null default now(),
  note text,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index product_prices_product_id_idx on public.product_prices (product_id, effective_from desc);
create index product_prices_created_by_idx on public.product_prices (created_by);

-- Contact and quote requests from the website.
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'contact' check (kind in ('contact', 'quote')),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  phone text not null check (phone ~ '^[+0-9][0-9 -]{6,39}$'),
  email text check (email is null or (char_length(email) <= 160 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  location text check (location is null or char_length(location) <= 160),
  message text check (message is null or char_length(message) <= 4000),
  -- [{name, model?, qty}] snapshot of the visitor's quote list.
  items jsonb not null default '[]' check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) <= 50),
  source_page text check (source_page is null or char_length(source_page) <= 300),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_status_created_idx on public.enquiries (status, created_at desc);
create trigger enquiries_updated_at before update on public.enquiries for each row execute function private.set_updated_at();

-- Business details shown across the site. Exactly one row.
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null,
  address_line text not null default '',
  city text not null default 'Aba',
  state text not null default 'Abia State',
  country text not null default 'Nigeria',
  phone_display text not null default '',
  phone_e164 text not null default '' check (phone_e164 = '' or phone_e164 ~ '^\+[0-9]{8,15}$'),
  whatsapp_number text not null default '' check (whatsapp_number = '' or whatsapp_number ~ '^[0-9]{8,15}$'),
  email text not null default '',
  map_url text not null default '',
  hours jsonb not null default '[]' check (jsonb_typeof(hours) = 'array'),
  social jsonb not null default '{}' check (jsonb_typeof(social) = 'object'),
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at before update on public.site_settings for each row execute function private.set_updated_at();
