"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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

export default function EducatorsPage() {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEducators() {
      try {
        const supabase = getSupabase();

        const { data, error } = await supabase
          .from("educator_directory")
          .select(
            "id, full_name, bio, profile_photo_url, hourly_rate, city, curricula, levels_taught, experience_band, subjects, timezone"
          )
          .eq("approval_status", "approved")
          .eq("is_public", true)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMessage("Failed to load educators.");
          setLoading(false);
          return;
        }

        setEducators((data ?? []) as Educator[]);
        setLoading(false);
      } catch {
        setErrorMessage("Failed to load educators.");
        setLoading(false);
      }
    }

    loadEducators();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-6xl">Loading educators...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            The Alkebula School
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Find an Approved Educator
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Browse approved educators for Cambridge, Edexcel, A Level and IB
            learning support.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {errorMessage ? (
          <p className="rounded-xl bg-red-50 p-4 text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {educators.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No approved educators listed yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {educators.map((educator) => (
              <Link
                key={educator.id}
                href={`/educators/${educator.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

                  <div>
                    <h2 className="text-xl font-semibold">{educator.full_name}</h2>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {educator.city ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                          {educator.city}
                        </span>
                      ) : null}

                      {educator.hourly_rate ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                          USD {educator.hourly_rate}/hour
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                  {educator.bio ?? "Professional educator profile coming soon."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(educator.subjects ?? []).slice(0, 3).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}