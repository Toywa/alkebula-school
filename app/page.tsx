"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/parent-enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({
        parent_name: "",
        student_name: "",
        email: "",
        phone: "",
        curriculum: "",
        message: "",
      });
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
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
                <Link
                  href="/educators"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Find a Tutor
                </Link>

                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Make Enquiry
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

      {/* CURRICULA */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Academic Pathways
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              International standards. Serious academic direction.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Explore globally respected curricula and choose the pathway that
              best fits your child’s academic goals, stage, and learning style.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/curricula/cambridge"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src="/curricula/cambridge-students.png"
                  alt="Cambridge students"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex h-14 items-center justify-center">
                  <Image
                    src="/cambridge.png"
                    alt="Cambridge"
                    width={150}
                    height={60}
                    className="h-auto max-h-12 w-auto object-contain"
                  />
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Structured and internationally respected, ideal for strong
                  foundations, progression, and excellent exam preparation.
                </p>
                <div className="mt-5 text-sm font-semibold text-amber-700">
                  Explore Cambridge →
                </div>
              </div>
            </Link>

            <Link
              href="/curricula/edexcel"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src="/curricula/edexcel-students.png"
                  alt="Edexcel students"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex h-14 items-center justify-center">
                  <Image
                    src="/edexcel.png"
                    alt="Edexcel"
                    width={150}
                    height={60}
                    className="h-auto max-h-12 w-auto object-contain"
                  />
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  A flexible modern pathway with clear assessment structure and
                  strong support for subject mastery.
                </p>
                <div className="mt-5 text-sm font-semibold text-amber-700">
                  Explore Edexcel →
                </div>
              </div>
            </Link>

            <Link
              href="/curricula/ib"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src="/curricula/ib-students.png"
                  alt="IB students"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex h-14 items-center justify-center">
                  <Image
                    src="/ib.png"
                    alt="International Baccalaureate"
                    width={150}
                    height={60}
                    className="h-auto max-h-12 w-auto object-contain"
                  />
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Inquiry-based, rigorous, and globally minded, designed for
                  deep thinking, reflection, and academic discipline.
                </p>
                <div className="mt-5 text-sm font-semibold text-amber-700">
                  Explore IB →
                </div>
              </div>
            </Link>

            <Link
              href="/curricula/a-levels"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <Image
                  src="/curricula/alevel-students.png"
                  alt="A Level students"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex h-14 items-center justify-center">
                  <Image
                    src="/alevel.png"
                    alt="A Levels"
                    width={150}
                    height={60}
                    className="h-auto max-h-12 w-auto object-contain"
                  />
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Advanced subject-focused learning for serious students
                  preparing for university and high-level performance.
                </p>
                <div className="mt-5 text-sm font-semibold text-amber-700">
                  Explore A Levels →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquiry" className="py-16 lg:py-24">
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
              pathway for your child.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 grid gap-5 md:grid-cols-2">
              <input
                placeholder="Parent Name"
                value={form.parent_name}
                onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white"
              />

              <input
                placeholder="Student Name"
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white"
              />

              <input
                placeholder="Phone (+254...)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white"
              />

              <select
                value={form.curriculum}
                onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white md:col-span-2"
              >
                <option value="">Select Curriculum</option>
                <option>Cambridge</option>
                <option>Edexcel</option>
                <option>IB</option>
                <option>A Levels</option>
              </select>

              <textarea
                placeholder="Tell us what you need..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white md:col-span-2"
                rows={5}
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white py-3 font-semibold text-slate-900"
                >
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </button>
              </div>

              {success && (
                <p className="text-green-300 md:col-span-2">
                  Enquiry submitted successfully.
                </p>
              )}
            </form>

            <div className="mt-6 text-sm text-slate-300">
              Or WhatsApp us directly:{" "}
              <a
                href="https://wa.me/254728866097"
                className="font-semibold text-white"
              >
                +254 728 866 097
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}