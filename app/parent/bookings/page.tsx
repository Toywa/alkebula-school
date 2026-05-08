"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Booking = {
  id: string;
  parent_email: string | null;
  tutor_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  date: string | null;
  time: string | null;
  status: string | null;
  created_at: string | null;
};

export default function ParentBookingsPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const email = user.email.toLowerCase();
      setParentEmail(email);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("parent_email", email)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setBookings(data || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "booked" ||
      booking.status === "upcoming" ||
      booking.status === "scheduled" ||
      !booking.status
  );

  const pastBookings = bookings.filter(
    (booking) =>
      booking.status === "completed" ||
      booking.status === "cancelled" ||
      booking.status === "rejected"
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">Parent Bookings</h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          View your child’s upcoming lessons, tutor bookings, and booking
          history.
        </p>

        {parentEmail ? (
          <p className="mt-3 text-sm text-slate-500">
            Signed in as {parentEmail}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/tutors"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Find a Tutor
          </Link>
        </div>

        {loading ? <p className="mt-8">Loading bookings...</p> : null}

        {errorMessage ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!loading && !errorMessage ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="mt-2 text-3xl font-bold">{bookings.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Upcoming Lessons</p>
                <p className="mt-2 text-3xl font-bold">
                  {upcomingBookings.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Completed / Past</p>
                <p className="mt-2 text-3xl font-bold">
                  {pastBookings.length}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Upcoming Lessons</h2>

              {upcomingBookings.length === 0 ? (
                <p className="mt-4 text-slate-600">
                  You have no upcoming lessons yet.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {booking.subject || "Lesson"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-600">
                            Student: {booking.student_name || "—"}
                          </p>

                          <p className="text-sm text-slate-600">
                            Tutor: {booking.tutor_email || "—"}
                          </p>

                          <p className="text-sm text-slate-600">
                            Curriculum: {booking.curriculum || "—"}
                          </p>

                          <p className="text-sm text-slate-600">
                            Date/Time: {booking.date || "—"}{" "}
                            {booking.time ? `• ${booking.time}` : ""}
                          </p>
                        </div>

                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          {booking.status || "booked"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Booking History</h2>

              {pastBookings.length === 0 ? (
                <p className="mt-4 text-slate-600">No past bookings yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <h3 className="text-lg font-semibold">
                        {booking.subject || "Lesson"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        Student: {booking.student_name || "—"}
                      </p>

                      <p className="text-sm text-slate-600">
                        Tutor: {booking.tutor_email || "—"}
                      </p>

                      <p className="text-sm text-slate-600">
                        Date/Time: {booking.date || "—"}{" "}
                        {booking.time ? `• ${booking.time}` : ""}
                      </p>

                      <p className="text-sm text-slate-600">
                        Status: {booking.status || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}