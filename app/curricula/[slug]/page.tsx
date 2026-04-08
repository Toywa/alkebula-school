import Image from "next/image";
import Link from "next/link";

const curriculumData: Record<
  string,
  {
    name: string;
    logo: string;
    image: string;
    overview: string;
    whoItsFor: string[];
    whatWeSupport: string[];
  }
> = {
  cambridge: {
    name: "Cambridge",
    logo: "/cambridge.png",
    image: "/curricula/cambridge-students.png",
    overview:
      "Cambridge offers a strong international academic pathway built on clear progression, subject depth, and rigorous assessment. It is ideal for families seeking structured learning and solid foundations across key stages.",
    whoItsFor: [
      "Learners needing strong academic foundations",
      "Families seeking an internationally recognised curriculum",
      "Students preparing for IGCSE and advanced progression",
    ],
    whatWeSupport: [
      "Gap identification and targeted intervention",
      "Structured subject support and exam preparation",
      "Progress tracking and personalised academic planning",
    ],
  },
  edexcel: {
    name: "Edexcel",
    logo: "/edexcel.png",
    image: "/curricula/edexcel-students.png",
    overview:
      "Edexcel provides a flexible and respected international pathway that supports strong academic growth across a range of learner profiles. It is well suited to students who benefit from structured progression and clear assessment goals.",
    whoItsFor: [
      "Students needing support with subject mastery",
      "Families who value flexibility within strong standards",
      "Learners preparing for IGCSE or equivalent progression",
    ],
    whatWeSupport: [
      "Focused teaching for difficult subjects and topics",
      "Academic catch-up and confidence building",
      "Preparation for strong assessment performance",
    ],
  },
  ib: {
    name: "IB",
    logo: "/ib.png",
    image: "/curricula/ib-students.png",
    overview:
      "The International Baccalaureate develops inquiry, critical thinking, academic discipline, and global perspective. It suits learners who benefit from deeper thinking, strong reflection, and intellectually rich learning.",
    whoItsFor: [
      "Students who thrive in inquiry-based learning",
      "Families seeking a globally respected pathway",
      "Learners ready for critical thinking and high-level engagement",
    ],
    whatWeSupport: [
      "Conceptual understanding and analytical depth",
      "Support with demanding tasks and academic writing",
      "Structured guidance for confidence and consistency",
    ],
  },
  "a-levels": {
    name: "A Levels",
    logo: "/alevel.png",
    image: "/curricula/alevel-students.png",
    overview:
      "A Levels offer advanced subject-focused learning for serious students preparing for university and beyond. This pathway suits learners who want depth, challenge, and strong academic direction in chosen subjects.",
    whoItsFor: [
      "Students preparing for competitive university pathways",
      "Learners who want subject specialisation",
      "Families seeking strong advanced-level academic preparation",
    ],
    whatWeSupport: [
      "Deep subject teaching and exam-focused preparation",
      "Academic planning and performance improvement",
      "Targeted support for demanding advanced-level content",
    ],
  },
};

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const curriculum = curriculumData[slug];

  if (!curriculum) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-semibold">Curriculum not found</h1>
          <p className="mt-4 text-slate-600">
            The curriculum you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-18">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-16 items-center">
                <Image
                  src={curriculum.logo}
                  alt={curriculum.name}
                  width={170}
                  height={70}
                  className="h-auto w-auto object-contain"
                />
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
                {curriculum.name} at The Alkebula School
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {curriculum.overview}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:admissions@alkebulaschool.com"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  admissions@alkebulaschool.com
                </a>

                <a
                  href="https://wa.me/254728866097"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
              <div className="relative h-[420px] w-full bg-slate-100">
                <Image
                  src={curriculum.image}
                  alt={`${curriculum.name} students studying`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold">Who this pathway suits</h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              {curriculum.whoItsFor.map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-semibold">
              How The Alkebula School supports learners
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              {curriculum.whatWeSupport.map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-4 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}