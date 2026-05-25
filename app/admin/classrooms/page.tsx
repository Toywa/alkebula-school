"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
};

type LessonTiming = "live" | "starting-soon" | "upcoming" | "past-today" | "unknown";

const HIDDEN_STATUSES = new Set([
  "cancelled",
  "canceled",
  "rejected",
  "declined",
  "completed",
]);

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

function localDateISO(date = new Date()) {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());

  return `${year}-${month}-${day}`;
}

function addDaysISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateISO(date);
}

function cleanTime(time: string | null) {
  if (!time) return null;

  const parts = time.split(":");
  const hour = parts[0] || "00";
  const minute = parts[1] || "00";

  return `${padNumber(Number(hour))}:${padNumber(Number(minute))}`;
}

function makeLocalDateTime(date: string | null, time: string | null) {
  const clean = cleanTime(time);

  if (!date || !clean) return null;

  return new Date(`${date}T${clean}:00`);
}

function lessonTimeLabel(lesson: Lesson) {
  return `${lesson.lesson_date || "—"} · ${cleanTime(lesson.start_time) || "—"} - ${
    cleanTime(lesson.end_time) || "—"
  }`;
}

function getLessonTiming(lesson: Lesson): LessonTiming {
  const start = makeLocalDateTime(lesson.lesson_date, lesson.start_time);
  let end = makeLocalDateTime(lesson.lesson_date, lesson.end_time);

  if (!start || !end) return "unknown";

  /**
   * If a lesson accidentally has an end time earlier than the start time,
   * assume it crosses midnight.
   */
  if (end <= start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }

  const now = new Date();

  /**
   * Admin should be able to join slightly before class starts,
   * and shortly after the scheduled end in case the class runs over.
   */
  const liveWindowStart = new Date(start.getTime() - 10 * 60 * 1000);
  const liveWindowEnd = new Date(end.getTime() + 20 * 60 * 1000);

  if (now >= liveWindowStart && now <= liveWindowEnd) {
    return "live";
  }

  const startsInMinutes = (start.getTime() - now.getTime()) / 60000;

  if (startsInMinutes > 0 && startsInMinutes <= 30) {
    return "starting-soon";
  }

  if (start > now) {
    return "upcoming";
  }

  if (lesson.lesson_date === localDateISO()) {
    return "past-today";
  }

  return "unknown";
}

function timingLabel(timing: LessonTiming) {
  if (timing === "live") return "Live now";
  if (timing === "starting-soon") return "Starting soon";
  if (timing === "upcoming") return "Upcoming";
  if (timing === "past-today") return "Past today";
  return "Time unknown";
}

function timingClassName(timing: LessonTiming) {
  if (timing === "live") {
    return "bg-red-100 text-red-800 ring-1 ring-red-200";
  }

  if (timing === "starting-soon") {
    return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
  }

  if (timing === "upcoming") {
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
  }

  if (timing === "past-today") {
    return "bg-slate-200 text-slate-700 ring-1 ring-slate-300";
  }

  return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
}

function statusLabel(status: string | null) {
  if (!status) return "scheduled";

  return status.replaceAll("_", " ");
}

