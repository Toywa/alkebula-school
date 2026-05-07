import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getProfileImageUrl(path?: string | null) {
  if (!path) return null;

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/educator-documents/${path}`;
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            The Alkebula School
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-5xl">
            Approved Tutors
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Meet approved educators supporting Cambridge, Edexcel, A Level, and
            IB learners through structured, premium academic support.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tutors/apply"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply as Tutor
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Create Tutor Account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        {error ? (
          <p className="text-red-600">{error.message}</p>
        ) : !tutors || tutors.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">
              No approved tutors are publicly listed yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => {
              const imageUrl = getProfileImageUrl(tutor.profile_photo_url);

              return (
                <article
                  key={tutor.id || tutor.email}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={tutor.full_name}
                      className="h-48 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
                      No profile photo
                    </div>
                  )}

                  <h2 className="mt-5 text-xl font-semibold">
                    {tutor.full_name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {tutor.bio || "Approved Alkebula School educator."}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {tutor.city || "Available online"}
                    </p>

                    <p>
                      <span className="font-medium">Subjects:</span>{" "}
                      {tutor.subjects?.join(", ") || "—"}
                    </p>

                    <p>
                      <span className="font-medium">Curricula:</span>{" "}
                      {tutor.curricula?.join(", ") || "—"}
                    </p>

                    {tutor.hourly_rate ? (
                      <p>
                        <span className="font-medium">Rate:</span>{" "}
                        ${tutor.hourly_rate}/hour
                      </p>
                    ) : null}
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