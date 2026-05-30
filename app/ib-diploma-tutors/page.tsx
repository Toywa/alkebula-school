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

const supportCards = [
  {
    title: "IB-Focused Support",
    description:
      "IB learners need more than content coverage. They need structure, reasoning, reflection, and confidence across a demanding academic programme.",
  },
  {
    title: "Conceptual Understanding",
    description:
      "Our tutoring approach helps students understand ideas deeply, organize their thinking, and communicate their answers clearly.",
  },
  {
    title: "Global Online Access",
    description:
      "Students can access IB tutoring from anywhere, with flexible online support for international families and homeschooling learners.",
  },
];

const learnerTypes = [
  "Students taking the International Baccalaureate",
  "Learners who need stronger subject foundations",
  "Students working toward improved internal and final results",
  "Families seeking structured academic accountability",
  "Learners who need confidence in complex IB subjects",
];

const ibSubjects = [
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Economics",
  "Business Management",
  "Geography",
  "English",
];

export default function IBOnlineTutorsPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              IB Online Tutoring
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              IB online tutors for structured, confident academic progress.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The Alkebula School provides structured online IB tutoring for
              learners who need deeper understanding, stronger academic
              discipline, and clear support across demanding International
              Baccalaureate subjects.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/educators"
                className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                View Tutors
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
              >
                Parent Sign Up
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
              Built for IB learners who need clarity, depth, and structure.
            </h2>

            <ul className="mt-8 grid gap-4 text-slate-600">
              {learnerTypes.map((item) => (
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
              IB Areas We Support
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950">
              Subject support shaped around tutor availability.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Subject availability depends on approved tutor profiles and
              current scheduling availability.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold sm:grid-cols-2">
              {ibSubjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-xl border border-[#379CD6]/15 bg-[#F7FCFF] p-3 text-[#156B96]"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-8 shadow-sm lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Why IB Support Matters
          </p>

          <h2 className="mt-4 max-w-4xl text-3xl font-bold text-slate-950 sm:text-5xl">
            IB learning demands depth, structure, and consistent support.
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
            Give your learner a stronger path forward with expert online IB
            tutoring designed for better understanding, clearer thinking, and
            measurable academic progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
            >
              Find an IB Tutor
            </Link>

            <Link
              href="/tutors/apply"
              className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
            >
              Apply as a Tutor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}