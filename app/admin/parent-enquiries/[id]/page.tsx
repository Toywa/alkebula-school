"use client";

import { useEffect, useState } from "react";

type EducatorInfo = {
  id: string;
  display_name: string;
  primary_subject: string | null;
  curriculum_expertise: string | null;
  location: string | null;
  teaching_mode: string | null;
  hourly_rate: number | null;
};

type Enquiry = {
  id: string;
  educator_id: string | null;
  parent_name: string;
  parent_email: string;
  parent_phone: string | null;
  student_name: string;
  subject: string;
  preferred_mode: string | null;
  preferred_schedule: string | null;
  message: string | null;
  status: string;
  created_at: string;
  educators: EducatorInfo | null;
};

export default function AdminParentEnquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [scheduledAt, setScheduledAt] = useState("");
  const [lessonMode, setLessonMode] = useState("online");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [amountUsd, setAmountUsd] = useState("50");

  useEffect(() => {
    async function loadEnquiry() {
      try {
        const response = await fetch(`/api/parent-enquiries/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load enquiry.");
        }

        setEnquiry(result.enquiry);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load enquiry.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadEnquiry();
  }, [params.id]);

  async function updateStatus(status: string) {
    setStatusLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/parent-enquiries/${params.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update enquiry status.");
      }

      setEnquiry((prev) =>
        prev ? { ...prev, status: result.enquiry.status } : prev
      );
      setMessage(`Status updated to ${result.enquiry.status}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setError(msg);
    } finally {
      setStatusLoading(false);
    }
  }

  async function createBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!enquiry || !enquiry.educators) {
      setError("No linked educator found for this enquiry.");
      return;
    }

    setBookingLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          educatorId: enquiry.educators.id,
          parentName: enquiry.parent_name,
          parentEmail: enquiry.parent_email,
          parentPhone: enquiry.parent_phone,
          studentName: enquiry.student_name,
          subject: enquiry.subject,
          lessonMode,
          scheduledAt,
          durationMinutes: Number(durationMinutes),
          amountUsd: Number(amountUsd),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create booking.");
      }

      setEnquiry((prev) => (prev ? { ...prev, status: "booked" } : prev));

      const invoiceAmount =
        result?.invoice?.amount_usd !== undefined &&
        result?.invoice?.amount_usd !== null
          ? result.invoice.amount_usd
          : null;

      if (invoiceAmount !== null) {
        setMessage(
          `Booking created successfully. Invoice generated for USD ${invoiceAmount}.`
        );
      } else {
        setMessage("Booking created successfully.");
      }

      setScheduledAt("");
      setLessonMode("online");
      setDurationMinutes("60");
      setAmountUsd("50");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Booking failed.";
      setError(msg);
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return <div className="p-10">Loading enquiry...</div>;
  }

  if (error && !enquiry) {
    return <div className="p-10 text-red-600">{error}</div>;
  }

  if (!enquiry) {
    return <div className="p-10 text-red-600">Enquiry not found.</div>;
  }

  return (
    <main className="p-10">
      <a
        href="/admin/parent-enquiries"
        className="text-blue-600 hover:underline"
      >
        ← Back to parent enquiries
      </a>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{enquiry.parent_name}</h1>
          <p className="mt-2 text-gray-600 capitalize">
            Status: {enquiry.status}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateStatus("contacted")}
            disabled={statusLoading}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-60"
          >
            Mark Contacted
          </button>
          <button
            onClick={() => updateStatus("matched")}
            disabled={statusLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Mark Matched
          </button>
          <button
            onClick={() => updateStatus("closed")}
            disabled={statusLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Close
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-green-700">
          {message}
        </div>
      ) : null}

      {error && enquiry ? (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <strong>Parent Email:</strong>
          <p className="mt-2 text-slate-700">{enquiry.parent_email}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Parent Phone:</strong>
          <p className="mt-2 text-slate-700">{enquiry.parent_phone || "-"}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Student Name:</strong>
          <p className="mt-2 text-slate-700">{enquiry.student_name}</p>
        </div>

        <div className="rounded-xl border p-4">
          <strong>Subject Needed:</strong>
          <p className="mt-2 text-slate-700">{enquiry.subject}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-2xl font-semibold">Create Booking + Invoice</h2>

        <form onSubmit={createBooking} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Scheduled At</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Lesson Mode</label>
            <select
              value={lessonMode}
              onChange={(e) => setLessonMode(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Duration (Minutes)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={bookingLoading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {bookingLoading ? "Creating..." : "Create Booking + Invoice"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-sm text-slate-500">
        Submitted:{" "}
        {enquiry.created_at
          ? new Date(enquiry.created_at).toLocaleString()
          : "-"}
      </div>
    </main>
  );
}