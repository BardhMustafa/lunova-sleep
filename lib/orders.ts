import { createSupabaseAdmin } from "./supabase/admin";

/** Human-friendly order number like LUN-7F3K9. */
export function generateOrderNumber(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LUN-${code}`;
}

export async function uniqueOrderNumber(): Promise<string> {
  const supabase = createSupabaseAdmin();
  for (let i = 0; i < 6; i++) {
    const n = generateOrderNumber();
    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", n)
      .maybeSingle();
    if (!data) return n;
  }
  return `LUN-${Date.now().toString(36).toUpperCase()}`;
}
