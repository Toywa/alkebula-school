"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Lesson = {
  id: string;
  tutor_email: string;
  student_name: string | null;
  subject: string | null;
  lesson_date: string | null;
  status: string;
  hourly_rate: number | null;
  amount_due: number | null;
  payment_status: string | null;
};

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

function tutorDue(lesson: Lesson) {
  return Number(lesson.amount_due || lesson.hourly_rate || 0) * 0.7;
}

export default function AdminPayoutsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      window.location.href = "/auth/sign-in";
      return;
    }

    const email = user.email.toLowerCase();

    if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
      setAuthorized(false);
      setChecking(false);
      return;
    }

    setAuthorized(true);
    setChecking(false);
    loadLessons();
  }

  async function loadLessons() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("tutor_lessons")
        .select("*")
        .eq("status", "completed")
        .order("lesson_date", { ascending: false });

      if (error) throw new Error(error.message);

      setLessons(data || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load payouts."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(id: string) {
    setActingId(id);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase
        .from("tutor_lessons")
        .update({ payment_status: "paid" })
        .eq("id", id);

      if (error) throw new Error(error.message);

      setMessage("Lesson payout marked as paid.");
      await loadLessons();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to mark as paid."
      );
    } finally {
      setActingId("");
    }
  }

  const unpaidLessons = lessons.filter((lesson) => lesson.payment_status !== "paid");
  const paidLessons = lessons.filter((lesson) => lesson.payment_status === "paid");

  const unpaidTotal = unpaidLessons.reduce(
    (total, lesson) => total + tutorDue(lesson),
    0
  );

  const paidTotal = paidLessons.reduce(
    (total, lesson) => total + tutorDue(lesson),
    0
  );

  const groupedByTutor = unpaidLessons.reduce<Record<string, Lesson[]>>(
    (groups, lesson) => {
      const email = lesson.tutor_email || "unknown";
      groups[email] = groups[email] || [];
      groups[email].push(lesson);
      return groups;
    },
    {}
  );

  if (checking) {
    return (
      <main className="min-h-screen bg-white px-6 py-20">
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
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">Tutor Payouts</h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          Track completed lessons, unpaid tutor balances, paid payouts, and
          tutor earnings after the 30% platform commission.
        </p>

        {message ? <p className="mt-4 text-green-600">{message}</p> : null}
        {errorMessage ? <p className="mt-4 text-red-600">{errorMessage}</p> : null}

        {loading ? (
          <p className="mt-8">Loading payouts...</p>
        ) : (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Completed Lessons</p>
                <p className="mt-2 text-3xl font-bold">{lessons.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Unpaid Lessons</p>
                <p className="mt-2 text-3xl font-bold">{unpaidLessons.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Amount Due</p>
                <p className="mt-2 text-3xl font-bold">
                  ${unpaidTotal.toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Paid Out</p>
                <p className="mt-2 text-3xl font-bold">
                  ${paidTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold">Unpaid by Tutor</h2>

              {Object.keys(groupedByTutor).length === 0 ? (
                <p className="mt-4 text-slate-600">
                  No unpaid completed lessons yet.
                </p>
              ) : (
                <div className="mt-5 space-y-6">
                  {Object.entries(groupedByTutor).map(([email, tutorLessons]) => {
                    const tutorTotal = tutorLessons.reduce(
                      (total, lesson) => total + tutorDue(lesson),
                      0
                    );

                    return (
                      <div key={email} className="rounded-2xl border p-5">
                        <div className="flex flex-wrap justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">{email}</h3>
                            <p className="text-sm text-slate-600">
                              {tutorLessons.length} unpaid completed lesson(s)
                            </p>
                          </div>

                          <p className="text-xl font-bold">
                            ${tutorTotal.toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-5 space-y-3">
                          {tutorLessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="font-semibold">
                                    {lesson.subject || "Lesson"}
                                  </p>
                                  <p className="text-slate-600">
                                    Student: {lesson.student_name || "—"}
                                  </p>
                                  <p className="text-slate-600">
                                    Date: {lesson.lesson_date || "—"}
                                  </p>
                                  <p className="text-slate-600">
                                    Tutor Due: ${tutorDue(lesson).toFixed(2)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={actingId === lesson.id}
                                  onClick={() => markAsPaid(lesson.id)}
                                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                  {actingId === lesson.id
                                    ? "Updating..."
                                    : "Mark as Paid"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}