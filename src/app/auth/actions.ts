"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// What the form shows after a failed or pending submit.
export type AuthFormState = { error?: string; message?: string } | undefined;

const MIN_PASSWORD_LENGTH = 8;

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signUp(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Stored on the auth user; the database trigger copies it into profiles.display_name.
    options: { data: { display_name: displayName || null } },
  });

  if (error) return { error: error.message };

  // No session means Supabase is waiting for the user to confirm their email.
  if (!data.session) {
    return { message: "Check your email for a confirmation link, then log in." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logIn(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Same message for wrong email and wrong password, so attackers can't tell which emails exist.
  if (error) return { error: "Incorrect email or password." };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
