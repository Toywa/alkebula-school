"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== "undefined"
          ? `${window.location.origin}/auth/sign-in`
          : undefined,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Password reset email sent. Please check your inbox.");
      setEmail("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send reset email"
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
            <h1 className="mt-3 text-3xl font-bold">Forgot password</h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email address and we’ll send you a password reset link.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {message ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}
          {errorMessage ? (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <p className="mt-6 text-sm text-slate-600">
            Back to{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-amber-700 hover:text-amber-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}