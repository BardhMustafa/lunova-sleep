import { createSupabaseAdmin } from "./supabase/admin";
import { parseProduct, type ProductRow, type ProductView } from "./types";

export async function getActiveProducts(): Promise<ProductView[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(parseProduct);
}

export async function getFeaturedProducts(): Promise<ProductView[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(parseProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<ProductView | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? parseProduct(data as ProductRow) : null;
}

export async function getProductById(
  id: string
): Promise<ProductView | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? parseProduct(data as ProductRow) : null;
}

export async function getAllProducts(): Promise<ProductView[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ProductRow[]).map(parseProduct);
}
