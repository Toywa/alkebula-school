"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "educator";

function getDashboardPath(role: UserRole) {
  if (role === "educator") return "/educator/bookings";
  return "/parent/bookings";
}

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("parent");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
          },
        },
      });

      if (error) throw new Error(error.message);

      if (data.session?.user) {
        window.location.href = getDashboardPath(role);
        return;
      }

      setMessage(
        "Account created. Please check your email for confirmation if email verification is enabled."
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("parent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to sign up"
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
            <h1 className="mt-3 text-3xl font-bold">Create account</h1>
            <p className="mt-2 text-sm text-slate-600">
              Parents and educators can create accounts here. Admin access is
              restricted.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Your full name"
              />
            </div>

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
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Account type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="parent">Parent</option>
                <option value="educator">Tutor / Educator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {message ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}
          {errorMessage ? <p className="mt-4 text-sm text-red-600">{errorMessage}</p> : null}

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-medium text-amber-700">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}