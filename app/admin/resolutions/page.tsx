"use client";

import { useEffect, useMemo, useState } from "react";

type AdminCase = {
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
  admin_resolution_status: string | null;
  created_at: string;
};

type SlotOption = {
  id: string;
  educator_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  timezone: string | null;
  status: string;
};

const STATUS_OPTIONS = [
  "pending_admin_review",
  "parent_contacted",
  "reschedule_in_progress",
  "resolved",
  "closed",
] as const;

export default function AdminResolutionsPage() {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [actingId, setActingId] = useState("");
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});
  const [slotOptions, setSlotOptions] = useState<Record<string, SlotOption[]>>({});
  const [selectedNewSlot, setSelectedNewSlot] = useState<Record<string, string>>(
    {}
  );
  const [loadingSlotsFor, setLoadingSlotsFor] = useState("");

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch("/api/admin-resolutions?mode=reschedule_only");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load admin cases");
        }

        setCases(json.data || []);

        const drafts: Record<string, string> = {};
        for (const item of json.data || []) {
          drafts[item.id] = item.admin_resolution_status || "pending_admin_review";
        }
        setStatusDrafts(drafts);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load admin cases"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  const visibleCases = useMemo(() => {
    return cases.filter((item) => item.status === "reschedule_requested");
  }, [cases]);

  async function handleUpdate(caseId: string) {
    const nextStatus = statusDrafts[caseId];

    if (!nextStatus) {
      setErrorMessage("Please choose a status.");
      return;
    }

    try {
      setActingId(caseId);
      setMessage("");
      setErrorMessage("");

      const res = await fetch(`/api/admin-resolutions/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_resolution_status: nextStatus,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to update admin case");
      }

      setCases((prev) =>
        prev.map((item) =>
          item.id === caseId
            ? {
                ...item,
                admin_resolution_status: nextStatus,
              }
            : item
        )
      );

      setMessage(
        json.warning
          ? `Case updated. ${json.warning}`
          : "Admin case updated successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update admin case"
      );
    } finally {
      setActingId("");
    }
  }

  async function loadRescheduleOptions(caseId: string, educatorId: string) {
    try {
      setLoadingSlotsFor(caseId);
      setErrorMessage("");

      const res = await fetch(
        `/api/admin-reschedule-options?educator_id=${educatorId}`
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load slot options");
      }

      setSlotOptions((prev) => ({
        ...prev,
        [caseId]: json.data || [],
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load slot options"
      );
    } finally {
      setLoadingSlotsFor("");
    }
  }

  async function handleFinalizeReschedule(caseId: string) {
    const newSlotId = selectedNewSlot[caseId];

    if (!newSlotId) {
      setErrorMessage("Please choose a new slot first.");
      return;
    }

    try {
      setActingId(caseId);
      setMessage("");
      setErrorMessage("");

      const res = await fetch(`/api/admin-reschedule/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_slot_id: newSlotId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to finalize reschedule");
      }

      setCases((prev) =>
        prev.map((item) =>
          item.id === caseId
            ? {
                ...item,
                booking_date: json.data.booking_date,
                start_time: json.data.start_time,
                end_time: json.data.end_time,
                timezone: json.data.timezone,
                status: "tutor_confirmed",
                tutor_confirmation_status: "confirmed",
                admin_resolution_status: "resolved",
              }
            : item
        )
      );

      setMessage(
        json.warning
          ? `Booking rescheduled. ${json.warning}`
          : "Booking rescheduled successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to finalize reschedule"
      );
    } finally {
      setActingId("");
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-4xl font-bold">Admin Resolution Dashboard</h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Review tutor reschedule requests, engage parents, assign a new slot,
            and resolve each case without breaking booking integrity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {message ? <p className="mb-4 text-green-600">{message}</p> : null}
        {errorMessage ? <p className="mb-4 text-red-600">{errorMessage}</p> : null}

        {loading ? (
          <p>Loading...</p>
        ) : visibleCases.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No reschedule cases right now.</p>
            <p className="mt-2 text-slate-600">
              Tutor reschedule requests will appear here for admin handling.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleCases.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {item.student_name || "Student"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Parent: {item.parent_name || "Unknown"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      {item.booking_date}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      {item.start_time} - {item.end_time}
                    </span>
                    {item.timezone ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        {item.timezone}
                      </span>
                    ) : null}
                    {item.admin_resolution_status ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                        {item.admin_resolution_status}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 text-sm text-slate-700">
                  <div>
                    <span className="font-medium">Parent email:</span>{" "}
                    {item.parent_email || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Parent phone:</span>{" "}
                    {item.parent_phone || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Curriculum:</span>{" "}
                    {item.curriculum || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Subject:</span>{" "}
                    {item.subject || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Class / Level:</span>{" "}
                    {item.class_level || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Tutor confirmation status:</span>{" "}
                    {item.tutor_confirmation_status || "—"}
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  <span className="font-medium">Tutor reschedule reason:</span>{" "}
                  {item.reschedule_reason || "No reason provided."}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={statusDrafts[item.id] || "pending_admin_review"}
                    onChange={(e) =>
                      setStatusDrafts((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleUpdate(item.id)}
                    disabled={actingId === item.id}
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    {actingId === item.id ? "Updating..." : "Update Case"}
                  </button>

                  <button
                    onClick={() => loadRescheduleOptions(item.id, item.educator_id)}
                    disabled={loadingSlotsFor === item.id}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                  >
                    {loadingSlotsFor === item.id
                      ? "Loading slots..."
                      : "Load New Slot Options"}
                  </button>
                </div>

                {slotOptions[item.id]?.length ? (
                  <div className="mt-6 rounded-xl border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      Choose a new slot
                    </p>

                    <select
                      value={selectedNewSlot[item.id] || ""}
                      onChange={(e) =>
                        setSelectedNewSlot((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    >
                      <option value="">Select available slot</option>
                      {slotOptions[item.id].map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.slot_date} | {slot.start_time} - {slot.end_time} |{" "}
                          {slot.timezone}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleFinalizeReschedule(item.id)}
                      disabled={actingId === item.id}
                      className="mt-4 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white"
                    >
                      {actingId === item.id
                        ? "Rescheduling..."
                        : "Assign New Slot and Finalize"}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}