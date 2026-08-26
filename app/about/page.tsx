import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AudienceReachSection from "@/components/AudienceReachSection";

export const metadata: Metadata = {
  title: "About The Alkebula School | Premium Online International Tutoring",
  description:
    "Learn about The Alkebula School, a premium online international learning platform supporting international-curriculum learners with Cambridge IGCSE, Edexcel IGCSE, Cambridge A Levels, Edexcel International A Levels, IB Diploma, Cambridge Checkpoint, Common Entrance and homeschool support.",
  alternates: {
    canonical: "/about",
  },
};

const highlights = [
  {
    title: "International-School Support",
    description:
      "Built for learners in international-school environments who need stronger academic support online or locally where available.",
  },
  {
    title: "Regional and Global Reach",
    description:
      "Supporting families across different cities, countries and time zones through flexible online tutoring.",
  },
  {
    title: "Approved Educators",
    description:
      "Learners are supported by carefully reviewed tutors with subject knowledge, teaching experience and professional expectations.",
  },
  {
    title: "Exam-Ready Structure",
    description:
      "Lessons are built around syllabus gaps, past-paper practice, revision planning, exam technique and measurable progress.",
  },
];

const values = [
  {
    title: "Specific Support",
    description:
      "We support real learners in real contexts — international-school students, homeschool learners, private candidates and global families.",
  },
  {
    title: "Structure Before Panic",
    description:
      "We believe serious learning improves when students have a clear rhythm, a revision plan and consistent academic accountability.",
  },
  {
    title: "Tutor Quality Matters",
    description:
      "A good tutor does more than explain. They diagnose gaps, guide practice, build confidence and help the learner think clearly.",
  },
];

const systems = [
  "Secure online teaching environment",
  "Structured lesson booking",
  "Parent-friendly communication",
  "Tutor availability management",
  "Professional tutor onboarding",
  "Exam-series revision support",
  "Homeschool support pathways",
  "Progress-focused academic planning",
];

const curricula = [
  {
    label: "Cambridge IGCSE",
    href: "/exam-revision/cambridge-igcse-november-2026",
  },
  {
    label: "Edexcel IGCSE",
    href: "/exam-revision/edexcel-igcse-november-2026",
  },
  {
    label: "Cambridge AS & A Levels",
    href: "/exam-revision/cambridge-a-level-november-2026",
  },
  {
    label: "Edexcel International A Levels",
    href: "/exam-revision/edexcel-ial-october-2026",
  },
  {
    label: "IB Diploma Programme",
    href: "/exam-revision/ib-diploma-november-2026",
  },
  {
    label: "Cambridge Checkpoint",
    href: "/exam-revision/cambridge-checkpoint-october-2026",
  },
  {
    label: "Common Entrance",
    href: "/get-matched",
  },
  {
    label: "Homeschool Support",
    href: "/homeschool-support",
  },
];

const impactStats = [
  { label: "Current Priority", value: "Oct/Nov 2026" },
  { label: "Approved Tutors", value: "41+" },
  { label: "Delivery", value: "Online" },
  { label: "Reach", value: "Global" },
];

