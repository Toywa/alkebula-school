"use client";

import { useMemo, useState } from "react";

type ParentBooking = {
  id: string;
  educator_id: string;
  parent_name: string | null;
  parent_email: string | null;
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
  admin_resolution_status: string | null;
  parent_response: string | null;
  parent_response_at: string | null;
  created_at: string;
};

type ParentInvoice = {
  id: string;
  booking_id: string;
  educator_id: string;
  parent_name: string | null;
  parent_email: string | null;
  amount_usd: number | null;
  status: string | null;
  due_date: string | null;
  timezone: string | null;
  created_at: string;
};

export default function ParentBookingsPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [bookings, setBookings] = useState<ParentBooking[]>([]);
  const [invoices, setInvoices] = useState<ParentInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [actingBookingId, setActingBookingId] = useState("");
  const [actingInvoiceId, setActingInvoiceId] = useState("");

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const [bookingsRes, invoicesRes] = await Promise.all([
        fetch(
          `/api/parent-bookings?parent_email=${encodeURIComponent(parentEmail)}`
        ),
        fetch(
          `/api/parent-invoices?parent_email=${encodeURIComponent(parentEmail)}`
        ),
      ]);

      const bookingsJson = await bookingsRes.json();
      const invoicesJson = await invoicesRes.json();

      if (!bookingsRes.ok) {
        throw new Error(bookingsJson.error || "Failed to load bookings");
      }

      if (!invoicesRes.ok) {
        throw new Error(invoicesJson.error || "Failed to load invoices");
      }

      setBookings(bookingsJson.data || []);
      setInvoices(invoicesJson.data || []);
      setMessage("Booking and invoice history loaded.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load parent history"
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshHistory() {
    if (!parentEmail.trim()) return;

    try {
      const [bookingsRes, invoicesRes] = await Promise.all([
        fetch(
          `/api/parent-bookings?parent_email=${encodeURIComponent(parentEmail)}`
        ),
        fetch(
          `/api/parent-invoices?parent_email=${encodeURIComponent(parentEmail)}`
        ),
      ]);

      const bookingsJson = await bookingsRes.json();
      const invoicesJson = await invoicesRes.json();

      if (!bookingsRes.ok) {
        throw new Error(bookingsJson.error || "Failed to refresh bookings");
      }

      if (!invoicesRes.ok) {
        throw new Error(invoicesJson.error || "Failed to refresh invoices");
      }

      setBookings(bookingsJson.data || []);
      setInvoices(invoicesJson.data || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to refresh parent history"
      );
    }
  }

  async function handleParentResponse(
    bookingId: string,
    action: "accept_reschedule" | "request_admin_help"
  ) {
    try {
      setActingBookingId(bookingId);
      setMessage("");
      setErrorMessage("");

      const res = await fetch(`/api/parent-response/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to update booking response");
      }

      setMessage(
        action === "accept_reschedule"
          ? "You accepted the new lesson time."
          : "Admin has been notified to help with this booking."
      );

      await refreshHistory();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update booking response"
      );
    } finally {
      setActingBookingId("");
    }
  }

  async function handleMarkPaid(invoiceId: string) {
    try {
      setActingInvoiceId(invoiceId);
      setMessage("");
      setErrorMessage("");

      const res = await fetch(`/api/parent-pay/${invoiceId}`, {
        method: "PATCH",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to update invoice payment");
      }

      setMessage("Invoice marked as paid.");
      await refreshHistory();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update invoice payment"
      );
    } finally {
      setActingInvoiceId("");
    }
  }

  const invoiceMap = useMemo(() => {
    const map = new Map<string, ParentInvoice>();
    for (const invoice of invoices) {
      map.set(invoice.booking_id, invoice);
    }
    return map;
  }, [invoices]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-4xl font-bold">Parent Booking History</h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            View your booked lessons, booking statuses, invoice details, and
            reschedule responses in one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <form
          onSubmit={handleLookup}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="mb-2 block text-sm font-medium">Parent email</label>
          <input
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            placeholder="Enter the email used for booking"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {loading ? "Loading..." : "View My Bookings"}
          </button>

          {message ? <p className="mt-4 text-green-600">{message}</p> : null}
          {errorMessage ? <p className="mt-4 text-red-600">{errorMessage}</p> : null}
        </form>

        <div className="mt-8 space-y-6">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium">No bookings loaded yet.</p>
              <p className="mt-2 text-slate-600">
                Enter your booking email above to view your history.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const invoice = invoiceMap.get(booking.id);

              return (
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
                        {booking.booking_date} | {booking.start_time} -{" "}
                        {booking.end_time}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      {booking.status ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          {booking.status}
                        </span>
                      ) : null}

                      {booking.tutor_confirmation_status ? (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                          {booking.tutor_confirmation_status}
                        </span>
                      ) : null}

                      {booking.admin_resolution_status &&
                      booking.admin_resolution_status !== "not_required" ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-800">
                          {booking.admin_resolution_status}
                        </span>
                      ) : null}

                      {booking.parent_response ? (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                          parent: {booking.parent_response}
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

                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">Invoice</p>

                    {invoice ? (
                      <>
                        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-slate-700">
                          <div>
                            <span className="font-medium">Amount:</span>{" "}
                            {typeof invoice.amount_usd === "number"
                              ? `USD ${invoice.amount_usd}`
                              : "—"}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>{" "}
                            {invoice.status || "—"}
                          </div>
                          <div>
                            <span className="font-medium">Due date:</span>{" "}
                            {invoice.due_date || "—"}
                          </div>
                        </div>

                        {invoice.status !== "paid" && (
                          <button
                            onClick={() => handleMarkPaid(invoice.id)}
                            disabled={actingInvoiceId === invoice.id}
                            className="mt-4 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
                          >
                            {actingInvoiceId === invoice.id
                              ? "Updating..."
                              : "Mark as Paid"}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-slate-600">
                        No invoice visible yet for this booking.
                      </p>
                    )}
                  </div>

                  {booking.status === "reschedule_requested" && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-medium text-amber-900">
                        This lesson has been rescheduled and needs your response.
                      </p>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() =>
                            handleParentResponse(
                              booking.id,
                              "accept_reschedule"
                            )
                          }
                          disabled={actingBookingId === booking.id}
                          className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white"
                        >
                          {actingBookingId === booking.id
                            ? "Updating..."
                            : "Accept New Time"}
                        </button>

                        <button
                          onClick={() =>
                            handleParentResponse(
                              booking.id,
                              "request_admin_help"
                            )
                          }
                          disabled={actingBookingId === booking.id}
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          {actingBookingId === booking.id
                            ? "Updating..."
                            : "I Need Help / Contact Admin"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}