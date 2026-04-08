import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

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
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, anonKey);
}

export default async function EducatorsPage() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("educator_directory")
    .select(
      "id, full_name, bio, profile_photo_url, hourly_rate, city, curricula, levels_taught, experience_band, subjects, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
          >
            ← Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-semibold">Educators</h1>

          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-sm text-red-600">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </main>
    );
  }

  const educators = (data ?? []) as Educator[];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/"
            className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
          >
            ← Back to Home
          </Link>

          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
            Meet Our Educators
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Explore qualified educators across international curricula and find
            the right academic fit for your child.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {educators.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No educators yet.</p>
            <p className="mt-2 text-slate-600">
              Add educator records in Supabase to display them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {educators.map((educator) => (
              <div
                key={educator.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100">
                    {educator.profile_photo_url ? (
                      <Image
                        src={educator.profile_photo_url}
                        alt={educator.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500">
                        {educator.full_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {educator.full_name}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      {educator.city ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          City: {educator.city}
                        </span>
                      ) : null}

                      {educator.hourly_rate ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          KSh {educator.hourly_rate}/hour
                        </span>
                      ) : null}

                      {educator.experience_band ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          {educator.experience_band}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {educator.bio ?? "Professional educator profile coming soon."}
                </p>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-900">Curricula</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(educator.curricula ?? []).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-900">Levels Taught</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(educator.levels_taught ?? []).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-900">Subjects</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(educator.subjects ?? []).map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/educators/${educator.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Book This Tutor
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}