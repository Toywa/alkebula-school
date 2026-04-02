"use client";

import { useState } from "react";

type Enquiry = {
  id: string;
  student_name: string;
  subject: string;
  preferred_mode: string | null;
  preferred_schedule: string | null;
  status: string;
  created_at: string;
};

type Booking = {
  id: string;
  student_name: string;
  subject: string;
  lesson_mode: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  created_at: string;
};

export default function ParentDashboardPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [loadedEmail, setLoadedEmail] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/parent-dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parentEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load parent dashboard.");
      }

      setLoadedEmail(result.parentEmail);
      setEnquiries(result.enquiries || []);
      setBookings(result.bookings || []);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load parent dashboard.";
      setError(msg);
      setLoadedEmail("");
      setEnquiries([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();

  const upcomingBookings = bookings.filter((booking) => {
    const scheduled = new Date(booking.scheduled_at);
    return scheduled >= now && booking.status !== "cancelled";
  });

  const bookingHistory = bookings.filter((booking) => {
    const scheduled = new Date(booking.scheduled_at);
    return scheduled < now || booking.status === "completed" || booking.status === "cancelled";
  });

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
            Parent Portal
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
            Parent Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Load a parent profile using the parent email to view enquiries,
            bookings, and upcoming lessons.
          </p>

          <form onSubmit={loadDashboard} className="mt-8 flex flex-col gap-4 md:flex-row">
            <input
              className="flex-1 rounded-xl border p-3"
              placeholder="Enter parent email"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load Dashboard"}
            </button>
          </form>

          {error ? (
            <div className="mt-6 rounded-xl bg-red-50 p-3 text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        {loadedEmail ? (
          <>
            <div className="mt-8 rounded-3xl bg-white p-8 shadow">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">{loadedEmail}</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border p-4">
                  <strong>Total Enquiries</strong>
                  <p className="mt-2 text-slate-700">{enquiries.length}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <strong>Total Bookings</strong>
                  <p className="mt-2 text-slate-700">{bookings.length}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <strong>Upcoming Lessons</strong>
                  <p className="mt-2 text-slate-700">{upcomingBookings.length}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <strong>Past / Closed Lessons</strong>
                  <p className="mt-2 text-slate-700">{bookingHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow">
                <h3 className="text-2xl font-semibold text-[#1A1A1A]">
                  Parent Enquiries
                </h3>

                {enquiries.length === 0 ? (
                  <p className="mt-4 text-slate-600">No enquiries found.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {enquiries.map((enquiry) => (
                      <div key={enquiry.id} className="rounded-2xl border p-5">
                        <div className="font-semibold text-[#1A1A1A]">
                          {enquiry.student_name} — {enquiry.subject}
                        </div>
                        <div className="mt-2 text-sm text-slate-600 capitalize">
                          Preferred Mode: {enquiry.preferred_mode || "-"}
                        </div>
                        <div className="text-sm text-slate-600">
                          Preferred Schedule: {enquiry.preferred_schedule || "-"}
                        </div>
                        <div className="text-sm text-slate-600 capitalize">
                          Status: {enquiry.status}
                        </div>
                        <div className="text-sm text-slate-600">
                          Submitted:{" "}
                          {enquiry.created_at
                            ? new Date(enquiry.created_at).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-8 shadow">
                <h3 className="text-2xl font-semibold text-[#1A1A1A]">
                  Upcoming Lessons
                </h3>

                {upcomingBookings.length === 0 ? (
                  <p className="mt-4 text-slate-600">No upcoming lessons.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="rounded-2xl border p-5">
                        <div className="font-semibold text-[#1A1A1A]">
                          {booking.student_name} — {booking.subject}
                        </div>
                        <div className="mt-2 text-sm text-slate-600 capitalize">
                          Lesson Mode: {booking.lesson_mode || "-"}
                        </div>
                        <div className="text-sm text-slate-600">
                          Duration: {booking.duration_minutes} minutes
                        </div>
                        <div className="text-sm text-slate-600">
                          Scheduled:{" "}
                          {booking.scheduled_at
                            ? new Date(booking.scheduled_at).toLocaleString()
                            : "-"}
                        </div>
                        <div className="text-sm text-slate-600 capitalize">
                          Status: {booking.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-8 shadow">
              <h3 className="text-2xl font-semibold text-[#1A1A1A]">
                Booking History
              </h3>

              {bookingHistory.length === 0 ? (
                <p className="mt-4 text-slate-600">No booking history yet.</p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="rounded-2xl border p-5">
                      <div className="font-semibold text-[#1A1A1A]">
                        {booking.student_name} — {booking.subject}
                      </div>
                      <div className="mt-2 text-sm text-slate-600 capitalize">
                        Lesson Mode: {booking.lesson_mode || "-"}
                      </div>
                      <div className="text-sm text-slate-600">
                        Scheduled:{" "}
                        {booking.scheduled_at
                          ? new Date(booking.scheduled_at).toLocaleString()
                          : "-"}
                      </div>
                      <div className="text-sm text-slate-600 capitalize">
                        Status: {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}