"use client";

import { useState } from "react";

export default function ParentEnquiryPage({
  params,
}: {
  params: { id: string };
}) {
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [preferredMode, setPreferredMode] = useState("online");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/parent-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          educatorId: params.id,
          parentName,
          parentEmail,
          parentPhone,
          studentName,
          subject,
          preferredMode,
          preferredSchedule,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry.");
      }

      setSuccess("Enquiry submitted successfully.");
      setParentName("");
      setParentEmail("");
      setParentPhone("");
      setStudentName("");
      setSubject("");
      setPreferredMode("online");
      setPreferredSchedule("");
      setMessage("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
        <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
          The Alkebula School
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
          Parent Enquiry
        </h1>
        <p className="mt-3 text-slate-600">
          Tell us about the learner and your preferred arrangement. We will use
          this to start the booking process.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="Parent full name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
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
            placeholder="Parent phone"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Subject needed"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <select
            className="rounded-xl border p-3"
            value={preferredMode}
            onChange={(e) => setPreferredMode(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="in-person">In-person</option>
            <option value="both">Both</option>
          </select>

          <input
            className="rounded-xl border p-3 md:col-span-2"
            placeholder="Preferred schedule (e.g. Weekdays after 4pm)"
            value={preferredSchedule}
            onChange={(e) => setPreferredSchedule(e.target.value)}
          />

          <textarea
            className="min-h-[140px] rounded-xl border p-3 md:col-span-2"
            placeholder="Additional notes"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
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