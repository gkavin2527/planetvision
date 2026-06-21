-- ============================================================
--  Urban Nest — Database Schema
--  Run this in the Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Properties
-- ------------------------------------------------------------
create table if not exists properties (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text not null,
  price         numeric not null,
  price_type    text not null default 'sale',      -- 'sale' | 'rent'
  location      text not null,
  city          text not null,
  bedrooms      integer not null,
  bathrooms     integer not null,
  area          numeric not null,                  -- sq ft
  property_type text not null,                     -- 'apartment' | 'villa' | 'penthouse' | 'house'
  images        text[] default '{}',              -- Supabase Storage public URLs
  amenities     text[] default '{}',
  featured      boolean default false,
  status        text default 'available',          -- 'available' | 'sold' | 'rented'
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ------------------------------------------------------------
-- Inquiries
-- ------------------------------------------------------------
create table if not exists inquiries (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  status      text default 'new',                  -- 'new' | 'contacted' | 'closed'
  property_id uuid references properties(id) on delete set null,
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- Auto-update updated_at trigger
-- ------------------------------------------------------------
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists properties_updated_at on properties;
create trigger properties_updated_at
  before update on properties
  for each row execute function update_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table properties enable row level security;
alter table inquiries  enable row level security;

-- Public can read properties
drop policy if exists "Public read properties" on properties;
create policy "Public read properties"
  on properties for select using (true);

-- Public can insert inquiries
drop policy if exists "Public insert inquiries" on inquiries;
create policy "Public insert inquiries"
  on inquiries for insert with check (true);

-- Authenticated (admin) full access
drop policy if exists "Admin full access properties" on properties;
create policy "Admin full access properties"
  on properties for all
  using (auth.role() = 'authenticated');

drop policy if exists "Admin full access inquiries" on inquiries;
create policy "Admin full access inquiries"
  on inquiries for all
  using (auth.role() = 'authenticated');

-- ============================================================
--  Storage — property images bucket
-- ============================================================
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images"
  on storage.objects for select
  using (bucket_id = 'property-images');

drop policy if exists "Admin upload property images" on storage.objects;
create policy "Admin upload property images"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

drop policy if exists "Admin delete property images" on storage.objects;
create policy "Admin delete property images"
  on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');
