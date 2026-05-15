"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_ALLOWED_EMAILS = [
  "sunscapecars@gmail.com",
  "davidmusilah@gmail.com",
];

export default function AdminResolutionsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    async function checkAdmin() {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const email = user.email?.toLowerCase() || "";

      if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
        setAuthorized(false);
        setCheckingAuth(false);
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
      await loadUnreadMessageCount();
    }

    checkAdmin();
  }, []);

  async function loadUnreadMessageCount() {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const response = await fetch("/api/messages/unread-count", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUnreadMessageCount(data.unread_count || 0);
      }
    } catch {
      setUnreadMessageCount(0);
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl">Checking admin access...</div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">Access denied</h1>
          <p className="mt-4 text-red-700">
            This page is restricted to approved platform administrators only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">
                Admin Resolution Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-slate-600">
                Review tutor reschedule requests, engage parents, assign a new
                slot, and resolve each case without breaking booking integrity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/messages"
                className="relative rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Messages
                {unreadMessageCount > 0 ? (
                  <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    {unreadMessageCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/admin/finance"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
              >
                Finance
              </Link>

              <Link
                href="/admin/tutor-applications"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
              >
                Tutor Applications
              </Link>
            </div>
          </div>

          {unreadMessageCount > 0 ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              <p className="font-semibold">
                You have {unreadMessageCount} unread internal message
                {unreadMessageCount === 1 ? "" : "s"}.
              </p>
              <p className="mt-1 text-sm">
                Open Messages to review tutor or parent support communication.
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
              <p className="font-semibold">No unread internal messages.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/messages"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <p className="text-sm text-slate-500">Internal Communication</p>
            <h2 className="mt-2 text-2xl font-bold">
              Messages{" "}
              {unreadMessageCount > 0 ? (
                <span className="text-red-600">({unreadMessageCount})</span>
              ) : null}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Read tutor messages, reply to educators, and handle parent support.
            </p>
          </Link>

          <Link
            href="/admin/finance"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <p className="text-sm text-slate-500">Finance Operations</p>
            <h2 className="mt-2 text-2xl font-bold">Finance</h2>
            <p className="mt-3 text-sm text-slate-600">
              Track payments, tutor payouts, revenue, and commissions.
            </p>
          </Link>

          <Link
            href="/admin/tutor-applications"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <p className="text-sm text-slate-500">Tutor Pipeline</p>
            <h2 className="mt-2 text-2xl font-bold">Applications</h2>
            <p className="mt-3 text-sm text-slate-600">
              Review, interview, approve, or reject educator applications.
            </p>
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-lg font-medium">No reschedule cases right now.</p>
          <p className="mt-3 text-slate-600">
            Tutor reschedule requests will appear here for admin handling.
          </p>
        </div>
      </section>
    </main>
  );
}