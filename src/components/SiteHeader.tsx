import Link from "next/link";

import { logOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

// Top bar on every page: shows who is logged in, or links to log in / sign up.
export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <Link href="/" className="font-semibold">
        Lease Up Noles
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        {email ? (
          <>
            <span className="text-zinc-600 dark:text-zinc-400">{email}</span>
            <form action={logOut}>
              <button type="submit" className="underline">
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="underline">
              Log in
            </Link>
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
