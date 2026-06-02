"use client";

import { use, useEffect, useState } from "react";

type Educator = {
  id: string;
  display_name: string;
  primary_subject: string | null;
  curriculum_expertise: string | null;
  location: string | null;
  teaching_mode: string | null;
  hourly_rate: number | null;
};

type Booking = {
  id: string;
  enquiry_id: string | null;
  educator_id: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone: string | null;
  student_name: string;
  subject: string;
  lesson_mode: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  created_at: string;
  educator: Educator | null;
};

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooking() {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        const text = await response.text();

        let result: any = {};

        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            `Non-JSON response from /api/bookings/${id}: ${text.slice(0, 200)}`
          );
        }

        if (!response.ok) {
          throw new Error(result.error || "Failed to load booking.");
        }

        setBooking(result.booking);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load booking.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [id]);

  async function updateStatus(status: string) {
    setStatusLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const text = await response.text();

      let result: any = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Non-JSON response from /api/bookings/${id}/status: ${text.slice(
            0,
            200
          )}`
        );
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to update booking.");
      }

      setBooking((prev) =>
        prev ? { ...prev, status: result.booking.status } : prev
      );

      setMessage(`Booking status updated to ${result.booking.status}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setError(msg);
    } finally {
      setStatusLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-6 text-slate-900 lg:p-10">
        Loading booking...
      </main>
    );
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-white p-6 text-red-600 lg:p-10">
        {error}
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-white p-6 text-red-600 lg:p-10">
        Booking not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900 lg:p-10">
      <a
        href="/admin/bookings"
        className="text-sm font-semibold text-[#8F1F36] hover:underline"
      >
        ← Back to bookings
      </a>

      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Booking Review
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-950">
              {booking.parent_name}
            </h1>

            <p className="mt-2 text-sm font-semibold capitalize text-slate-600">
              Status: {booking.status}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateStatus("scheduled")}
              disabled={statusLoading}
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Scheduled
            </button>

            <button
              onClick={() => updateStatus("completed")}
              disabled={statusLoading}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Completed
            </button>

            <button
              onClick={() => updateStatus("rescheduled")}
              disabled={statusLoading}
              className="rounded-xl bg-[#156B96] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Rescheduled
            </button>

            <button
              onClick={() => updateStatus("cancelled")}
              disabled={statusLoading}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {message ? (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      ) : null}

      {error && booking ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-950">Booking Details</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Parent Email:</strong>
            <p className="mt-2 text-slate-700">{booking.parent_email}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Parent Phone:</strong>
            <p className="mt-2 text-slate-700">
              {booking.parent_phone || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Student Name:</strong>
            <p className="mt-2 text-slate-700">{booking.student_name}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Subject:</strong>
            <p className="mt-2 text-slate-700">{booking.subject}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Lesson Mode:</strong>
            <p className="mt-2 capitalize text-slate-700">
              {booking.lesson_mode || "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Scheduled At:</strong>
            <p className="mt-2 text-slate-700">
              {booking.scheduled_at
                ? new Date(booking.scheduled_at).toLocaleString()
                : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Duration:</strong>
            <p className="mt-2 text-slate-700">
              {booking.duration_minutes} minutes
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <strong>Created:</strong>
            <p className="mt-2 text-slate-700">
              {booking.created_at
                ? new Date(booking.created_at).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-950">
          Assigned Educator
        </h2>

        {booking.educator ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#F7FCFF] p-4">
              <strong>Name:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.display_name}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FCFF] p-4">
              <strong>Subject:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.primary_subject || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FCFF] p-4">
              <strong>Curriculum:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.curriculum_expertise || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FCFF] p-4">
              <strong>Location:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.location || "-"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-600">No educator assigned.</p>
        )}
      </section>
    </main>
  );
}