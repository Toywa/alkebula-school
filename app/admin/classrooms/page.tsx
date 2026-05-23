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
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function lessonTimeLabel(lesson: Lesson) {
  return `${lesson.lesson_date || "—"} · ${lesson.start_time || "—"} - ${
    lesson.end_time || "—"
  }`;
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

      const today = todayISO();

      const { data, error } = await supabase
        .from("tutor_lessons")
        .select(
          "id,tutor_email,parent_email,student_name,subject,curriculum,lesson_date,start_time,end_time,status,payment_status"
        )
        .gte("lesson_date", today)
        .in("status", ["upcoming", "booked", "scheduled"])
        .order("lesson_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw new Error(error.message);

      setLessons(data || []);
      setMessage("Classroom list refreshed.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load classrooms."
      );
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
                View scheduled live lessons and join classrooms for quality
                assurance, support, supervision, or dispute resolution.
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold">Scheduled Classrooms</h2>

          <p className="mt-2 text-sm text-slate-600">
            Showing upcoming scheduled lessons from today onward.
          </p>

          {lessons.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium">
                No scheduled classrooms found.
              </p>
              <p className="mt-3 text-slate-600">
                Once lessons are booked or rescheduled, they will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold">
                        {lesson.subject || "Lesson"}
                      </p>

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

                      <p className="mt-2 text-xs text-slate-500">
                        Lesson ID: {lesson.id}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {lesson.status || "scheduled"}
                      </span>

                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}