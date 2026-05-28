import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A Level Online Tutors",
  description:
    "Expert A Level online tutoring for students preparing for Cambridge, Edexcel, and international A Level examinations with structured academic support.",
  alternates: {
    canonical: "/a-level-online-tutors",
  },
};

export default function ALevelOnlineTutorsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            A Level Online Tutoring
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            A Level Online Tutors for Deeper Mastery and Exam Confidence
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Alkebula School provides structured online A Level tutoring for
            students who need expert subject guidance, stronger analytical
            skills, and focused preparation for demanding international exams.
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
            <h2 className="text-xl font-bold">Advanced Subject Support</h2>
            <p className="mt-3 text-slate-600">
              A Level requires deeper reasoning, stronger subject command, and
              careful exam preparation. Our tutors help learners build that
              higher-level confidence.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Exam-Focused Preparation</h2>
            <p className="mt-3 text-slate-600">
              Lessons focus on understanding concepts, applying knowledge, and
              improving written, numerical, and analytical exam responses.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Global Online Access</h2>
            <p className="mt-3 text-slate-600">
              Students can access structured A Level support from anywhere,
              whether learning from Kenya, the UK, Europe, the Middle East, or
              beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Who Our A Level Tutoring Is For
            </h2>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Students preparing for A Level examinations</li>
              <li>• Learners struggling with advanced subject concepts</li>
              <li>• Students targeting stronger university entry grades</li>
              <li>• Homeschooling families following A Level pathways</li>
              <li>• Learners needing structured revision and accountability</li>
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
              <span className="rounded-xl bg-white p-3">Further Mathematics</span>
              <span className="rounded-xl bg-white p-3">Physics</span>
              <span className="rounded-xl bg-white p-3">Chemistry</span>
              <span className="rounded-xl bg-white p-3">Biology</span>
              <span className="rounded-xl bg-white p-3">Economics</span>
              <span className="rounded-xl bg-white p-3">Business</span>
              <span className="rounded-xl bg-white p-3">Geography</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold">
            A Level success needs structure, depth, and expert academic guidance.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Give your learner the support they need to master advanced concepts
            and prepare with confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Find an A Level Tutor
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