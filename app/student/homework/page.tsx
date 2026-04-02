"use client";

import { useState } from "react";

export default function StudentHomeworkPage() {
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [educatorId, setEducatorId] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("studentName", studentName);
      formData.append("parentEmail", parentEmail);
      formData.append("educatorId", educatorId);
      formData.append("subject", subject);
      formData.append("topic", topic);
      formData.append("subtopic", subtopic);
      formData.append("submissionText", submissionText);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/homework-submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit homework.");
      }

      setSuccess("Homework submitted successfully.");
      setStudentName("");
      setParentEmail("");
      setEducatorId("");
      setSubject("");
      setTopic("");
      setSubtopic("");
      setSubmissionText("");
      setFile(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Homework submission failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
        <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
          Student Portal
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
          Submit Homework
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Submit homework for educator review. You can type your work, upload a file, or both.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="Student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Parent email"
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Educator ID"
            value={educatorId}
            onChange={(e) => setEducatorId(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Subtopic"
            value={subtopic}
            onChange={(e) => setSubtopic(e.target.value)}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Upload File (PDF, DOC, DOCX, JPG, PNG)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <textarea
            className="min-h-[160px] rounded-xl border p-3 md:col-span-2"
            placeholder="Write homework answer or notes here"
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Homework"}
            </button>
          </div>
        </form>

        {success ? (
          <div className="mt-6 rounded-xl bg-green-50 p-3 text-green-700">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl bg-red-50 p-3 text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}