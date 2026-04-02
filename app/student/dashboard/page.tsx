"use client";

import { useState } from "react";

type Booking = {
  id: string;
  parent_name: string;
  parent_email: string;
  subject: string;
  lesson_mode: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  created_at: string;
};

export default function StudentDashboardPage() {
  const [studentName, setStudentName] = useState("");
  const [loadedStudent, setLoadedStudent] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/student-dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load student dashboard.");
      }

      setLoadedStudent(result.studentName);
      setBookings(result.bookings || []);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load student dashboard.";
      setError(msg);
      setLoadedStudent("");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();

  const upcomingLessons = bookings.filter((booking) => {
    const scheduled = new Date(booking.scheduled_at);
    return scheduled >= now && booking.status !== "cancelled";
  });

  const lessonHistory = bookings.filter((booking) => {
    const scheduled = new Date(booking.scheduled_at);
    return scheduled < now || booking.status === "completed" || booking.status === "cancelled";
  });

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
            Student Portal
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
            Student Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Load a student profile using the student name to view upcoming lessons
            and lesson history.
          </p>

          <form onSubmit={loadDashboard} className="mt-8 flex flex-col gap-4 md:flex-row">
            <input
              className="flex-1 rounded-xl border p-3"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
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

        {loadedStudent ? (
          <>
            <div className="mt-8 rounded-3xl bg-white p-8 shadow">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">{loadedStudent}</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <strong>Total Lessons</strong>
                  <p className="mt-2 text-slate-700">{bookings.length}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <strong>Upcoming Lessons</strong>
                  <p className="mt-2 text-slate-700">{upcomingLessons.length}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <strong>Lesson History</strong>
                  <p className="mt-2 text-slate-700">{lessonHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow">
                <h3 className="text-2xl font-semibold text-[#1A1A1A]">
                  Upcoming Lessons
                </h3>

                {upcomingLessons.length === 0 ? (
                  <p className="mt-4 text-slate-600">No upcoming lessons.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {upcomingLessons.map((booking) => (
                      <div key={booking.id} className="rounded-2xl border p-5">
                        <div className="font-semibold text-[#1A1A1A]">
                          {booking.subject}
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          Parent: {booking.parent_name}
                        </div>
                        <div className="text-sm text-slate-600 capitalize">
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

              <div className="rounded-3xl bg-white p-8 shadow">
                <h3 className="text-2xl font-semibold text-[#1A1A1A]">
                  Lesson History
                </h3>

                {lessonHistory.length === 0 ? (
                  <p className="mt-4 text-slate-600">No lesson history yet.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {lessonHistory.map((booking) => (
                      <div key={booking.id} className="rounded-2xl border p-5">
                        <div className="font-semibold text-[#1A1A1A]">
                          {booking.subject}
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          Parent: {booking.parent_name}
                        </div>
                        <div className="text-sm text-slate-600 capitalize">
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
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}