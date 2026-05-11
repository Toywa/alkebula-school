"use client";

import Link from "next/link";
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
  lesson_amount?: number | null;
  platform_commission?: number | null;
  tutor_payout_amount?: number | null;
  payment_status: string | null;
  homework_title: string | null;
  homework_instructions: string | null;
  homework_due_date: string | null;
  homework_status: string | null;
  completion_notes: string | null;
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

function usd(value?: number | null) {
  if (!value) return "USD 0.00";
  return `USD ${Number(value).toFixed(2)}`;
}

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

  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkInstructions, setHomeworkInstructions] = useState("");
  const [homeworkDueDate, setHomeworkDueDate] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

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
      throw new Error(`${label} returned non-JSON response.`);
    }
  }

  function calculateTutorDue(lesson: Lesson) {
    return Number(
      lesson.tutor_payout_amount || lesson.amount_due || Number(lesson.hourly_rate || 0) * 0.7
    );
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
        setError("No approved educator profile found.");
        setLoading(false);
        return;
      }

      setProfile(educatorProfile);

      const resolvedEducatorId = educatorProfile.id || email;
      setEducatorId(resolvedEducatorId);

      await loadAvailability(resolvedEducatorId);
      await loadLessons(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailability(resolvedEducatorId: string) {
    const res = await fetch(`/api/educator-availability-load/${resolvedEducatorId}`);
    const data = await readJsonOrThrow(res, "availability");

    if (!res.ok) throw new Error(data.error || "Failed to load availability.");

    setPeriods(data.periods || []);
    setSlots(data.slots || []);
  }

  async function loadLessons(email: string) {
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("tutor_lessons")
      .select("*")
      .eq("tutor_email", email)
      .order("lesson_date", { ascending: true });

    if (error) throw new Error(error.message);

    setLessons(data || []);
  }

  async function generatePeriod() {
    try {
      const res = await fetch("/api/availability-periods", {
        method: "POST",
        body: JSON.stringify({ educatorId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await readJsonOrThrow(res, "period");

      if (!res.ok) throw new Error(data.error || "Failed.");

      setPeriods((prev) => [data.period, ...prev]);
      setActivePeriodId(data.period.id);
      setMessage("Availability period generated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    }
  }

  async function saveSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

      const data = await readJsonOrThrow(res, "slot");

      if (!res.ok) throw new Error(data.error || "Failed.");

      setSlots((prev) => [...prev, data.slot]);
      setSlotDate("");
      setStartTime("");
      setEndTime("");
      setMessage("Availability slot saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    }
  }

  async function updateLessonStatus(lessonId: string, status: string) {
    try {
      const supabase = getSupabaseBrowserClient();

      const updates: any = { status };

      if (status === "completed") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("tutor_lessons")
        .update(updates)
        .eq("id", lessonId);

      if (error) throw new Error(error.message);

      await loadLessons(educatorEmail);
      setMessage(`Lesson marked as ${status}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    }
  }

  async function assignHomework() {
    try {
      if (!selectedLessonId) throw new Error("Select a lesson first.");

      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase
        .from("tutor_lessons")
        .update({
          homework_title: homeworkTitle,
          homework_instructions: homeworkInstructions,
          homework_due_date: homeworkDueDate,
          homework_status: "assigned",
        })
        .eq("id", selectedLessonId);

      if (error) throw new Error(error.message);

      setHomeworkTitle("");
      setHomeworkInstructions("");
      setHomeworkDueDate("");
      setSelectedLessonId("");

      await loadLessons(educatorEmail);
      setMessage("Homework assigned successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign homework.");
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

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Educator Dashboard</h1>

            {profile ? (
              <p className="mt-3 text-slate-600">
                Welcome, <strong>{profile.full_name}</strong>
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/educator/profile"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Profile Picture
            </Link>

            <Link
              href="/educator/availability"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create Monthly Slots
            </Link>
          </div>
        </div>

        {message ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? <p className="mt-8">Loading dashboard...</p> : null}

        {!loading ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Available Slots</p>
                <p className="mt-2 text-3xl font-bold">
                  {slots.filter((slot) => slot.status !== "booked").length}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Upcoming Lessons</p>
                <p className="mt-2 text-3xl font-bold">{upcomingLessons.length}</p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Completed Lessons</p>
                <p className="mt-2 text-3xl font-bold">{completedLessons.length}</p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Amount Due</p>
                <p className="mt-2 text-3xl font-bold">{usd(totalTutorDue)}</p>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={generatePeriod}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Generate Availability Period
              </button>
            </div>

            <form onSubmit={saveSlot} className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Add Availability Slot</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} className="rounded-xl border p-3" required />
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl border p-3" required />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl border p-3" required />
                <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="rounded-xl border p-3" />
              </div>

              <button className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white">
                Save Slot
              </button>
            </form>

            <div className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Upcoming Lessons</h2>

              {upcomingLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">No upcoming lessons.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl border p-5">
                      <p className="font-semibold">{lesson.subject || "Lesson"}</p>
                      <p className="mt-2 text-sm text-slate-600">
                        {lesson.curriculum || "—"} · {lesson.lesson_date || "—"} ·{" "}
                        {lesson.start_time || "—"} - {lesson.end_time || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Student: {lesson.student_name || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Parent: {lesson.parent_email || "—"}
                      </p>

                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-3">
                        <p><strong>Hourly Rate:</strong> {usd(lesson.hourly_rate)}</p>
                        <p><strong>Lesson Amount:</strong> {usd(lesson.lesson_amount || lesson.hourly_rate)}</p>
                        <p><strong>Your Payout:</strong> {usd(calculateTutorDue(lesson))}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button type="button" onClick={() => updateLessonStatus(lesson.id, "completed")} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                          Mark Completed
                        </button>

                        <button type="button" onClick={() => updateLessonStatus(lesson.id, "cancelled")} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                          Cancel Lesson
                        </button>

                        <button type="button" onClick={() => setSelectedLessonId(lesson.id)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                          Issue Homework
                        </button>
                      </div>

                      {lesson.homework_title ? (
                        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm">
                          <p className="font-semibold">Homework: {lesson.homework_title}</p>
                          <p className="mt-1">{lesson.homework_instructions}</p>
                          <p className="mt-2 text-slate-600">
                            Due: {lesson.homework_due_date || "—"} · Status:{" "}
                            {lesson.homework_status || "assigned"}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedLessonId ? (
              <div className="mt-10 rounded-2xl border p-6">
                <h2 className="text-2xl font-semibold">Assign Homework</h2>

                <div className="mt-5 space-y-4">
                  <input value={homeworkTitle} onChange={(e) => setHomeworkTitle(e.target.value)} placeholder="Homework title" className="w-full rounded-xl border p-3" />
                  <textarea value={homeworkInstructions} onChange={(e) => setHomeworkInstructions(e.target.value)} placeholder="Homework instructions" rows={5} className="w-full rounded-xl border p-3" />
                  <input type="date" value={homeworkDueDate} onChange={(e) => setHomeworkDueDate(e.target.value)} className="rounded-xl border p-3" />

                  <button type="button" onClick={assignHomework} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                    Save Homework
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Completed Lessons & Payments</h2>

              {completedLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">No completed lessons yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {completedLessons.map((lesson) => {
                    const tutorDue = calculateTutorDue(lesson);

                    return (
                      <div key={lesson.id} className="rounded-xl border p-5">
                        <p className="font-semibold">{lesson.subject || "Lesson"}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {lesson.curriculum || "—"} · {lesson.lesson_date || "—"}
                        </p>

                        <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-4">
                          <p><strong>Hourly Rate:</strong> {usd(lesson.hourly_rate)}</p>
                          <p><strong>Lesson Amount:</strong> {usd(lesson.lesson_amount || lesson.hourly_rate)}</p>
                          <p><strong>Your Payout:</strong> {usd(tutorDue)}</p>
                          <p><strong>Payment:</strong> {lesson.payment_status || "unpaid"}</p>
                        </div>
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