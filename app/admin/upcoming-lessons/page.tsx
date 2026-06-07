"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

const TIMEZONE_OPTIONS = [
  "Africa/Nairobi",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Qatar",
  "America/New_York",
  "America/Toronto",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC",
];

type Lesson = {
  id: string;
  tutor_email: string;
  parent_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  class_level?: string | null;
  lesson_date: string | null;
  start_time: string | null;
  end_time: string | null;
  start_at_utc?: string | null;
  end_at_utc?: string | null;
  tutor_timezone?: string | null;
  parent_timezone?: string | null;
  status: string | null;
  payment_status: string | null;
  lesson_amount: number | null;
  tutor_payout_amount: number | null;
  created_at?: string | null;
};

type TutorDirectoryRecord = {
  email: string;
  full_name: string | null;
  timezone: string | null;
};

type LessonWithTutor = Lesson & {
  tutor_name: string;
  fallback_timezone: string;
};

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

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

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(time?: string | null) {
  if (!time) return "—";
  return time.slice(0, 5);
}

function getUtcDateKey(utcValue?: string | null, timeZone = "Africa/Nairobi") {
  if (!utcValue || !isValidTimeZone(timeZone)) return "No date";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(utcValue));
}

function formatUtcInTimeZone(
  utcValue?: string | null,
  timeZone = "Africa/Nairobi",
  options?: Intl.DateTimeFormatOptions
) {
  if (!utcValue || !isValidTimeZone(timeZone)) return "—";

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
    ...options,
  }).format(new Date(utcValue));
}

function getLessonTimeForZone(lesson: LessonWithTutor, zone: string) {
  if (lesson.start_at_utc) {
    const start = formatUtcInTimeZone(lesson.start_at_utc, zone, {
      year: undefined,
      month: undefined,
      day: undefined,
      weekday: undefined,
    });

    const end = lesson.end_at_utc
      ? formatUtcInTimeZone(lesson.end_at_utc, zone, {
          year: undefined,
          month: undefined,
          day: undefined,
          weekday: undefined,
        })
      : "";

    return end && end !== "—" ? `${start} - ${end}` : start;
  }

  return `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`;
}

