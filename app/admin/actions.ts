"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin, PRODUCT_BUCKET } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";
import { ORDER_STATUSES, type Size } from "@/lib/types";

async function ensureAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
}

// ───────────── Auth ─────────────

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Incorrect email or password. Please try again." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ───────────── Orders ─────────────

export async function updateOrderStatus(formData: FormData) {
  await ensureAuth();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ORDER_STATUSES.includes(status as never)) return;
  const supabase = createSupabaseAdmin();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function deleteOrder(formData: FormData) {
  await ensureAuth();
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseAdmin();
  await supabase.from("orders").delete().eq("id", id);
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

/** Uploads any attached image files to Supabase Storage, returns public URLs. */
async function uploadImages(formData: FormData, slug: string): Promise<string[]> {
  const files = formData
    .getAll("imageFiles")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return [];

  const supabase = createSupabaseAdmin();
  const urls: string[] = [];
  for (const file of files) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${slug || "product"}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(PRODUCT_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

async function buildProductData(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const manualImages = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const uploaded = await uploadImages(formData, slug);
  const images = [...manualImages, ...uploaded];

  return {
    slug,
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    material: String(formData.get("material") ?? "").trim(),
    color_name: String(formData.get("colorName") ?? "").trim(),
    color_hex: String(formData.get("colorHex") ?? "#999999").trim(),
    images,
    sizes: parseSizesFromForm(formData),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    sort_order: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
  };
}

export async function createProduct(formData: FormData) {
  await ensureAuth();
  const data = await buildProductData(formData);
  if (!data.slug || !data.name) {
    throw new Error("Name and slug are required");
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("products").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await ensureAuth();
  const id = String(formData.get("id") ?? "");
  const data = await buildProductData(formData);
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("products")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await ensureAuth();
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseAdmin();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
}

export async function toggleProductActive(formData: FormData) {
  await ensureAuth();
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("products")
    .select("active")
    .eq("id", id)
    .maybeSingle();
  if (!data) return;
  await supabase
    .from("products")
    .update({ active: !data.active })
    .eq("id", id);
  revalidatePath("/admin/products");
}
