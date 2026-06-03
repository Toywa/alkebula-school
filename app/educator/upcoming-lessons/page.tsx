"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

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
  status: string | null;
  payment_status: string | null;
  lesson_amount?: number | null;
  tutor_payout_amount?: number | null;
  hourly_rate?: number | null;
  amount_due?: number | null;
};

type EducatorProfile = {
  email: string;
  full_name: string | null;
  timezone: string | null;
};


function getParentFirstName(parentEmail?: string | null) {
  const localPart = String(parentEmail || "").split("@")[0].trim();

  if (!localPart) return "Parent";

  const firstPart = localPart.split(/[._\-\s]+/).filter(Boolean)[0] || "Parent";

  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
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

function usd(value?: number | null) {
  return `USD ${Number(value || 0).toFixed(2)}`;
}

function getTutorPayout(lesson: Lesson) {
  return Number(
    lesson.tutor_payout_amount ||
      lesson.amount_due ||
      Number(lesson.lesson_amount || lesson.hourly_rate || 0) * 0.7
  );
}

function getStatusClass(status?: string | null) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "upcoming" || cleanStatus === "booked") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (cleanStatus === "in_progress") {
    return "border-[#379CD6]/20 bg-[#F7FCFF] text-[#156B96]";
  }

  if (cleanStatus === "cancelled" || cleanStatus === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
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

export default function EducatorUpcomingLessonsPage() {
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSignedInTutorAndLessons();
  }, []);

  async function loadSignedInTutorAndLessons() {
    try {
      setLoading(true);
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const tutorEmail = user.email.toLowerCase();

      const { data: educatorProfile, error: profileError } = await supabase
        .from("educator_directory")
        .select("email,full_name,timezone")
        .eq("email", tutorEmail)
        .eq("approval_status", "approved")
        .single();

      if (profileError || !educatorProfile) {
        throw new Error("Approved tutor profile not found.");
      }

      setProfile(educatorProfile);
      await loadUpcomingLessons(tutorEmail);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load upcoming lessons."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadUpcomingLessons(emailOverride?: string) {
    try {
      setLoadingLessons(true);
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();
      const tutorEmail = emailOverride || profile?.email;

      if (!tutorEmail) {
        throw new Error("Tutor email not found.");
      }

      const today = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("tutor_lessons")
        .select("*")
        .eq("tutor_email", tutorEmail.toLowerCase())
        .gte("lesson_date", today)
        .in("status", ["upcoming", "booked", "scheduled", "in_progress"])
        .order("lesson_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw new Error(error.message);

      setLessons((data || []) as Lesson[]);
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
    return lessons.reduce<Record<string, Lesson[]>>((groups, lesson) => {
      const key = lesson.lesson_date || "No date";
      groups[key] = groups[key] || [];
      groups[key].push(lesson);
      return groups;
    }, {});
  }, [lessons]);

  const timezone = profile?.timezone || "Africa/Nairobi";

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        Loading upcoming lessons...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <Link
            href="/educator/dashboard"
            className="text-sm font-semibold text-[#8F1F36] hover:underline"
          >
            ← Back to Educator Dashboard
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Tutor Lesson Schedule
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                Upcoming Lessons
              </h1>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                View your scheduled lessons, including student name, parent
                email, subject, curriculum, lesson date, time and timezone.
              </p>

              {profile ? (
                <p className="mt-4 text-sm text-slate-600">
                  Tutor:{" "}
                  <strong className="text-slate-950">
                    {profile.full_name || profile.email}
                  </strong>
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => loadUpcomingLessons()}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
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
            <p className="mt-2 text-sm text-slate-600">
              New parent bookings will appear here automatically.
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
                          Time
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Student
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Parent First Name
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Lesson
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Timezone
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Payment
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Tutor Payout
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-slate-700">
                          Classroom
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {dateLessons.map((lesson) => (
                        <tr key={lesson.id} className="align-top">
                          <td className="px-5 py-4 font-semibold text-slate-950">
                            {formatTime(lesson.start_time)} -{" "}
                            {formatTime(lesson.end_time)}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {lesson.student_name || "—"}
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {getParentFirstName(lesson.parent_email)}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-950">
                              {lesson.subject || "Lesson"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {lesson.curriculum || "—"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {timezone}
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
                          <td className="px-5 py-4 font-semibold text-slate-900">
                            {usd(getTutorPayout(lesson))}
                          </td>
                          <td className="px-5 py-4">
                            <Link
                              href={`/classroom/${lesson.id}`}
                              className="rounded-xl bg-[#8F1F36] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#6F1729]"
                            >
                              Open
                            </Link>
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
