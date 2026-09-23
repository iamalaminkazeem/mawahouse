# MaWa House — Website + Admin Dashboard

A production-ready restaurant website for MaWa House (Atlanta, GA), built with Next.js 14
(App Router), TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Includes a full self-service
admin dashboard so the restaurant owner can manage the menu, gallery, specials, buffet, hours,
ordering links, reservation links, and site copy without touching code.

## What's included

- **Public site:** Home, Menu (search + category filter), About, Gallery (lightbox), Reservations,
  Order Online, Contact
- **Admin dashboard** (`/admin`): secure login, menu item + category CRUD, gallery uploads,
  specials, buffet, homepage/hero editor, about editor, restaurant info, hours, ordering links,
  reservation links, socials
- **Auth:** NextAuth (credentials/email+password), protected by middleware
- **Database:** PostgreSQL via Prisma ORM
- **Images:** ImageKit (signed direct-to-storage uploads — the private key never reaches the browser)
- Menu pre-seeded with the real MaWa House menu from the flyer you supplied

## 1. Requirements

- Node.js 18.18+ (20.x recommended)
- A [Neon](https://neon.tech) Postgres database (free tier is fine)
- A free [ImageKit](https://imagekit.io) account (for photo uploads)

## 2. Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon's **pooled** connection string (Neon dashboard → Connection Details) |
| `DIRECT_URL` | Neon's **direct** (non-pooled) connection string — used by Prisma migrations |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your live site URL (or `http://localhost:3000` for local dev) |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` | ImageKit dashboard → Developer Options |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | The first admin login — **change the password after first login** |

Push the schema and seed the database:

```bash
npx prisma db push
npm run seed
```

Run locally:

```bash
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin
dashboard (login with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set).

## 3. Deploying (Vercel — recommended)

1. Push this project to a GitHub repo.
2. Import it into [Vercel](https://vercel.com/new).
3. Add all the same environment variables from `.env` in the Vercel project settings.
4. Deploy. Vercel will run `prisma generate` automatically via the `postinstall` script.
5. After the first deploy, run the seed script once against your production database
   (`npx prisma db push && npm run seed` locally, pointed at the production `DATABASE_URL`).

From here, **everything else is managed from `/admin`** — no code changes needed for day-to-day
updates (menu, prices, photos, hours, links, etc.).

## 4. Known gaps / next steps

- **"Our Dishes" items** imported from the flyer have no listed price — they're seeded as
  unavailable so they won't show publicly until you set a real price in `/admin/menu`.
- **Buffet schedule** wasn't on the flyer, so it starts empty — add entries in `/admin/buffet`
  whenever ready.
- **About page story** and **hero/gallery photos** are placeholders until the client supplies
  real copy and photography — editable in `/admin/about`, `/admin/homepage`, and `/admin/gallery`.
- **Ordering is fully custom and built into the site** — customers add items (with add-ons and
  special instructions) to a cart on `/menu`, then check out on `/checkout` with pickup or
  delivery details. No external platform (Toast/Square/etc.) is used.
- **No online payment yet** — orders are submitted without card payment; the confirmation page
  tells the customer MaWa House will confirm and collect payment at pickup/delivery. Configure
  delivery fee, delivery minimum, and tax under `/admin/ordering`. Online payment can be added
  later as a separate integration.
- **Reservations** still link out to whatever platform you configure in `/admin/reservations`
  (e.g. OpenTable, Resy) — this was not part of the custom-build request.
- New orders appear under `/admin/orders`, where the owner can update status (Received →
  Confirmed → Preparing → Ready → Completed) and call the customer directly.
- Admin password changes currently require a database update — ask your developer to add a
  password-change form if needed later.

## 5. Project structure

```
app/            → pages (public + admin) and API routes
components/     → UI components, organized by area
lib/            → Prisma client, auth config, settings helper, validation schemas
prisma/         → schema.prisma + seed.ts
```
