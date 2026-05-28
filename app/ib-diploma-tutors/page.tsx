import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IB Online Tutors",
  description:
    "Expert online IB tutoring for students taking the International Baccalaureate. Structured support for stronger subject mastery, confidence, and academic progress.",
  alternates: {
    canonical: "/ib-online-tutors",
  },
};

export default function IBOnlineTutorsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            IB Online Tutoring
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            IB Online Tutors for Structured, Confident Academic Progress
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Alkebula School provides structured online IB tutoring for
            learners who need deeper understanding, stronger academic discipline,
            and clear support across demanding International Baccalaureate
            subjects.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Tutors
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Parent Sign Up
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">IB-Focused Support</h2>
            <p className="mt-3 text-slate-600">
              IB learners need more than content coverage. They need structure,
              reasoning, reflection, and confidence across a demanding academic
              programme.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Conceptual Understanding</h2>
            <p className="mt-3 text-slate-600">
              Our tutoring approach helps students understand ideas deeply,
              organize their thinking, and communicate their answers clearly.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Global Online Access</h2>
            <p className="mt-3 text-slate-600">
              Students can access IB tutoring from anywhere, with flexible online
              support for international families and homeschooling learners.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Who Our IB Tutoring Is For
            </h2>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Students taking the International Baccalaureate</li>
              <li>• Learners who need stronger subject foundations</li>
              <li>• Students working toward improved internal and final results</li>
              <li>• Families seeking structured academic accountability</li>
              <li>• Learners who need confidence in complex IB subjects</li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-slate-50 p-8">
            <h2 className="text-3xl font-bold">IB Areas We Support</h2>

            <p className="mt-4 text-slate-600">
              Subject availability depends on approved tutor profiles and
              current scheduling availability.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <span className="rounded-xl bg-white p-3">Mathematics</span>
              <span className="rounded-xl bg-white p-3">Biology</span>
              <span className="rounded-xl bg-white p-3">Chemistry</span>
              <span className="rounded-xl bg-white p-3">Physics</span>
              <span className="rounded-xl bg-white p-3">Economics</span>
              <span className="rounded-xl bg-white p-3">
                Business Management
              </span>
              <span className="rounded-xl bg-white p-3">Geography</span>
              <span className="rounded-xl bg-white p-3">English</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold">
            IB learning demands depth, structure, and consistent support.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Give your learner a stronger path forward with expert online IB
            tutoring designed for measurable progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Find an IB Tutor
            </Link>

            <Link
              href="/tutors/apply"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Apply as a Tutor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}