import Link from "next/link";

export default function TutorsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            The Alkebula School
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-5xl">
            Join as a Tutor
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            We are building a premium educator network for families pursuing
            Cambridge, Edexcel, A Level, and IB pathways. If you are a serious,
            experienced educator, we invite you to join the platform and open
            your availability for the full month of May.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create Tutor Account
            </Link>

            <Link
              href="/tutors/may-availability"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open May Availability
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Premium Positioning</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Teach families who value structure, quality, and serious academic
              progress.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Flexible Scheduling</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Publish bookable hourly slots that fit your real teaching rhythm
              and monthly planning.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Global Reach</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Join a platform designed for international curricula and a broader,
              high-intent parent audience.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            What we are looking for
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5">
              <p className="font-semibold text-slate-900">
                Curriculum strength
              </p>
              <p className="mt-2 text-slate-600">
                Cambridge, Edexcel, A Level, or IB teaching confidence.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="font-semibold text-slate-900">
                Strong professionalism
              </p>
              <p className="mt-2 text-slate-600">
                Reliable communication, polished presentation, and serious
                commitment to student outcomes.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="font-semibold text-slate-900">
                Subject mastery
              </p>
              <p className="mt-2 text-slate-600">
                Confidence in your teaching area and ability to close learning
                gaps.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="font-semibold text-slate-900">
                Availability discipline
              </p>
              <p className="mt-2 text-slate-600">
                Ability to publish and honor bookable slots for May.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}