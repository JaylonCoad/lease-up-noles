import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "./env";

// Supabase client for Server Components, Route Handlers, and Server Actions.
// Create a new one per request: it reads the logged-in user's session from that request's cookies.
export async function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot set cookies. This is safe to ignore as long as
          // session refresh is handled in proxy.ts (added with auth in #7).
        }
      },
    },
  });
}