const examFocus = [
  {
    title: "October/November 2026 Revision",
    description:
      "Immediate support for Cambridge IGCSE, Edexcel IGCSE, Cambridge AS & A Level, Edexcel IAL, IB Diploma and Cambridge Checkpoint learners.",
    href: "/exam-revision",
  },
  {
    title: "January 2027 Preparation",
    description:
      "Early revision and resit planning for students preparing for the next Pearson Edexcel International A Level window.",
    href: "/exam-revision/edexcel-ial-january-2027",
  },
  {
    title: "May/June 2027 Planning",
    description:
      "Longer-term syllabus coverage, subject mastery and exam preparation for families planning ahead.",
    href: "/exam-revision/may-june-2027",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#071A2F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,31,54,0.6),transparent_28%),radial-gradient(circle_at_top_right,rgba(55,156,214,0.45),transparent_34%),linear-gradient(135deg,#071A2F,#0F2744_48%,#071A2F)]" />
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#379CD6]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#BFEAFF] shadow-sm backdrop-blur">
                About The Alkebula School
              </p>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[3rem]">
                Premium tutoring for international-curriculum learners
                worldwide.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
                The Alkebula School is a premium online international learning
                platform built for learners who need structured academic support,
                serious revision planning and access to experienced tutors.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                We support Cambridge IGCSE, Edexcel IGCSE, Cambridge AS & A
                Levels, Edexcel International A Levels, IB Diploma, Cambridge
                Checkpoint, Common Entrance and homeschool pathways.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/exam-revision"
                  className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
                >
                  View Revision Hub
                </Link>

                <Link
                  href="/get-matched"
                  className="rounded-xl border border-white/20 bg-white px-6 py-3 text-sm font-bold text-[#071A2F] shadow-sm transition hover:bg-[#EEF9FF]"
                >
                  Get Matched
                </Link>

                <Link
                  href="/educators"
                  className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Find Tutors
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {impactStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur"
                  >
                    <p className="text-xl font-bold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="mb-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-2xl backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#BFEAFF]">
                  Current Priority
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  October/November 2026 revision support
                </p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_35px_90px_rgba(0,0,0,0.32)] backdrop-blur">
                <div className="relative overflow-hidden rounded-[1.5rem] bg-[#EEF4F8]">
                  <Image
                    src="/alkebula-hero.jpg"
                    alt="Premium online international tutoring"
                    width={1672}
                    height={941}
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="h-[300px] w-full object-cover object-center sm:h-[350px] lg:h-[390px]"
                  />

                  <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#071A2F] shadow-sm">
                    Online international tutoring
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[1.6rem] border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#BFEAFF]">
                  Personal, structured and global
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-100">
                  For international-school learners, homeschool families,
                  private candidates and students preparing for recognised global
                  exam pathways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AudienceReachSection />

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

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              Why Alkebula Exists
            </p>

            <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Learning support should feel clear, structured and professionally
              managed.
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
              <p>
                Many families need more than casual tutoring. They need a
                dependable learning structure, strong tutor quality, clear
                communication and a system that helps the learner move forward
                with confidence.
              </p>

              <p>
                The Alkebula School was built to provide that structure. We
                combine experienced tutors, student-focused academic support and
                technology that makes teaching, booking and support easier to
                coordinate.
              </p>

              <p>
                Our work is designed for global families following international
                curricula, including learners who need targeted revision,
                stronger academic rhythm, homeschool support or deeper subject
                mastery.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/70 lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              Our System
            </p>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
              Built to support families and tutors professionally.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Alkebula is not simply a listing site. It is designed as a
              structured online education system with secure teaching, booking,
              tutor management and support workflows.
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
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              What Guides Us
            </p>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Premium education needs care, clarity and fairness.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              We care about students, but we also believe tutors perform best
              when they are managed professionally, treated fairly and supported
              by clear systems.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-950">
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

      <section className="bg-[#F7FCFF] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#156B96]">
                Exam Revision Priority
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Built around the exam windows families are preparing for now.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Our current priority is October/November 2026 revision, followed
                by January 2027 preparation and May/June 2027 planning.
              </p>
            </div>

            <Link
              href="/exam-revision"
              className="inline-flex w-fit rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
            >
              Open Revision Hub
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {examFocus.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#379CD6]/40 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <p className="mt-5 text-sm font-bold text-[#8F1F36]">
                  View page →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-7 shadow-sm lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              Curricula We Support
            </p>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
              International curriculum support for global learners.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Alkebula focuses on international education pathways where
              structure, mastery and examination confidence matter deeply.
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

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm lg:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              For Parents
            </p>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
              Clear support for families who want serious learning progress.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Parents need confidence that their child is supported by capable,
              caring professionals. Alkebula brings together experienced tutors,
              secure online learning, structured booking and responsive support
              to make that experience easier.
            </p>

            <div className="mt-6 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-5">
              <p className="text-sm font-semibold leading-7 text-[#156B96]">
                Our management approach is student-focused, parent-friendly and
                tutor-aware. We aim to protect quality while treating educators
                fairly and professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#8F1F36] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-14">
          <h2 className="max-w-3xl text-2xl font-bold tracking-tight md:text-4xl">
            Build a clearer academic path for your learner.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            Start with approved tutors, secure online teaching, structured
            booking and a premium support system built around measurable
            academic progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/get-matched"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-[#EEF9FF]"
            >
              Get Matched
            </Link>

            <Link
              href="/exam-revision"
              className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Revision Pages
            </Link>

            <Link
              href="/educators"
              className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Find Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}