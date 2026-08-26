"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const curriculumOptions = [
  "Cambridge IGCSE",
  "Edexcel IGCSE",
  "Cambridge AS & A Levels",
  "Edexcel International A Levels",
  "IB Diploma Programme",
  "Cambridge Checkpoint",
  "Common Entrance",
  "Homeschool Support",
  "Not sure yet",
];

const examWindowOptions = [
  "October/November 2026 revision",
  "Edexcel IAL October 2026",
  "Edexcel IAL January 2027",
  "May/June 2027 preparation",
  "Ongoing academic support",
  "Homeschool structure",
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
  "October/November exam revision",
  "Planning ahead",
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

const learnerTypes = [
  "International-school learner",
  "Homeschool learner",
  "Private candidate",
  "Boarding school learner",
  "Globally mobile family",
  "Not sure yet",
];

const supportHighlights = [
  "Cambridge, Edexcel, A Level, IB and Checkpoint focus",
  "Guided tutor matching instead of endless browsing",
  "Online tutoring across time zones",
  "Local in-person support considered where available",
];

const processSteps = [
  {
    title: "1. Share the learning situation",
    description:
      "Tell us the curriculum, subject, exam window, current challenge and preferred schedule.",
  },
  {
    title: "2. We review the best fit",
    description:
      "We look at tutor strengths, curriculum experience, availability and the learner’s academic need.",
  },
  {
    title: "3. Start with confidence",
    description:
      "You receive guidance toward suitable tutor support, whether for revision, recovery or ongoing learning.",
  },
];

const trustNotes = [
  "Best for parents who are unsure which tutor to choose",
  "Useful for exam revision, homeschool support and subject recovery",
  "Built for international-school, homeschool and private-candidate pathways",
  "Suitable for families in Kenya, across the region and abroad",
];

export default function GetMatchedPage() {
  const [form, setForm] = useState({
    parent_name: "",
    email: "",
    phone: "",
    student_name: "",
    student_age: "",
    year_group: "",
    learner_type: "",
    curriculum: "",
    exam_window: "",
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const detailedMessage = [
        "GET MATCHED WITH A TUTOR REQUEST",
        "",
        `Learner type: ${form.learner_type || "Not provided"}`,
        `Student age: ${form.student_age || "Not provided"}`,
        `Year group / class: ${form.year_group || "Not provided"}`,
        `Exam window / support goal: ${form.exam_window || "Not provided"}`,
        `Subject needed: ${form.subject_needed || "Not provided"}`,
        `Current challenge: ${form.current_challenge || "Not provided"}`,
        `Preferred timezone: ${form.preferred_timezone || "Not provided"}`,
        `Preferred lesson frequency: ${
          form.lesson_frequency || "Not provided"
        }`,
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
        learner_type: "",
        curriculum: "",
        exam_window: "",
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
    <main className="min-h-screen bg-[#FFFDFB] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_28%),radial-gradient(circle_at_top_right,#F7FCFF,transparent_30%),#FFFDFB]">
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#FFF5F7] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#F7FCFF] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit rounded-full border border-[#8F1F36]/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8F1F36] shadow-sm">
              Get Matched With a Tutor
            </p>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
              Let us help you choose the right tutor for your learner.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Share your child’s curriculum, subject needs, exam window,
              learning challenge and preferred schedule. Alkebula will help you
              narrow the choice toward suitable academic support.
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              This matching route is ideal for parents who do not want to browse
              every tutor profile first — especially where the learner needs
              urgent revision, homeschool structure, subject recovery or
              international-curriculum guidance.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#matching-form"
                className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                Start Matching Request
              </a>

              <Link
                href="/educators"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:border-[#379CD6]/30 hover:bg-[#F7FCFF]"
              >
                Browse Tutors Instead
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {supportHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[1.6rem] border border-[#8F1F36]/10 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8F1F36]">
                Personal but global
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                We support learners in international-school, homeschool and
                private-candidate pathways — from families in Kenya and the
                wider region to globally mobile students abroad.
              </p>
            </div>
          </div>

          <div
            id="matching-form"
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:p-8"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                  Parent Matching Request
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                  Tell us what your child needs.
                </h2>
              </div>

              <div className="rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#156B96]">
                  Current focus
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  Oct/Nov 2026 revision
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
              <input
                placeholder="Parent Name"
                value={form.parent_name}
                onChange={(e) =>
                  setForm({ ...form, parent_name: e.target.value })
                }
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                placeholder="Phone / WhatsApp"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                placeholder="Student Name"
                value={form.student_name}
                onChange={(e) =>
                  setForm({ ...form, student_name: e.target.value })
                }
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                placeholder="Student Age"
                value={form.student_age}
                onChange={(e) =>
                  setForm({ ...form, student_age: e.target.value })
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                placeholder="Year Group / Class"
                value={form.year_group}
                onChange={(e) =>
                  setForm({ ...form, year_group: e.target.value })
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <select
                value={form.learner_type}
                onChange={(e) =>
                  setForm({ ...form, learner_type: e.target.value })
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              >
                <option value="">Learner Type</option>
                {learnerTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={form.curriculum}
                onChange={(e) =>
                  setForm({ ...form, curriculum: e.target.value })
                }
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              >
                <option value="">Select Curriculum</option>
                {curriculumOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={form.exam_window}
                onChange={(e) =>
                  setForm({ ...form, exam_window: e.target.value })
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              >
                <option value="">Exam Window / Support Goal</option>
                {examWindowOptions.map((item) => (
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
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <select
                value={form.preferred_timezone}
                onChange={(e) =>
                  setForm({ ...form, preferred_timezone: e.target.value })
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
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
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
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
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10 md:col-span-2"
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
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10 md:col-span-2"
              />

              <textarea
                placeholder="Anything else we should know? Optional."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10 md:col-span-2"
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

      <section className="bg-white px-6 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {processSteps.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-950">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-slate-200 bg-[#FFFDFB] p-8 text-center shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
            Prefer to browse tutors yourself?
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            You can still explore approved tutors directly.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Browse tutor profiles based on curriculum, subject, profile and
            availability. The matching route is simply there for parents who
            want guidance before choosing.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/educators"
              className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm hover:bg-[#F7FCFF]"
            >
              View Approved Tutors
            </Link>

            <Link
              href="/exam-revision"
              className="inline-flex justify-center rounded-xl border border-[#8F1F36]/15 bg-[#FFF5F7] px-6 py-3 text-sm font-bold text-[#8F1F36] hover:bg-white"
            >
              View Revision Pages
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#FFF8F9] px-6 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              Why Matching Helps
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Not every parent wants to start by comparing tutor profiles.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Some learners need urgent exam revision. Others need a calm
              academic reset, homeschool structure, or support across time zones.
              Matching helps us understand the situation first, then guide the
              next step more professionally.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Subtle local and global context matters too: families may be in
              Kenya, elsewhere in the region, or abroad, while still following
              Cambridge, Edexcel, IB or other international pathways.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustNotes.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[#8F1F36]/10 bg-white p-5 text-sm font-bold leading-7 text-slate-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF5F7] p-8 text-center shadow-sm lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
            Start With Clarity
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Tell us the challenge. We will help you find the right support.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Use the matching form to share the learner’s curriculum, subject,
            exam window and current academic need. The Alkebula team will review
            it and guide the next step.
          </p>

          <a
            href="#matching-form"
            className="mt-7 inline-flex rounded-xl bg-[#8F1F36] px-7 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
          >
            Complete Matching Form
          </a>
        </div>
      </section>
    </main>
  );
}