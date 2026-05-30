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

const supportCards = [
  {
    title: "Structured Academic Support",
    description:
      "Homeschooling works best when learners have rhythm, accountability, expert guidance, and clear academic targets.",
  },
  {
    title: "International Curriculum Focus",
    description:
      "We support Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB learners. We do not offer CBC support.",
  },
  {
    title: "Progress Parents Can Track",
    description:
      "Our tutoring system helps parents see progress, understand learning gaps, and support better academic planning.",
  },
];

const audienceItems = [
  "Families homeschooling through Cambridge IGCSE",
  "Families using the Edexcel IGCSE pathway",
  "A Level learners who need structured subject support",
  "IB students who need deeper academic guidance",
  "Parents seeking accountability and measurable progress",
  "Learners who need help closing subject gaps",
];

const curricula = ["Cambridge IGCSE", "Edexcel IGCSE", "A Levels", "IB"];

export default function HomeschoolSupportPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Homeschool Support
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Online homeschool support for international curriculum learners.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The Alkebula School supports homeschooling families following
              Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB pathways. We help
              learners stay structured, close learning gaps, strengthen subject
              mastery, and move forward with measurable academic progress.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/educators"
                className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                View Tutors
              </Link>

              <Link
                href="/parent/bookings"
                className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
              >
                Book a Lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 lg:grid-cols-3 lg:px-8">
          {supportCards.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#379CD6]/15 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF9FF] text-lg font-black text-[#156B96]">
                ✓
              </div>

              <h2 className="text-xl font-bold text-slate-950">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Who It Is For
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Built for families who want freedom with academic structure.
            </h2>

            <ul className="mt-8 grid gap-4 text-slate-600">
              {audienceItems.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold shadow-sm"
                >
                  <span className="mr-3 text-[#379CD6]">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Curriculum Focus
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950">
              International education pathways only.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              The Alkebula School focuses on international education pathways
              only, giving families targeted support rather than generalised
              tutoring.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              {curricula.map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-[#379CD6]/15 bg-[#F7FCFF] p-3 text-[#156B96]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#379CD6]/20 bg-[#F7FCFF] p-4 text-sm font-semibold leading-7 text-[#156B96]">
              Alkebula does not offer CBC tutoring. Our focus is international
              curricula with structured online academic support.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-8 shadow-sm lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Why Structure Matters
          </p>

          <h2 className="mt-4 max-w-4xl text-3xl font-bold text-slate-950 sm:text-5xl">
            Why homeschooling families choose structured support.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <p className="text-base leading-8 text-slate-600">
              Homeschooling gives families flexibility, but learners still need
              subject expertise, academic rhythm, and honest feedback. Without
              structure, small gaps can grow quietly until exams are near.
            </p>

            <p className="text-base leading-8 text-slate-600">
              Alkebula helps families bring structure into the learning journey
              through tutor-led support, curriculum awareness, lesson records,
              and a system built around steady academic improvement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#8F1F36] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <h2 className="max-w-4xl text-3xl font-bold sm:text-5xl">
            Homeschooling should feel structured, supported, and academically
            purposeful.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">
            Give your learner expert support across international curricula and
            build a clearer path toward measurable progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-[#EEF9FF]"
            >
              Find a Tutor
            </Link>

            <Link
              href="/online-cambridge-igcse-tutors"
              className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cambridge IGCSE Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}