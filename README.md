# Planetvision — Luxury Real Estate Platform

A premium, production-ready luxury real estate platform built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Public site** — cinematic hero with parallax, animated search, featured listings, stats counters, testimonials, about, blog, FAQ, and a full property catalog with filtering, sorting, and pagination.
- **Property detail** — gallery with lightbox, amenities, embedded map, inquiry form, and similar listings.
- **Admin portal** (`/admin`) — Supabase Auth login, dashboard with live stats, property CRUD with image upload to Supabase Storage, and inquiry management with status updates.
- **Design system** — Playfair Display + Inter, warm cream/bark/sand palette, signature image-clipped giant footer logo.

## Tech Stack

| Layer        | Choice                                   |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 14 (App Router)                  |
| Language     | TypeScript                               |
| Styling      | Tailwind CSS + CSS custom properties     |
| Animation    | Framer Motion                            |
| Backend      | Supabase (Postgres + Auth + Storage)     |
| Deployment   | Vercel                                   |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials
(Supabase Dashboard → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=your-random-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> The app renders gracefully (empty states) until these are set, so you can
> preview the UI before wiring up the backend.

### 3. Set up the database

In the Supabase **SQL Editor**, run, in order:

1. [`supabase/schema.sql`](supabase/schema.sql) — properties/inquiries tables, RLS policies, triggers, and the `property-images` storage bucket.
2. [`supabase/profiles.sql`](supabase/profiles.sql) — `profiles` table, `user_role` enum, signup trigger, `is_admin()` helper, role RLS, and the first-admin backfill.
3. [`supabase/seed.sql`](supabase/seed.sql) — 12 sample properties.

### 4. Create the admin user

Either use the script (uses your service role key, pre-confirms the email):

```bash
node --env-file=.env.local scripts/create-admin.mjs
# → admin@urbannest.com / Admin@123
```

…or Supabase Dashboard → **Authentication → Users → Add User** (check **Auto Confirm User**).

### Role-based access (admin authorization)

Only users with `role = 'admin'` in the `profiles` table may access `/admin/*`.
The bottom of [`supabase/profiles.sql`](supabase/profiles.sql) backfills and promotes
`admin@urbannest.com`. To promote any other user later:

```bash
node --env-file=.env.local scripts/promote-admin.mjs you@example.com
# demote with: ... scripts/promote-admin.mjs you@example.com user
```

Or in SQL:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin' from auth.users where email = 'you@example.com'
on conflict (id) do update set role = 'admin';
```

How it works:
- New signups auto-get a `profiles` row with `role = 'user'` (via an `on auth.users` trigger).
- [`middleware.ts`](middleware.ts) → unauthenticated users hitting `/admin/*` go to `/admin/login`; authenticated non-admins are bounced to `/`; only admins get in.
- The login form rejects non-admin accounts; admin API routes re-check the role server-side (defense in depth); RLS restricts all writes to `is_admin()`.
- A trigger blocks non-admins from changing their own `role` (no privilege escalation).

### 5. Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the site and
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin portal.

## Project Structure

```
app/
  (public)/        Public site (home, properties, about, contact, blog, faq)
  (admin)/         Admin portal (login, dashboard, properties, inquiries)
  api/             Route handlers (properties, inquiries, upload)
components/        Layout, home, properties, ui, admin components
lib/               Supabase clients, queries, animations, utils
supabase/          schema.sql + seed.sql
types/             Shared TypeScript types
middleware.ts      Protects /admin routes
```

## Deployment

Deploy to Vercel, add the same environment variables in the Vercel project
settings, and set `NEXT_PUBLIC_SITE_URL` to your production URL.
