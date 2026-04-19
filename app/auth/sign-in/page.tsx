"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "educator" | "admin" | null;

function getDashboardPath(role: UserRole) {
  if (role === "admin") return "/admin/resolutions";
  if (role === "educator") return "/educator/bookings";
  return "/parent/bookings";
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const role = (data.user?.user_metadata?.role as UserRole) || "parent";
      setMessage("Signed in successfully.");
      window.location.href = getDashboardPath(role);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to sign in"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              The Alkebula School
            </p>
            <h1 className="mt-3 text-3xl font-bold">Sign in</h1>
            <p className="mt-2 text-sm text-slate-600">
              Access your account to manage lessons, bookings, and learning progress.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}
          {errorMessage ? (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <div className="mt-6 space-y-2 text-sm">
            <p>
              <Link
                href="/auth/forgot-password"
                className="font-medium text-amber-700 hover:text-amber-800"
              >
                Forgot password?
              </Link>
            </p>
            <p className="text-slate-600">
              Don’t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-amber-700 hover:text-amber-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}