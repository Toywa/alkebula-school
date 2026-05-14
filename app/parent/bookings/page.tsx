"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Booking = {
  id: string;
  parent_email: string | null;
  tutor_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  date: string | null;
  time: string | null;
  status: string | null;
  created_at: string | null;
  hourly_rate: number | null;
  lesson_amount: number | null;
  payment_status?: string | null;
};

type Lesson = {
  id: string;
  tutor_email: string;
  parent_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  lesson_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  payment_status: string | null;
  hourly_rate: number | null;
  lesson_amount: number | null;
  homework_title: string | null;
  homework_instructions: string | null;
  homework_due_date: string | null;
  homework_status: string | null;
};

type HomeworkSubmission = {
  id: string;
  lesson_id: string | null;
  submission_text: string | null;
  status: string | null;
  submitted_at: string | null;
  tutor_feedback: string | null;
};

function usd(value?: number | null) {
  if (!value) return "—";
  return `USD ${Number(value).toFixed(2)}`;
}

function hasPayableAmount(lesson: Lesson) {
  return Number(lesson.lesson_amount || lesson.hourly_rate || 0) > 0;
}

export default function ParentBookingsPage() {
  const [parentEmail, setParentEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingLessonId, setActingLessonId] = useState("");
  const [payingLessonId, setPayingLessonId] = useState("");
  const [submissionText, setSubmissionText] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setErrorMessage("");
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
      setParentEmail(email);

      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("parent_email", email)
        .order("created_at", { ascending: false });

      if (bookingError) throw new Error(bookingError.message);

      const { data: lessonData, error: lessonError } = await supabase
        .from("tutor_lessons")
        .select("*")
        .eq("parent_email", email)
        .order("lesson_date", { ascending: false });

      if (lessonError) throw new Error(lessonError.message);

      const { data: submissionData, error: submissionError } = await supabase
        .from("homework_submissions")
        .select("*")
        .eq("parent_email", email)
        .order("submitted_at", { ascending: false });

      if (submissionError) throw new Error(submissionError.message);

      setBookings(bookingData || []);
      setLessons(lessonData || []);
      setSubmissions(submissionData || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load parent dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  function getSubmissionForLesson(lessonId: string) {
    return submissions.find((submission) => submission.lesson_id === lessonId);
  }

  async function submitHomework(lesson: Lesson) {
    setActingLessonId(lesson.id);
    setMessage("");
    setErrorMessage("");

    try {
      const text = (submissionText[lesson.id] || "").trim();

      if (!text) {
        throw new Error("Please write or paste the homework response before submitting.");
      }

      const supabase = getSupabaseBrowserClient();

      const { error: insertError } = await supabase
        .from("homework_submissions")
        .insert({
          lesson_id: lesson.id,
          parent_email: parentEmail,
          tutor_email: lesson.tutor_email,
          student_name: lesson.student_name,
          homework_title: lesson.homework_title,
          submission_text: text,
          status: "submitted",
        });

      if (insertError) throw new Error(insertError.message);

      const { error: updateError } = await supabase
        .from("tutor_lessons")
        .update({ homework_status: "submitted" })
        .eq("id", lesson.id);

      if (updateError) throw new Error(updateError.message);

      setSubmissionText((prev) => ({ ...prev, [lesson.id]: "" }));
      setMessage("Homework submitted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit homework."
      );
    } finally {
      setActingLessonId("");
    }
  }

  async function payForLesson(lesson: Lesson) {
    setPayingLessonId(lesson.id);
    setMessage("");
    setErrorMessage("");

    try {
      const amount = Number(lesson.lesson_amount || lesson.hourly_rate || 0);

      if (!amount) throw new Error("This lesson has no payable amount.");
      if (!parentEmail) throw new Error("Parent email is missing. Please sign in again.");

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          parentEmail,
          amount,
          studentName: lesson.student_name || "Student",
          subject: lesson.subject || "Lesson",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.authorization_url) {
        throw new Error(data.error || "Payment could not be initialized.");
      }

      window.location.href = data.authorization_url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Payment failed to start."
      );
      setPayingLessonId("");
    }
  }

  function renderPaymentAction(lesson: Lesson) {
    if (lesson.payment_status === "paid") {
      return (
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
          Paid
        </p>
      );
    }

    if (!hasPayableAmount(lesson)) return null;

    return (
      <button
        type="button"
        disabled={payingLessonId === lesson.id}
        onClick={() => payForLesson(lesson)}
        className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {payingLessonId === lesson.id ? "Starting Payment..." : "Pay Now"}
      </button>
    );
  }

  const upcomingLessons = lessons.filter(
    (lesson) =>
      lesson.status === "upcoming" ||
      lesson.status === "booked" ||
      lesson.status === "scheduled" ||
      !lesson.status
  );

  const pastLessons = lessons.filter(
    (lesson) =>
      lesson.status === "completed" ||
      lesson.status === "cancelled" ||
      lesson.status === "rejected"
  );

  const homeworkLessons = lessons.filter(
    (lesson) =>
      lesson.homework_title ||
      lesson.homework_instructions ||
      lesson.homework_status === "assigned" ||
      lesson.homework_status === "submitted"
  );

  const unpaidTotal = lessons
    .filter((lesson) => lesson.payment_status !== "paid")
    .reduce(
      (total, lesson) =>
        total + Number(lesson.lesson_amount || lesson.hourly_rate || 0),
      0
    );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">Parent Bookings</h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          View lessons, pricing, invoices, payment status, and homework.
        </p>

        {parentEmail ? (
          <p className="mt-3 text-sm text-slate-500">Signed in as {parentEmail}</p>
        ) : null}

        <div className="mt-8">
          <Link
            href="/tutors"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Find a Tutor
          </Link>
        </div>

        {loading ? <p className="mt-8">Loading dashboard...</p> : null}
        {message ? <p className="mt-6 text-green-600">{message}</p> : null}

        {errorMessage ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!loading && !errorMessage ? (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="mt-2 text-3xl font-bold">{bookings.length}</p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Upcoming Lessons</p>
                <p className="mt-2 text-3xl font-bold">{upcomingLessons.length}</p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Homework Items</p>
                <p className="mt-2 text-3xl font-bold">{homeworkLessons.length}</p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Unpaid Lesson Total</p>
                <p className="mt-2 text-2xl font-bold">{usd(unpaidTotal)}</p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Upcoming Lessons & Invoices</h2>

              {upcomingLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">You have no upcoming lessons yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl border bg-white p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {lesson.subject || "Lesson"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Curriculum: {lesson.curriculum || "—"}
                          </p>
                          <p className="text-sm text-slate-600">
                            Student: {lesson.student_name || "—"}
                          </p>
                          <p className="text-sm text-slate-600">
                            Tutor: {lesson.tutor_email || "—"}
                          </p>
                          <p className="text-sm text-slate-600">
                            Date/Time: {lesson.lesson_date || "—"} •{" "}
                            {lesson.start_time || "—"} - {lesson.end_time || "—"}
                          </p>
                        </div>

                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          {lesson.status || "booked"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-3">
                        <p>
                          <span className="font-semibold">Hourly Rate:</span>{" "}
                          {usd(lesson.hourly_rate)}
                        </p>
                        <p>
                          <span className="font-semibold">Invoice Amount:</span>{" "}
                          {usd(lesson.lesson_amount || lesson.hourly_rate)}
                        </p>
                        <p>
                          <span className="font-semibold">Payment:</span>{" "}
                          {lesson.payment_status || "unpaid"}
                        </p>
                      </div>

                      {renderPaymentAction(lesson)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Homework</h2>

              {homeworkLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">No homework has been assigned yet.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {homeworkLessons.map((lesson) => {
                    const existingSubmission = getSubmissionForLesson(lesson.id);
                    const alreadySubmitted = !!existingSubmission;

                    return (
                      <div key={lesson.id} className="rounded-2xl border bg-slate-50 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {lesson.homework_title || "Homework"}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                              Subject: {lesson.subject || "—"}
                            </p>
                            <p className="text-sm text-slate-600">
                              Due date: {lesson.homework_due_date || "—"}
                            </p>
                          </div>

                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            {lesson.homework_status || "assigned"}
                          </span>
                        </div>

                        {lesson.homework_instructions ? (
                          <div className="mt-4 rounded-xl border bg-white p-4 text-sm leading-7 text-slate-700">
                            {lesson.homework_instructions}
                          </div>
                        ) : null}

                        {alreadySubmitted ? (
                          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                            <p className="font-semibold">Submitted</p>
                            <p className="mt-1">
                              {existingSubmission?.submission_text || "Homework submitted."}
                            </p>
                            {existingSubmission?.tutor_feedback ? (
                              <p className="mt-3">
                                <span className="font-semibold">Tutor Feedback:</span>{" "}
                                {existingSubmission.tutor_feedback}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium">
                              Submit homework response
                            </label>
                            <textarea
                              value={submissionText[lesson.id] || ""}
                              onChange={(e) =>
                                setSubmissionText((prev) => ({
                                  ...prev,
                                  [lesson.id]: e.target.value,
                                }))
                              }
                              rows={5}
                              placeholder="Paste or type the student's homework response here..."
                              className="w-full rounded-xl border px-4 py-3 text-sm"
                            />
                            <button
                              type="button"
                              disabled={actingLessonId === lesson.id}
                              onClick={() => submitHomework(lesson)}
                              className="mt-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                            >
                              {actingLessonId === lesson.id ? "Submitting..." : "Submit Homework"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-10 rounded-2xl border p-6">
              <h2 className="text-2xl font-semibold">Booking History</h2>

              {pastLessons.length === 0 ? (
                <p className="mt-4 text-slate-600">No past lessons yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {pastLessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl border bg-white p-5">
                      <h3 className="text-lg font-semibold">
                        {lesson.subject || "Lesson"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Student: {lesson.student_name || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Tutor: {lesson.tutor_email || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Date: {lesson.lesson_date || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Status: {lesson.status || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Amount: {usd(lesson.lesson_amount || lesson.hourly_rate)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Payment: {lesson.payment_status || "unpaid"}
                      </p>

                      {renderPaymentAction(lesson)}
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