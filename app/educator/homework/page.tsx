"use client";

import { useState } from "react";

type HomeworkSubmission = {
  id: string;
  student_name: string;
  parent_email: string | null;
  educator_id: string | null;
  subject: string;
  topic: string;
  subtopic: string;
  submission_text: string | null;
  file_url: string | null;
  signed_url: string | null;
  status: string;
  submitted_at: string;
};

export default function EducatorHomeworkPage() {
  const [educatorId, setEducatorId] = useState("");
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  async function loadHomework(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/educator-homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ educatorId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load homework.");
      }

      setSubmissions(result.submissions || []);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load homework.";
      setError(msg);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(submissionId: string) {
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/homework-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          educatorId,
          score: Number(score),
          feedback,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save review.");
      }

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === submissionId ? { ...item, status: "reviewed" } : item
        )
      );

      setMessage("Homework reviewed successfully.");
      setReviewingId(null);
      setScore("");
      setFeedback("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Review failed.";
      setError(msg);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
            Educator Portal
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
            Homework Inbox
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Load homework submitted to a specific educator and review it.
          </p>

          <form onSubmit={loadHomework} className="mt-8 flex flex-col gap-4 md:flex-row">
            <input
              className="flex-1 rounded-xl border p-3"
              placeholder="Enter educator ID"
              value={educatorId}
              onChange={(e) => setEducatorId(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load Homework"}
            </button>
          </form>

          {error ? (
            <div className="mt-6 rounded-xl bg-red-50 p-3 text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-6 rounded-xl bg-green-50 p-3 text-green-700">
              {message}
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            Submitted Homework
          </h2>

          {submissions.length === 0 ? (
            <p className="mt-4 text-slate-600">No homework submissions found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="rounded-2xl border p-5">
                  <div className="font-semibold text-[#1A1A1A]">
                    {submission.student_name} — {submission.subject}
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    Topic: {submission.topic}
                  </div>

                  <div className="text-sm text-slate-600">
                    Subtopic: {submission.subtopic}
                  </div>

                  <div className="text-sm text-slate-600 capitalize">
                    Status: {submission.status}
                  </div>

                  <div className="text-sm text-slate-600">
                    Submitted:{" "}
                    {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleString()
                      : "-"}
                  </div>

                  {submission.parent_email ? (
                    <div className="text-sm text-slate-600">
                      Parent Email: {submission.parent_email}
                    </div>
                  ) : null}

                  {submission.submission_text ? (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <strong>Submission Text:</strong>
                      <p className="mt-2 text-slate-700">
                        {submission.submission_text}
                      </p>
                    </div>
                  ) : null}

                  {submission.signed_url ? (
                    <div className="mt-4">
                      <a
                        href={submission.signed_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Attached File
                      </a>
                    </div>
                  ) : null}

                  {submission.status !== "reviewed" ? (
                    <div className="mt-6 rounded-xl bg-[#F7F5F2] p-4">
                      {reviewingId === submission.id ? (
                        <div className="space-y-4">
                          <input
                            type="number"
                            placeholder="Score out of 100"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full rounded-xl border p-3"
                          />

                          <textarea
                            placeholder="Write feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="min-h-[120px] w-full rounded-xl border p-3"
                          />

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => submitReview(submission.id)}
                              className="rounded-xl bg-[#1F3D2B] px-4 py-3 text-white"
                            >
                              Save Review
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setReviewingId(null);
                                setScore("");
                                setFeedback("");
                              }}
                              className="rounded-xl border px-4 py-3"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReviewingId(submission.id)}
                          className="rounded-xl bg-[#C6A75E] px-4 py-3 font-medium text-[#1A1A1A]"
                        >
                          Review Homework
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-xl bg-green-50 p-3 text-green-700">
                      This submission has been reviewed.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}