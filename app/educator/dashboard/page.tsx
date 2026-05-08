"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

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

type Lesson = {
  id: string;
  tutor_email: string;
  student_name: string | null;
  parent_email: string | null;
  subject: string | null;
  curriculum: string | null;
  lesson_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string;
  hourly_rate: number | null;
  amount_due: number | null;
  payment_status: string | null;
};

type EducatorProfile = {
  id?: string;
  email: string;
  full_name: string;
  city: string | null;
  hourly_rate: number | null;
  approval_status: string;
  is_public: boolean;
};

export default function EducatorDashboardPage() {
  const [educatorId, setEducatorId] = useState("");
  const [educatorEmail, setEducatorEmail] = useState("");
  const [profile, setProfile] = useState<EducatorProfile | null>(null);

  const [periods, setPeriods] = useState<Period[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activePeriodId, setActivePeriodId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimezone) setTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    loadSignedInEducator();
  }, []);

  async function readJsonOrThrow(response: Response, label: string) {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`${label} returned non-JSON response: ${text.slice(0, 160)}`);
    }
  }

  function calculateTutorDue(lesson: Lesson) {
    const grossRate = Number(lesson.amount_due || lesson.hourly_rate || 0);
    return grossRate * 0.7;
  }

  async function loadSignedInEducator() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const email = user.email.toLowerCase();
      setEducatorEmail(email);

      const { data: educatorProfile, error: profileError } = await supabase
        .from("educator_directory")
        .select("*")
        .eq("email", email)
        .eq("approval_status", "approved")
        .single();

      if (profileError || !educatorProfile) {
        setError("No approved educator profile found for this account.");
        setLoading(false);
        return;
      }

      setProfile(educatorProfile);

      const resolvedEducatorId = educatorProfile.id || email;
      setEducatorId(resolvedEducatorId);

      await loadAvailability(resolvedEducatorId);
      await loadLessons(email);

      setMessage("Dashboard loaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load educator dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailability(resolvedEducatorId: string) {
    const res = await fetch(`/api/educator-availability-load/${resolvedEducatorId}`);
    const data = await readJsonOrThrow(res, "educator-availability-load API");

    if (!res.ok) {
      throw new Error(data.error || "Failed to load availability.");
    }

    setPeriods(data.periods || []);
    setSlots(data.slots || []);
  }

  async function loadLessons(email: string) {
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("tutor_lessons")
      .select("*")
      .eq("tutor_email", email)
      .order("lesson_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    setLessons(data || []);
  }

  async function generatePeriod() {
    setError("");
    setMessage("");

    try {
      if (!educatorId) throw new Error("Educator profile not loaded yet.");

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
      setError(err instanceof Error ? err.message : "Failed to generate period.");
    }
  }

  async function saveSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (!educatorId) throw new Error("Educator profile not loaded yet.");

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
      setError(err instanceof Error ? err.message : "Failed to save slot.");
    }
  }

  const upcomingLessons = lessons.filter(
    (lesson) =>
      lesson.status === "upcoming" ||
      lesson.status === "booked" ||
      lesson.status === "scheduled"
  );

  const completedLessons = lessons.filter((lesson) => lesson.status === "completed");

  const totalTutorDue = completedLessons
    .filter((lesson) => lesson.payment_status !== "paid")
    .reduce((total, lesson) => total + calculateTutorDue(lesson), 0);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">Educator Dashboard</h1>

        {profile ? (
          <p className="mt-3 text-slate-600">
            Welcome, <strong>{profile.full_name}</strong> — {educatorEmail}
          </p>
        ) : null}

        {loading ? <p className="mt-8">Loading dashboard...</p> : null}

        {error ? (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
        ) : null}

        {message ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">{message}</div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Available Slots</p>
                <p className="mt-2 text-3xl font-bold">
                  {slots.filter((slot) => slot.status !== "booked").length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Upcoming Lessons</p>
                <p className="mt-2 text-3xl font-bold">{upcomingLessons.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Completed Lessons</p>
                <p className="mt-2 text-3xl font-bold">{completedLessons.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Amount Due</p>
                <p className="mt-2 text-3xl font-bold">${totalTutorDue.toFixed(2)}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Tutor payout after 30% platform commission.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={generatePeriod}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Generate / Load Current Availability Period
              </button>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Availability Periods</h2>

              {periods.length === 0 ? (
                <p className="mt-4 text-slate-600">No periods yet.</p>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {periods.map((p) => (
                    <div key={p.id} className="rounded-xl border p-4">
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
                        className="mt-3 rounded-lg border px-3 py-2 text-sm"
                      >
                        Use This Period
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={saveSlot} className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Add Availability Slot</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="rounded-xl border border-slate-300 p-3"
                  required
                />

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-xl border border-slate-300 p-3"
                  required
                />

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-xl border border-slate-300 p-3"
                  required
                />

                <input
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="Timezone"
                  className="rounded-xl border border-slate-300 p-3"
                />
              </div>

              <button className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white">
                Save Slot
              </button>
            </form>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">My Slots</h2>

              {slots.length === 0 ? (
                <p className="mt-4 text-slate-600">No slots yet.</p>
              ) : (
                <div className="mt-5 space-y-2">
                  {slots.map((s) => (
                    <div key={s.id} className="rounded-lg border p-3 text-sm">
                      {s.slot_date} {s.start_time}-{s.end_time} ({s.timezone || "UTC"}) —{" "}
                      <span className="font-medium">{s.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Upcoming Lessons</h2>

              {upcomingLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">No upcoming lessons yet.</p>
              ) : (
                <div className="mt-5 space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl border p-4 text-sm">
                      <p className="font-semibold">{lesson.subject || "Lesson"}</p>
                      <p>{lesson.lesson_date || "—"} · {lesson.start_time || "—"} - {lesson.end_time || "—"}</p>
                      <p>Student: {lesson.student_name || "—"}</p>
                      <p>Parent: {lesson.parent_email || "—"}</p>
                      <p>Status: {lesson.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Completed Lessons & Payments</h2>

              {completedLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">No completed lessons yet.</p>
              ) : (
                <div className="mt-5 space-y-3">
                  {completedLessons.map((lesson) => {
                    const tutorDue = calculateTutorDue(lesson);

                    return (
                      <div key={lesson.id} className="rounded-xl border p-4 text-sm">
                        <p className="font-semibold">{lesson.subject || "Lesson"}</p>
                        <p>{lesson.lesson_date || "—"}</p>
                        <p>Gross Rate: ${Number(lesson.amount_due || lesson.hourly_rate || 0).toFixed(2)}</p>
                        <p>Platform Commission: 30%</p>
                        <p className="font-semibold">Tutor Due: ${tutorDue.toFixed(2)}</p>
                        <p>Payment Status: {lesson.payment_status || "unpaid"}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}