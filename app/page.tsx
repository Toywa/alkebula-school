export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO SECTION */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            THE ALKEBULA SCHOOL
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight">
            Extraordinary Learning.
            <br />
            Proven Results.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            A premium education system designed to close learning gaps,
            strengthen mastery, and help students move forward with clarity,
            confidence, and measurable progress.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-black px-6 py-3 text-white hover:opacity-90">
              Book Consultation
            </button>
            <button className="rounded-xl border border-slate-300 px-6 py-3 hover:bg-slate-100">
              Explore Programs
            </button>
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold">
          Education built with intention.
        </h2>

        <p className="mt-4 max-w-3xl text-slate-600">
          At The Alkebula School, we do not believe in one-size-fits-all learning.
          We identify gaps, strengthen foundations, and build structured academic
          growth paths for every learner.
        </p>
      </section>

      {/* WHO IT’S FOR */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold">Who this is for</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              Students with learning gaps
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              High-performing students seeking challenge
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              Homeschooling families
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              Exam-focused learners (IGCSE, A-Level, IB)
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold">How it works</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold">Assess</h3>
            <p className="text-sm text-slate-600">
              Identify strengths and learning gaps
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Personalize</h3>
            <p className="text-sm text-slate-600">
              Create a focused learning path
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Teach</h3>
            <p className="text-sm text-slate-600">
              Expert-led structured instruction
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Track</h3>
            <p className="text-sm text-slate-600">
              Measurable academic progress
            </p>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold">
            International academic pathways
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">Cambridge</div>
            <div className="rounded-xl bg-white p-6 shadow-sm">Edexcel</div>
            <div className="rounded-xl bg-white p-6 shadow-sm">A Levels</div>
            <div className="rounded-xl bg-white p-6 shadow-sm">IB</div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Ready to build real academic momentum?
        </h2>

        <p className="mt-4 text-slate-600">
          Start your journey with a structured, premium, results-driven system.
        </p>

        <button className="mt-8 rounded-xl bg-black px-8 py-4 text-white hover:opacity-90">
          Start the Journey
        </button>
      </section>

    </main>
  )
}