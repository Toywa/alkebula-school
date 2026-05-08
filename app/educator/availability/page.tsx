"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const months = [
  { label: "May 2026", start: "2026-05-01", end: "2026-05-31" },
  { label: "June 2026", start: "2026-06-01", end: "2026-06-30" },
];

const days = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

function getDatesInRange(start: string, end: string, selectedDays: number[]) {
  const dates: string[] = [];
  const current = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);

  while (current <= last) {
    if (selectedDays.includes(current.getDay())) {
      dates.push(current.toISOString().slice(0, 10));
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export default function MayJuneAvailabilityPage() {
  const [email, setEmail] = useState("");
  const [approved, setApproved] = useState(false);
  const [checking, setChecking] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState("May 2026");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [timezone, setTimezone] = useState("UTC");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) setTimezone(tz);

    checkTutor();
  }, []);

  async function checkTutor() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      window.location.href = "/auth/sign-in";
      return;
    }

    const userEmail = user.email.toLowerCase();
    setEmail(userEmail);

    const { data } = await supabase
      .from("educator_directory")
      .select("email,approval_status")
      .eq("email", userEmail)
      .eq("approval_status", "approved")
      .single();

    setApproved(!!data);
    setChecking(false);
  }

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function createSlots() {
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!approved) {
        throw new Error("Only approved educators can create availability slots.");
      }

      if (!selectedDays.length) {
        throw new Error("Please choose at least one day of the week.");
      }

      if (!startTime || !endTime) {
        throw new Error("Please choose start and end time.");
      }

      if (startTime >= endTime) {
        throw new Error("End time must be later than start time.");
      }

      const month = months.find((m) => m.label === selectedMonth);
      if (!month) throw new Error("Invalid month selected.");

      const dates = getDatesInRange(month.start, month.end, selectedDays);

      const rows = dates.map((date) => ({
        tutor_email: email,
        date,
        slot_date: date,
        start_time: startTime,
        end_time: endTime,
        timezone,
        status: "available",
        is_booked: false,
      }));

      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase
        .from("tutor_availability_slots")
        .insert(rows);

      if (error) throw new Error(error.message);

      setMessage(`${rows.length} availability slots created for ${selectedMonth}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create slots."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        Checking educator access...
      </main>
    );
  }

  if (!approved) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
          Only approved educators can access this page.
        </div>
      </main>
    );
  }

  const month = months.find((m) => m.label === selectedMonth)!;
  const previewDates = getDatesInRange(month.start, month.end, selectedDays);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          May & June 2026 Availability
        </h1>

        <p className="mt-4 text-slate-600">
          Signed in as <strong>{email}</strong>. Create bookable slots for May
          and June 2026.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                {months.map((m) => (
                  <option key={m.label} value={m.label}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Timezone</label>
              <input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Repeat on these days</p>
            <div className="flex flex-wrap gap-3">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                    selectedDays.includes(day.value)
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-semibold">Preview</p>
            <p className="mt-2 text-sm text-slate-600">
              This will create <strong>{previewDates.length}</strong> slots for{" "}
              <strong>{selectedMonth}</strong>, from{" "}
              <strong>{startTime}</strong> to <strong>{endTime}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={createSlots}
            disabled={loading}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : `Create ${selectedMonth} Slots`}
          </button>

          {message ? <p className="mt-4 text-green-600">{message}</p> : null}
          {errorMessage ? (
            <p className="mt-4 text-red-600">{errorMessage}</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}