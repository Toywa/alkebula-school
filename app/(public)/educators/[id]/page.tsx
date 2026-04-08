import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

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

type Availability = {
  id: string;
  educator_id: string;
  day_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
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

export default async function EducatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: educator, error: educatorError } = await supabase
    .from("educator_directory")
    .select(
      "id, full_name, bio, profile_photo_url, hourly_rate, city, curricula, levels_taught, experience_band, subjects"
    )
    .eq("id", id)
    .single();

  const { data: availability, error: availabilityError } = await supabase
    .from("availability")
    .select("id, educator_id, day_of_week, start_time, end_time")
    .eq("educator_id", id)
    .order("day_of_week", { ascending: true });

  if (educatorError || !educator) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <Link href="/educators" className="text-sm font-semibold text-amber-700">
            ← Back to Educators
          </Link>
          <h1 className="mt-6 text-3xl font-semibold">Tutor not found</h1>
        </div>
      </main>
    );
  }

  const tutor = educator as Educator;
  const slots = (availability ?? []) as Availability[];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/educators"
            className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
          >
            ← Back to Educators
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-start gap-5">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100">
                  {tutor.profile_photo_url ? (
                    <Image
                      src={tutor.profile_photo_url}
                      alt={tutor.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">
                      {tutor.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl font-bold">{tutor.full_name}</h1>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {tutor.city ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        City: {tutor.city}
                      </span>
                    ) : null}

                    {tutor.hourly_rate ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        KSh {tutor.hourly_rate}/hour
                      </span>
                    ) : null}

                    {tutor.experience_band ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        {tutor.experience_band}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <p className="mt-8 max-w-3xl text-base leading-8 text-slate-600">
                {tutor.bio ?? "Professional tutor profile coming soon."}
              </p>

              <div className="mt-8">
                <p className="text-sm font-medium text-slate-900">Curricula</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(tutor.curricula ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-slate-900">Levels Taught</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(tutor.levels_taught ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium text-slate-900">Subjects</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(tutor.subjects ?? []).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Available slots</h2>

              {availabilityError ? (
                <p className="mt-4 text-red-600">Failed to load availability.</p>
              ) : slots.length === 0 ? (
                <p className="mt-4 text-slate-600">
                  No availability added yet for this tutor.
                </p>
              ) : (
                <div className="mt-6 space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <p className="font-medium text-slate-900">
                        {slot.day_of_week}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {slot.start_time} - {slot.end_time}
                      </p>
                      <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                        Select This Slot
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-6 text-sm text-slate-500">
                Rating will be added later. Next, we connect slot selection to
                real booking creation, invoicing, and tutor notifications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}