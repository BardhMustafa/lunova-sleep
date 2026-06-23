import { prisma } from "./db";
import { parseProduct, type ProductView } from "./types";

export async function getActiveProducts(): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(parseProduct);
}

export async function getFeaturedProducts(): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(parseProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? parseProduct(row) : null;
}

export async function getAllProducts(): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(parseProduct);
}
