"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

type AvailabilitySlot = {
  id: string;
  educator_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  source: string;
  start_at_utc: string | null;
  end_at_utc: string | null;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, anonKey);
}

export default function EducatorDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [educator, setEducator] = useState<Educator | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingState, setBookingState] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setErrorMessage("Missing tutor id in route.");
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabase();

        const { data: tutor, error: tutorError } = await supabase
          .from("educator_directory")
          .select(
            "id, full_name, bio, profile_photo_url, hourly_rate, city, curricula, levels_taught, experience_band, subjects, timezone"
          )
          .eq("id", id)
          .maybeSingle();

        if (tutorError || !tutor) {
          setErrorMessage("Tutor not found.");
          setLoading(false);
          return;
        }

        const { data: slotData, error: slotError } = await supabase
          .from("availability_slots")
          .select(
            "id, educator_id, slot_date, start_time, end_time, timezone, status, source, start_at_utc, end_at_utc"
          )
          .eq("educator_id", id)
          .eq("status", "available")
          .order("slot_date", { ascending: true })
          .order("start_time", { ascending: true });

        if (slotError) {
          setErrorMessage("Failed to load available slots.");
          setLoading(false);
          return;
        }

        setEducator(tutor as Educator);
        setSlots((slotData ?? []) as AvailabilitySlot[]);
        setLoading(false);
      } catch {
        setErrorMessage("Failed to load tutor page.");
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleBookSlot(
    slot: AvailabilitySlot,
    parentName: string,
    studentName: string,
    parentEmail: string,
    parentPhone: string,
    curriculum: string,
    subject: string,
    classLevel: string
  ) {
    if (!educator) return;

    const key = slot.id;
    setBookingState((prev) => ({ ...prev, [key]: "booking" }));

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          educator_id: educator.id,
          slot_id: slot.id,
          parent_name: parentName,
          parent_email: parentEmail,
          parent_phone: parentPhone,
          student_name: studentName,
          curriculum,
          subject,
          class_level: classLevel,
          date: slot.slot_date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          timezone: slot.timezone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      const amountText =
        typeof data.invoice_amount_usd === "number"
          ? ` Invoice created: USD ${data.invoice_amount_usd}.`
          : "";

      const warningText = data.warning ? ` ${data.warning}` : "";

      setBookingState((prev) => ({
        ...prev,
        [key]: `success|Booking created successfully.${amountText}${warningText}`,
      }));

      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } catch (error) {
      setBookingState((prev) => ({
        ...prev,
        [key]: error instanceof Error ? error.message : "Booking failed",
      }));
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl">Loading...</div>
      </main>
    );
  }

  if (errorMessage || !educator) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <Link href="/educators" className="text-sm font-semibold text-amber-700">
            ← Back to Educators
          </Link>
          <h1 className="mt-6 text-3xl font-semibold">
            {errorMessage || "Tutor not found."}
          </h1>
        </div>
      </main>
    );
  }

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
                  {educator.profile_photo_url ? (
                    <Image
                      src={educator.profile_photo_url}
                      alt={educator.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">
                      {educator.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl font-bold">{educator.full_name}</h1>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {educator.city ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        City: {educator.city}
                      </span>
                    ) : null}

                    {educator.hourly_rate ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        USD {educator.hourly_rate}/hour
                      </span>
                    ) : null}

                    {educator.experience_band ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        {educator.experience_band}
                      </span>
                    ) : null}

                    {educator.timezone ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        Timezone: {educator.timezone}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <p className="mt-8 max-w-3xl text-base leading-8 text-slate-600">
                {educator.bio ?? "Professional tutor profile coming soon."}
              </p>

              <div className="mt-8">
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

              <div className="mt-8">
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

              <div className="mt-8">
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
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Available hourly slots</h2>

              {slots.length === 0 ? (
                <p className="mt-4 text-slate-600">
                  No available slots yet for this tutor.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {slots.map((slot) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      bookingState={bookingState[slot.id] || ""}
                      onBook={handleBookSlot}
                    />
                  ))}
                </div>
              )}

              <p className="mt-6 text-sm text-slate-500">
                Parent email and phone are collected for invoicing and booking administration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SlotCard({
  slot,
  bookingState,
  onBook,
}: {
  slot: AvailabilitySlot;
  bookingState: string;
  onBook: (
    slot: AvailabilitySlot,
    parentName: string,
    studentName: string,
    parentEmail: string,
    parentPhone: string,
    curriculum: string,
    subject: string,
    classLevel: string
  ) => void;
}) {
  const [parentName, setParentName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");

  const success = bookingState.startsWith("success|");
  const message = success ? bookingState.replace("success|", "") : bookingState;

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="font-medium text-slate-900">{slot.slot_date}</p>
      <p className="mt-1 text-sm text-slate-600">
        {slot.start_time} - {slot.end_time}
      </p>
      <p className="mt-1 text-xs text-slate-500">{slot.timezone}</p>

      <div className="mt-4 space-y-3">
        <input
          name="parent_name"
          type="text"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Parent name"
          autoComplete="name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <input
          name="parent_email"
          type="email"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          placeholder="Parent email"
          autoComplete="email"
          list="parent-email-suggestions"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <datalist id="parent-email-suggestions">
          <option value="@gmail.com" />
          <option value="@yahoo.com" />
          <option value="@outlook.com" />
          <option value="@hotmail.com" />
          <option value="@gmail.co.uk" />
        </datalist>

        <input
          name="parent_phone"
          type="text"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
          placeholder="Parent phone"
          autoComplete="tel"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <input
          name="student_name"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Student name"
          autoComplete="section-student shipping name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <select
          name="curriculum"
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Select curriculum</option>
          <option value="Cambridge">Cambridge</option>
          <option value="Edexcel">Edexcel</option>
          <option value="IB">IB</option>
          <option value="A Levels">A Levels</option>
        </select>

        <input
          name="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          list="common-subjects"
          autoComplete="off"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <datalist id="common-subjects">
          <option value="Mathematics" />
          <option value="English" />
          <option value="Biology" />
          <option value="Chemistry" />
          <option value="Physics" />
          <option value="Geography" />
          <option value="History" />
          <option value="Business Studies" />
          <option value="Economics" />
          <option value="Computer Science" />
        </datalist>

        <select
          name="class_level"
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Select class / level</option>
          <option value="Year 5">Year 5</option>
          <option value="Year 6">Year 6</option>
          <option value="Year 7">Year 7</option>
          <option value="Year 8">Year 8</option>
          <option value="Year 9">Year 9</option>
          <option value="IGCSE">IGCSE</option>
          <option value="AS Level">AS Level</option>
          <option value="A Level">A Level</option>
          <option value="IB Middle Years">IB Middle Years</option>
          <option value="IB Diploma">IB Diploma</option>
        </select>

        <button
          onClick={() =>
            onBook(
              slot,
              parentName,
              studentName,
              parentEmail,
              parentPhone,
              curriculum,
              subject,
              classLevel
            )
          }
          disabled={!parentName || !studentName || bookingState === "booking"}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {bookingState === "booking" ? "Booking..." : "Book This Slot"}
        </button>

        {message ? (
          <p className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}