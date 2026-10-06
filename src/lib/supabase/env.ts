// Reads the Supabase connection settings once and fails loudly if they are missing,
// so a misconfigured environment shows a clear error instead of a vague network failure.
// NEXT_PUBLIC_ values must be referenced directly (not via process.env[name])
// so Next.js can inline them into the browser bundle at build time.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase env vars. Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return { supabaseUrl, supabasePublishableKey };
}
