# Lunova Sleep

A high-end storefront for **Lunova Sleep** — a small collection of simple,
good-looking, budget-friendly beds — with a built-in **admin dashboard** for
managing orders and products.

No online payment: customers order and **pay on delivery**. You manage
everything from `/admin`.

---

## ✨ What's inside

**Storefront**
- A catchy, emotional hero ("Sleep is the new luxury") that sells a feeling, not just a product
- Clean, editorial design — warm linen palette, sage-green accent, refined serif type
- Collection grid + rich product pages with size selection (90×200 → 180×200)
- Slide-out cart (persists in the browser)
- Pay-on-delivery checkout — collects name, contact and delivery address
- Order confirmation with an order number

**Admin dashboard** (`/admin`)
- Protected by **Supabase Auth** (email + password)
- Orders view: customer details, line items, totals, live status (Pending → Confirmed → Delivered → Cancelled)
- Product management: create / edit / hide / delete, set prices per size, mark featured, reorder
- **Photo uploads** straight to Supabase Storage
- At-a-glance stats (orders, pending, delivered, revenue)

## 🧱 Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** — Postgres database, Auth, and Storage (via `@supabase/supabase-js` + `@supabase/ssr`)
- Server Actions for admin mutations, a REST route for order placement

All database access happens **server-side** using the Supabase **service-role**
key. Row Level Security is enabled with no public policies, so the public
(anon) key can never read or write your data directly.

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase (see "Supabase setup" below), then:
cp .env.example .env
#   fill in the three Supabase values

# 3. Run it
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin

## ☁️ Supabase setup

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is fine).

2. **Create the tables, security, storage bucket and seed data.**
   Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it.

3. **Get your keys** from **Project → Settings → API** and put them in `.env`:

   | Variable                         | Where to find it                          | Notes                          |
   | -------------------------------- | ----------------------------------------- | ------------------------------ |
   | `NEXT_PUBLIC_SUPABASE_URL`       | Settings → API → Project URL              | Public                         |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Settings → API → anon / publishable key   | Public (safe in the browser)   |
   | `SUPABASE_SERVICE_ROLE_KEY`      | Settings → API → service_role / secret key| **Secret — server only!**      |

   ⚠️ Never commit the service-role key or expose it in the browser.

4. **Create your admin user.** Go to **Authentication → Users → Add user**,
   enter your email + a password, and (easiest) tick *Auto Confirm User*.
   That email/password is what you'll use to sign in at `/admin`.

That's it — `npm run dev` and sign in.

## 🖼 Product photos

The site ships with elegant generated SVG placeholders (one per bed) in
`public/products/`, so nothing looks broken out of the box.

To use real photos, two options:
- **Upload in the dashboard** — Admin → Products → Edit → *Upload photos*.
  Files go to Supabase Storage and the public URL is saved automatically.
- **Reference a path/URL** — add any image path or URL in the *Image URLs*
  box (one per line). Local files in `public/products/` work too.

## 🌍 Languages

The storefront is bilingual — **Albanian (default)** and **English** — with a
`SQ / EN` switcher in the nav. The choice is stored in a cookie and rendered
server-side. UI copy lives in [`lib/i18n/dictionaries.ts`](./lib/i18n/dictionaries.ts);
product names/descriptions show as entered in the admin. (The admin dashboard
itself is English.)

## 💶 Prices, sizes & products

All pricing is **placeholder** and fully editable from **Admin → Products**.
Each bed has its own list of sizes and EUR prices — add, remove or rename
sizes freely. Currency is Euro (€).

---

## 📁 Project structure

```
app/
  (store)/            # public storefront (home, collection, product, checkout)
  admin/              # protected dashboard + server actions
  api/orders/         # order placement endpoint
components/           # UI: navbar, cart, product cards, admin widgets
lib/
  supabase/           # server (auth), admin (service-role), middleware clients
  auth, products,     # data + auth helpers
  orders, types
supabase/schema.sql   # tables, RLS, storage bucket, seed data
public/products/      # placeholder bed images
middleware.ts         # refreshes the Supabase auth session
```

## 🚢 Deploying (e.g. Vercel)

1. Push the repo and import it in Vercel.
2. Add the three env vars (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
3. Deploy. The same Supabase project powers production — your orders,
   products and uploaded photos all persist.
