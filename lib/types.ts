import type { Product as PrismaProduct, Order as PrismaOrder } from "@prisma/client";

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

/** Product shape with JSON fields parsed for use in the UI. */
export type ProductView = Omit<PrismaProduct, "images" | "sizes"> & {
  images: string[];
  sizes: Size[];
};

export function parseProduct(p: PrismaProduct): ProductView {
  let images: string[] = [];
  let sizes: Size[] = [];
  try {
    images = JSON.parse(p.images);
  } catch {
    images = [];
  }
  try {
    sizes = JSON.parse(p.sizes);
  } catch {
    sizes = [];
  }
  return { ...p, images, sizes };
}

export type OrderView = Omit<PrismaOrder, "items"> & {
  items: OrderItem[];
};

export function parseOrder(o: PrismaOrder): OrderView {
  let items: OrderItem[] = [];
  try {
    items = JSON.parse(o.items);
  } catch {
    items = [];
  }
  return { ...o, items };
}
