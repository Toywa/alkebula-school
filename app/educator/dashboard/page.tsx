"use client";

import { useEffect, useState } from "react";

type Period = {
  id: string;
  period_label: string;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  submitted_at: string | null;
  status: string;
};

type Slot = {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  timezone: string | null;
  status: string;
};

export default function EducatorDashboardPage() {
  const [educatorId, setEducatorId] = useState("");
  const [periods, setPeriods] = useState<Period[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [activePeriodId, setActivePeriodId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimezone) {
      setTimezone(detectedTimezone);
    }
  }, []);

  async function readJsonOrThrow(response: Response, label: string) {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`${label} returned non-JSON response: ${text.slice(0, 160)}`);
    }
  }

  async function loadDashboard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/educator-availability-load/${educatorId}`);
      const data = await readJsonOrThrow(res, "educator-availability-load API");

      if (!res.ok) {
        throw new Error(data.error || "Failed to load dashboard.");
      }

      setPeriods(data.periods || []);
      setSlots(data.slots || []);
      setMessage("Dashboard loaded.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard.";
      setError(msg);
      setPeriods([]);
      setSlots([]);
    }
  }

  async function generatePeriod() {
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/availability-periods", {
        method: "POST",
        body: JSON.stringify({ educatorId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await readJsonOrThrow(res, "availability-periods API");

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate period.");
      }

      const newPeriod = data.period as Period;

      setPeriods((prev) => {
        const exists = prev.find((p) => p.id === newPeriod.id);
        return exists ? prev : [newPeriod, ...prev];
      });

      setActivePeriodId(newPeriod.id);
      setMessage(`Availability period ready: ${newPeriod.period_label}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate period.";
      setError(msg);
    }
  }

  async function saveSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/educator-availability", {
        method: "POST",
        body: JSON.stringify({
          educatorId,
          periodId: activePeriodId || null,
          slotDate,
          startTime,
          endTime,
          timezone,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await readJsonOrThrow(res, "educator-availability API");

      if (!res.ok) {
        throw new Error(data.error || "Failed to save slot.");
      }

      setSlots((prev) => [...prev, data.slot]);
      setMessage("Availability slot saved successfully.");
      setSlotDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save slot.";
      setError(msg);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Educator Dashboard</h1>

      <form onSubmit={loadDashboard} className="mt-6">
        <input
          value={educatorId}
          onChange={(e) => setEducatorId(e.target.value)}
          placeholder="Enter educator ID"
          className="w-full border p-3"
        />
        <button className="mt-3 bg-black px-4 py-2 text-white">
          Load Dashboard
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-green-700">
          {message}
        </div>
      ) : null}

      <div className="mt-6">
        <button
          type="button"
          onClick={generatePeriod}
          className="bg-blue-600 px-4 py-2 text-white"
        >
          Generate / Load Current Availability Period
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-bold">Periods</h2>

        {periods.length === 0 ? (
          <div className="mt-2 text-slate-600">No periods yet.</div>
        ) : (
          <div className="mt-3 space-y-3">
            {periods.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border p-4"
              >
                <div className="font-medium">{p.period_label}</div>
                <div className="text-sm text-slate-600">
                  {p.start_date} to {p.end_date}
                </div>
                <div className="text-sm text-slate-600">
                  Deadline: {p.submission_deadline}
                </div>
                <div className="text-sm text-slate-600 capitalize">
                  Status: {p.status}
                </div>
                <button
                  type="button"
                  onClick={() => setActivePeriodId(p.id)}
                  className="mt-3 rounded-lg border px-3 py-2"
                >
                  Use This Period
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={saveSlot} className="mt-8 space-y-4">
        <h2 className="font-bold">Add Availability Slot</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            className="border p-2"
          />

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2"
          />

          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Timezone"
            className="border p-2"
          />
        </div>

        <button className="bg-green-600 px-4 py-2 text-white">
          Save Slot
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-bold">Slots</h2>

        {slots.length === 0 ? (
          <div className="mt-2 text-slate-600">No slots yet.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {slots.map((s) => (
              <div key={s.id} className="rounded-lg border p-3">
                {s.slot_date} {s.start_time}-{s.end_time} ({s.timezone || "UTC"})
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}