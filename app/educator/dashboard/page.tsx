"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Slot = {
  id: string;
  tutor_email: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  timezone: string | null;
  status: string | null;
  is_booked?: boolean | null;
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
  payout_status?: string | null;
  payout_date?: string | null;
  payout_reference?: string | null;
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
  return `USD ${Number(value || 0).toFixed(2)}`;
}

function getLessonAmount(lesson: Lesson) {
  return Number(
    lesson.lesson_amount || lesson.hourly_rate || lesson.amount_due || 0
  );
}

function getTutorPayout(lesson: Lesson) {
  return Number(lesson.tutor_payout_amount || getLessonAmount(lesson) * 0.7);
}

function classroomHref(lessonId: string) {
  return `/classroom/${lessonId}`;
}

export default function EducatorDashboardPage() {
  const [educatorEmail, setEducatorEmail] = useState("");
  const [profile, setProfile] = useState<EducatorProfile | null>(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("Africa/Nairobi");

  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkInstructions, setHomeworkInstructions] = useState("");
  const [homeworkDueDate, setHomeworkDueDate] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  const [rescheduleLesson, setRescheduleLesson] = useState<Lesson | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredStartTime, setPreferredStartTime] = useState("");
  const [preferredEndTime, setPreferredEndTime] = useState("");
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimezone) setTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    loadSignedInEducator();
  }, []);

  async function loadUnreadMessageCount() {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const response = await fetch("/api/messages/unread-count", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUnreadMessageCount(data.unread_count || 0);
      }
    } catch {
      setUnreadMessageCount(0);
    }
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

      await loadSlots(email);
      await loadLessons(email);
      await loadUnreadMessageCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots(email: string) {
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("tutor_availability_slots")
      .select("*")
      .eq("tutor_email", email)
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);

    setSlots(data || []);
  }

  async function loadLessons(email: string) {
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("tutor_lessons")
      .select("*")
      .eq("tutor_email", email)
      .order("lesson_date", { ascending: false });

    if (error) throw new Error(error.message);

    setLessons(data || []);
  }

  async function saveSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingSlot(true);
    setMessage("");
    setError("");

    try {
      if (!educatorEmail) {
        throw new Error("Educator email not found. Please sign in again.");
      }

      if (!slotDate || !startTime || !endTime) {
        throw new Error("Please select date, start time, and end time.");
      }

      if (startTime >= endTime) {
        throw new Error("End time must be later than start time.");
      }

      const supabase = getSupabaseBrowserClient();

      const { error: insertError } = await supabase
        .from("tutor_availability_slots")
        .insert({
          tutor_email: educatorEmail,
          date: slotDate,
          slot_date: slotDate,
          start_time: startTime,
          end_time: endTime,
          timezone,
          status: "available",
          is_booked: false,
        });

      if (insertError) throw new Error(insertError.message);

      setSlotDate("");
      setStartTime("");
      setEndTime("");
      setMessage("Availability slot saved successfully.");

      await loadSlots(educatorEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save slot.");
    } finally {
      setSavingSlot(false);
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

  function openRescheduleForm(lesson: Lesson) {
    setRescheduleLesson(lesson);
    setRescheduleReason("");
    setPreferredDate("");
    setPreferredStartTime("");
    setPreferredEndTime("");
    setMessage("");
    setError("");
  }

  async function submitRescheduleRequest() {
    if (!rescheduleLesson) return;

    setSubmittingReschedule(true);
    setMessage("");
    setError("");

    try {
      if (!rescheduleReason.trim()) {
        throw new Error("Please provide a reason for the reschedule request.");
      }

      const response = await fetch("/api/educator/reschedule-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: rescheduleLesson.id,
          tutorEmail: rescheduleLesson.tutor_email,
          parentEmail: rescheduleLesson.parent_email,
          studentName: rescheduleLesson.student_name,
          subject: rescheduleLesson.subject,
          curriculum: rescheduleLesson.curriculum,
          currentLessonDate: rescheduleLesson.lesson_date,
          currentStartTime: rescheduleLesson.start_time,
          currentEndTime: rescheduleLesson.end_time,
          preferredDate,
          preferredStartTime,
          preferredEndTime,
          reason: rescheduleReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit reschedule request.");
      }

      setRescheduleLesson(null);
      setRescheduleReason("");
      setPreferredDate("");
      setPreferredStartTime("");
      setPreferredEndTime("");
      setMessage("Reschedule request sent to admin successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit reschedule request."
      );
    } finally {
      setSubmittingReschedule(false);
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

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  );

  const paidLessons = lessons.filter((lesson) => lesson.payment_status === "paid");
  const unpaidLessons = lessons.filter((lesson) => lesson.payment_status !== "paid");

  const totalTutorEarned = paidLessons.reduce(
    (total, lesson) => total + getTutorPayout(lesson),
    0
  );

  const totalPaidOut = paidLessons
    .filter((lesson) => lesson.payout_status === "paid")
    .reduce((total, lesson) => total + getTutorPayout(lesson), 0);

  const pendingPayout = paidLessons
    .filter((lesson) => lesson.payout_status !== "paid")
    .reduce((total, lesson) => total + getTutorPayout(lesson), 0);

  const availableSlots = slots.filter(
    (slot) => !slot.is_booked && slot.status !== "booked"
  );

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
            <Link href="/educator/profile" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Edit Profile Picture
            </Link>

            <Link href="/educator/subjects" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Edit Subjects & Rates
            </Link>

            <Link href="/educator/availability" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Bulk Monthly Slots
            </Link>

            <Link href="/educator/messages" className="relative rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Message Admin
              {unreadMessageCount > 0 ? (
                <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadMessageCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {message ? <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">{message}</div> : null}
        {error ? <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div> : null}
        {loading ? <p className="mt-8">Loading dashboard...</p> : null}

        {!loading ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              <MetricCard title="Available Slots" value={String(availableSlots.length)} />
              <MetricCard title="Upcoming Lessons" value={String(upcomingLessons.length)} />
              <MetricCard title="Completed Lessons" value={String(completedLessons.length)} />
              <MetricCard title="Pending Payout" value={usd(pendingPayout)} />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <MetricCard title="Paid Lessons" value={String(paidLessons.length)} />
              <MetricCard title="Unpaid Lessons" value={String(unpaidLessons.length)} />
              <MetricCard title="Total Earned" value={usd(totalTutorEarned)} />
              <MetricCard title="Paid Out" value={usd(totalPaidOut)} />
            </div>

            <form onSubmit={saveSlot} className="mt-10 rounded-2xl border p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Add Single Availability Slot</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Best for part-time educators. Pick one exact date and time.
                  </p>
                </div>

                <Link href="/educator/availability" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                  Use Bulk Monthly Creator
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} className="rounded-xl border p-3" required />
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl border p-3" required />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl border p-3" required />
                <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="rounded-xl border p-3" />
              </div>

              <button disabled={savingSlot} className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {savingSlot ? "Saving Slot..." : "Save Single Slot"}
              </button>
            </form>

            <div className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Your Availability Slots</h2>

              {slots.length === 0 ? (
                <p className="mt-4 text-slate-600">No availability slots created yet.</p>
              ) : (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {slots.slice(0, 12).map((slot) => (
                    <div key={slot.id} className="rounded-xl border bg-slate-50 p-4 text-sm">
                      <p className="font-semibold">{slot.slot_date}</p>
                      <p className="mt-1 text-slate-600">{slot.start_time} - {slot.end_time}</p>
                      <p className="mt-1 text-slate-600">
                        {slot.timezone || "Africa/Nairobi"} ·{" "}
                        {slot.is_booked || slot.status === "booked" ? "Booked" : "Available"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                      <p className="text-sm text-slate-600">Student: {lesson.student_name || "—"}</p>
                      <p className="text-sm text-slate-600">Parent: {lesson.parent_email || "—"}</p>

                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-4">
                        <p><strong>Lesson Amount:</strong> {usd(getLessonAmount(lesson))}</p>
                        <p><strong>Your Payout:</strong> {usd(getTutorPayout(lesson))}</p>
                        <p><strong>Payment:</strong> {lesson.payment_status || "unpaid"}</p>
                        <p><strong>Payout:</strong> {lesson.payout_status || "pending"}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={classroomHref(lesson.id)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Start Classroom
                        </Link>

                        <button
                          type="button"
                          onClick={() => updateLessonStatus(lesson.id, "completed")}
                          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Mark Completed
                        </button>

                        <button
                          type="button"
                          onClick={() => openRescheduleForm(lesson)}
                          className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                        >
                          Request Reschedule
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Issue Homework
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {rescheduleLesson ? (
              <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h2 className="text-2xl font-semibold">Request Lesson Reschedule</h2>
                <p className="mt-2 text-sm text-slate-700">
                  This request will be sent to admin for review. The lesson will not be cancelled automatically.
                </p>

                <div className="mt-5 rounded-xl bg-white p-4 text-sm">
                  <p className="font-semibold">{rescheduleLesson.subject || "Lesson"}</p>
                  <p className="mt-1 text-slate-600">
                    Current time: {rescheduleLesson.lesson_date || "—"} ·{" "}
                    {rescheduleLesson.start_time || "—"} - {rescheduleLesson.end_time || "—"}
                  </p>
                  <p className="text-slate-600">
                    Student: {rescheduleLesson.student_name || "—"}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="rounded-xl border bg-white p-3"
                  />

                  <input
                    type="time"
                    value={preferredStartTime}
                    onChange={(e) => setPreferredStartTime(e.target.value)}
                    className="rounded-xl border bg-white p-3"
                  />

                  <input
                    type="time"
                    value={preferredEndTime}
                    onChange={(e) => setPreferredEndTime(e.target.value)}
                    className="rounded-xl border bg-white p-3"
                  />
                </div>

                <textarea
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Explain why this lesson needs to be rescheduled..."
                  rows={5}
                  className="mt-4 w-full rounded-xl border bg-white p-3 text-sm"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={submitRescheduleRequest}
                    disabled={submittingReschedule}
                    className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                  >
                    {submittingReschedule ? "Submitting..." : "Submit Request"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRescheduleLesson(null)}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            ) : null}

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
                  {completedLessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl border p-5">
                      <p className="font-semibold">{lesson.subject || "Lesson"}</p>
                      <p className="mt-2 text-sm text-slate-600">{lesson.curriculum || "—"} · {lesson.lesson_date || "—"}</p>

                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-4">
                        <p><strong>Lesson Amount:</strong> {usd(getLessonAmount(lesson))}</p>
                        <p><strong>Your Payout:</strong> {usd(getTutorPayout(lesson))}</p>
                        <p><strong>Payment:</strong> {lesson.payment_status || "unpaid"}</p>
                        <p><strong>Payout:</strong> {lesson.payout_status || "pending"}</p>
                      </div>

                      {lesson.payout_status === "paid" ? (
                        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                          <p className="font-semibold">Payout Paid</p>
                          <p className="mt-1">Reference: {lesson.payout_reference || "—"}</p>
                          <p className="mt-1">
                            Date: {lesson.payout_date ? new Date(lesson.payout_date).toLocaleString() : "—"}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-6">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}