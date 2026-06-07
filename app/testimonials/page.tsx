import Link from "next/link";

const testimonials = [
  {
    name: "Parent of Cambridge IGCSE learner",
    location: "Runda, Nairobi",
    focus: "Cambridge IGCSE Mathematics",
    quote:
      "The tutor brought structure and calm into our child’s study routine. Difficult topics became easier to approach, and our child became more confident after every lesson.",
  },
  {
    name: "Parent of Edexcel IGCSE Sciences Student",
    location: "Karen, Nairobi",
    focus: "Edexcel IGCSE Sciences",
    quote:
      "We were done with physical tutors who ran late or missed lessons entirely. For Edexcel IGCSE Sciences, we needed serious academic support. The Alkebula School delivered — organized, professional, and relentlessly focused on real understanding.",
  },
  {
    name: "Parent of A Level learner",
    location: "Muthaiga, Nairobi",
    focus: "A Level Revision",
    quote:
      "The tutor quickly identified the learning gaps and helped our child approach questions with better structure, confidence, and exam technique.",
  },
  {
    name: "Parent of IB learner",
    location: "Manhattan, New York",
    focus: "IB Academic Support",
    quote:
      "The support was thoughtful and well structured. The tutor understood the pressure of international curriculum learning and helped our child organise complex ideas more clearly.",
  },
  {
    name: "Parent of IGCSE learner",
    location: "Brooklyn Heights, New York",
    focus: "Exam Preparation",
    quote:
      "The lessons were focused around weak areas and past-paper practice. We saw stronger concentration, better confidence, and a clearer revision plan.",
  },
  {
    name: "Parent of Cambridge Learner",
    location: "Kensington, London",
    focus: "Cambridge IGCSE English",
    quote:
      "We transferred to London mid-year and worried about disruption to Cambridge IGCSE English. The Alkebula School made it seamless. Lessons are calm, professional, and well-paced. Most importantly, our son feels listened to and always comes away with a practical plan to elevate his written work.",
  },
  {
    name: "Homeschool parent",
    location: "Dubai Marina, Dubai",
    focus: "International Homeschooling",
    quote:
      "The tutor understood what an international homeschooling family needs: clarity, structure, consistency, and respectful support across time zones.",
  },
  {
    name: "Parent of IB learner",
    location: "West Bay, Doha",
    focus: "IB Support",
    quote:
      "We appreciated the professionalism and the international outlook. The tutor helped simplify difficult work and gave our child a stronger learning rhythm.",
  },
  {
    name: "Parent of Edexcel learner",
    location: "Sandton, Johannesburg",
    focus: "Edexcel IGCSE Support",
    quote:
      "The support felt premium and personal. The tutor was prepared, patient, and serious about helping our child improve.",
  },
  {
    name: "Parent of IB Learner",
    location: "Kololo, Kampala",
    focus: "IB Support",
    quote:
      "IB tutors who grasp the program’s demands are rare in Kampala. Alkebula delivered. The lessons are structured, purposeful, and explained with patience. Our child is more organized, more confident, and finally in control of the syllabus.",
  },
  {
    name: "Parent of homeschool learner",
    location: "Masaki, Dar es Salaam",
    focus: "Homeschool Structure",
    quote:
      "The support gave our homeschool programme more direction. It helped us maintain a steady weekly rhythm and gave our child clearer academic expectations.",
  },
  {
    name: "Parent of IGCSE learner",
    location: "Bole, Addis Ababa",
    focus: "Learning Gap Support",
    quote:
      "The tutor first understood where our child was struggling, then guided the lesson step by step. That careful approach made a real difference.",
  },
];

const highlights = [
  "Structured online lessons",
  "International curriculum focus",
  "Professional tutor support",
  "Exam preparation guidance",
  "Homeschool learning structure",
  "Timezone-aware booking",
];

export const metadata = {
  title: "Testimonials | The Alkebula School",
  description:
    "Parent testimonials and learner success stories from families using The Alkebula School for international online tutoring support.",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Parent Testimonials
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Trusted by international families worldwide.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              The Alkebula School is the first choice for discerning families
              seeking calm, expert online tutoring. Each program is structured,
              personalized, and aligned with leading international curricula to
              deliver measurable progress and guaranteed results — from exam
              success to seamless homeschool support, all with unmatched
              professionalism and care.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-7 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                Create Parent Account
              </Link>

              <Link
                href="/educators"
                className="inline-flex items-center justify-center rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-7 py-4 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
              >
                View Tutors
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-slate-600">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              What Parents Say About The Alkebula School
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
              Your privacy, our priority.
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              We honor the trust you place in us. Every testimonial is carefully
              curated and shared anonymously — no names, no identifying details.
              Only exceptional results, presented with discretion and
              professionalism.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={`${item.name}-${item.location}-${item.focus}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#379CD6]/30 hover:shadow-lg"
              >
                <div className="rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#156B96]">
                    {item.focus}
                  </p>
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

      <section className="bg-[#F7FCFF] py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Why Parents Trust Alkebula
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Professional tutoring with structure and clarity.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Choosing an online tutor is a trust decision. Alkebula is designed
              to give parents confidence through approved tutors, clear subject
              packages, timezone-aware booking, and structured learning support.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Prepared and professional tutors",
              "Clear communication with families",
              "Support for learning gaps",
              "Better confidence before exams",
              "Homeschool structure and accountability",
              "International curriculum understanding",
            ].map((item) => (
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

      <section className="bg-white px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-8 text-center shadow-sm lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Start With Alkebula
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
            Give your learner structured, professional academic support.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Create a parent account, explore approved tutors, or send an enquiry
            so the right academic support can be matched to your child.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-[#8F1F36] px-7 py-4 text-sm font-bold text-white hover:bg-[#6F1729]"
            >
              Parent Sign Up
            </Link>

            <Link
              href="/educators"
              className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-7 py-4 text-sm font-semibold text-[#156B96] hover:bg-[#EEF9FF]"
            >
              View Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