export default function AdminClassroomsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const visibleLessons = useMemo(() => {
    return lessons
      .filter((lesson) => {
        const status = lesson.status?.toLowerCase().trim() || "";

        return !HIDDEN_STATUSES.has(status);
      })
      .sort((a, b) => {
        const timingOrder: Record<LessonTiming, number> = {
          live: 1,
          "starting-soon": 2,
          upcoming: 3,
          "past-today": 4,
          unknown: 5,
        };

        const aTiming = getLessonTiming(a);
        const bTiming = getLessonTiming(b);

        if (timingOrder[aTiming] !== timingOrder[bTiming]) {
          return timingOrder[aTiming] - timingOrder[bTiming];
        }

        const aDate = `${a.lesson_date || ""} ${cleanTime(a.start_time) || ""}`;
        const bDate = `${b.lesson_date || ""} ${cleanTime(b.start_time) || ""}`;

        return aDate.localeCompare(bDate);
      });
  }, [lessons]);

  const liveCount = visibleLessons.filter(
    (lesson) => getLessonTiming(lesson) === "live"
  ).length;

  useEffect(() => {
    checkAdminAndLoad();

    /**
     * Refresh automatically so the admin page notices when a lesson moves
     * from upcoming to live.
     */
    const interval = window.setInterval(() => {
      loadLessons({ silent: true });
    }, 60_000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
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

  async function loadLessons(options?: { silent?: boolean }) {
    try {
      setLoading(true);

      if (!options?.silent) {
        setMessage("");
        setErrorMessage("");
      }

      const supabase = getSupabaseBrowserClient();

      const fromDate = localDateISO();
      const toDate = addDaysISO(30);

      /**
       * Important:
       * Do NOT restrict status to only upcoming/booked/scheduled here.
       * Some confirmed or active lessons may use statuses like:
       * accepted, confirmed, paid, active, in_progress, rescheduled, etc.
       */
      const { data, error } = await supabase
        .from("tutor_lessons")
        .select(
          "id,tutor_email,parent_email,student_name,subject,curriculum,lesson_date,start_time,end_time,status,payment_status"
        )
        .gte("lesson_date", fromDate)
        .lte("lesson_date", toDate)
        .order("lesson_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw new Error(error.message);

      setLessons(data || []);

      if (!options?.silent) {
        setMessage("Classroom list refreshed.");
      }
    } catch (error) {
      if (!options?.silent) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load classrooms."
        );
      }
    } finally {
      setLoading(false);
    }
  }

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
                View live, starting-soon, and upcoming lessons. Admins can join
                classrooms for supervision, support, quality assurance, or
                dispute resolution.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Live now
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {liveCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Visible classrooms
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {visibleLessons.length}
                  </p>
                </div>
              </div>
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
                onClick={() => loadLessons()}
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Scheduled Classrooms</h2>

              <p className="mt-2 text-sm text-slate-600">
                Showing today&apos;s lessons and upcoming lessons for the next
                30 days. Cancelled, rejected, declined, and completed lessons
                are hidden.
              </p>
            </div>

            <p className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
              Auto-refreshes every 60 seconds
            </p>
          </div>

          {visibleLessons.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium">
                No active or upcoming classrooms found.
              </p>

              <p className="mt-3 text-slate-600">
                If a class is currently running but does not appear here, check
                whether its lesson date, start time, end time, or database status
                was saved correctly.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {visibleLessons.map((lesson) => {
                const timing = getLessonTiming(lesson);

                return (
                  <div
                    key={lesson.id}
                    className={`rounded-2xl border p-5 ${
                      timing === "live"
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-bold">
                            {lesson.subject || "Lesson"}
                          </p>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${timingClassName(
                              timing
                            )}`}
                          >
                            {timingLabel(timing)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {lesson.curriculum || "—"} · {lessonTimeLabel(lesson)}
                        </p>

                        <div className="mt-4 grid gap-1 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-800">
                              Student:
                            </span>{" "}
                            {lesson.student_name || "—"}
                          </p>

                          <p>
                            <span className="font-semibold text-slate-800">
                              Tutor:
                            </span>{" "}
                            {lesson.tutor_email || "—"}
                          </p>

                          <p>
                            <span className="font-semibold text-slate-800">
                              Parent:
                            </span>{" "}
                            {lesson.parent_email || "—"}
                          </p>
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          Lesson ID: {lesson.id}
                        </p>
                      </div>

                      <div className="flex min-w-[180px] flex-col gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-center text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          Status: {statusLabel(lesson.status)}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-center text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                          Payment: {lesson.payment_status || "unpaid"}
                        </span>

                        <Link
                          href={`/classroom/${lesson.id}`}
                          className={`rounded-xl px-5 py-3 text-center text-sm font-semibold text-white ${
                            timing === "live"
                              ? "bg-red-700 hover:bg-red-800"
                              : "bg-slate-900 hover:bg-slate-800"
                          }`}
                        >
                          {timing === "live"
                            ? "Join Live Classroom"
                            : "Join Classroom"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}