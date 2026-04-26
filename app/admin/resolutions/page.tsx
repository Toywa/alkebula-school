"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_ALLOWED_EMAILS = [
  "sunscapecars@gmail.com",
  "davidmusilah@gmail.com",
];

export default function AdminResolutionsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

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
    }

    checkAdmin();
  }, []);

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
          <h1 className="text-4xl font-bold">Admin Resolution Dashboard</h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Review tutor reschedule requests, engage parents, assign a new slot,
            and resolve each case without breaking booking integrity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-lg font-medium">No reschedule cases right now.</p>
          <p className="mt-3 text-slate-600">
            Tutor reschedule requests will appear here for admin handling.
          </p>
        </div>
      </section>
    </main>
  );
}