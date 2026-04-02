"use client";

import { useState } from "react";

type Submission = {
  id: string;
  subject: string;
  topic: string;
  subtopic: string;
  submission_text: string | null;
  status: string;
  submitted_at: string;
};

type Review = {
  id: string;
  submission_id: string;
  score: number | null;
  feedback: string | null;
  reviewed_at: string;
};

export default function StudentFeedbackPage() {
  const [studentName, setStudentName] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadFeedback(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/student-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load feedback.");
      }

      setSubmissions(result.submissions || []);
      setReviews(result.reviews || []);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load feedback.";
      setError(msg);
      setSubmissions([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  function getReview(submissionId: string) {
    return reviews.find((review) => review.submission_id === submissionId);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-8 shadow">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
            Student Portal
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
            Feedback & Scores
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Load a student profile to view homework feedback and scores.
          </p>

          <form onSubmit={loadFeedback} className="mt-8 flex flex-col gap-4 md:flex-row">
            <input
              className="flex-1 rounded-xl border p-3"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load Feedback"}
            </button>
          </form>

          {error ? (
            <div className="mt-6 rounded-xl bg-red-50 p-3 text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Reviewed Homework
          </h2>

          {submissions.length === 0 ? (
            <p className="mt-4 text-slate-600">No homework records found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {submissions.map((submission) => {
                const review = getReview(submission.id);

                return (
                  <div key={submission.id} className="rounded-2xl border p-5">
                    <div className="font-semibold text-[#1A1A1A]">
                      {submission.subject} — {submission.topic} / {submission.subtopic}
                    </div>

                    <div className="mt-2 text-sm text-slate-600 capitalize">
                      Status: {submission.status}
                    </div>

                    <div className="text-sm text-slate-600">
                      Submitted:{" "}
                      {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleString()
                        : "-"}
                    </div>

                    {submission.submission_text ? (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <strong>Your Submission:</strong>
                        <p className="mt-2 text-slate-700">
                          {submission.submission_text}
                        </p>
                      </div>
                    ) : null}

                    {review ? (
                      <div className="mt-4 rounded-xl bg-green-50 p-4">
                        <div className="font-medium text-green-800">
                          Score: {review.score ?? "-"}%
                        </div>
                        <p className="mt-2 text-green-700">
                          {review.feedback || "No feedback."}
                        </p>
                        <div className="mt-2 text-sm text-green-700">
                          Reviewed:{" "}
                          {review.reviewed_at
                            ? new Date(review.reviewed_at).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-yellow-700">
                        Awaiting educator review.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}