function getStatusClass(status?: string | null) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "upcoming" || cleanStatus === "booked") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (cleanStatus === "cancelled" || cleanStatus === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (cleanStatus === "completed") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border-[#379CD6]/20 bg-[#F7FCFF] text-[#156B96]";
}

function getPaymentClass(status?: string | null) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "paid") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (cleanStatus === "unpaid" || cleanStatus === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function AdminUpcomingLessonsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [lessons, setLessons] = useState<LessonWithTutor[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminTimezone, setAdminTimezone] = useState("Africa/Nairobi");

  useEffect(() => {
    setAdminTimezone(getBrowserTimeZone());

    async function checkAdminAndLoadLessons() {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const email = normalizeEmail(user.email);

      if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
        setAuthorized(false);
        setCheckingAuth(false);
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
      await loadUpcomingLessons();
    }

    checkAdminAndLoadLessons();
  }, []);

  async function loadUpcomingLessons() {
    try {
      setLoadingLessons(true);
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();
      const bookingWindowStart = "2026-06-01";
      const bookingWindowEnd = "2026-07-31";

      const { data: lessonData, error: lessonError } = await supabase
        .from("tutor_lessons")
        .select("*")
        .gte("lesson_date", bookingWindowStart)
        .lte("lesson_date", bookingWindowEnd)
        .in("status", ["upcoming", "booked"])
        .order("start_at_utc", { ascending: true, nullsFirst: false })
        .order("lesson_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (lessonError) throw new Error(lessonError.message);

      const rawLessons = (lessonData || []) as Lesson[];
      const tutorEmails = Array.from(
        new Set(rawLessons.map((item) => normalizeEmail(item.tutor_email)).filter(Boolean))
      );

      let tutorMap: Record<string, TutorDirectoryRecord> = {};

      if (tutorEmails.length > 0) {
        const { data: tutorData, error: tutorError } = await supabase
          .from("educator_directory")
          .select("email,full_name,timezone")
          .in("email", tutorEmails);

        if (tutorError) throw new Error(tutorError.message);

        tutorMap = ((tutorData || []) as TutorDirectoryRecord[]).reduce<
          Record<string, TutorDirectoryRecord>
        >((map, tutor) => {
          map[normalizeEmail(tutor.email)] = tutor;
          return map;
        }, {});
      }

      const cleanLessons = rawLessons.map((lesson) => {
        const tutorRecord = tutorMap[normalizeEmail(lesson.tutor_email)];

        return {
          ...lesson,
          tutor_name: tutorRecord?.full_name || lesson.tutor_email || "Tutor",
          fallback_timezone:
            lesson.tutor_timezone || tutorRecord?.timezone || "Africa/Nairobi",
        };
      });

      setLessons(cleanLessons);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load upcoming lessons."
      );
    } finally {
      setLoadingLessons(false);
    }
  }

  const groupedLessons = useMemo(() => {
    return lessons.reduce<Record<string, LessonWithTutor[]>>((groups, lesson) => {
      const key = lesson.start_at_utc
        ? getUtcDateKey(lesson.start_at_utc, adminTimezone)
        : lesson.lesson_date || "No date";

      groups[key] = groups[key] || [];
      groups[key].push(lesson);
      return groups;
    }, {});
  }, [lessons, adminTimezone]);

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
            This page is restricted to approved platform administrators only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <Link
            href="/admin/resolutions"
            className="text-sm font-semibold text-[#8F1F36] hover:underline"
          >
            ← Back to Admin Dashboard
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Admin Lesson Oversight
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                Upcoming Lessons
              </h1>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                View future lessons using synchronized UTC data. Change the
                admin timezone below to inspect the same lesson from different
                timezones.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={adminTimezone}
                onChange={(e) => setAdminTimezone(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
              >
                {Array.from(new Set([adminTimezone, getBrowserTimeZone(), ...TIMEZONE_OPTIONS]))
                  .filter(Boolean)
                  .map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={loadUpcomingLessons}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Refresh
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {loadingLessons ? (
          <p className="text-slate-600">Loading upcoming lessons...</p>
        ) : lessons.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-[#F7FCFF] p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              No upcoming lessons found.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLessons).map(([date, dateLessons]) => (
              <div
                key={date}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-200 bg-[#F7FCFF] px-5 py-4">
                  <h2 className="text-xl font-bold text-slate-950">
                    {date === "No date" ? "No date" : formatDate(date)}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Admin Time
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Tutor
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Student
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Parent
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Lesson
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Timezones
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Payment
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {dateLessons.map((lesson) => (
                        <tr key={lesson.id} className="align-top">
                          <td className="px-5 py-4 font-semibold text-slate-950">
                            {getLessonTimeForZone(lesson, adminTimezone)}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-950">
                              {lesson.tutor_name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {lesson.tutor_email}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {lesson.student_name || "—"}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {lesson.parent_email || "—"}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-950">
                              {lesson.subject || "Lesson"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {lesson.curriculum || "—"}
                              {lesson.class_level ? ` • ${lesson.class_level}` : ""}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            <p>
                              Admin: <strong>{adminTimezone}</strong>
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Tutor: {lesson.tutor_timezone || lesson.fallback_timezone}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Parent: {lesson.parent_timezone || "—"}
                            </p>
                            {lesson.start_at_utc ? (
                              <p className="mt-1 text-xs text-slate-400">
                                UTC: {new Date(lesson.start_at_utc).toISOString().replace(".000", "")}
                              </p>
                            ) : null}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                                lesson.status
                              )}`}
                            >
                              {lesson.status || "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold ${getPaymentClass(
                                lesson.payment_status
                              )}`}
                            >
                              {lesson.payment_status || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
