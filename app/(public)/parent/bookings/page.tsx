"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Invoice = {
  id: string;
  amount_usd: number | null;
  status: string | null;
  due_date: string | null;
  created_at: string | null;
};

type Booking = {
  id: string;
  parent_name: string | null;
  parent_email: string | null;
  student_name: string | null;
  curriculum: string | null;
  subject: string | null;
  class_level: string | null;
  booking_date: string | null;
  start_time: string | null;
  end_time: string | null;
  timezone: string | null;
  status: string | null;
  tutor_confirmation_status: string | null;
  created_at: string | null;
  educator_directory?: {
    full_name: string | null;
    email: string | null;
  } | null;
  lesson_invoices?: Invoice[];
};

export default function ParentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function checkAuthAndLoad() {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      setUserEmail(user.email);
      setCheckingAuth(false);

      const res = await fetch("/api/parent/bookings");
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to load bookings.");
        setLoading(false);
        return;
      }

      setBookings(data.bookings || []);
      setLoading(false);
    }

    checkAuthAndLoad();
  }, []);

  if (checkingAuth || loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-6xl">Loading your secure parent dashboard...</div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">Access restricted</h1>
          <p className="mt-4 text-red-700">{errorMessage}</p>
          <p className="mt-4 text-sm text-red-700">
            Please sign in using the same email used for your booking.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Parent Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-bold">My Bookings & Invoices</h1>

          <p className="mt-4 max-w-3xl text-slate-600">
            This dashboard only shows bookings linked to your signed-in account.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Signed in as: <strong>{userEmail}</strong>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No bookings found yet.</p>
            <p className="mt-3 text-slate-600">
              Bookings will appear here only if they were made using your signed-in email.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const invoice = booking.lesson_invoices?.[0];

              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {booking.subject || "Lesson Booking"}
                      </h2>

                      <p className="mt-2 text-slate-600">
                        Student:{" "}
                        <span className="font-medium text-slate-900">
                          {booking.student_name || "—"}
                        </span>
                      </p>

                      <p className="mt-1 text-slate-600">
                        Tutor:{" "}
                        <span className="font-medium text-slate-900">
                          {booking.educator_directory?.full_name || "Assigned Tutor"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        Booking: {booking.status || "pending"}
                      </span>

                      <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800">
                        Tutor: {booking.tutor_confirmation_status || "awaiting"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </p>
                      <p className="mt-2 font-medium">{booking.booking_date || "—"}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Time
                      </p>
                      <p className="mt-2 font-medium">
                        {booking.start_time || "—"} - {booking.end_time || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Timezone
                      </p>
                      <p className="mt-2 font-medium">
                        {booking.timezone || "Africa/Nairobi"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Invoice</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {invoice ? "Invoice created for this booking." : "Invoice not found yet."}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          USD {invoice?.amount_usd ?? "—"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Status:{" "}
                          <span className="font-medium">
                            {invoice?.status || "pending"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <p>
                      <span className="font-medium text-slate-900">
                        Curriculum:
                      </span>{" "}
                      {booking.curriculum || "—"}
                    </p>

                    <p>
                      <span className="font-medium text-slate-900">
                        Class / Level:
                      </span>{" "}
                      {booking.class_level || "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}