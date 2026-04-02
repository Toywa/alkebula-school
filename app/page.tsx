export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">
              The Alkebula School
            </p>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Extraordinary Learning. Proven Results.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              A premium education system designed to close learning gaps,
              strengthen mastery, and help students move forward with confidence.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
              Built for families who want serious academic progress, personalized
              support, and a learning experience centered on excellence.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#consultation"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Book a Consultation
              </a>
              <a
                href="#programs"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Programs
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            "Personalized learning plans",
            "Premium educator selection",
            "Measured academic progress",
            "International curriculum focus",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Why Alkebula
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Education built with intention. Results built on method.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-slate-600">
            <p>
              At The Alkebula School, we do not believe in one-size-fits-all
              learning. We use carefully designed methods to identify gaps,
              strengthen foundations, and help each student progress with
              clarity and confidence.
            </p>
            <p>
              Whether a learner needs support catching up or challenge to go
              further, our system is built to deliver measurable academic
              growth.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50" id="programs">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Who this is for
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built for serious learners and ambitious families
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Students with learning gaps who need structured support",
              "High-performing students ready for greater challenge",
              "Families seeking premium academic guidance",
              "Homeschooling families who want expert-led learning",
              "Learners preparing for major international examinations",
              "Students who need clearer structure, accountability, and momentum",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-base font-medium leading-7 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            A better way to learn
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Assess",
              text: "We identify the student’s current level, strengths, and learning gaps.",
            },
            {
              title: "Personalize",
              text: "We build a focused learning path matched to the learner’s needs and goals.",
            },
            {
              title: "Teach with precision",
              text: "Expert educators deliver structured, high-quality instruction.",
            },
            {
              title: "Track progress",
              text: "Families see clear academic progress, not guesswork.",
            },
          ].map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                Curriculum focus
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                International pathways. Serious academic standards.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                We support learners across leading international pathways with
                focused instruction, rigorous academic expectations, and
                structured support.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["Cambridge IGCSE", "Edexcel", "A Levels", "IB"].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-lg font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            What makes us different
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Premium learning, built for support and excellence
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            "Personalized learning, not generic teaching",
            "Strong academic foundations before acceleration",
            "Premium educator selection and quality standards",
            "Measured progress tracking for families",
            "A system designed for both support and high performance",
            "Clear structure, accountability, and academic momentum",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-base font-medium leading-7 text-slate-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="consultation"
        className="border-t border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Start here
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Ready to build real academic momentum?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Book a consultation and discover how The Alkebula School can support
            your child with structured, premium, results-driven learning.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Start the Journey
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              Speak to Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}