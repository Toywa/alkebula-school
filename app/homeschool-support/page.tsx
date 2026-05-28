import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online Homeschool Support for International Curriculum Learners",
  description:
    "Premium online homeschool support for Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB learners. Structured tutoring, academic accountability, and measurable progress.",
  alternates: {
    canonical: "/homeschool-support",
  },
};

export default function HomeschoolSupportPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Homeschool Support
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            Online Homeschool Support for International Curriculum Learners
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Alkebula School supports homeschooling families following
            Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB pathways. We help
            learners stay structured, close learning gaps, strengthen subject
            mastery, and move forward with measurable academic progress.
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
            <h2 className="text-xl font-bold">Structured Academic Support</h2>
            <p className="mt-3 text-slate-600">
              Homeschooling works best when learners have rhythm, accountability,
              expert guidance, and clear academic targets.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">International Curriculum Focus</h2>
            <p className="mt-3 text-slate-600">
              We support Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB
              learners. We do not offer CBC support.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-xl font-bold">Progress Parents Can Track</h2>
            <p className="mt-3 text-slate-600">
              Our tutoring system is designed to help parents see progress,
              understand learning gaps, and support better academic planning.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Who This Homeschool Support Is For
            </h2>

            <ul className="mt-6 space-y-4 text-slate-600">
              <li>• Families homeschooling through Cambridge IGCSE</li>
              <li>• Families using the Edexcel IGCSE pathway</li>
              <li>• A Level learners who need structured subject support</li>
              <li>• IB students who need deeper academic guidance</li>
              <li>• Parents seeking accountability and measurable progress</li>
              <li>• Learners who need help closing subject gaps</li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-slate-50 p-8">
            <h2 className="text-3xl font-bold">Curricula We Support</h2>

            <p className="mt-4 text-slate-600">
              The Alkebula School focuses on international education pathways
              only.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <span className="rounded-xl bg-white p-3">Cambridge IGCSE</span>
              <span className="rounded-xl bg-white p-3">Edexcel IGCSE</span>
              <span className="rounded-xl bg-white p-3">A Levels</span>
              <span className="rounded-xl bg-white p-3">IB</span>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Alkebula does not offer CBC tutoring. Our focus is international
              curricula with structured online academic support.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
        <div className="rounded-3xl border bg-white p-8">
          <h2 className="text-3xl font-bold">
            Why Homeschooling Families Choose Structured Support
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <p className="text-slate-600">
              Homeschooling gives families flexibility, but learners still need
              subject expertise, academic rhythm, and honest feedback. Without
              structure, small gaps can grow quietly until exams are near.
            </p>

            <p className="text-slate-600">
              Alkebula helps families bring structure into the learning journey
              through tutor-led support, curriculum awareness, lesson records,
              and a system built around steady academic improvement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold">
            Homeschooling should feel structured, supported, and academically
            purposeful.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Give your learner expert support across international curricula and
            build a clearer path toward measurable progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Find a Tutor
            </Link>

            <Link
              href="/online-cambridge-igcse-tutors"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cambridge IGCSE Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}