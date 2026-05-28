"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "educator" | "admin";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

const programmeLinks = [
  {
    href: "/online-cambridge-igcse-tutors",
    label: "Cambridge IGCSE",
  },
  {
    href: "/edexcel-igcse-tutors",
    label: "Edexcel IGCSE",
  },
  {
    href: "/a-level-online-tutors",
    label: "A Levels",
  },
  {
    href: "/ib-online-tutors",
    label: "IB",
  },
  {
    href: "/homeschool-support",
    label: "Homeschool Support",
  },
];

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

  useEffect(() => {
    let mounted = true;

    async function loadUserOnce() {
      try {
        const supabase = getSupabaseBrowserClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const email = normalizeEmail(session?.user?.email);

        if (!mounted) return;

        if (!email) {
          setIsSignedIn(false);
          setUserEmail("");
          setRole("parent");
          setLoading(false);
          return;
        }

        let resolvedRole: UserRole = "parent";

        if (email === ADMIN_EMAIL) {
          resolvedRole = "admin";
        } else {
          const { data } = await supabase
            .from("users")
            .select("role")
            .eq("email", email)
            .maybeSingle();

          if (data?.role === "admin") resolvedRole = "admin";
          if (data?.role === "educator") resolvedRole = "educator";
          if (data?.role === "parent") resolvedRole = "parent";
        }

        if (!mounted) return;

        setIsSignedIn(true);
        setUserEmail(email);
        setRole(resolvedRole);
      } catch {
        if (!mounted) return;

        setIsSignedIn(false);
        setUserEmail("");
        setRole("parent");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUserOnce();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-800"
          >
            The Alkebula School
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            About
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Programmes
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg group-hover:block">
              {programmeLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

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
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Apply as Tutor
          </Link>

          {!loading && isSignedIn ? (
            <>
              <Link
                href={getDashboardPath(userEmail, role)}
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
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
          ) : !loading ? (
            <>
              <Link
                href="/auth/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
              >
                Parent Sign Up
              </Link>
            </>
          ) : null}
        </nav>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-2">
          {programmeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}