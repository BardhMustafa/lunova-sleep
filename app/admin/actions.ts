"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  checkPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/auth";
import { ORDER_STATUSES, type Size } from "@/lib/types";

function ensureAuth() {
  if (!isAuthenticated()) throw new Error("Unauthorized");
}

// ───────────── Auth ─────────────

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }
  createSession();
  redirect("/admin");
}

export async function logoutAction() {
  destroySession();
  redirect("/admin/login");
}

// ───────────── Orders ─────────────

export async function updateOrderStatus(formData: FormData) {
  ensureAuth();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ORDER_STATUSES.includes(status as never)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function deleteOrder(formData: FormData) {
  ensureAuth();
  const id = String(formData.get("id") ?? "");
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin");
}

// ───────────── Products ─────────────

function parseSizesFromForm(formData: FormData): Size[] {
  const labels = formData.getAll("sizeLabel").map(String);
  const prices = formData.getAll("sizePrice").map(String);
  const sizes: Size[] = [];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]?.trim();
    const euros = parseFloat(prices[i] ?? "");
    if (!label || isNaN(euros)) continue;
    sizes.push({ label, price: Math.round(euros * 100) });
  }
  return sizes;
}

function buildProductData(formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    material: String(formData.get("material") ?? "").trim(),
    colorName: String(formData.get("colorName") ?? "").trim(),
    colorHex: String(formData.get("colorHex") ?? "#999999").trim(),
    images: JSON.stringify(images),
    sizes: JSON.stringify(parseSizesFromForm(formData)),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
  };
}

export async function createProduct(formData: FormData) {
  ensureAuth();
  const data = buildProductData(formData);
  if (!data.slug || !data.name) {
    throw new Error("Name and slug are required");
  }
  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  ensureAuth();
  const id = String(formData.get("id") ?? "");
  const data = buildProductData(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  ensureAuth();
  const id = String(formData.get("id") ?? "");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function toggleProductActive(formData: FormData) {
  ensureAuth();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({
    where: { id },
    data: { active: !product.active },
  });
  revalidatePath("/admin/products");
}
