import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

/** Returns the signed-in Supabase user, or null. */
export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}

/** For protected pages — redirects to login if not authenticated. */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}
