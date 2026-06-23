export type Size = { label: string; price: number };

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  size: string;
  price: number; // EUR cents
  qty: number;
  image?: string;
  colorHex?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// ───────────── Database row shapes (snake_case, as stored in Supabase) ─────────────

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  material: string;
  color_name: string;
  color_hex: string;
  images: unknown; // jsonb: string[]
  sizes: unknown; // jsonb: Size[]
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  notes: string;
  items: unknown; // jsonb: OrderItem[]
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
};

// ───────────── View shapes (camelCase, used across the UI) ─────────────

export type ProductView = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  material: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: Size[];
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderView = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function parseProduct(row: ProductRow): ProductView {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    material: row.material,
    colorName: row.color_name,
    colorHex: row.color_hex,
    images: asArray<string>(row.images),
    sizes: asArray<Size>(row.sizes),
    featured: row.featured,
    active: row.active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function parseOrder(row: OrderRow): OrderView {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postal_code,
    country: row.country,
    notes: row.notes,
    items: asArray<OrderItem>(row.items),
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
