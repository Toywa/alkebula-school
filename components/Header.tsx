"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "educator" | "admin";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

function getDashboardPath(email: string, role: UserRole) {
  if (normalizeEmail(email) === ADMIN_EMAIL) return "/admin/resolutions";
  if (role === "admin") return "/admin/resolutions";
  if (role === "educator") return "/educator/dashboard";
  return "/parent/bookings";
}

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState<UserRole>("parent");

  async function resolveUserRole(email: string): Promise<UserRole> {
    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail === ADMIN_EMAIL) {
      return "admin";
    }

    try {
      const supabase = getSupabaseBrowserClient();

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (data?.role === "admin") return "admin";
      if (data?.role === "educator") return "educator";
      return "parent";
    } catch {
      return "parent";
    }
  }

  async function loadUser() {
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const email = normalizeEmail(session?.user?.email);

      if (!email) {
        setIsSignedIn(false);
        setUserEmail("");
        setRole("parent");
        setLoading(false);
        return;
      }

      const resolvedRole = await resolveUserRole(email);

      setIsSignedIn(true);
      setUserEmail(email);
      setRole(resolvedRole);
    } catch {
      setIsSignedIn(false);
      setUserEmail("");
      setRole("parent");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
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
          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            About
          </Link>

          <Link
            href="/faq"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            FAQ
          </Link>

          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Contact
          </Link>

          <Link
            href="/educators"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
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
                href={getDashboardPath(userEmail, role)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>

              <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 md:inline-block">
                {userEmail}
              </span>

              <button
                type="button"
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