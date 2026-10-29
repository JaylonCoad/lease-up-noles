"use client";

import Link from "next/link";
import { useActionState } from "react";

import { logIn, signUp } from "@/app/auth/actions";

type AuthFormProps = { mode: "login" | "signup" };

const inputClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

// Shared form for /login and /signup. The server action does the real work;
// useActionState gives us its returned error/message and a pending flag.
export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState(isSignup ? signUp : logIn, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isSignup && (
        <label className="flex flex-col gap-1 text-sm">
          Name (optional)
          <input name="displayName" autoComplete="name" className={inputClass} />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Email
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={isSignup ? 8 : undefined}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className={inputClass}
        />
      </label>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.message && <p className="text-sm text-green-700">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link href={isSignup ? "/login" : "/signup"} className="underline">
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
