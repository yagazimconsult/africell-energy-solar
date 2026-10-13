-- Catalogue: brand → category → series → product (Deye-style structure).
-- Public can read published rows; only admins can write (policies in a later migration).

create schema if not exists private;

-- Keeps updated_at current on every edit.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  logo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete restrict,
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  singular text not null,
  short_description text not null default '',
  description text not null default '',
  image text,
  -- Slugs of categories (same brand) whose products pair well with this one.
  pairs_with text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, slug)
);

create table public.product_series (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  tagline text not null default '',
  overview text[] not null default '{}',
  features jsonb not null default '[]' check (jsonb_typeof(features) = 'array'),
  applications text[] not null default '{}',
  gallery text[] not null default '{}',
  spec_status text not null default 'pending' check (spec_status in ('verified', 'partial', 'pending')),
  spec_note text,
  -- Spec table layout: [{title, rows: [{label, shared?}]}]. A row with "shared" applies to every
  -- model; otherwise each product supplies its own value in products.spec_values.
  spec_layout jsonb not null default '[]' check (jsonb_typeof(spec_layout) = 'array'),
  settings jsonb,
  guide jsonb not null default '[]' check (jsonb_typeof(guide) = 'array'),
  in_the_box text[] not null default '{}',
  downloads jsonb not null default '[]' check (jsonb_typeof(downloads) = 'array'),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.product_series (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  model text,
  chips text[] not null default '{}',
  power_kva numeric(8, 2) check (power_kva > 0),
  capacity_kwh numeric(8, 2) check (capacity_kwh > 0),
  wattage int check (wattage > 0),
  image text not null,
  gallery text[] not null default '{}',
  summary text not null default '',
  -- This model's values for rows in its series' spec_layout, keyed by row label.
  spec_values jsonb not null default '{}' check (jsonb_typeof(spec_values) = 'object'),
  -- Public stock signal only. Real quantities belong to the future inventory ledger.
  availability text not null default 'enquire' check (availability in ('in-stock', 'limited', 'on-order', 'enquire')),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_brand_id_idx on public.categories (brand_id);
create index product_series_category_id_idx on public.product_series (category_id);
create index products_series_id_idx on public.products (series_id);

create trigger brands_updated_at before update on public.brands for each row execute function private.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute function private.set_updated_at();
create trigger product_series_updated_at before update on public.product_series for each row execute function private.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function private.set_updated_at();
