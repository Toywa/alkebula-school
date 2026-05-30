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
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            The Alkebula School
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Parent Enquiry
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Tell us about the learner and your preferred arrangement. We will use
            this to understand the support needed and guide you toward the right
            next step.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8 lg:p-10">
          <div className="mb-8 rounded-3xl border border-[#379CD6]/15 bg-[#F7FCFF] p-5">
            <p className="text-sm font-semibold text-[#156B96]">
              Please share accurate contact details so our team can follow up
              smoothly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
              placeholder="Parent full name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />

            <input
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
              placeholder="Parent email"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />

            <input
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
              placeholder="Parent phone"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              required
            />

            <input
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
              placeholder="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />

            <input
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
              placeholder="Subject needed"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <select
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
              value={preferredMode}
              onChange={(e) => setPreferredMode(e.target.value)}
            >
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
              <option value="both">Both</option>
            </select>

            <input
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
              placeholder="Preferred schedule"
              value={preferredSchedule}
              onChange={(e) => setPreferredSchedule(e.target.value)}
            />

            <textarea
              className="min-h-[140px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
              placeholder="Additional notes"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#8F1F36] px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729] disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>
            </div>
          </form>

          {success ? (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}