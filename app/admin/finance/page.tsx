"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FinanceMetrics = {
  total_revenue: number;
  total_potential_revenue: number;
  paid_lessons: number;
  unpaid_lessons: number;
  total_lessons: number;
  platform_commission_earned: number;
  tutor_payout_liability: number;
  total_tutor_paid_out: number;
  pending_payout_count: number;
};

type LessonRow = {
  id: string;
  tutor_email: string | null;
  parent_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  lesson_date: string | null;
  status: string | null;
  payment_status: string | null;
  payout_status: string | null;
  hourly_rate: number | null;
  lesson_amount: number | null;
  platform_commission: number | null;
  tutor_payout_amount: number | null;
  paystack_reference: string | null;
  paid_at: string | null;
};

type TutorSummary = {
  tutor_email: string;
  total_lessons: number;
  paid_lessons: number;
  unpaid_lessons: number;
  gross_revenue: number;
  platform_commission: number;
  tutor_earned: number;
  tutor_paid_out: number;
  tutor_payout_pending: number;
};

function usd(value?: number | null) {
  return `USD ${Number(value || 0).toFixed(2)}`;
}

export default function AdminFinancePage() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [metrics, setMetrics] = useState<FinanceMetrics | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [tutors, setTutors] = useState<TutorSummary[]>([]);

  useEffect(() => {
    loadFinanceDashboard();
  }, []);

  async function loadFinanceDashboard() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/admin/finance");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load finance dashboard.");
      }

      setMetrics(data.metrics);
      setLessons(data.lessons || []);
      setTutors(data.tutor_summaries || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load finance dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Alkebula School Finance
            </p>

            <h1 className="mt-4 text-4xl font-bold">
              Admin Finance Dashboard
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Track revenue, commissions, tutor payouts, unpaid lessons,
              Paystack payments, and platform financial performance.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Back to Admin
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-slate-300">Loading finance dashboard...</p>
        ) : null}

        {errorMessage ? (
          <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {!loading && metrics ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={usd(metrics.total_revenue)}
              />

              <MetricCard
                title="Potential Revenue"
                value={usd(metrics.total_potential_revenue)}
              />

              <MetricCard
                title="Platform Commission"
                value={usd(metrics.platform_commission_earned)}
              />

              <MetricCard
                title="Tutor Payout Liability"
                value={usd(metrics.tutor_payout_liability)}
              />

              <MetricCard
                title="Paid Lessons"
                value={String(metrics.paid_lessons)}
              />

              <MetricCard
                title="Unpaid Lessons"
                value={String(metrics.unpaid_lessons)}
              />

              <MetricCard
                title="Pending Payouts"
                value={String(metrics.pending_payout_count)}
              />

              <MetricCard
                title="Tutor Paid Out"
                value={usd(metrics.total_tutor_paid_out)}
              />
            </div>

            <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Recent Lesson Payments
              </h2>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-slate-400">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Tutor</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Tutor Payout</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Payout</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lessons.map((lesson) => (
                      <tr
                        key={lesson.id}
                        className="border-b border-slate-800/70"
                      >
                        <td className="px-4 py-4">
                          {lesson.student_name || "—"}
                        </td>

                        <td className="px-4 py-4">
                          {lesson.tutor_email || "—"}
                        </td>

                        <td className="px-4 py-4">
                          {lesson.subject || "—"}
                        </td>

                        <td className="px-4 py-4">
                          {lesson.lesson_date || "—"}
                        </td>

                        <td className="px-4 py-4">
                          {usd(
                            lesson.lesson_amount || lesson.hourly_rate
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {usd(
                            lesson.platform_commission ||
                              Number(
                                lesson.lesson_amount ||
                                  lesson.hourly_rate ||
                                  0
                              ) * 0.3
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {usd(
                            lesson.tutor_payout_amount ||
                              Number(
                                lesson.lesson_amount ||
                                  lesson.hourly_rate ||
                                  0
                              ) * 0.7
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge
                            value={lesson.payment_status || "unpaid"}
                          />
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge
                            value={lesson.payout_status || "pending"}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Tutor Earnings Summary
              </h2>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-slate-400">
                      <th className="px-4 py-3">Tutor</th>
                      <th className="px-4 py-3">Lessons</th>
                      <th className="px-4 py-3">Revenue</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Tutor Earned</th>
                      <th className="px-4 py-3">Paid Out</th>
                      <th className="px-4 py-3">Pending</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tutors.map((tutor) => (
                      <tr
                        key={tutor.tutor_email}
                        className="border-b border-slate-800/70"
                      >
                        <td className="px-4 py-4">
                          {tutor.tutor_email}
                        </td>

                        <td className="px-4 py-4">
                          {tutor.total_lessons}
                        </td>

                        <td className="px-4 py-4">
                          {usd(tutor.gross_revenue)}
                        </td>

                        <td className="px-4 py-4">
                          {usd(tutor.platform_commission)}
                        </td>

                        <td className="px-4 py-4">
                          {usd(tutor.tutor_earned)}
                        </td>

                        <td className="px-4 py-4">
                          {usd(tutor.tutor_paid_out)}
                        </td>

                        <td className="px-4 py-4">
                          {usd(tutor.tutor_payout_pending)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  let classes =
    "bg-slate-700 text-white";

  if (normalized === "paid") {
    classes = "bg-emerald-500/20 text-emerald-300";
  }

  if (normalized === "unpaid") {
    classes = "bg-red-500/20 text-red-300";
  }

  if (normalized === "pending") {
    classes = "bg-amber-500/20 text-amber-300";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {value}
    </span>
  );
}