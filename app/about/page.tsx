import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About The Alkebula School",
  description:
    "Learn about The Alkebula School, a premium global online education system with global tutors, global students, secure online teaching, automated booking, automated support, and highly experienced tutors for Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB learners.",
  alternates: {
    canonical: "/about",
  },
};

const highlights = [
  {
    title: "Global Tutors",
    description:
      "A carefully managed network of experienced tutors supporting learners across locations and time zones.",
  },
  {
    title: "Global Students",
    description:
      "Online academic support designed for internationally minded families, mobile learners, and homeschool pathways.",
  },
  {
    title: "Secure Teaching",
    description:
      "An in-built secure online teaching system designed to make lessons organised, professional, and easier to manage.",
  },
  {
    title: "Automated Booking",
    description:
      "A structured booking system that helps parents, tutors, and the school coordinate lessons more clearly.",
  },
];

const values = [
  {
    title: "Student-Focused Support",
    description:
      "We place the learner’s progress, confidence, and academic needs at the centre of every support decision.",
  },
  {
    title: "Professional Tutor Management",
    description:
      "We manage tutors with fairness, clarity, and strong HR practices so that high standards are balanced with professional respect.",
  },
  {
    title: "Structured Progress",
    description:
      "We believe good learning needs rhythm, accountability, careful follow-up, and a clear academic direction.",
  },
];

const systems = [
  "Secure online teaching environment",
  "Automated lesson booking",
  "Automated support workflows",
  "Parent-friendly communication",
  "Tutor availability management",
  "Professional tutor onboarding",
];

const curricula = [
  {
    label: "Cambridge IGCSE",
    href: "/online-cambridge-igcse-tutors",
  },
  {
    label: "Edexcel IGCSE",
    href: "/edexcel-igcse-tutors",
  },
  {
    label: "A Levels",
    href: "/a-level-online-tutors",
  },
  {
    label: "IB",
    href: "/ib-online-tutors",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              About The Alkebula School
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              A premium global online learning system built around structured
              progress.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The Alkebula School supports ambitious families through global
              tutors, secure online teaching, automated booking, automated
              support, and a professionally managed academic experience for
              international curriculum learners.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/educators"
                className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                Find Tutors
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
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#379CD6]/15 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF9FF] text-lg font-black text-[#156B96]">
                ✓
              </div>

              <h2 className="text-lg font-bold text-slate-950">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Why Alkebula Exists
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Learning support should feel clear, secure, and professionally
              managed.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>
                Many families need more than occasional tutoring. They need a
                dependable learning structure, strong tutor quality, clear
                communication, and a system that helps the learner move forward
                with confidence.
              </p>

              <p>
                The Alkebula School was built to provide that structure. We
                combine highly experienced tutors, caring student-focused
                management, and technology that makes teaching, booking, and
                support easier to coordinate.
              </p>

              <p>
                Our work is designed for global families following Cambridge
                IGCSE, Edexcel IGCSE, A Levels, and IB pathways, including
                learners who need targeted support, stronger academic rhythm, or
                deeper subject mastery.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Our System
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950">
              Built to support families and tutors professionally.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Alkebula is not simply a listing site. It is designed as a
              structured online education system with secure teaching, booking,
              and support workflows.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {systems.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#379CD6]/15 bg-[#F7FCFF] p-3 text-sm font-semibold text-[#156B96]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              What Guides Us
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 md:text-4xl">
              Premium education needs care, clarity, and fairness.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              We care about students, but we also believe tutors perform best
              when they are managed professionally, treated fairly, and supported
              by clear systems.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Curricula We Support
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950">
              International curriculum support for global learners.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Alkebula focuses on international education pathways where
              structure, mastery, and examination confidence matter deeply.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold sm:grid-cols-2">
              {curricula.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-[#379CD6]/15 bg-white p-3 text-[#156B96] transition hover:bg-[#EEF9FF]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              For Parents
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950">
              Clear support for families who want serious learning progress.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Parents need confidence that their child is supported by capable,
              caring professionals. Alkebula brings together experienced tutors,
              secure online learning, structured booking, and responsive support
              to make that experience easier.
            </p>

            <div className="mt-6 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-5">
              <p className="text-sm font-semibold leading-7 text-[#156B96]">
                Our management approach is student-focused, parent-friendly, and
                tutor-aware. We aim to protect quality while treating educators
                fairly and professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#8F1F36] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <h2 className="max-w-3xl text-3xl font-bold md:text-4xl">
            Build a clearer academic path for your learner.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
            Start with global tutors, secure online teaching, automated booking,
            and a premium support system built around measurable academic
            progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-[#EEF9FF]"
            >
              Find Tutors
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Parent Sign Up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}