import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Approved Tutors | The Alkebula School",
  description:
    "Browse approved Alkebula School tutors for Cambridge IGCSE, Edexcel IGCSE, Cambridge A Levels, Edexcel International A Levels, IB Diploma, Cambridge Checkpoint, Common Entrance and homeschool support.",
  alternates: {
    canonical: "/educators",
  },
};

type SubjectRate = {
  curriculum_level: string;
  class_level?: string | null;
  student_level?: string | null;
  level?: string | null;
  subject: string;
  hourly_rate: number;
};

type Tutor = {
  id: string;
  email: string;
  full_name: string;
  bio: string | null;
  city: string | null;
  subjects: string[] | null;
  curricula: string[] | null;
  subject_rates?: SubjectRate[] | null;
  hourly_rate: number | null;
  profile_photo_url: string | null;
  qualification?: string | null;
  qualifications?: string | null;
  years_of_experience?: number | null;
  experience_years?: number | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const premiumTutorOrder = [
  "antony kinyili",
  "charles m",
  "david m",
  "evans w",
  "massimo s",
  "sara p",
  "arkwings a",
  "chineke g",
  "kirui kipkorir victor",
];

const pathways = [
  "Cambridge IGCSE",
  "Edexcel IGCSE",
  "Cambridge AS & A Levels",
  "Edexcel International A Levels",
  "IB Diploma",
  "Cambridge Checkpoint",
  "Common Entrance",
  "Homeschool Support",
];

const trustPoints = [
  "Approved tutor profiles",
  "International curriculum focus",
  "Online lessons across time zones",
  "Local support considered where available",
];

const parentRoutes = [
  {
    title: "Browse tutors directly",
    description:
      "Review approved tutor profiles, subjects, curriculum experience and available package information.",
    href: "#tutor-list",
    cta: "View Tutors",
  },
  {
    title: "Get matched with guidance",
    description:
      "Share the learner’s needs and let Alkebula help narrow the choice toward suitable academic support.",
    href: "/get-matched",
    cta: "Get Matched",
  },
  {
    title: "Prepare for an exam window",
    description:
      "Use focused revision pages for October/November 2026, January 2027 and May/June 2027 preparation.",
    href: "/exam-revision",
    cta: "Revision Hub",
  },
];

function getDefaultPublicTutorName(fullName?: string | null) {
  if (!fullName) return "Alkebula Tutor";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "Alkebula Tutor";

  const firstName = parts[0];
  const lastInitial =
    parts.length > 1
      ? `${parts[parts.length - 1].charAt(0).toUpperCase()}.`
      : "";

  return [firstName, lastInitial].filter(Boolean).join(" ");
}

function normalizeTutorRankName(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function getPremiumTutorRank(tutor: Tutor) {
  const fullName = normalizeTutorRankName(tutor.full_name);
  const publicName = normalizeTutorRankName(
    getDefaultPublicTutorName(tutor.full_name)
  );

  const index = premiumTutorOrder.findIndex((priorityName) => {
    const target = normalizeTutorRankName(priorityName);

    return (
      fullName === target ||
      publicName === target ||
      fullName.startsWith(`${target} `) ||
      publicName.startsWith(target)
    );
  });

  return index === -1 ? 9999 : index;
}

function sortTutorsForPublicDisplay(tutors: Tutor[]) {
  return [...tutors].sort((a, b) => {
    const rankA = getPremiumTutorRank(a);
    const rankB = getPremiumTutorRank(b);

    if (rankA !== rankB) return rankA - rankB;

    const nameA = normalizeTutorRankName(a.full_name);
    const nameB = normalizeTutorRankName(b.full_name);

    return nameA.localeCompare(nameB);
  });
}

function getTutorNameCounts(tutors: Tutor[]) {
  return tutors.reduce<Record<string, number>>((counts, tutor) => {
    const defaultName = getDefaultPublicTutorName(tutor.full_name);
    counts[defaultName] = (counts[defaultName] || 0) + 1;
    return counts;
  }, {});
}

function getPublicTutorName(tutor: Tutor, nameCounts: Record<string, number>) {
  const defaultName = getDefaultPublicTutorName(tutor.full_name);

  if ((nameCounts[defaultName] || 0) > 1 && tutor.full_name) {
    return tutor.full_name;
  }

  return defaultName;
}

function getQualification(tutor: Tutor) {
  return (
    tutor.qualification ||
    tutor.qualifications ||
    "Qualification pending update"
  );
}

function getExperience(tutor: Tutor) {
  const years = tutor.years_of_experience ?? tutor.experience_years;

  if (!years) return "Experience pending update";

  return `${years} ${years === 1 ? "year" : "years"} experience`;
}

function getSubjectRateHighlights(subjectRates?: SubjectRate[] | null) {
  if (!Array.isArray(subjectRates) || subjectRates.length === 0) {
    return [];
  }

  return subjectRates.slice(0, 3);
}

function getMinimumRate(tutor: Tutor) {
  if (Array.isArray(tutor.subject_rates) && tutor.subject_rates.length > 0) {
    const validRates = tutor.subject_rates
      .map((item) => Number(item.hourly_rate || 0))
      .filter((rate) => rate > 0);

    if (validRates.length > 0) {
      return Math.min(...validRates);
    }
  }

  return Number(tutor.hourly_rate || 0);
}

function getTutorCountLabel(count: number) {
  if (count === 1) return "1 approved tutor";
  return `${count} approved tutors`;
}

export default async function TutorsPage() {
  const { data: tutors, error } = await supabase
    .from("educator_directory")
    .select("*")
    .eq("approval_status", "approved")
    .eq("is_public", true)
    .order("full_name", { ascending: true });

  const tutorList = sortTutorsForPublicDisplay((tutors || []) as Tutor[]);
  const nameCounts = getTutorNameCounts(tutorList);

  return (
    <main className="min-h-screen bg-[#FFFDFB] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_28%),radial-gradient(circle_at_top_right,#F7FCFF,transparent_30%),#FFFDFB]">
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#FFF5F7] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#F7FCFF] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-[#8F1F36]/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8F1F36] shadow-sm">
                Approved Alkebula Tutors
              </p>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
                Choose from approved tutors for serious international learning.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                Browse tutors supporting Cambridge, Edexcel, A Level, IB,
                Checkpoint, Common Entrance and homeschool pathways. Each public
                profile is designed to help parents understand subject fit,
                experience and available academic support.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                For families who prefer guidance before choosing, Alkebula can
                also help match the learner to suitable tutor support based on
                curriculum, subject, location, exam window and schedule.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#tutor-list"
                  className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
                >
                  Browse Approved Tutors
                </a>

                <Link
                  href="/get-matched"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:border-[#8F1F36]/20 hover:bg-[#FFF5F7]"
                >
                  Get Matched Instead
                </Link>

                <Link
                  href="/tutors/apply"
                  className="inline-flex items-center justify-center rounded-xl border border-[#379CD6]/20 bg-[#F7FCFF] px-6 py-3 text-sm font-bold text-[#156B96] shadow-sm transition hover:bg-white"
                >
                  Apply as Tutor
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                Parent choice, with guidance available
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-[#FFFDFB] p-4 text-sm font-semibold leading-7 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#156B96]">
                  Current priority
                </p>

                <p className="mt-2 text-sm font-bold text-slate-950">
                  October/November 2026 exam revision and ongoing international
                  curriculum support.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [getTutorCountLabel(tutorList.length), "Publicly listed now"],
              ["Global", "Online lessons"],
              ["Structured", "Academic support"],
              ["Guided", "Tutor matching"],
            ].map(([title, label]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xl font-bold text-slate-950">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {parentRoutes.map((route) => (
              <Link
                key={route.title}
                href={route.href}
                className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#8F1F36]/20 hover:shadow-lg"
              >
                <h2 className="text-lg font-bold text-slate-950">
                  {route.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {route.description}
                </p>

                <p className="mt-5 text-sm font-bold text-[#8F1F36]">
                  {route.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#FFF8F9] py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
                Academic Pathways
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Tutor support for recognised international pathways.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Alkebula focuses on families who need international curriculum
                support, structured revision and consistent academic guidance.
              </p>
            </div>

            <Link
              href="/exam-revision"
              className="inline-flex w-fit rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#6F1729]"
            >
              View Revision Pages
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {pathways.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#8F1F36]/10 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="tutor-list" className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              Tutor Directory
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Browse approved tutors.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Profiles show public tutor names, qualification details, teaching
              experience, curricula, subjects and available package highlights.
            </p>
          </div>

          <Link
            href="/get-matched"
            className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm hover:bg-[#FFF5F7]"
          >
            Need help choosing?
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error.message}
          </div>
        ) : tutorList.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-950">
              No approved tutors are publicly listed yet.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              You can still submit a matching request and Alkebula will review
              available academic support options.
            </p>

            <Link
              href="/get-matched"
              className="mt-6 inline-flex rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
            >
              Get Matched With a Tutor
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tutorList.map((tutor) => {
              const publicTutorName = getPublicTutorName(tutor, nameCounts);
              const highlights = getSubjectRateHighlights(tutor.subject_rates);
              const imageUrl = `/api/tutor-photo?id=${tutor.id}`;
              const minimumRate = getMinimumRate(tutor);

              return (
                <article
                  key={tutor.id || tutor.email}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#8F1F36]/20 hover:shadow-lg"
                >
                  <Link href={`/tutors/${tutor.id}`} className="block">
                    <div className="border-b border-slate-200 bg-[#FFFDFB] p-4">
                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                        <div className="flex h-72 items-center justify-center bg-white">
                          <img
                            src={imageUrl}
                            alt={`${publicTutorName} - Alkebula tutor`}
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-950">
                          {publicTutorName}
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-[#8F1F36]">
                          {getQualification(tutor)}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {getExperience(tutor)}
                        </p>
                      </div>

                      <span className="rounded-full border border-[#8F1F36]/15 bg-[#FFF5F7] px-3 py-1 text-xs font-bold text-[#8F1F36]">
                        Approved
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                      {tutor.bio || "Approved Alkebula School educator."}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-slate-700">
                      <p>
                        <span className="font-bold text-slate-950">City:</span>{" "}
                        {tutor.city || "Available online"}
                      </p>

                      {tutor.curricula && tutor.curricula.length > 0 ? (
                        <p>
                          <span className="font-bold text-slate-950">
                            Curricula:
                          </span>{" "}
                          {tutor.curricula.slice(0, 3).join(", ")}
                        </p>
                      ) : null}

                      {tutor.subjects && tutor.subjects.length > 0 ? (
                        <p>
                          <span className="font-bold text-slate-950">
                            Subjects:
                          </span>{" "}
                          {tutor.subjects.slice(0, 4).join(", ")}
                        </p>
                      ) : null}
                    </div>

                    {highlights.length > 0 ? (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-[#FFFDFB] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8F1F36]">
                          Popular Packages
                        </p>

                        <div className="mt-3 space-y-3">
                          {highlights.map((item, index) => (
                            <div
                              key={`${item.curriculum_level}-${item.subject}-${index}`}
                              className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                            >
                              <p className="font-bold text-slate-950">
                                {item.subject}
                              </p>

                              <p className="text-xs text-slate-500">
                                {item.curriculum_level}
                              </p>

                              <p className="mt-1 font-bold text-[#8F1F36]">
                                USD {item.hourly_rate}/hour
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : minimumRate > 0 ? (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-[#FFFDFB] p-4 text-sm">
                        <span className="font-bold text-slate-950">From:</span>{" "}
                        <span className="font-bold text-[#8F1F36]">
                          USD {minimumRate}/hour
                        </span>
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
                      >
                        View Profile
                      </Link>

                      <Link
                        href={`/enquire/${tutor.id}`}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-[#FFF5F7]"
                      >
                        Request Tutor
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-white px-6 pb-14 lg:pb-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF5F7] p-8 text-center shadow-sm lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
            Need guidance?
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Tell us the learner’s needs and we will help narrow the choice.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Use Get Matched when you want support choosing a tutor for a
            specific curriculum, subject, exam window, location or schedule.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/get-matched"
              className="inline-flex justify-center rounded-xl bg-[#8F1F36] px-7 py-4 text-sm font-bold text-white hover:bg-[#6F1729]"
            >
              Get Matched With a Tutor
            </Link>

            <Link
              href="/exam-revision"
              className="inline-flex justify-center rounded-xl border border-[#8F1F36]/15 bg-white px-7 py-4 text-sm font-bold text-[#8F1F36] hover:bg-[#FFF5F7]"
            >
              View Revision Pages
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}