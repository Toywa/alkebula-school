"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const curricula = [
  {
    slug: "cambridge",
    name: "Cambridge",
    logo: "/cambridge.png",
    image: "/curricula/cambridge-students.png",
    description:
      "Structured international learning with strong foundations, progression, and rigorous assessment.",
  },
  {
    slug: "edexcel",
    name: "Edexcel",
    logo: "/edexcel.png",
    image: "/curricula/edexcel-students.png",
    description:
      "A flexible international pathway designed to support subject mastery and confident academic growth.",
  },
  {
    slug: "ib",
    name: "IB",
    logo: "/ib.png",
    image: "/curricula/ib-students.png",
    description:
      "A globally respected pathway that develops inquiry, critical thinking, and strong academic discipline.",
  },
  {
    slug: "a-levels",
    name: "A Levels",
    logo: "/alevel.png",
    image: "/curricula/alevel-students.png",
    description:
      "Advanced subject-focused preparation for serious learners aiming for strong university readiness.",
  },
];

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                The Alkebula School
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Extraordinary Learning.
                <span className="block text-amber-700">Proven Results.</span>
              </h1>

              <div className="mt-6 h-1 w-20 rounded-full bg-amber-600" />

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
                A premium education system built to close learning gaps,
                strengthen mastery, and help students move forward with
                confidence, structure, and measurable academic progress.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                For families seeking serious academic support, deeper learning,
                and a refined educational experience designed around excellence.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Book a Consultation
                </a>

                <a
                  href="#programs"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Explore Programmes
                </a>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="The Alkebula School logo"
                    width={520}
                    height={520}
                    className="h-auto w-full max-w-md object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Precision
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Learning designed with intention
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We identify where a learner stands, what is missing, and what is
              needed to move them forward with clarity.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Excellence
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Built for support and high performance
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Whether a student is catching up or ready to go further, our
              system is structured to produce strong outcomes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Confidence
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Measurable academic progress
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Families gain visibility into progress through structured
              instruction, focused support, and clear academic direction.
            </p>
          </div>
        </div>
      </section>

      <section id="programs" className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Academic Pathways
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              International standards. Serious academic direction.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Click into each curriculum to learn more about the pathway, who it
              suits, and how The Alkebula School supports learners within it.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {curricula.map((curriculum) => (
              <Link
                key={curriculum.slug}
                href={`/curricula/${curriculum.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    src={curriculum.image}
                    alt={`${curriculum.name} students`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex h-14 items-center justify-center">
                    <Image
                      src={curriculum.logo}
                      alt={curriculum.name}
                      width={150}
                      height={60}
                      className="h-auto max-h-12 w-auto object-contain"
                    />
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {curriculum.description}
                  </p>

                  <div className="mt-5 text-sm font-semibold text-amber-700">
                    Explore {curriculum.name} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            A better way to build academic momentum
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-amber-700">01</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Assess
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We identify the learner’s current level, strengths, and gaps.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-amber-700">02</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Personalize
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We design a focused learning path aligned to goals and needs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-amber-700">03</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Teach
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Expert educators deliver rigorous, structured instruction with
              clarity and care.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-amber-700">04</div>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Track
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Progress is visible, measurable, and built into the learning
              journey.
            </p>
          </div>
        </div>
      </section>

      <section id="enquiry-form" className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] bg-slate-900 px-8 py-12 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] lg:px-16 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
              Parent Enquiry
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Tell us about your child and the support you need
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Share a few details and we’ll guide you toward the right academic
              pathway, whether your child needs support catching up, structured
              homeschooling guidance, or a stronger challenge to excel further.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-2xl bg-white/10 p-6 ring-1 ring-white/20">
                <p className="text-lg font-semibold">Thank you.</p>
                <p className="mt-2 text-slate-300">
                  Your enquiry has been received. We will be in touch using the
                  details you provided.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:admissions@alkebulaschool.com"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Email Admissions
                  </a>
                  <a
                    href="https://wa.me/254728866097"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="parentName"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Parent / Guardian Name
                  </label>
                  <input
                    id="parentName"
                    name="parentName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-white"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue="admissions@alkebulaschool.com"
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-white"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    defaultValue="+254728866097"
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-white"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="studentName"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Student Name
                  </label>
                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-white"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="curriculum"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Curriculum
                  </label>
                  <select
                    id="curriculum"
                    name="curriculum"
                    required
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none focus:border-white"
                  >
                    <option value="">Select curriculum</option>
                    <option value="Cambridge">Cambridge</option>
                    <option value="Edexcel">Edexcel</option>
                    <option value="IB">IB</option>
                    <option value="A Levels">A Levels</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Year / Level
                  </label>
                  <input
                    id="level"
                    name="level"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-white"
                    placeholder="e.g. Year 8, IGCSE, A Level"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Tell us what support you need
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-white"
                    placeholder="Describe the learner’s needs, goals, challenges, or subjects requiring support"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Submit Enquiry
                  </button>

                  <a
                    href="mailto:admissions@alkebulaschool.com"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    admissions@alkebulaschool.com
                  </a>

                  <a
                    href="https://wa.me/254728866097"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    WhatsApp: +254728866097
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}