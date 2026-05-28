"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const curriculumCards = [
  {
    title: "Cambridge IGCSE",
    href: "/online-cambridge-igcse-tutors",
    description:
      "Structured support for learners building strong foundations and preparing for Cambridge IGCSE examinations.",
  },
  {
    title: "Edexcel IGCSE",
    href: "/edexcel-igcse-tutors",
    description:
      "Focused online tutoring for Edexcel learners who need clarity, subject mastery, and exam confidence.",
  },
  {
    title: "A Levels",
    href: "/a-level-online-tutors",
    description:
      "Advanced subject support for serious learners preparing for higher-level academic performance.",
  },
  {
    title: "IB",
    href: "/ib-online-tutors",
    description:
      "Conceptual, structured support for International Baccalaureate learners across demanding subjects.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a parent account",
    description:
      "Join the platform so your family can access tutors, bookings, support, and lesson records.",
  },
  {
    number: "02",
    title: "Choose the right pathway",
    description:
      "Select Cambridge IGCSE, Edexcel IGCSE, A Levels, IB, or homeschool support.",
  },
  {
    number: "03",
    title: "Book structured lessons",
    description:
      "Connect with approved educators and book focused online lessons around your child’s needs.",
  },
  {
    number: "04",
    title: "Build steady progress",
    description:
      "Use consistent academic support to close gaps, strengthen mastery, and improve confidence.",
  },
];

const parentBenefits = [
  "International curriculum focus only",
  "Structured support for homeschooling families",
  "Approved educators and professional onboarding",
  "Online access for families across locations",
  "Built around learning gaps, mastery, and progress",
  "Parent support through the platform",
];

