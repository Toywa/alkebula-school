import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

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

export default async function TutorsPage() {
  const { data: tutors, error } = await supabase
    .from("educator_directory")
    .select("*")
    .eq("approval_status", "approved")
    .eq("is_public", true)
    .order("full_name", { ascending: true });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-12 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
              The Alkebula School
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Approved Tutors
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Meet approved educators supporting Cambridge, Edexcel, A Level,
              and IB learners through structured, premium academic support. When
              tutors share the same first name and last initial, their full names
              are shown to avoid confusion.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
              >
                Parent Sign Up
              </Link>

              <Link
                href="/tutors/apply"
                className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] transition hover:bg-[#EEF9FF]"
              >
                Apply as Tutor
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Approved", "Tutor profiles"],
              ["Global", "Online lessons"],
              ["Structured", "Academic support"],
              ["Parent-first", "Booking guidance"],
            ].map(([title, label]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-slate-950">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error.message}
          </div>
        ) : !tutors || tutors.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-[#F7FCFF] p-8 text-center">
            <p className="text-lg font-medium">
              No approved tutors are publicly listed yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(() => {
              const tutorList = tutors as Tutor[];
              const nameCounts = getTutorNameCounts(tutorList);

              return tutorList.map((tutor) => {
                const publicTutorName = getPublicTutorName(tutor, nameCounts);
              const highlights = getSubjectRateHighlights(tutor.subject_rates);
              const imageUrl = `/api/tutor-photo?id=${tutor.id}`;
              const minimumRate = getMinimumRate(tutor);

              return (
                <article
                  key={tutor.id || tutor.email}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/tutors/${tutor.id}`} className="block">
                    <div className="border-b border-slate-200 bg-[#F7FCFF] p-4">
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

                        <p className="mt-2 text-sm font-semibold text-[#156B96]">
                          {getQualification(tutor)}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {getExperience(tutor)}
                        </p>
                      </div>

                      <span className="rounded-full border border-[#379CD6]/20 bg-[#F7FCFF] px-3 py-1 text-xs font-bold text-[#156B96]">
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
                      <div className="mt-5 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#156B96]">
                          Popular Packages
                        </p>

                        <div className="mt-3 space-y-3">
                          {highlights.map((item, index) => (
                            <div
                              key={`${item.curriculum_level}-${item.subject}-${index}`}
                              className="rounded-xl bg-white p-3 text-sm"
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
                      <div className="mt-5 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-4 text-sm">
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
                        className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-5 py-3 text-sm font-semibold text-[#156B96] transition hover:bg-[#EEF9FF]"
                      >
                        Request Tutor
                      </Link>
                    </div>
                  </div>
                </article>
              );
              });
            })()}
          </div>
        )}
      </section>
    </main>
  );
}