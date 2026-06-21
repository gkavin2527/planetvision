# PlanetVision — Project Context

Luxury real-estate platform ("PlanetVision", originally scaffolded as "Urban Nest"),
based on the Eloria/PLANETVISION design reference. Public marketing + property
browsing site with a private admin CRUD dashboard, plus a Zillow-style feature set.

## Stack
- Next.js 14.2 (App Router) + React 18 + TypeScript
- Tailwind CSS (`darkMode: 'class'`) with CSS-variable theme tokens
- Framer Motion (animations, parallax, page transitions)
- Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — Postgres, Auth, RLS, Storage
- Leaflet + react-leaflet (OpenStreetMap, no API key) for map search
- lucide-react icons
- Dev server: http://localhost:3000

## Running it
- `npm run dev` (use `PORT=3000`). **Only ever run ONE dev server** — two share the
  `.next` folder and corrupt it (cause of past `Cannot find module './###.js'` /
  HTTP 500). Recovery: stop all `next` processes, `rm -rf .next`, restart.
- `npm run build` / `npm run start` / `npm run lint`
- Before a production build, stop the dev server (they contend over `.next`).
- Quick checks: `npx tsc --noEmit` (safe, doesn't touch `.next`).
- Supabase setup: run `supabase/schema.sql` → `profiles.sql` → `seed.sql` in the
  Supabase SQL editor. Admin scripts live in `scripts/` (need the service-role key).
- Env vars (`.env.local`, gitignored): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only — never
  expose to the browser), `NEXTAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## Directory map
```
app/
  (public)/   page, properties, properties/[id], about, blog, contact, faq,
              agents, sell, financing, calculators, saved, compare
  (admin)/admin/  dashboard, login, properties (list/new/[id]/edit), inquiries
  api/        properties, inquiries, upload  (route handlers)
  globals.css theme tokens (:root light / .dark), .hero-wordmark, .footer-brand, .btn-*
components/
  home/        HeroBanner, SearchBar, FeaturedProperties, StatsStrip, Services…
  properties/  PropertyCard, LitePropertyCard, PropertyGrid, PropertyFilters,
               PropertyGallery, PropertyMap(+View), ViewToggle, FavoriteButton,
               ShareButton, CompareToggle, CompareBar, ContactTourTabs,
               TourScheduler, RecentlyViewedTracker, InquiryForm, Pagination
  tools/       MortgageCalculator, AffordabilityCalculator, CalculatorsTabs
  layout/      Navbar, Footer, FooterBrand, PageTransition
  theme/       ThemeProvider, ThemeToggle
  admin/, ui/  AdminShell, PropertyForm, ImageUploader…; Dropdown, Badge, Button…
lib/
  finance.ts        mortgage / affordability / estimate / price-per-sqft math
  geo.ts            city → coords + deterministic per-listing spread for the map
  property-lite.ts  toLite() + PropertyLite type (NON-client, server-safe)
  property-store.ts 'use client' localStorage hooks: useFavorites / useRecentlyViewed
                    / useCompare (re-exports toLite from property-lite)
  queries.ts        server data access (getProperties, getProperty, getComparables…)
  supabase/         client.ts, server.ts, middleware.ts
  auth.ts, utils.ts, animations.ts
types/index.ts      Property, Inquiry, Profile, PropertyFilters
supabase/           schema.sql, profiles.sql, seed.sql
scripts/            create-admin.mjs, promote-admin.mjs, check-setup.mjs
```

## Data model (Supabase)
- **properties** — title, description, price, `price_type` (sale|rent), location, city,
  bedrooms, bathrooms, area (sqft), `property_type` (apartment|villa|penthouse|house),
  images[] (Storage URLs), amenities[], featured, status (available|sold|rented).
  No lat/lng column → the map approximates a location from the city centre.
- **inquiries** — name, email, phone, message, status (new|contacted|closed),
  property_id. ALL public forms (contact, request-a-tour, sell, financing, agent-match)
  POST here via `/api/inquiries`.
- **profiles** — id, email, full_name, **role** (admin|user); drives RBAC. `is_admin()`
  SECURITY DEFINER avoids RLS recursion; a trigger blocks privilege escalation.
- **Storage**: public `property-images` bucket. RLS: public read properties + insert
  inquiries; authenticated admin full access.

## Auth / access control
- Admin login: **admin@urbannest.com / Admin@123** — this is the REAL Supabase auth
  account. The login page demo hint must keep `admin@urbannest.com` (do NOT rebrand it
  to planetvision). `gkavin446@gmail.com` was also promoted to admin.
- Middleware: unauthenticated `/admin/*` → `/admin/login`; authenticated non-admin → `/`;
  logged-in user on the login page → `/admin` or `/` by role.

## Theme system
CSS custom properties flip between `:root` (light, cream/#f5f0e8) and `.dark` (warm
near-black). `ThemeProvider` context + anti-FOUC inline script + `ThemeToggle`
(variants: auto | light | glass). Brand colors (bark `#2c2416`, sand `#c4a882`) are
constant; surface/heading/body/muted/line tokens are theme-aware. Use the tokens
(`text-heading`, `bg-surface`, `border-line`, etc.) rather than hard-coding light values.

### Navbar behavior (important, has been iterated on)
- Home: header is FULLY TRANSPARENT over the hero (never a solid brown bar). Text uses
  `text-heading` so it adapts to the day (dark text) / night (light text) hero image.
- Inner pages open with a dark `bg-bark` hero band, so the header gets a frosted theme
  bar (`bg-cream/85 backdrop-blur`) to keep `text-heading` legible. The center nav pill
  is a frosted-white chip in light mode for guaranteed contrast over any background.

## Zillow-style features (all additive; no DB migration)
Saved homes (heart) · recently viewed · compare tray + `/compare` table · mortgage +
affordability calculators (`/calculators`, also embedded on listings) · estimated
monthly payment on cards/detail · comparable-based "PlanetVision Estimate" + price/sqft
(transparent heuristic, clearly labeled — NOT a real AVM) · share · request-a-tour
scheduler · expanded filters (keyword / beds / baths / min sqft / custom price / status /
sort) · List/Map view with Leaflet price-pin markers · `/agents`, `/sell`, `/financing`
pages. Saved/compare/recently-viewed persist in **localStorage** (public visitors have no
account); `CompareBar` is mounted globally in the public layout.

Not faithfully possible without external paid data (so intentionally NOT faked): real
Zestimate ML, live MLS feed, real school ratings, Street View, real-time email/SMS alerts.

## Conventions / gotchas
- `PropertyLite` + `toLite()` live in `lib/property-lite.ts` (no `'use client'`) so server
  components can call them. `lib/property-store.ts` is the `'use client'` hooks module and
  re-exports them — import `toLite` from `property-lite` in server components.
- Property cards (`PropertyCard`, `LitePropertyCard`) use `flex h-full flex-col` with the
  beds/baths/area stats in a 3-col `divide-x` grid pinned via `mt-auto` → equal height +
  aligned figures. Listings grid: `sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3`.
- `lib/queries.ts` is `import 'server-only'` and degrades gracefully (returns empty) when
  Supabase env vars are absent.
- Leaflet touches `window`: load the map via `PropertyMapView` (`dynamic(..., {ssr:false})`).
- zsh here doesn't handle null-delimited xargs/`read -d ''` well; for bulk regex edits a
  throwaway Python script is more reliable than shell loops.
