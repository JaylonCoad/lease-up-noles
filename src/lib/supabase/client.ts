import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "./env";

// Supabase client for Client Components (code that runs in the browser).
export function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
