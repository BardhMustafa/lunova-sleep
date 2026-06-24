import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

const URL = SUPABASE_URL;
const ANON = SUPABASE_ANON_KEY;

/**
 * Session-aware Supabase client for Server Components / Server Actions.
 * Uses the public anon key and the request cookies — this is what knows
 * whether the admin is signed in. It is NOT used for privileged data writes.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component where cookies are read-only —
          // the middleware refreshes the session instead.
        }
      },
    },
  });
}
