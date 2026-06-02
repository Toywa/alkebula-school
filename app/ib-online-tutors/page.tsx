import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IB Online Tutors",
  description:
    "Find expert IB online tutors at The Alkebula School. Structured online tutoring for International Baccalaureate learners who need stronger subject mastery, confidence, and measurable academic progress.",
  alternates: {
    canonical: "/ib-online-tutors",
  },
};

export default function IBOnlineTutorsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-amber-100 bg-gradient-to-b from-[#fffdf8] to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              IB Online Tutoring
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              IB Online Tutors for Structured, Confident Academic Progress
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The Alkebula School provides structured online IB tutoring for
              International Baccalaureate learners who need deeper understanding,
              stronger academic discipline, and clear subject support.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/educators"
                className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-700"
              >
                Find an IB Tutor
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Parent Sign Up
              </Link>

              <Link
                href="/homeschool-support"
                className="rounded-xl px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-white"
              >
                Homeschool Support
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-slate-600">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                IB Mathematics
              </span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                IB Sciences
              </span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                IB Humanities
              </span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-amber-100">
                Online Support
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              IB-Focused Academic Support
            </h2>
            <p className="mt-3 text-slate-600">
              IB learners need more than content coverage. They need structure,
              reasoning, reflection, and confidence across a demanding academic
              programme.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Deeper Conceptual Understanding
            </h2>
            <p className="mt-3 text-slate-600">
              Our tutors help learners understand ideas deeply, organize their
              thinking, and communicate answers clearly across IB subjects.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Flexible Online Learning
            </h2>
            <p className="mt-3 text-slate-600">
              Students can access structured IB support online, whether they are
              learning from Kenya, the UK, Europe, the Middle East, or elsewhere.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-amber-100 bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                Who We Support
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Online IB tutoring for learners who need clarity and structure.
              </h2>

              <ul className="mt-6 space-y-4 text-slate-600">
                <li>• Students taking the International Baccalaureate</li>
                <li>• Learners who need stronger subject foundations</li>
                <li>• Students preparing for internal and final assessments</li>
                <li>• Families seeking structured academic accountability</li>
                <li>• Homeschooling or internationally mobile IB learners</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-slate-950">
                IB Areas We Support
              </h2>

              <p className="mt-4 text-slate-600">
                Subject availability depends on approved tutor profiles and
                current scheduling availability.
              </p>

              <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
                <span className="rounded-xl bg-slate-50 p-3">Mathematics</span>
                <span className="rounded-xl bg-slate-50 p-3">Biology</span>
                <span className="rounded-xl bg-slate-50 p-3">Chemistry</span>
                <span className="rounded-xl bg-slate-50 p-3">Physics</span>
                <span className="rounded-xl bg-slate-50 p-3">Economics</span>
                <span className="rounded-xl bg-slate-50 p-3">
                  Business Management
                </span>
                <span className="rounded-xl bg-slate-50 p-3">Geography</span>
                <span className="rounded-xl bg-slate-50 p-3">English</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-slate-50 p-8 text-center shadow-sm lg:p-12">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold text-slate-950 md:text-5xl">
              Give your IB learner structured support for deeper mastery.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-600">
              Start with a parent account, explore approved educators, and build
              a clearer path toward measurable academic progress.
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
        </div>
      </section>
    </main>
  );
}