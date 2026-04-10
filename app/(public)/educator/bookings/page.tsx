"use client";

import { useEffect, useMemo, useState } from "react";

type Educator = {
  id: string;
  full_name: string;
  timezone: string | null;
};

type TutorBooking = {
  id: string;
  educator_id: string;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  student_name: string | null;
  curriculum: string | null;
  subject: string | null;
  class_level: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  timezone: string | null;
  status: string | null;
  tutor_confirmation_status: string | null;
  reschedule_reason: string | null;
  created_at: string;
};

export default function EducatorBookingsPage() {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [selectedEducatorId, setSelectedEducatorId] = useState("");
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rescheduleDrafts, setRescheduleDrafts] = useState<Record<string, string>>({});
  const [actingId, setActingId] = useState("");

  async function loadEducators() {
    const res = await fetch("/api/educator-directory");
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to load educators");
    }

    setEducators(json.data || []);
    if (!selectedEducatorId && json.data?.length) {
      setSelectedEducatorId(json.data[0].id);
    }
  }

  async function loadBookings(educatorId: string) {
    const res = await fetch(`/api/tutor-bookings?educator_id=${educatorId}`);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to load bookings");
    }

    setBookings(json.data || []);
  }

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        await loadEducators();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to initialize page"
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (!selectedEducatorId) return;

    async function refreshBookings() {
      try {
        setErrorMessage("");
        await loadBookings(selectedEducatorId);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load bookings"
        );
      }
    }

    refreshBookings();
  }, [selectedEducatorId]);

  const visibleBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.status === "pending" ||
        booking.status === "pending_tutor_confirmation" ||
        booking.status === "tutor_confirmed" ||
        booking.status === "reschedule_requested"
    );
  }, [bookings]);

  async function handleConfirm(bookingId: string) {
    try {
      setActingId(bookingId);
      setMessage("");
      setErrorMessage("");

      const res = await fetch(`/api/tutor-bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "confirm" }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to confirm booking");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "tutor_confirmed",
                tutor_confirmation_status: "confirmed",
                reschedule_reason: null,
              }
            : booking
        )
      );

      setMessage(
        json.warning
          ? `Booking confirmed. ${json.warning}`
          : "Booking confirmed successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to confirm booking"
      );
    } finally {
      setActingId("");
    }
  }

  async function handleRequestReschedule(bookingId: string) {
    const reason = rescheduleDrafts[bookingId]?.trim();

    if (!reason) {
      setErrorMessage("Please enter a reason before requesting reschedule.");
      return;
    }

    try {
      setActingId(bookingId);
      setMessage("");
      setErrorMessage("");

      const res = await fetch(`/api/tutor-bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "request_reschedule",
          reason,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to request reschedule");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: "reschedule_requested",
                tutor_confirmation_status: "reschedule_requested",
                reschedule_reason: reason,
              }
            : booking
        )
      );

      setMessage(
        json.warning
          ? `Reschedule requested. ${json.warning}`
          : "Reschedule request sent to admin."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to request reschedule"
      );
    } finally {
      setActingId("");
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-4xl font-bold">Tutor Booking Dashboard</h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Tutors confirm lessons or request reschedule. Reschedule requests notify admin for parent follow-up. Lessons should not be casually rejected once booked and invoiced.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="mb-2 block text-sm font-medium">
                Select tutor
              </label>
              <select
                value={selectedEducatorId}
                onChange={(e) => setSelectedEducatorId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                {educators.map((educator) => (
                  <option key={educator.id} value={educator.id}>
                    {educator.full_name}
                  </option>
                ))}
              </select>

              {message ? (
                <p className="mt-4 text-green-600">{message}</p>
              ) : null}

              {errorMessage ? (
                <p className="mt-4 text-red-600">{errorMessage}</p>
              ) : null}
            </div>

            <div className="mt-8 space-y-6">
              {visibleBookings.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-lg font-medium">No bookings yet.</p>
                  <p className="mt-2 text-slate-600">
                    New tutor bookings will appear here.
                  </p>
                </div>
              ) : (
                visibleBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold">
                          {booking.student_name || "Student"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          Parent: {booking.parent_name || "Unknown"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          {booking.booking_date}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          {booking.start_time} - {booking.end_time}
                        </span>
                        {booking.timezone ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                            {booking.timezone}
                          </span>
                        ) : null}
                        {booking.status ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                            {booking.status}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3 text-sm text-slate-700">
                      <div>
                        <span className="font-medium">Curriculum:</span>{" "}
                        {booking.curriculum || "—"}
                      </div>
                      <div>
                        <span className="font-medium">Subject:</span>{" "}
                        {booking.subject || "—"}
                      </div>
                      <div>
                        <span className="font-medium">Class / Level:</span>{" "}
                        {booking.class_level || "—"}
                      </div>
                    </div>

                    {booking.status === "reschedule_requested" && booking.reschedule_reason ? (
                      <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                        <span className="font-medium">Reschedule reason:</span>{" "}
                        {booking.reschedule_reason}
                      </div>
                    ) : null}

                    {(booking.status === "pending" ||
                      booking.status === "pending_tutor_confirmation" ||
                      booking.status === "awaiting_confirmation") && (
                      <div className="mt-6 space-y-4">
                        <textarea
                          value={rescheduleDrafts[booking.id] || ""}
                          onChange={(e) =>
                            setRescheduleDrafts((prev) => ({
                              ...prev,
                              [booking.id]: e.target.value,
                            }))
                          }
                          placeholder="If you need a reschedule, explain clearly for admin follow-up."
                          rows={3}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                        />

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            onClick={() => handleConfirm(booking.id)}
                            disabled={actingId === booking.id}
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                          >
                            {actingId === booking.id ? "Working..." : "Confirm Lesson"}
                          </button>

                          <button
                            onClick={() => handleRequestReschedule(booking.id)}
                            disabled={actingId === booking.id}
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                          >
                            {actingId === booking.id
                              ? "Working..."
                              : "Request Reschedule"}
                          </button>
                        </div>
                      </div>
                    )}

                    {booking.status === "tutor_confirmed" && (
                      <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">
                        Lesson confirmed.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}