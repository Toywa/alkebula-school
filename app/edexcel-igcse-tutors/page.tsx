import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online Edexcel IGCSE Tutors",
  description:
    "Expert online Edexcel IGCSE tutoring for students who need structured support, stronger subject mastery, and better exam preparation.",
  alternates: {
    canonical: "/edexcel-igcse-tutors",
  },
};

export default function EdexcelIGCSETutorsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Edexcel IGCSE Online Tutoring
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            Online Edexcel IGCSE Tutors for Confident Exam Preparation
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Alkebula School provides structured online Edexcel IGCSE tutoring
            for learners who need clarity, stronger foundations, and steady
            academic progress. Our tutors help students understand the syllabus,
            improve exam technique, and prepare with confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Tutors
            </Link>

            <Link
              href="/parent/bookings"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Book a Lesson
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Edexcel-Aligned Lessons</h2>
            <p className="mt-3 text-slate-600">
              Tutoring is focused on Edexcel IGCSE expectations, helping learners
              build knowledge, confidence, and examination discipline.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Stronger Subject Mastery</h2>
            <p className="mt-3 text-slate-600">
              We help students identify weak areas, repair gaps, and move
              forward with a clearer understanding of each subject.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Flexible Online Learning</h2>
            <p className="mt-3 text-slate-600">
              Learners can study from anywhere with structured online support
              that fits international families and homeschooling schedules.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Who Our Edexcel IGCSE Tutoring Supports
            </h2>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Students preparing for Edexcel IGCSE examinations</li>
              <li>• Homeschooling families following the Edexcel pathway</li>
              <li>• Learners who need stronger foundations</li>
              <li>• Students targeting higher grades</li>
              <li>• Families seeking structured academic support</li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-slate-50 p-8">
            <h2 className="text-3xl font-bold">Subjects We Support</h2>

            <p className="mt-4 text-slate-600">
              Subject availability depends on approved tutor profiles and
              current scheduling availability.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <span className="rounded-xl bg-white p-3">Mathematics</span>
              <span className="rounded-xl bg-white p-3">English</span>
              <span className="rounded-xl bg-white p-3">Biology</span>
              <span className="rounded-xl bg-white p-3">Chemistry</span>
              <span className="rounded-xl bg-white p-3">Physics</span>
              <span className="rounded-xl bg-white p-3">Business</span>
              <span className="rounded-xl bg-white p-3">Economics</span>
              <span className="rounded-xl bg-white p-3">Geography</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold">
            Help your Edexcel IGCSE learner prepare with structure, clarity, and
            expert support.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            The right tutor can make the learning journey clearer, calmer, and
            more measurable.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Find an Edexcel IGCSE Tutor
            </Link>

            <Link
              href="/apply"
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