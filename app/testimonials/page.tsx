import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Parent Testimonials | The Alkebula School",
  description:
    "Read anonymous parent testimonials from families using The Alkebula School for international online tutoring, exam revision, homeschool support, Cambridge IGCSE, Edexcel IGCSE, A Levels and IB support.",
  alternates: {
    canonical: "/testimonials",
  },
};

const testimonials = [
  {
    name: "Parent of Cambridge IGCSE learner",
    location: "Runda, Nairobi",
    region: "Kenya",
    focus: "Cambridge IGCSE Mathematics",
    quote:
      "The tutor brought structure and calm into our child’s study routine. Difficult topics became easier to approach, and our child became more confident after every lesson.",
  },
  {
    name: "Parent of Edexcel IGCSE Sciences Student",
    location: "Karen, Nairobi",
    region: "Kenya",
    focus: "Edexcel IGCSE Sciences",
    quote:
      "We were done with physical tutors who ran late or missed lessons entirely. For Edexcel IGCSE Sciences, we needed serious academic support. The Alkebula School delivered — organised, professional, and focused on real understanding.",
  },
  {
    name: "Parent of A Level learner",
    location: "Muthaiga, Nairobi",
    region: "Kenya",
    focus: "A Level Revision",
    quote:
      "The tutor quickly identified the learning gaps and helped our child approach questions with better structure, confidence, and exam technique.",
  },
  {
    name: "Parent of IB learner",
    location: "Manhattan, New York",
    region: "United States",
    focus: "IB Academic Support",
    quote:
      "The support was thoughtful and well structured. The tutor understood the pressure of international curriculum learning and helped our child organise complex ideas more clearly.",
  },
  {
    name: "Parent of IGCSE learner",
    location: "Brooklyn Heights, New York",
    region: "United States",
    focus: "Exam Preparation",
    quote:
      "The lessons were focused around weak areas and past-paper practice. We saw stronger concentration, better confidence, and a clearer revision plan.",
  },
  {
    name: "Parent of Cambridge learner",
    location: "Kensington, London",
    region: "United Kingdom",
    focus: "Cambridge IGCSE English",
    quote:
      "We transferred to London mid-year and worried about disruption to Cambridge IGCSE English. The Alkebula School made it seamless. Lessons are calm, professional, and well-paced. Most importantly, our son feels listened to and always comes away with a practical plan to improve his written work.",
  },
  {
    name: "Homeschool parent",
    location: "Dubai Marina, Dubai",
    region: "United Arab Emirates",
    focus: "International Homeschooling",
    quote:
      "The tutor understood what an international homeschooling family needs: clarity, structure, consistency, and respectful support across time zones.",
  },
  {
    name: "Parent of IB learner",
    location: "West Bay, Doha",
    region: "Qatar",
    focus: "IB Support",
    quote:
      "We appreciated the professionalism and the international outlook. The tutor helped simplify difficult work and gave our child a stronger learning rhythm.",
  },
  {
    name: "Parent of Edexcel learner",
    location: "Sandton, Johannesburg",
    region: "South Africa",
    focus: "Edexcel IGCSE Support",
    quote:
      "The support felt premium and personal. The tutor was prepared, patient, and serious about helping our child improve.",
  },
  {
    name: "Parent of IB learner",
    location: "Kololo, Kampala",
    region: "Uganda",
    focus: "IB Support",
    quote:
      "IB tutors who grasp the programme’s demands are rare in Kampala. Alkebula delivered. The lessons are structured, purposeful, and explained with patience. Our child is more organised, more confident, and finally in control of the syllabus.",
  },
  {
    name: "Parent of homeschool learner",
    location: "Masaki, Dar es Salaam",
    region: "Tanzania",
    focus: "Homeschool Structure",
    quote:
      "The support gave our homeschool programme more direction. It helped us maintain a steady weekly rhythm and gave our child clearer academic expectations.",
  },
  {
    name: "Parent of IGCSE learner",
    location: "Bole, Addis Ababa",
    region: "Ethiopia",
    focus: "Learning Gap Support",
    quote:
      "The tutor first understood where our child was struggling, then guided the lesson step by step. That careful approach made a real difference.",
  },
];

const highlights = [
  "Anonymous parent stories",
  "International curriculum focus",
  "Exam preparation support",
  "Homeschool structure",
  "Regional and global families",
  "Professional tutor guidance",
];

const trustPillars = [
  {
    title: "Discreet by Design",
    description:
      "We protect family privacy by sharing testimonials anonymously, without student names or identifying school details.",
  },
  {
    title: "Rooted in Real Learning Needs",
    description:
      "The stories reflect familiar concerns: learning gaps, exam pressure, homeschool structure, tutor reliability and confidence.",
  },
  {
    title: "International and Personal",
    description:
      "Families use Alkebula from different cities and time zones, but the support remains personal, structured and student-focused.",
  },
];

