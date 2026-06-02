"use client";

import { use, useState } from "react";

export default function ParentEnquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

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
          educatorId: id,
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
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
              The Alkebula School
            </p>

            <h1 className="mt-3 text-4xl font-bold text-slate-950">
              Parent Enquiry
            </h1>

            <p className="mt-4 leading-8 text-slate-600">
              Tell us about the learner and your preferred arrangement. We will
              use this to start the booking process and help coordinate the
              right tutor support.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              <input
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                placeholder="Parent full name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                placeholder="Parent email"
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                placeholder="Parent phone"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                placeholder="Student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                placeholder="Subject needed"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <select
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value)}
              >
                <option value="online">Online</option>
                <option value="in-person">In-person</option>
                <option value="both">Both</option>
              </select>

              <input
                className="rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
                placeholder="Preferred schedule, for example: weekdays after 4pm"
                value={preferredSchedule}
                onChange={(e) => setPreferredSchedule(e.target.value)}
                required
              />

              <textarea
                className="min-h-[140px] rounded-xl border border-slate-300 bg-white p-3 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
                placeholder="Additional notes"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#8F1F36] px-6 py-3 font-bold text-white transition hover:bg-[#6F1729] disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </button>
              </div>
            </form>

            {success ? (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}