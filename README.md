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
- Password-protected (signed session cookie)
- Orders view: customer details, line items, totals, live status (Pending → Confirmed → Delivered → Cancelled)
- Product management: create / edit / hide / delete, set prices per size, mark featured, reorder, manage images
- At-a-glance stats (orders, pending, delivered, revenue)

## 🧱 Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Prisma** + **Postgres** (via **Supabase**)
- Server Actions for admin mutations, a small REST route for order placement

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment
cp .env.example .env
#   then edit .env — at minimum change ADMIN_PASSWORD and SESSION_SECRET

# 3. Create the database and seed the 5 starter beds
npm run db:push
npm run db:seed

# 4. Run it
npm run dev
```

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin  (default password: `lunova-admin` — change it!)

## 🔑 Environment variables

| Variable             | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`       | Supabase **pooled** connection (port 6543) — used at runtime |
| `DIRECT_URL`         | Supabase **direct** connection (port 5432) — used by `db push` |
| `ADMIN_PASSWORD`     | Password for the `/admin` dashboard                        |
| `SESSION_SECRET`     | Secret used to sign the admin session cookie               |
| `STORE_CONTACT_EMAIL`| Your orders contact address                               |

---

## 🖼 Replacing the placeholder photos

The site ships with elegant generated SVG placeholders (one per bed) in
`public/products/` so nothing looks broken out of the box.

To use the real product photos:

1. Drop your images into `public/products/` (e.g. `lunova-horizontal.jpg`).
2. In **Admin → Products → Edit**, set the **Image paths** field, one per line,
   e.g. `/products/lunova-horizontal.jpg`.

(Multiple lines = multiple gallery images on the product page.)

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
lib/                  # db client, auth, formatting, product/order helpers
prisma/               # schema + seed (the 5 starter beds)
public/products/      # product images (placeholders included)
```

## ☁️ Database setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project → Settings → Database → Connection string** and copy:
   - the **pooled** string (Transaction mode, port **6543**) → `DATABASE_URL`
   - the **direct** string (port **5432**) → `DIRECT_URL`
   - (add `?pgbouncer=true` to the pooled URL if it isn't already there)
3. Put both in your `.env` (and in your host's env vars for production).
4. Create the tables and seed the starter beds:
   ```bash
   npm run db:push
   npm run db:seed
   ```

`npm run build` runs `prisma generate` automatically.

### Deploying (e.g. Vercel)

Set these env vars in your host: `DATABASE_URL`, `DIRECT_URL`,
`ADMIN_PASSWORD`, and a strong `SESSION_SECRET`. That's it.
