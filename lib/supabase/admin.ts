import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./env";

const URL = SUPABASE_URL;
const SERVICE_ROLE = SUPABASE_SERVICE_ROLE_KEY;

/**
 * Privileged, server-only Supabase client using the service-role key.
 * Bypasses Row Level Security — never import this into client code.
 * All product/order data access goes through here so the public keys can
 * never touch your data directly.
 */
export function createSupabaseAdmin() {
  return createClient(URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const PRODUCT_BUCKET = "product-images";
