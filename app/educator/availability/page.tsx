"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const TIMEZONE_OPTIONS = [
  "Africa/Nairobi",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Qatar",
  "Asia/Riyadh",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Toronto",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Kampala",
  "Africa/Kigali",
  "Africa/Dar_es_Salaam",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Amsterdam",
  "Australia/Sydney",
  "Asia/Singapore",
  "UTC",
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

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Nairobi";
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
    if (part.type !== "literal") values[part.type] = part.value;
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

function getMonthOptions() {
  return [
    { label: "June 2026", start: "2026-06-01", end: "2026-06-30" },
    { label: "July 2026", start: "2026-07-01", end: "2026-07-31" },
  ];
}

function getDatesInRange(start: string, end: string) {
  const dates: string[] = [];
  const current = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);

  while (current <= last) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function getDateLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function EducatorAvailabilityPage() {
  const [email, setEmail] = useState("");
  const [approved, setApproved] = useState(false);
  const [checking, setChecking] = useState(true);

  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.label || "");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
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

  const selectedMonthRecord =
    monthOptions.find((item) => item.label === selectedMonth) || monthOptions[0];

  const monthDates = useMemo(() => {
    if (!selectedMonthRecord) return [];
    return getDatesInRange(selectedMonthRecord.start, selectedMonthRecord.end);
  }, [selectedMonthRecord]);

  const selectedDatesSorted = useMemo(() => {
    return [...selectedDates].sort();
  }, [selectedDates]);

  const firstPreviewDate = selectedDatesSorted[0];

  const previewStartUtc =
    startTime && firstPreviewDate && isValidTimeZone(timezone)
      ? zonedDateTimeToUtc(firstPreviewDate, startTime, timezone).toISOString()
      : "";

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

  function toggleDate(date: string) {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((item) => item !== date) : [...prev, date]
    );
  }

  function selectWeekday(day: number) {
    const matchingDates = monthDates.filter((date) => {
      return new Date(`${date}T00:00:00`).getDay() === day;
    });

    setSelectedDates((prev) => Array.from(new Set([...prev, ...matchingDates])));
  }

  function clearDates() {
    setSelectedDates([]);
  }

  async function createSlots() {
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!approved) {
        throw new Error("Only approved educators can create availability slots.");
      }

      if (!selectedDatesSorted.length) {
        throw new Error("Please choose at least one calendar date.");
      }

      if (!startTime || !endTime) {
        throw new Error("Please choose start and end time.");
      }

      if (startTime >= endTime) {
        throw new Error("End time must be later than start time.");
      }

      if (!isValidTimeZone(timezone)) {
        throw new Error("Please select a valid timezone.");
      }

      const rows = selectedDatesSorted.map((date) => {
        const startAtUtc = zonedDateTimeToUtc(date, startTime, timezone);
        const endAtUtc = zonedDateTimeToUtc(date, endTime, timezone);

        if (endAtUtc <= startAtUtc) {
          throw new Error("One or more slots has an invalid end time.");
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

      await supabase
        .from("educator_directory")
        .update({ timezone })
        .eq("email", email);

      setMessage(
        `${rows.length} timezone-safe availability slots created successfully.`
      );
      setSelectedDates([]);
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

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_28%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] p-8 shadow-sm lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
            The Alkebula School
          </p>

          <h1 className="mt-4 text-4xl font-bold text-slate-950">
            Premium Availability Calendar
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Signed in as <strong>{email}</strong>. Create June and July teaching
            slots in your own timezone. Alkebula stores the true lesson time in
            UTC so parents, tutors and admin see synchronized times.
          </p>

          <div className="mt-6 rounded-3xl border border-[#8F1F36]/15 bg-white p-5 text-sm text-slate-700">
            <p className="font-bold text-[#8F1F36]">June parent onboarding priority</p>
            <p className="mt-2 leading-7">
              Please create enough June availability immediately, and add July
              slots where possible. More visible slots increase your chance of
              receiving bookings.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSelectedDates([]);
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                {monthOptions.map((m) => (
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

              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                {Array.from(new Set([timezone, getBrowserTimeZone(), ...TIMEZONE_OPTIONS]))
                  .filter(Boolean)
                  .map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
              </select>

              <p className="mt-2 text-xs text-slate-500">
                The detected timezone is loaded automatically, but you can
                choose another one if you teach from a different location.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Time in Your Timezone
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Time in Your Timezone
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">
                Select June or July calendar dates
              </p>

              <button
                type="button"
                onClick={clearDates}
                className="text-xs font-bold text-[#8F1F36] hover:underline"
              >
                Clear selected dates
              </button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => selectWeekday(day.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#F7FCFF]"
                >
                  Add all {day.label}
                </button>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {monthDates.map((date) => {
                const selected = selectedDates.includes(date);

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => toggleDate(date)}
                    className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                      selected
                        ? "border-[#8F1F36] bg-[#8F1F36] text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-[#F7FCFF]"
                    }`}
                  >
                    <span className="block font-bold">{getDateLabel(date)}</span>
                    <span className="text-xs opacity-80">{date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-semibold">Preview</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This will create <strong>{selectedDatesSorted.length}</strong>{" "}
              slots from <strong>{startTime}</strong> to{" "}
              <strong>{endTime}</strong> in <strong>{timezone}</strong>.
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
            {loading ? "Creating..." : "Create Selected Slots"}
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
