import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

type Educator = {
  id: string;
  full_name: string;
  bio: string | null;
  profile_photo_url: string | null;
  hourly_rate: number | null;
  city: string | null;
  curricula: string[] | null;
  levels_taught: string[] | null;
  experience_band: string | null;
  subjects: string[] | null;
  timezone: string | null;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, anonKey);
}

export default async function EducatorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getSupabase();
  const id = params.id;

  const { data: educator, error } = await supabase
    .from("educator_directory")
    .select(
      "id, full_name, bio, profile_photo_url, hourly_rate, city, curricula, levels_taught, experience_band, subjects, timezone"
    )
    .eq("id", id)
    .eq("approval_status", "approved")
    .eq("is_public", true)
    .maybeSingle();

  if (error || !educator) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold">Educator not found</h1>
          <p className="mt-4 text-slate-600">
            This educator is not available or not approved.
          </p>

          <Link
            href="/educators"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white"
          >
            Back to educators
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-slate-100">
              {educator.profile_photo_url ? (
                <Image
                  src={educator.profile_photo_url}
                  alt={educator.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-500">
                  {educator.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{educator.full_name}</h1>

              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {educator.city && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {educator.city}
                  </span>
                )}

                {educator.hourly_rate && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    USD {educator.hourly_rate}/hour
                  </span>
                )}

                {educator.experience_band && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                    {educator.experience_band}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-4 text-slate-600 leading-7">
              {educator.bio || "Professional educator profile coming soon."}
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">Subjects</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(educator.subjects ?? []).map((subject: string) => (
                  <span
                    key={subject}
                    className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">Curricula</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(educator.curricula ?? []).map((c: string) => (
                  <span
                    key={c}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Book Sessions</h3>

            <p className="mt-3 text-sm text-slate-600">
              Available booking slots will appear here.
            </p>

            <button className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              View Availability
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}