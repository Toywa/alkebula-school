"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

type Lesson = {
  id: string;
  tutor_email: string | null;
  parent_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  lesson_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  payment_status: string | null;

  lesson_started_at?: string | null;
  lesson_ended_at?: string | null;
  actual_duration_minutes?: number | null;
  lesson_notes?: string | null;
  homework_notes?: string | null;
  completed_by_tutor?: boolean | null;
  completed_at?: string | null;
  lesson_started_by?: string | null;
  lesson_ended_by?: string | null;
};

type LessonSectionHighlight = "live" | "completed" | "default";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function lessonTimeLabel(lesson: Lesson) {
  return `${lesson.lesson_date || "—"} · ${lesson.start_time || "—"} - ${
    lesson.end_time || "—"
  }`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function durationLabel(value?: number | null) {
  if (!value) return "—";
  return `${value} minute${value === 1 ? "" : "s"}`;
}

function statusBadgeClass(status?: string | null) {
  if (status === "in_progress") return "bg-green-100 text-green-800";
  if (status === "completed") return "bg-blue-100 text-blue-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

export default function AdminClassroomsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      if (user.email.toLowerCase() !== ADMIN_EMAIL) {
        setAuthorized(false);
        setCheckingAuth(false);
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
      await loadLessons();
    } catch {
      setAuthorized(false);
      setCheckingAuth(false);
    }
  }

  async function loadLessons() {
    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const response = await fetch("/api/admin/classrooms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load classrooms.");
      }

      setLessons(data.lessons || []);
      setMessage("Classroom list refreshed.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load classrooms."
      );
    } finally {
      setLoading(false);
    }
  }

  const today = todayISO();

  const liveLessons = lessons.filter(
    (lesson) =>
      lesson.status === "in_progress" ||
      (!!lesson.lesson_started_at && !lesson.lesson_ended_at)
  );

  const todayLessons = lessons.filter(
    (lesson) =>
      lesson.lesson_date === today &&
      lesson.status !== "in_progress" &&
      lesson.status !== "completed"
  );

  const upcomingLessons = lessons.filter(
    (lesson) =>
      !!lesson.lesson_date &&
      lesson.lesson_date > today &&
      lesson.status !== "completed" &&
      lesson.status !== "cancelled"
  );

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  );

  const cancelledLessons = lessons.filter(
    (lesson) => lesson.status === "cancelled"
  );

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        Checking admin access...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">Access denied</h1>
          <p className="mt-4 text-red-700">
            This page is restricted to platform administrators only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                The Alkebula School
              </p>

              <h1 className="mt-4 text-4xl font-bold">
                Admin Classroom Monitor
              </h1>

              <p className="mt-4 max-w-3xl text-slate-600">
                Monitor live, upcoming, completed, and recently ended lessons.
                Review attendance, lesson duration, tutor notes, and homework
                notes for quality assurance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/resolutions"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
              >
                Admin Dashboard
              </Link>

              <button
                type="button"
                onClick={loadLessons}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {message ? (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
              {message}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-10 grid gap-5 md:grid-cols-5">
            <MetricCard title="Live Now" value={String(liveLessons.length)} />
            <MetricCard title="Today" value={String(todayLessons.length)} />
            <MetricCard title="Upcoming" value={String(upcomingLessons.length)} />
            <MetricCard title="Completed" value={String(completedLessons.length)} />
            <MetricCard title="Cancelled" value={String(cancelledLessons.length)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6 py-10 lg:px-8">
        <LessonSection
          title="Live / In Progress"
          description="Lessons that have been started and not yet ended."
          lessons={liveLessons}
          emptyMessage="No live classes are currently in progress."
          highlight="live"
        />

        <LessonSection
          title="Today’s Classrooms"
          description="Today’s scheduled lessons, including recently created or rescheduled classes."
          lessons={todayLessons}
          emptyMessage="No other scheduled classrooms found for today."
          highlight="default"
        />

        <LessonSection
          title="Upcoming Classrooms"
          description="Future lessons from tomorrow onward."
          lessons={upcomingLessons}
          emptyMessage="No upcoming classrooms found."
          highlight="default"
        />

        <LessonSection
          title="Completed Lesson Reports"
          description="Completed lessons with attendance, duration, tutor notes, and homework notes."
          lessons={completedLessons}
          emptyMessage="No completed lessons found in the recent window."
          highlight="completed"
        />

        <LessonSection
          title="Cancelled Lessons"
          description="Recently cancelled lessons."
          lessons={cancelledLessons}
          emptyMessage="No cancelled lessons found in the recent window."
          highlight="default"
        />
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function LessonSection({
  title,
  description,
  lessons,
  emptyMessage,
  highlight = "default",
}: {
  title: string;
  description: string;
  lessons: Lesson[];
  emptyMessage: string;
  highlight?: LessonSectionHighlight;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      <p className="mt-2 text-sm text-slate-600">{description}</p>

      {lessons.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-lg font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              highlight={highlight}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LessonCard({
  lesson,
  highlight = "default",
}: {
  lesson: Lesson;
  highlight?: LessonSectionHighlight;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight === "live"
          ? "border-green-200 bg-green-50"
          : highlight === "completed"
          ? "border-blue-100 bg-blue-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold">{lesson.subject || "Lesson"}</p>

          <p className="mt-1 text-sm text-slate-600">
            {lesson.curriculum || "—"} · {lessonTimeLabel(lesson)}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Student: {lesson.student_name || "—"}
          </p>

          <p className="text-sm text-slate-600">
            Tutor: {lesson.tutor_email || "—"}
          </p>

          <p className="text-sm text-slate-600">
            Parent: {lesson.parent_email || "—"}
          </p>

          <p className="mt-2 text-xs text-slate-500">Lesson ID: {lesson.id}</p>
        </div>

        <div className="flex min-w-[180px] flex-col gap-3">
          <span
            className={`rounded-full px-3 py-1 text-center text-xs font-semibold ${statusBadgeClass(
              lesson.status
            )}`}
          >
            {lesson.status || "scheduled"}
          </span>

          <span className="rounded-full bg-slate-200 px-3 py-1 text-center text-xs font-semibold text-slate-700">
            Payment: {lesson.payment_status || "unpaid"}
          </span>

          <Link
            href={`/classroom/${lesson.id}`}
            className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
          >
            Join Classroom
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-white p-4 text-sm md:grid-cols-3">
        <p>
          <strong>Started:</strong> {formatDateTime(lesson.lesson_started_at)}
        </p>
        <p>
          <strong>Ended:</strong> {formatDateTime(lesson.lesson_ended_at)}
        </p>
        <p>
          <strong>Duration:</strong>{" "}
          {durationLabel(lesson.actual_duration_minutes)}
        </p>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-white p-4 text-sm md:grid-cols-2">
        <p>
          <strong>Started By:</strong> {lesson.lesson_started_by || "—"}
        </p>
        <p>
          <strong>Ended By:</strong> {lesson.lesson_ended_by || "—"}
        </p>
      </div>

      {lesson.lesson_notes || lesson.homework_notes ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          {lesson.lesson_notes ? (
            <div>
              <p className="font-semibold">Tutor Lesson Notes</p>
              <p className="mt-1 leading-7 text-slate-700">
                {lesson.lesson_notes}
              </p>
            </div>
          ) : null}

          {lesson.homework_notes ? (
            <div className="mt-4">
              <p className="font-semibold">Homework / Next Steps</p>
              <p className="mt-1 leading-7 text-slate-700">
                {lesson.homework_notes}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {lesson.completed_at ? (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <p>
            <strong>Completed At:</strong> {formatDateTime(lesson.completed_at)}
          </p>
          <p>
            <strong>Completed By Tutor:</strong>{" "}
            {lesson.completed_by_tutor ? "Yes" : "No"}
          </p>
        </div>
      ) : null}
    </div>
  );
}