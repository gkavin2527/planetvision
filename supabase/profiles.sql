-- ============================================================
--  Urban Nest — Role-Based Access Control (profiles + roles)
--  Run AFTER schema.sql in the Supabase SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Role enum
-- ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'user');
  end if;
end$$;

-- ------------------------------------------------------------
-- 2. Profiles table (1:1 with auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep updated_at fresh (reuses update_updated_at() from schema.sql)
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

-- ------------------------------------------------------------
-- 3. SECURITY DEFINER role check
--    Bypasses RLS so it can be called *inside* policies without
--    causing infinite recursion (a policy querying its own table).
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- 4. Auto-create a profile whenever a new auth user signs up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 5. Prevent privilege escalation
--    A non-admin can edit their own profile but NOT their role.
-- ------------------------------------------------------------
create or replace function public.protect_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change a user role';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_role_change();

-- ------------------------------------------------------------
-- 6. Row Level Security for profiles
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Read: own profile, or everything if admin
drop policy if exists "Profiles: read own or admin" on public.profiles;
create policy "Profiles: read own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Update: own profile (role change blocked by trigger) or admin
drop policy if exists "Profiles: update own or admin" on public.profiles;
create policy "Profiles: update own or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Insert: admins only (normal signups insert via the SECURITY DEFINER trigger)
drop policy if exists "Profiles: admin insert" on public.profiles;
create policy "Profiles: admin insert"
  on public.profiles for insert
  with check (public.is_admin());

-- Delete: admins only
drop policy if exists "Profiles: admin delete" on public.profiles;
create policy "Profiles: admin delete"
  on public.profiles for delete
  using (public.is_admin());

-- ------------------------------------------------------------
-- 7. Tighten content tables to require the admin role
--    (replaces the "any authenticated user" policies from schema.sql)
--    Public read of properties and public insert of inquiries are
--    unaffected — those policies still live in schema.sql.
-- ------------------------------------------------------------
drop policy if exists "Admin full access properties" on public.properties;
create policy "Admin full access properties"
  on public.properties for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin full access inquiries" on public.inquiries;
create policy "Admin full access inquiries"
  on public.inquiries for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
--  8. Create / promote the FIRST admin
--     The dashboard-created auth user has no profile row yet
--     (it predates the trigger), so we backfill + promote here.
--     Replace the email if yours differs. Safe to re-run.
-- ============================================================
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'admin@urbannest.com'
on conflict (id) do update set role = 'admin';
