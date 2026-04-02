"use client";

import { useEffect, useState } from "react";

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
  params: { id: string };
}) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooking() {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        const text = await response.text();

        let result: any = {};
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            `Non-JSON response from /api/bookings/${params.id}: ${text.slice(0, 200)}`
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
  }, [params.id]);

  async function updateStatus(status: string) {
    setStatusLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/bookings/${params.id}/status`, {
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
          `Non-JSON response from /api/bookings/${params.id}/status: ${text.slice(0, 200)}`
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
    return <div className="p-10">Loading booking...</div>;
  }

  if (error && !booking) {
    return <div className="p-10 text-red-600">{error}</div>;
  }

  if (!booking) {
    return <div className="p-10 text-red-600">Booking not found.</div>;
  }

  return (
    <main className="p-10">
      <a href="/admin/bookings" className="text-blue-600 hover:underline">
        ← Back to bookings
      </a>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{booking.parent_name}</h1>
          <p className="mt-2 text-gray-600 capitalize">
            Status: {booking.status}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateStatus("scheduled")}
            disabled={statusLoading}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-60"
          >
            Scheduled
          </button>
          <button
            onClick={() => updateStatus("completed")}
            disabled={statusLoading}
            className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Completed
          </button>
          <button
            onClick={() => updateStatus("rescheduled")}
            disabled={statusLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Rescheduled
          </button>
          <button
            onClick={() => updateStatus("cancelled")}
            disabled={statusLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Cancelled
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-green-700">
          {message}
        </div>
      ) : null}

      {error && booking ? (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <strong>Parent Email:</strong>
          <p className="mt-2 text-slate-700">{booking.parent_email}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Parent Phone:</strong>
          <p className="mt-2 text-slate-700">{booking.parent_phone || "-"}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Student Name:</strong>
          <p className="mt-2 text-slate-700">{booking.student_name}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Subject:</strong>
          <p className="mt-2 text-slate-700">{booking.subject}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Lesson Mode:</strong>
          <p className="mt-2 text-slate-700 capitalize">
            {booking.lesson_mode || "-"}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Scheduled At:</strong>
          <p className="mt-2 text-slate-700">
            {booking.scheduled_at
              ? new Date(booking.scheduled_at).toLocaleString()
              : "-"}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Duration:</strong>
          <p className="mt-2 text-slate-700">
            {booking.duration_minutes} minutes
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Created:</strong>
          <p className="mt-2 text-slate-700">
            {booking.created_at
              ? new Date(booking.created_at).toLocaleString()
              : "-"}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-2xl font-semibold">Assigned Educator</h2>

        {booking.educator ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <strong>Name:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.display_name}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <strong>Subject:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.primary_subject || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <strong>Curriculum:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.curriculum_expertise || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <strong>Location:</strong>
              <p className="mt-2 text-slate-700">
                {booking.educator.location || "-"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-600">No educator assigned.</p>
        )}
      </div>
    </main>
  );
}