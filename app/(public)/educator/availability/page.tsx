"use client";

import { useEffect, useMemo, useState } from "react";

type Educator = {
  id: string;
  full_name: string;
};

type AvailabilitySlot = {
  id: string;
  educator_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EducatorAvailabilityPage() {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedEducatorId, setSelectedEducatorId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadEducators() {
    const res = await fetch("/api/educator-directory");
    const json = await res.json();
    if (res.ok) {
      setEducators(json.data || []);
      if (!selectedEducatorId && json.data?.length) {
        setSelectedEducatorId(json.data[0].id);
      }
    }
  }

  async function loadSlots() {
    const res = await fetch("/api/educator-availability");
    const json = await res.json();
    if (res.ok) {
      setSlots(json.data || []);
    } else {
      setErrorMessage(json.error || "Failed to load slots");
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      setErrorMessage("");
      await Promise.all([loadEducators(), loadSlots()]);
      setLoading(false);
    }
    init();
  }, []);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => slot.educator_id === selectedEducatorId);
  }, [slots, selectedEducatorId]);

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const res = await fetch("/api/educator-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        educator_id: selectedEducatorId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setErrorMessage(json.error || "Failed to create slot");
      setSaving(false);
      return;
    }

    setSlots((prev) => [json.data, ...prev]);
    setMessage("Availability slot added.");
    setSaving(false);
  }

  async function handleDeleteSlot(id: string) {
    setMessage("");
    setErrorMessage("");

    const res = await fetch(`/api/educator-availability/${id}`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (!res.ok) {
      setErrorMessage(json.error || "Failed to delete slot");
      return;
    }

    setSlots((prev) => prev.filter((slot) => slot.id !== id));
    setMessage("Availability slot removed.");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-4xl font-bold">Educator Availability</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Tutors define the exact time slots parents can book. These slots feed directly into the public booking pages.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <form
              onSubmit={handleCreateSlot}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold">Add availability slot</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Educator
                  </label>
                  <select
                    value={selectedEducatorId}
                    onChange={(e) => setSelectedEducatorId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    required
                  >
                    {educators.map((educator) => (
                      <option key={educator.id} value={educator.id}>
                        {educator.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Day</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Start time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">End time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    required
                  />
                </div>
              </div>

              {message ? (
                <p className="mt-4 text-green-600">{message}</p>
              ) : null}

              {errorMessage ? (
                <p className="mt-4 text-red-600">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
              >
                {saving ? "Saving..." : "Add Slot"}
              </button>
            </form>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Current slots</h2>

              {!selectedEducatorId ? (
                <p className="mt-4 text-slate-600">Select an educator first.</p>
              ) : filteredSlots.length === 0 ? (
                <p className="mt-4 text-slate-600">No slots added yet.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {filteredSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                    >
                      <div>
                        <p className="font-medium">{slot.day_of_week}</p>
                        <p className="text-sm text-slate-600">
                          {slot.start_time} - {slot.end_time}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}