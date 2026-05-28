import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About The Alkebula School",
  description:
    "Learn about The Alkebula School, a premium global online education system supporting Cambridge IGCSE, Edexcel IGCSE, A Levels, and IB learners with structured, measurable academic support.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    title: "Structured Learning",
    description:
      "We believe learners do better when lessons are clear, organized, and connected to measurable academic goals.",
  },
  {
    title: "Mastery Before Motion",
    description:
      "We focus on understanding first. Progress should not be rushed when important learning gaps still need attention.",
  },
  {
    title: "Parent Confidence",
    description:
      "Parents deserve clarity, professionalism, and a learning system they can trust.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            About The Alkebula School
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
            A Premium Online Education System Built for Measurable Progress
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Alkebula School is designed for families who want more than
            casual tutoring. We provide structured academic support for learners
            following international curricula, helping them close learning gaps,
            strengthen mastery, and move forward with confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Find Tutors
            </Link>

            <Link
              href="/homeschool-support"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Homeschool Support
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-4 lg:px-8">
          <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm font-semibold text-slate-500">Curricula</p>
            <p className="mt-2 text-2xl font-bold">International</p>
            <p className="mt-2 text-sm text-slate-600">
              Cambridge, Edexcel, A Levels, and IB.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm font-semibold text-slate-500">Learning Goal</p>
            <p className="mt-2 text-2xl font-bold">Mastery</p>
            <p className="mt-2 text-sm text-slate-600">
              Strong foundations before exam confidence.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm font-semibold text-slate-500">Delivery</p>
            <p className="mt-2 text-2xl font-bold">Online</p>
            <p className="mt-2 text-sm text-slate-600">
              Flexible access for families across locations.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm font-semibold text-slate-500">Motto</p>
            <p className="mt-2 text-2xl font-bold">Proven Results</p>
            <p className="mt-2 text-sm text-slate-600">
              Extraordinary Learning. Proven Results.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Why Alkebula Exists
            </h2>

            <div className="mt-6 space-y-5 text-slate-600">
              <p>
                Many learners struggle not because they lack ability, but because
                gaps quietly build up over time. A missed concept in Mathematics,
                weak writing structure in English, poor exam technique in
                Science, or lack of academic rhythm can slowly affect confidence
                and performance.
              </p>

              <p>
                The Alkebula School exists to bring structure back into the
                learning journey. We help learners understand where they are,
                what needs strengthening, and how to move forward with a clearer
                academic path.
              </p>

              <p>
                Our work is especially suited to families following Cambridge
                IGCSE, Edexcel IGCSE, A Levels, and IB pathways, including
                homeschooling families and internationally mobile learners.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-slate-50 p-8">
            <h2 className="text-3xl font-bold">Our Mission</h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              To deliver extraordinary learning experiences that help students
              close gaps, build mastery, and achieve measurable academic
              progress through structured online support.
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Our Motto
              </p>
              <p className="mt-2 text-2xl font-bold">
                Extraordinary Learning. Proven Results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="text-3xl font-bold">
            What Makes Alkebula Different
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map((item) => (
              <div key={item.title} className="rounded-3xl border bg-white p-6">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border p-8">
            <h2 className="text-3xl font-bold">Curricula We Support</h2>

            <p className="mt-4 text-slate-600">
              Alkebula focuses on international curriculum pathways only.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <Link
                href="/online-cambridge-igcse-tutors"
                className="rounded-xl bg-slate-50 p-3 hover:bg-slate-100"
              >
                Cambridge IGCSE
              </Link>
              <Link
                href="/edexcel-igcse-tutors"
                className="rounded-xl bg-slate-50 p-3 hover:bg-slate-100"
              >
                Edexcel IGCSE
              </Link>
              <Link
                href="/a-level-online-tutors"
                className="rounded-xl bg-slate-50 p-3 hover:bg-slate-100"
              >
                A Levels
              </Link>
              <Link
                href="/ib-online-tutors"
                className="rounded-xl bg-slate-50 p-3 hover:bg-slate-100"
              >
                IB
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              We do not offer CBC tutoring. Our focus is international education
              pathways with structured academic support.
            </div>
          </div>

          <div className="rounded-3xl border p-8">
            <h2 className="text-3xl font-bold">For Parents</h2>

            <p className="mt-4 text-slate-600">
              Alkebula is built for parents who want clarity, structure, and
              academic seriousness. Whether your child is catching up, preparing
              for exams, or aiming higher, our system is designed to support
              purposeful progress.
            </p>

            <ul className="mt-6 space-y-3 text-slate-600">
              <li>• Structured tutor-led academic support</li>
              <li>• International curriculum focus</li>
              <li>• Online access for global families</li>
              <li>• Support for homeschooling learners</li>
              <li>• A system designed around measurable improvement</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold">
            Build a clearer academic path for your learner.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Start with structured support, international curriculum expertise,
            and a system built for measurable progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/educators"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Find Tutors
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Parent Sign Up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}