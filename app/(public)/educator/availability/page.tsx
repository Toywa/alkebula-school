"use client";

import { useEffect, useMemo, useState } from "react";

type Educator = {
  id: string;
  full_name: string;
  email: string;
  timezone: string | null;
};

type SavedSlot = {
  id: string;
  educator_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  source: string;
};

type PeriodLabel = "period_1" | "period_2" | "short_notice";

const HOURLY_OPTIONS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  const start = `${String(hour).padStart(2, "0")}:00`;
  const end = `${String(hour + 1).padStart(2, "0")}:00`;
  return { start, end, label: `${start} - ${end}` };
});

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function getPeriodRange(year: number, month: number, period: PeriodLabel) {
  const lastDay = getDaysInMonth(year, month);

  if (period === "period_1") {
    return { startDay: 1, endDay: 15 };
  }

  if (period === "period_2") {
    return { startDay: 16, endDay: lastDay };
  }

  return { startDay: 1, endDay: lastDay };
}

export default function EducatorAvailabilityPage() {
  const now = new Date();

  const [educator, setEducator] = useState<Educator | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState("Africa/Nairobi");
  const [periodLabel, setPeriodLabel] = useState<PeriodLabel>("period_1");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [shortNoticeStart, setShortNoticeStart] = useState(
    formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );
  const [shortNoticeEnd, setShortNoticeEnd] = useState(
    formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
  );
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>(
    {}
  );
  const [savedSlots, setSavedSlots] = useState<SavedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSlots() {
    setErrorMessage("");

    const res = await fetch("/api/educator-availability");
    const json = await res.json();

    if (!res.ok) {
      setErrorMessage(json.error || "Failed to load availability.");
      setLoading(false);
      return;
    }

    setEducator(json.educator || null);
    setSelectedTimezone(json.educator?.timezone || "Africa/Nairobi");
    setSavedSlots(json.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadSlots();
  }, []);

  const displayedDates = useMemo(() => {
    if (periodLabel === "short_notice") {
      const start = new Date(shortNoticeStart);
      const end = new Date(shortNoticeEnd);
      const dates: string[] = [];

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return dates;
      }

      const current = new Date(start);
      while (current <= end) {
        dates.push(
          formatDate(
            current.getFullYear(),
            current.getMonth() + 1,
            current.getDate()
          )
        );
        current.setDate(current.getDate() + 1);
      }

      return dates;
    }

    const { startDay, endDay } = getPeriodRange(year, month, periodLabel);
    const dates: string[] = [];

    for (let day = startDay; day <= endDay; day++) {
      dates.push(formatDate(year, month, day));
    }

    return dates;
  }, [periodLabel, year, month, shortNoticeStart, shortNoticeEnd]);

  function toggleSlot(date: string, start: string, end: string) {
    const key = `${date}|${start}|${end}`;

    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function handleSave() {
    const chosen = Object.entries(selectedSlots)
      .filter(([, checked]) => checked)
      .map(([key]) => {
        const [slot_date, start_time, end_time] = key.split("|");

        return {
          slot_date,
          start_time,
          end_time,
          source: periodLabel === "short_notice" ? "short_notice" : "planned",
        };
      });

    if (chosen.length === 0) {
      setErrorMessage("Please select at least one hourly slot.");
      return;
    }

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const start_date =
      periodLabel === "short_notice"
        ? shortNoticeStart
        : displayedDates[0] || formatDate(year, month, 1);

    const end_date =
      periodLabel === "short_notice"
        ? shortNoticeEnd
        : displayedDates[displayedDates.length - 1] ||
          formatDate(year, month, getDaysInMonth(year, month));

    const res = await fetch("/api/educator-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timezone: selectedTimezone,
        period_label: periodLabel,
        year,
        month,
        start_date,
        end_date,
        slots: chosen,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setErrorMessage(json.error || "Failed to save availability.");
      setSaving(false);
      return;
    }

    setMessage("Availability saved successfully.");
    setSelectedSlots({});
    await loadSlots();
    setSaving(false);
  }

  const savedSlotKeys = useMemo(() => {
    const keys = new Set<string>();

    for (const slot of savedSlots) {
      keys.add(`${slot.slot_date}|${slot.start_time}|${slot.end_time}`);
    }

    return keys;
  }, [savedSlots]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-5xl">Loading availability...</div>
      </main>
    );
  }

  if (errorMessage && !educator) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">
            Availability Access Restricted
          </h1>
          <p className="mt-4 text-red-700">{errorMessage}</p>
          <p className="mt-4 text-sm text-red-700">
            Please sign in with an approved educator account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Educator Dashboard
          </p>

          <h1 className="text-4xl font-bold">Calendar-Based Availability</h1>

          <p className="mt-4 max-w-3xl text-slate-600">
            Set exact 1-hour bookable slots by period. All times are saved with
            timezone awareness and converted to UTC for reliable booking,
            reminders, and invoicing.
          </p>

          {educator ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Signed in educator</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {educator.full_name}
              </p>
              <p className="mt-1 text-sm text-slate-600">{educator.email}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Timezone
              </label>
              <input
                value={selectedTimezone}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Period</label>
              <select
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value as PeriodLabel)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="period_1">Period 1 (1st - 15th)</option>
                <option value="period_2">Period 2 (16th - month end)</option>
                <option value="short_notice">Short Notice</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Month</label>
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          {periodLabel === "short_notice" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Short Notice Start Date
                </label>
                <input
                  type="date"
                  value={shortNoticeStart}
                  onChange={(e) => setShortNoticeStart(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Short Notice End Date
                </label>
                <input
                  type="date"
                  value={shortNoticeEnd}
                  onChange={(e) => setShortNoticeEnd(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>
          ) : null}

          <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Submit planned availability in advance: Period 1 for the 1st–15th,
            and Period 2 for the 16th–month end. Short Notice is for temporary
            one-day or short-range openings.
          </div>

          {message ? <p className="mt-4 text-green-600">{message}</p> : null}
          {errorMessage ? (
            <p className="mt-4 text-red-600">{errorMessage}</p>
          ) : null}
        </div>

        <div className="mt-8 space-y-6">
          {displayedDates.map((date) => (
            <div
              key={date}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{date}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Timezone: {selectedTimezone}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {HOURLY_OPTIONS.map((option) => {
                  const key = `${date}|${option.start}|${option.end}`;
                  const selected = !!selectedSlots[key];
                  const saved = savedSlotKeys.has(key);

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={saved}
                      onClick={() => toggleSlot(date, option.start, option.end)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                        saved
                          ? "cursor-not-allowed border-green-300 bg-green-50 text-green-800"
                          : selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div>{option.label}</div>
                      <div className="mt-1 text-xs opacity-80">
                        {saved
                          ? "Already saved"
                          : selected
                          ? "Selected"
                          : "Tap to select"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Selected Slots"}
          </button>
        </div>
      </section>
    </main>
  );
}