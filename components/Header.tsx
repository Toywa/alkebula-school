"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type UserRole = "parent" | "educator" | "admin";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

const programmeLinks = [
  {
    href: "/exam-revision",
    label: "Exam Revision Hub",
    description: "Oct/Nov 2026, January 2027 and May/June planning",
  },
  {
    href: "/exam-revision/cambridge-igcse-november-2026",
    label: "Cambridge IGCSE",
    description: "Focused IGCSE revision and subject support",
  },
  {
    href: "/exam-revision/edexcel-igcse-november-2026",
    label: "Edexcel IGCSE",
    description: "International GCSE support and exam preparation",
  },
  {
    href: "/exam-revision/cambridge-a-level-november-2026",
    label: "Cambridge A Levels",
    description: "AS and A Level academic support",
  },
  {
    href: "/exam-revision/edexcel-ial-october-2026",
    label: "Edexcel International A Levels",
    description: "IAL October and January exam preparation",
  },
  {
    href: "/exam-revision/ib-diploma-november-2026",
    label: "IB Diploma",
    description: "HL, SL, essay and exam support",
  },
  {
    href: "/exam-revision/cambridge-checkpoint-october-2026",
    label: "Cambridge Checkpoint",
    description: "Primary and Lower Secondary support",
  },
  {
    href: "/homeschool-support",
    label: "Homeschool Support",
    description: "Structured learning support for home education",
  },
];

const mainLinks = [
  { href: "/about", label: "About" },
  { href: "/educators", label: "Find Tutors" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const quickLinks = [
  { href: "/exam-revision", label: "Oct/Nov Revision" },
  { href: "/get-matched", label: "Get Matched" },
  { href: "/educators", label: "Approved Tutors" },
  { href: "/homeschool-support", label: "Homeschool Support" },
  { href: "/testimonials", label: "Parent Stories" },
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

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState<UserRole>("parent");
  const [mobileOpen, setMobileOpen] = useState(false);

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

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-200/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-3 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          onClick={closeMobileMenu}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8F1F36]/10 bg-white shadow-sm">
            <Image
              src="/logo.png"
              alt="The Alkebula School logo"
              width={34}
              height={34}
              priority
              className="h-8 w-8 object-contain"
            />
          </span>

          <span className="inline-flex flex-col">
            <span className="text-sm font-black uppercase tracking-[0.22em] text-[#8F1F36] transition group-hover:text-[#6F1729]">
              The Alkebula School
            </span>
            <span className="mt-1 text-[11px] font-medium tracking-wide text-slate-500">
              Extraordinary Learning. Proven Results.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainLinks.slice(0, 1).map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}

          <div className="group relative">
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
            >
              Programmes
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-[22rem] pt-3 group-hover:block">
              <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/80">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                    Academic pathways
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    International curriculum support, revision and homeschool
                    structure.
                  </p>
                </div>

                <div className="max-h-[28rem] overflow-y-auto p-1">
                  {programmeLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-4 py-3 transition hover:bg-[#FFF8F9]"
                    >
                      <span className="block text-sm font-bold text-slate-900">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {mainLinks.slice(1).map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/get-matched"
            className="rounded-xl bg-[#8F1F36] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
          >
            Get Matched
          </Link>

          {!loading && isSignedIn ? (
            <>
              <Link
                href={getDashboardPath(userEmail, role)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-[#FFF5F7]"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/auth/sign-in"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
              >
                Sign In
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-xl border border-[#8F1F36]/15 bg-[#FFF5F7] px-4 py-2.5 text-sm font-bold text-[#8F1F36] transition hover:bg-white"
              >
                Parent Sign Up
              </Link>
            </>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm lg:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div className="hidden border-t border-slate-100 bg-[#FFFDFB] lg:block">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-2 lg:px-8">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#8F1F36]/20 hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/tutors/apply"
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#8F1F36]/20 hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
          >
            Apply as Tutor
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="space-y-4 px-6 py-5">
            <div className="grid gap-2">
              {mainLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-[#FFFDFB] p-3">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                Programmes
              </p>

              <div className="grid gap-2">
                {programmeLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Link
                href="/get-matched"
                onClick={closeMobileMenu}
                className="rounded-xl bg-[#8F1F36] px-5 py-3 text-center text-sm font-bold text-white"
              >
                Get Matched With a Tutor
              </Link>

              <Link
                href="/tutors/apply"
                onClick={closeMobileMenu}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-900"
              >
                Apply as Tutor
              </Link>

              {!loading && isSignedIn ? (
                <>
                  <Link
                    href={getDashboardPath(userEmail, role)}
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-slate-200 bg-[#FFF5F7] px-5 py-3 text-center text-sm font-bold text-[#8F1F36]"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Logout
                  </button>
                </>
              ) : !loading ? (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/sign-up"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-[#8F1F36]/15 bg-[#FFF5F7] px-5 py-3 text-center text-sm font-bold text-[#8F1F36]"
                  >
                    Parent Sign Up
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}