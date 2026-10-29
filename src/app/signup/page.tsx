import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/");

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
      <AuthForm mode="signup" />
    </main>
  );
}
