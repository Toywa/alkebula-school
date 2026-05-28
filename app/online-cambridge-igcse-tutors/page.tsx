import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online Cambridge IGCSE Tutors",
  description:
    "Find expert online Cambridge IGCSE tutors at The Alkebula School. Structured tutoring for Mathematics, Sciences, English, Business, Humanities, and more.",
  alternates: {
    canonical: "/online-cambridge-igcse-tutors",
  },
};

export default function OnlineCambridgeIGCSETutorsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Cambridge IGCSE Online Tutoring
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            Online Cambridge IGCSE Tutors for Focused, Measurable Progress
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Alkebula School provides structured online Cambridge IGCSE
            tutoring for learners who need stronger understanding, better exam
            technique, and consistent academic support. Our approach helps
            students close learning gaps, strengthen mastery, and prepare with
            confidence.
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
            <h2 className="text-xl font-bold">Cambridge-Focused Support</h2>
            <p className="mt-3 text-slate-600">
              Lessons are aligned to Cambridge IGCSE expectations, helping
              learners build subject knowledge, exam confidence, and proper
              question-handling technique.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Structured Learning</h2>
            <p className="mt-3 text-slate-600">
              Tutors focus on identifying weak areas, rebuilding foundations,
              and guiding learners through a clear path of improvement.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Global Online Access</h2>
            <p className="mt-3 text-slate-600">
              Students can learn from anywhere, whether they are in Kenya, the
              UK, the Middle East, Europe, or other international locations.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Who This Cambridge IGCSE Tutoring Is For
            </h2>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Students preparing for Cambridge IGCSE examinations</li>
              <li>• Homeschooling families using the Cambridge pathway</li>
              <li>• Learners who need support in difficult subjects</li>
              <li>• Students who are doing well but want higher grades</li>
              <li>• Families seeking structured academic accountability</li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-slate-50 p-8">
            <h2 className="text-3xl font-bold">Subjects We Support</h2>

            <p className="mt-4 text-slate-600">
              The Alkebula School supports a wide range of Cambridge IGCSE
              subjects depending on tutor availability.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <span className="rounded-xl bg-white p-3">Mathematics</span>
              <span className="rounded-xl bg-white p-3">English</span>
              <span className="rounded-xl bg-white p-3">Biology</span>
              <span className="rounded-xl bg-white p-3">Chemistry</span>
              <span className="rounded-xl bg-white p-3">Physics</span>
              <span className="rounded-xl bg-white p-3">Business Studies</span>
              <span className="rounded-xl bg-white p-3">Economics</span>
              <span className="rounded-xl bg-white p-3">Geography</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold">
            Give your Cambridge IGCSE learner the structure, clarity, and expert
            support they need.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Start with the right tutor, the right learning plan, and a system
            built around measurable academic progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Find a Cambridge IGCSE Tutor
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