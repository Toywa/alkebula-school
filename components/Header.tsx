"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "educator" | "admin" | null;

function getDashboardPath(role: UserRole) {
  if (role === "admin") return "/admin/resolutions";
  if (role === "educator") return "/educator/bookings";
  return "/parent/bookings";
}

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email || "");
        const userRole = (user.user_metadata?.role as UserRole) || "parent";
        setRole(userRole);
      } else {
        setIsSignedIn(false);
        setUserEmail("");
        setRole(null);
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;

      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email || "");
        const userRole = (user.user_metadata?.role as UserRole) || "parent";
        setRole(userRole);
      } else {
        setIsSignedIn(false);
        setUserEmail("");
        setRole(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-800"
        >
          The Alkebula School
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            About
          </Link>

          <Link
            href="/faq"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            FAQ
          </Link>

          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Contact
          </Link>

          {loading ? null : isSignedIn ? (
            <>
              <Link
                href={getDashboardPath(role)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>

              {userEmail ? (
                <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 md:inline-block">
                  {userEmail}
                </span>
              ) : null}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Sign In
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}