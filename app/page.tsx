import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO SECTION */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="The Alkebula School"
              width={120}
              height={120}
              className="h-auto w-auto"
            />
          </div>

          {/* BRAND NAME */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            THE ALKEBULA SCHOOL
          </h1>

          {/* TAGLINE */}
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Extraordinary Learning. Proven Results.
          </p>

        </div>
      </section>

      {/* PROGRAMS / CURRICULA */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">

          <h2 className="text-center text-2xl font-semibold mb-10">
            Our Academic Pathways
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <div className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Image
                src="/cambridge.png"
                alt="Cambridge"
                width={140}
                height={60}
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Image
                src="/edexcel.png"
                alt="Edexcel"
                width={140}
                height={60}
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Image
                src="/ib.png"
                alt="International Baccalaureate"
                width={120}
                height={60}
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Image
                src="/alevel.png"
                alt="A Levels"
                width={140}
                height={60}
                className="object-contain"
              />
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}