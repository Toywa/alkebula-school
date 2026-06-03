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

function isValidTimeZone(timeZone: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return asUtc - date.getTime();
}

function zonedDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  let offset = getTimeZoneOffsetMs(utcGuess, timeZone);
  let utcDate = new Date(utcGuess.getTime() - offset);

  offset = getTimeZoneOffsetMs(utcDate, timeZone);
  utcDate = new Date(utcGuess.getTime() - offset);

  return utcDate;
}

function formatInTimeZone(isoDate: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(new Date(isoDate));
}

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Nairobi";
}

export default function MayJuneAvailabilityPage() {
  const [email, setEmail] = useState("");
  const [approved, setApproved] = useState(false);
  const [checking, setChecking] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState("May 2026");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [timezone, setTimezone] = useState("Africa/Nairobi");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTimezone(getBrowserTimeZone());
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
      .select("email,approval_status,timezone")
      .eq("email", userEmail)
      .eq("approval_status", "approved")
      .single();

    setApproved(!!data);

    if (data?.timezone && isValidTimeZone(data.timezone)) {
      setTimezone(data.timezone);
    }

    setChecking(false);
  }

  function useDetectedTimezone() {
    setTimezone(getBrowserTimeZone());
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

      if (!isValidTimeZone(timezone)) {
        throw new Error(
          "Please use a valid IANA timezone, for example Africa/Nairobi or Europe/London."
        );
      }

      const month = months.find((m) => m.label === selectedMonth);
      if (!month) throw new Error("Invalid month selected.");

      const dates = getDatesInRange(month.start, month.end, selectedDays);

      const rows = dates.map((date) => {
        const startAtUtc = zonedDateTimeToUtc(date, startTime, timezone);
        const endAtUtc = zonedDateTimeToUtc(date, endTime, timezone);

        if (endAtUtc <= startAtUtc) {
          throw new Error(
            "One or more generated slots has an invalid end time. Please review your time range."
          );
        }

        return {
          tutor_email: email,
          date,
          slot_date: date,
          start_time: startTime,
          end_time: endTime,
          timezone,
          tutor_timezone: timezone,
          start_at_utc: startAtUtc.toISOString(),
          end_at_utc: endAtUtc.toISOString(),
          status: "available",
          is_booked: false,
        };
      });

      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase
        .from("tutor_availability_slots")
        .insert(rows);

      if (error) throw new Error(error.message);

      setMessage(
        `${rows.length} timezone-safe availability slots created for ${selectedMonth}.`
      );
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
  const firstPreviewDate = previewDates[0] || month.start;

  const previewStartUtc =
    startTime && firstPreviewDate && isValidTimeZone(timezone)
      ? zonedDateTimeToUtc(firstPreviewDate, startTime, timezone).toISOString()
      : "";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Timezone-Sensitive Availability
        </h1>

        <p className="mt-4 text-slate-600">
          Signed in as <strong>{email}</strong>. Create bookable slots in your
          own timezone. Alkebula stores the true lesson time in UTC so parents,
          tutors and admin can view the same lesson correctly across countries.
        </p>

        <div className="mt-8 rounded-3xl border border-[#379CD6]/20 bg-[#F7FCFF] p-5 text-sm text-slate-700">
          <p className="font-bold text-[#156B96]">Timezone safety note</p>
          <p className="mt-2 leading-7">
            Do not manually calculate London, Nairobi, Dubai or New York time.
            Create slots in your own timezone. The system stores UTC timestamps
            for accurate timezone conversion later.
          </p>
        </div>

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
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium">
                  Your teaching timezone
                </label>

                <button
                  type="button"
                  onClick={useDetectedTimezone}
                  className="text-xs font-semibold text-[#8F1F36] hover:underline"
                >
                  Use detected timezone
                </button>
              </div>

              <input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Example: Africa/Nairobi"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              <p className="mt-2 text-xs text-slate-500">
                Use an IANA timezone such as Africa/Nairobi, Europe/London,
                Asia/Dubai or America/New_York.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Start Time in Your Timezone</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End Time in Your Timezone</label>
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
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This will create <strong>{previewDates.length}</strong> slots for{" "}
              <strong>{selectedMonth}</strong>, from{" "}
              <strong>{startTime}</strong> to <strong>{endTime}</strong> in{" "}
              <strong>{timezone}</strong>.
            </p>

            {previewStartUtc ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">
                  First slot conversion preview
                </p>
                <p className="mt-2">
                  Tutor time:{" "}
                  <strong>{formatInTimeZone(previewStartUtc, timezone)}</strong>
                </p>
                <p className="mt-1">
                  UTC stored time:{" "}
                  <strong>
                    {new Date(previewStartUtc).toISOString().replace(".000", "")}
                  </strong>
                </p>
              </div>
            ) : null}
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