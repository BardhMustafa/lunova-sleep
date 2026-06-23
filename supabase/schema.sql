-- ============================================================
--  Lunova Sleep — Supabase schema, security & seed data
--  Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists pgcrypto;

-- ───────────── Tables ─────────────

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  tagline     text not null default '',
  description text not null default '',
  material    text not null default '',
  color_name  text not null default '',
  color_hex   text not null default '#999999',
  images      jsonb not null default '[]'::jsonb,   -- string[]
  sizes       jsonb not null default '[]'::jsonb,   -- { label, price(cents) }[]
  featured    boolean not null default false,
  active      boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  email        text not null,
  phone        text not null,
  address      text not null,
  city         text not null,
  postal_code  text not null,
  country      text not null default '',
  notes        text not null default '',
  items        jsonb not null default '[]'::jsonb,  -- { productId, name, size, price, qty }[]
  total        int not null default 0,              -- EUR cents
  status       text not null default 'PENDING',     -- PENDING|CONFIRMED|DELIVERED|CANCELLED
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists products_sort_idx on products (sort_order);

-- ───────────── Security (RLS) ─────────────
-- Lock both tables down completely. The app's server code uses the
-- service-role key, which bypasses RLS. With no policies defined, the
-- public anon/publishable key has ZERO direct access to your data.

alter table products enable row level security;
alter table orders   enable row level security;

-- ───────────── Image storage bucket ─────────────
-- Public bucket → uploaded product photos are readable via their public URL.
-- Uploads happen server-side with the service-role key.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- ───────────── Seed: the 5 starter beds ─────────────

insert into products (slug, name, tagline, description, material, color_name, color_hex, images, sizes, featured, active, sort_order)
values
('lunova-horizontal', 'Lunova Horizontal', 'Calm, grounded, effortless.',
 'Clean horizontal channels give the Horizontal a quiet, architectural presence. Upholstered in a soft olive weave that warms a room without shouting — the kind of bed you stop noticing and simply rest in.',
 'Olive linen-blend upholstery · pocket-spring core', 'Olive', '#7A8B5C',
 '["/products/lunova-horizontal.svg"]',
 '[{"label":"90×200","price":24900},{"label":"120×200","price":29900},{"label":"160×200","price":37900},{"label":"180×200","price":42900}]',
 true, true, 1),

('lunova-stripe', 'Lunova Stripe', 'Quietly confident.',
 'Vertical stripe tufting draws the eye upward for a taller, tailored headboard. A deep navy that feels considered and calm — designed to anchor a bedroom and last well beyond a trend.',
 'Deep-navy woven upholstery · pocket-spring core', 'Navy', '#2C3E5B',
 '["/products/lunova-stripe.svg"]',
 '[{"label":"90×200","price":24900},{"label":"120×200","price":29900},{"label":"160×200","price":37900},{"label":"180×200","price":42900}]',
 true, true, 2),

('lunova-diagonal', 'Lunova Diagonal', 'Soft lines, warm light.',
 'A subtle diagonal pattern adds movement to an otherwise minimal frame. Wrapped in a warm sand tone, the Diagonal brings a gentle, sunlit softness to the room it sits in.',
 'Sand boucle-look upholstery · pocket-spring core', 'Sand', '#CDBBA0',
 '["/products/lunova-diagonal.svg"]',
 '[{"label":"90×200","price":24900},{"label":"120×200","price":29900},{"label":"160×200","price":37900},{"label":"180×200","price":42900}]',
 false, true, 3),

('lunova-line', 'Lunova Line', 'Minimal, modern, timeless.',
 'Slim vertical lines and a cool grey finish make the Line the most versatile of the collection. It slips into any palette and stays out of the way of good sleep.',
 'Stone-grey woven upholstery · pocket-spring core', 'Stone Grey', '#9AA0A4',
 '["/products/lunova-line.svg"]',
 '[{"label":"90×200","price":24900},{"label":"120×200","price":29900},{"label":"160×200","price":37900},{"label":"180×200","price":42900}]',
 true, true, 4),

('lunova-grid', 'Lunova Grid', 'Texture you can feel.',
 'A soft squared grid headboard with a warm clay tone — the most tactile piece in the collection. Cosy, characterful, and still beautifully simple.',
 'Clay textured upholstery · pocket-spring core', 'Clay', '#B98B73',
 '["/products/lunova-grid.svg"]',
 '[{"label":"90×200","price":24900},{"label":"120×200","price":29900},{"label":"160×200","price":37900},{"label":"180×200","price":42900}]',
 false, true, 5)
on conflict (slug) do nothing;
