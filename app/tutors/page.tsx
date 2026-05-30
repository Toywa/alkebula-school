import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type SubjectRate = {
  curriculum_level: string;
  subject: string;
  hourly_rate: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getSubjectRateHighlights(subjectRates?: SubjectRate[] | null) {
  if (!Array.isArray(subjectRates) || subjectRates.length === 0) {
    return [];
  }

  return subjectRates.slice(0, 3);
}

export default async function TutorsPage() {
  const { data: tutors, error } = await supabase
    .from("educator_directory")
    .select("*")
    .eq("approval_status", "approved")
    .eq("is_public", true)
    .order("full_name", { ascending: true });

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Approved Alkebula Tutors
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Meet experienced tutors for international curriculum learners.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Explore approved educators supporting Cambridge IGCSE, Edexcel
              IGCSE, A Levels, and IB learners through structured online
              lessons, professional academic support, and a secure learning
              system.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                Parent Sign Up
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
              >
                Ask for Guidance
              </Link>

              <Link
                href="/tutors/apply"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Apply as Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            {
              title: "Approved Tutors",
              text: "Tutor profiles are reviewed before appearing publicly.",
            },
            {
              title: "Global Lessons",
              text: "Online support for families across locations and time zones.",
            },
            {
              title: "Structured Support",
              text: "Lessons are designed around clarity, mastery, and progress.",
            },
            {
              title: "Parent-Friendly",
              text: "A system built to help families book and manage support.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#379CD6]/15 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF9FF] text-sm font-black text-[#156B96]">
                ✓
              </div>

              <h2 className="text-base font-bold text-slate-950">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Tutor Directory
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
              Choose the right academic support.
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Review tutor profiles, subject strengths, curriculum experience,
              and available rates before choosing the best fit for your learner.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-fit rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-5 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
          >
            Need help choosing?
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Unable to load tutors.</p>
            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        ) : !tutors || tutors.length === 0 ? (
          <div className="rounded-[2rem] border border-[#379CD6]/20 bg-[#F7FCFF] p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-950">
              No approved tutors are publicly listed yet.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Approved tutor profiles will appear here once they are ready for
              public viewing. You can still contact Alkebula for guidance.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
            >
              Contact Alkebula
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {tutors.map((tutor) => {
              const highlights = getSubjectRateHighlights(tutor.subject_rates);

              return (
                <article
                  key={tutor.id || tutor.email}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#379CD6]/25 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <Link href={`/tutors/${tutor.id}`} className="block">
                    <div className="border-b border-slate-200 bg-[#F7FCFF] p-4">
                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                        <div className="flex h-72 items-center justify-center bg-white">
                          <img
                            src={`/api/tutor-photo?id=${tutor.id}`}
                            alt={
                              tutor.full_name ||
                              "Alkebula tutor profile photo"
                            }
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-950">
                          {tutor.full_name}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-[#156B96]">
                          {tutor.city || "Available online"}
                        </p>
                      </div>

                      <span className="rounded-full border border-[#379CD6]/20 bg-[#F7FCFF] px-3 py-1 text-xs font-bold text-[#156B96]">
                        Approved
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                      {tutor.bio || "Approved Alkebula School educator."}
                    </p>

                    <div className="mt-5 flex-1">
                      {highlights.length > 0 ? (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            Popular Subjects
                          </p>

                          <div className="mt-3 space-y-3">
                            {highlights.map((item, index) => (
                              <div
                                key={`${item.curriculum_level}-${item.subject}-${index}`}
                                className="rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-4"
                              >
                                <p className="font-bold text-slate-950">
                                  {item.subject}
                                </p>

                                <p className="mt-1 text-xs font-semibold text-[#156B96]">
                                  {item.curriculum_level}
                                </p>

                                <p className="mt-2 text-sm font-bold text-slate-800">
                                  USD {item.hourly_rate}/hour
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                          <p>
                            <span className="font-bold">Subjects:</span>{" "}
                            {tutor.subjects?.join(", ") ||
                              "Available on profile"}
                          </p>

                          <p>
                            <span className="font-bold">Curricula:</span>{" "}
                            {tutor.curricula?.join(", ") ||
                              "Available on profile"}
                          </p>

                          {tutor.hourly_rate ? (
                            <p>
                              <span className="font-bold">Rate:</span> USD{" "}
                              {tutor.hourly_rate}/hour
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
                      >
                        View Profile & Book
                      </Link>

                      <Link
                        href={`/enquire/${tutor.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-5 py-3 text-sm font-semibold text-[#156B96] transition hover:bg-[#EEF9FF]"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}