"use client";

import Link from "next/link";
import { useState } from "react";

const curriculumOptions = [
  "Cambridge IGCSE",
  "Edexcel IGCSE",
  "A Levels",
  "IB",
  "Homeschool Support",
  "Not sure yet",
];

const frequencyOptions = [
  "One lesson first",
  "1 lesson per week",
  "2 lessons per week",
  "3+ lessons per week",
  "Intensive exam preparation",
  "Not sure yet",
];

const urgencyOptions = [
  "Start this week",
  "Start next week",
  "Start within 2 weeks",
  "Planning for July",
  "Just exploring",
];

const timezoneOptions = [
  "Africa/Nairobi",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Qatar",
  "America/New_York",
  "America/Toronto",
  "Africa/Kampala",
  "Africa/Dar_es_Salaam",
  "Africa/Addis_Ababa",
  "Africa/Johannesburg",
  "Other / not sure",
];

export default function GetMatchedPage() {
  const [form, setForm] = useState({
    parent_name: "",
    email: "",
    phone: "",
    student_name: "",
    student_age: "",
    year_group: "",
    curriculum: "",
    subject_needed: "",
    current_challenge: "",
    preferred_timezone: "Africa/Nairobi",
    lesson_frequency: "",
    urgency: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const detailedMessage = [
        "GET MATCHED WITH A TUTOR REQUEST",
        "",
        `Student age: ${form.student_age || "Not provided"}`,
        `Year group / class: ${form.year_group || "Not provided"}`,
        `Subject needed: ${form.subject_needed || "Not provided"}`,
        `Current challenge: ${form.current_challenge || "Not provided"}`,
        `Preferred timezone: ${form.preferred_timezone || "Not provided"}`,
        `Preferred lesson frequency: ${form.lesson_frequency || "Not provided"}`,
        `Urgency: ${form.urgency || "Not provided"}`,
        "",
        `Additional message: ${form.message || "None"}`,
      ].join("\n");

      const res = await fetch("/api/parent-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_name: form.parent_name,
          student_name: form.student_name,
          email: form.email,
          phone: form.phone,
          curriculum: form.curriculum,
          message: detailedMessage,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Unable to submit your request. Please try again."
        );
      }

      setSuccess(true);
      setForm({
        parent_name: "",
        email: "",
        phone: "",
        student_name: "",
        student_age: "",
        year_group: "",
        curriculum: "",
        subject_needed: "",
        current_challenge: "",
        preferred_timezone: "Africa/Nairobi",
        lesson_frequency: "",
        urgency: "",
        message: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-12 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
              Get Matched With a Tutor
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Let Alkebula help you choose the right tutor.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Share your child’s curriculum, subject needs, learning challenge,
              and preferred schedule. Our team will review the request and guide
              you toward the most suitable approved tutor.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Cambridge, Edexcel, A Level and IB focus",
                "Homeschool support guidance",
                "Tutor matching based on learner needs",
                "Premium, parent-first support",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-[#379CD6]/20 bg-[#F7FCFF] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#156B96]">
                Best for parents who are unsure
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                You do not need to browse every tutor first. Tell us the academic
                situation, and we will help you narrow the choice professionally.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
              Parent Matching Request
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Tell us what your child needs.
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
              <input
                placeholder="Parent Name"
                value={form.parent_name}
                onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <input
                placeholder="Phone / WhatsApp"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <input
                placeholder="Student Name"
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <input
                placeholder="Student Age"
                value={form.student_age}
                onChange={(e) => setForm({ ...form, student_age: e.target.value })}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <input
                placeholder="Year Group / Class"
                value={form.year_group}
                onChange={(e) => setForm({ ...form, year_group: e.target.value })}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <select
                value={form.curriculum}
                onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              >
                <option value="">Select Curriculum</option>
                {curriculumOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <input
                placeholder="Subject Needed"
                value={form.subject_needed}
                onChange={(e) =>
                  setForm({ ...form, subject_needed: e.target.value })
                }
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              />

              <select
                value={form.preferred_timezone}
                onChange={(e) =>
                  setForm({ ...form, preferred_timezone: e.target.value })
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              >
                {timezoneOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={form.lesson_frequency}
                onChange={(e) =>
                  setForm({ ...form, lesson_frequency: e.target.value })
                }
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
              >
                <option value="">Preferred Lesson Frequency</option>
                {frequencyOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
              >
                <option value="">How soon do you want to start?</option>
                {urgencyOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <textarea
                placeholder="What is your child currently struggling with?"
                value={form.current_challenge}
                onChange={(e) =>
                  setForm({ ...form, current_challenge: e.target.value })
                }
                required
                rows={4}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
              />

              <textarea
                placeholder="Anything else we should know? Optional."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15 md:col-span-2"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#8F1F36] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#6F1729] disabled:opacity-60 md:col-span-2"
              >
                {loading ? "Submitting..." : "Get Matched With a Tutor"}
              </button>

              {success ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 md:col-span-2">
                  Your matching request has been submitted successfully. The
                  Alkebula team will review it and guide you toward the right
                  tutor.
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:col-span-2">
                  {errorMessage}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            {
              title: "1. Tell us the need",
              description:
                "Share the curriculum, subject, current challenge, and preferred schedule.",
            },
            {
              title: "2. We review the match",
              description:
                "We look at tutor strengths, curriculum fit, availability, and learner needs.",
            },
            {
              title: "3. Book with confidence",
              description:
                "You receive guidance toward a suitable tutor and can proceed with structured lessons.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-slate-200 bg-[#F7FCFF] p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-950">
            Prefer to browse tutors yourself?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            You can still explore approved tutors directly and choose a tutor
            based on curriculum, subject, profile, and availability.
          </p>

          <Link
            href="/educators"
            className="mt-6 inline-flex rounded-xl border border-[#379CD6]/30 bg-white px-6 py-3 text-sm font-semibold text-[#156B96] hover:bg-[#EEF9FF]"
          >
            View Approved Tutors
          </Link>
        </div>
      </section>
    </main>
  );
}
