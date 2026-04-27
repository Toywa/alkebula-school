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
        setRole((user.user_metadata?.role as UserRole) || "parent");
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (user) {
        setIsSignedIn(true);
        setUserEmail(user.email || "");
        setRole((user.user_metadata?.role as UserRole) || "parent");
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

        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            About
          </Link>

          <Link href="/faq" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            FAQ
          </Link>

          <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Contact
          </Link>

          <Link href="/educators" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Find Tutors
          </Link>

          <Link
            href="/tutors/apply"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Apply as Tutor
          </Link>

          {loading ? null : isSignedIn ? (
            <>
              <Link
                href={getDashboardPath(role)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Parent Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}