const supportThemes = [
  "Prepared and professional tutors",
  "Clear communication with families",
  "Support for learning gaps",
  "Better confidence before exams",
  "Homeschool structure and accountability",
  "International curriculum understanding",
  "Past-paper discipline",
  "Time-zone aware online support",
];

const groupedTestimonials = [
  {
    title: "Kenya and International-School Families",
    description:
      "For families connected to international-school environments who need structured academic support beyond the normal school day.",
    items: testimonials.filter((item) => item.region === "Kenya"),
  },
  {
    title: "Regional African Families",
    description:
      "For learners across the region who want access to experienced international-curriculum tutors online.",
    items: testimonials.filter((item) =>
      ["Uganda", "Tanzania", "Ethiopia", "South Africa"].includes(item.region)
    ),
  },
  {
    title: "Global Families",
    description:
      "For internationally mobile families, homeschool learners and students preparing for recognised global pathways.",
    items: testimonials.filter((item) =>
      ["United States", "United Kingdom", "United Arab Emirates", "Qatar"].includes(
        item.region
      )
    ),
  },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#071A2F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,31,54,0.62),transparent_28%),radial-gradient(circle_at_top_right,rgba(55,156,214,0.46),transparent_32%),linear-gradient(135deg,#071A2F,#0F2744_48%,#071A2F)]" />
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#379CD6]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#BFEAFF] shadow-sm backdrop-blur">
                Parent Testimonials
              </p>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[3rem]">
                Trusted by families preparing for serious international learning.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
                Families come to The Alkebula School when they need more than
                casual tutoring: structure, confidence, exam readiness,
                homeschool rhythm and strong academic guidance.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                These stories reflect learners in international-school,
                homeschool and private-candidate pathways across Kenya, the
                region and global cities.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/get-matched"
                  className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
                >
                  Get Matched With a Tutor
                </Link>

                <Link
                  href="/exam-revision"
                  className="rounded-xl border border-white/20 bg-white px-6 py-3 text-sm font-bold text-[#071A2F] shadow-sm transition hover:bg-[#EEF9FF]"
                >
                  View Revision Pages
                </Link>

                <Link
                  href="/educators"
                  className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Browse Tutors
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-100">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-2"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#BFEAFF]">
                What parents repeatedly value
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Structure", "Clear learning rhythm"],
                  ["Confidence", "Calmer exam preparation"],
                  ["Quality", "Prepared tutors"],
                  ["Access", "Support across time zones"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4"
                  >
                    <p className="text-lg font-bold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm leading-7 text-slate-100">
                  We keep testimonials anonymous and privacy-conscious. The goal
                  is to share the learning experience without exposing students,
                  families or schools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              What Parents Say
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Calm, structured support for real academic pressure.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Parents often come to Alkebula because something needs to change:
              a difficult subject, exam pressure, unreliable tutoring, a
              disrupted school move, or a homeschool programme that needs more
              rhythm.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={`${item.name}-${item.location}-${item.focus}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#379CD6]/30 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#F7FCFF] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#156B96] ring-1 ring-[#379CD6]/15">
                    {item.focus}
                  </span>

                  <span className="rounded-full bg-[#FFF5F7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8F1F36] ring-1 ring-[#8F1F36]/10">
                    {item.region}
                  </span>
                </div>

                <p className="mt-6 text-base leading-8 text-slate-700">
                  “{item.quote}”
                </p>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="font-bold text-slate-950">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#8F1F36]">
                    {item.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7FCFF] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {trustPillars.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
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
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
                A Personal but Global Platform
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Different cities, similar academic concerns.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Whether a learner is in an international-school environment, a
                homeschool setting, a private-candidate pathway or a globally
                mobile family, the need is often the same: reliable support,
                strong tutors, clear planning and steady progress.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/get-matched"
                  className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
                >
                  Request Tutor Matching
                </Link>

                <Link
                  href="/about"
                  className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-5 py-3 text-sm font-bold text-[#156B96] hover:bg-[#EEF9FF]"
                >
                  About Alkebula
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              {groupedTestimonials.map((group) => (
                <div
                  key={group.title}
                  className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-950">
                    {group.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {group.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={`${group.title}-${item.location}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                      >
                        {item.location}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FCFF] py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              Why Parents Trust Alkebula
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Professional tutoring with structure and clarity.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Choosing an online tutor is a trust decision. Alkebula is designed
              to give parents confidence through approved tutors, clear academic
              pathways, timezone-aware booking and structured learning support.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {supportThemes.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-bold leading-7 text-slate-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071A2F] px-6 py-12 text-white lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#BFEAFF]">
              Start With Alkebula
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Give your learner structured, professional academic support.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              Create a parent account, explore approved tutors, or request a
              match so the right academic support can be aligned to your child’s
              curriculum, subject and exam goals.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/get-matched"
              className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
            >
              Get Matched With a Tutor
            </Link>

            <Link
              href="/educators"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-6 py-3 text-sm font-bold text-[#071A2F] shadow-sm transition hover:bg-[#EEF9FF]"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}