export default function HomePage() {
  const [form, setForm] = useState({
    parent_name: "",
    student_name: "",
    email: "",
    phone: "",
    curriculum: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);
      setErrorMessage("");

      const res = await fetch("/api/parent-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Unable to submit enquiry. Please try again.");
      }

      setSuccess(true);
      setForm({
        parent_name: "",
        student_name: "",
        email: "",
        phone: "",
        curriculum: "",
        message: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] text-slate-900">
      <section className="relative overflow-hidden border-b border-amber-100 bg-[radial-gradient(circle_at_top_left,#fff7df,transparent_34%),linear-gradient(to_bottom,#fffdf8,#f8fafc)]">
        <div className="absolute right-0 top-10 hidden h-80 w-80 rounded-full bg-amber-100/70 blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-80 w-80 rounded-full bg-blue-50 blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="inline-flex rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-800 shadow-sm">
                Premium Online International Tutoring
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-7xl">
                Gentle structure.
                <span className="block text-amber-700">
                  Serious academic progress.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                The Alkebula School supports Cambridge IGCSE, Edexcel IGCSE,
                A Level, and IB learners with calm, structured online tutoring
                designed to close learning gaps and build lasting confidence.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-7 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
                >
                  Parent Sign Up
                </Link>

                <Link
                  href="/educators"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Find Tutors
                </Link>

                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-xl px-7 py-4 text-sm font-semibold text-slate-600 transition hover:bg-white"
                >
                  Make Enquiry
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-slate-600">
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                  Cambridge IGCSE
                </span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                  Edexcel IGCSE
                </span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                  A Levels
                </span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                  IB
                </span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                  International Curricula Only
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-100 bg-white/90 p-6 shadow-[0_30px_80px_rgba(120,53,15,0.10)] backdrop-blur">
              <div className="rounded-[1.5rem] border border-amber-100 bg-gradient-to-br from-white via-amber-50/50 to-slate-50 p-6">
                <div className="flex justify-center rounded-3xl bg-white p-6 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="The Alkebula School logo"
                    width={420}
                    height={420}
                    className="h-auto w-full max-w-sm object-contain"
                    priority
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-amber-100 bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Focus
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      Mastery
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Delivery
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      Online
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Support
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      Structured
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Motto
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      Proven Results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-950">Global</p>
              <p className="mt-1 text-sm text-slate-600">Online access</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-950">4</p>
              <p className="mt-1 text-sm text-slate-600">International pathways</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-950">Parent-first</p>
              <p className="mt-1 text-sm text-slate-600">Support experience</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-950">Structured</p>
              <p className="mt-1 text-sm text-slate-600">Academic progress</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Academic Pathways
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
                Focused support for international curricula.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Choose a pathway and connect your learner with structured online
                academic support built around mastery and measurable progress.
              </p>
            </div>

            <Link
              href="/homeschool-support"
              className="inline-flex w-fit rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Explore Homeschool Support
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {curriculumCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-amber-100 bg-[#fffdf8] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-700">
                  {item.title.charAt(0)}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <p className="mt-6 text-sm font-bold text-amber-700">
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff8ec] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">
              How Alkebula Works
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              A clearer path from support to progress.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-black text-amber-700">
                  {step.number}
                </p>

                <h3 className="mt-4 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Why Parents Choose Alkebula
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Built for families who want more than casual tutoring.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              Alkebula is designed around calm structure, clarity, and academic
              seriousness. We help parents support learners with better rhythm,
              expert guidance, and an international curriculum focus.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white hover:bg-amber-700"
              >
                Create Parent Account
              </Link>

              <Link
                href="/about"
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                About Alkebula
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {parentBenefits.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-amber-100 bg-[#fffdf8] p-5 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-amber-100 bg-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                International Curriculum Focus
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Focused exclusively on international pathways.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                The Alkebula School supports Cambridge IGCSE, Edexcel IGCSE,
                A Levels, and IB learners. Our system is built for families who
                need structured academic support, especially homeschooling
                families and internationally mobile learners.
              </p>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Alkebula does not offer CBC tutoring. Our focus is international
                curricula with structured online academic support.
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-100 bg-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                For Homeschooling Families
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Flexibility works best with structure.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Homeschooling gives families freedom, but learners still need
                academic rhythm, expert feedback, and honest support. Alkebula
                helps families bring structure and accountability into the
                learning journey.
              </p>

              <Link
                href="/homeschool-support"
                className="mt-6 inline-flex rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-900"
              >
                Learn About Homeschool Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="enquiry" className="bg-[#fffdf8] py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] border border-amber-100 bg-white px-8 py-12 text-slate-900 shadow-[0_20px_60px_rgba(120,53,15,0.10)] lg:px-16 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-800">
              Parent Enquiry
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Tell us about your child and the support you need.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Share a few details and we will guide you toward the right academic
              support for your learner.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 grid gap-5 md:grid-cols-2"
            >
              <input
                placeholder="Parent Name"
                value={form.parent_name}
                onChange={(e) =>
                  setForm({ ...form, parent_name: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
              />

              <input
                placeholder="Student Name"
                value={form.student_name}
                onChange={(e) =>
                  setForm({ ...form, student_name: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400"
              />

              <select
                value={form.curriculum}
                onChange={(e) =>
                  setForm({ ...form, curriculum: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 md:col-span-2"
              >
                <option value="">Select Curriculum</option>
                <option>Cambridge IGCSE</option>
                <option>Edexcel IGCSE</option>
                <option>A Levels</option>
                <option>IB</option>
                <option>Homeschool Support</option>
              </select>

              <textarea
                placeholder="Tell us what you need..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 md:col-span-2"
                rows={5}
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-amber-600 py-3 font-bold text-white transition hover:bg-amber-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Parent Enquiry"}
                </button>
              </div>

              {success ? (
                <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 md:col-span-2">
                  Enquiry submitted successfully.
                </p>
              ) : null}

              {errorMessage ? (
                <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 md:col-span-2">
                  {errorMessage}
                </p>
              ) : null}
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span>Ready to start directly?</span>
              <Link
                href="/auth/sign-up"
                className="font-bold text-amber-700 underline underline-offset-4"
              >
                Create a parent account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-slate-50 p-8 text-center shadow-sm lg:p-12">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-5xl">
            Give your learner structure, clarity, and serious academic support.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600">
            Parent sign-up is the best first step toward bookings, tutor access,
            and structured lesson support.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-amber-600 px-7 py-4 text-sm font-bold text-white hover:bg-amber-700"
            >
              Parent Sign Up
            </Link>

            <Link
              href="/educators"
              className="rounded-xl border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
