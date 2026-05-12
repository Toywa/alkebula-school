"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type SubjectRate = {
  curriculum_level: string;
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
};

type Slot = {
  id: string;
  date: string;
  slot_date?: string | null;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

function getImageUrl(path?: string | null) {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/educator-profile-images/${path}`;
}

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [parentEmail, setParentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedSubjectRateIndex, setSelectedSubjectRateIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  useEffect(() => {
    loadTutor();
  }, []);

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(time: string) {
    return time?.slice(0, 5);
  }

  async function loadTutor() {
    try {
      const supabase = getSupabaseBrowserClient();

      const { data: tutorData, error: tutorError } = await supabase
        .from("educator_directory")
        .select("*")
        .eq("id", params.id)
        .eq("approval_status", "approved")
        .eq("is_public", true)
        .single();

      if (tutorError || !tutorData) {
        throw new Error("Tutor profile not found.");
      }

      setTutor(tutorData);

      const { data: slotData } = await supabase
        .from("tutor_availability_slots")
        .select("*")
        .eq("tutor_email", tutorData.email)
        .eq("is_booked", false)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      const cleanSlots = (slotData || []).map((slot: any) => ({
        ...slot,
        date: slot.date || slot.slot_date,
      }));

      setSlots(cleanSlots);

      if (cleanSlots.length > 0) {
        setSelectedDate(cleanSlots[0].date);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load tutor."
      );
    } finally {
      setLoading(false);
    }
  }

  const subjectRateOptions = useMemo(() => {
    if (tutor?.subject_rates && tutor.subject_rates.length > 0) {
      return tutor.subject_rates;
    }

    return (tutor?.subjects || []).map((subject) => ({
      curriculum_level: tutor?.curricula?.[0] || "Not specified",
      subject,
      hourly_rate: Number(tutor?.hourly_rate || 0),
    }));
  }, [tutor]);

  const selectedSubjectRate = subjectRateOptions[selectedSubjectRateIndex];

  const availableDates = useMemo(() => {
    return Array.from(new Set(slots.map((slot) => slot.date).filter(Boolean)));
  }, [slots]);

  const slotsForSelectedDate = useMemo(() => {
    return slots.filter((slot) => slot.date === selectedDate);
  }, [slots, selectedDate]);

  async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBooking(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!tutor) throw new Error("Tutor profile missing.");
      if (!selectedSubjectRate) throw new Error("Please select a subject package.");

      const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

      if (!selectedSlot) {
        throw new Error("Please select an available time.");
      }

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentEmail,
          tutorEmail: tutor.email,
          studentName,
          subject: selectedSubjectRate.subject,
          curriculum: selectedSubjectRate.curriculum_level,
          hourlyRate: selectedSubjectRate.hourly_rate,
          date: selectedSlot.date,
          time: `${selectedSlot.start_time}-${selectedSlot.end_time}`,
          slotId: selectedSlot.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed.");
      }

      setMessage("Booking created successfully. Confirmation emails have been sent.");
      setParentEmail("");
      setStudentName("");
      setSelectedSlotId("");
      await loadTutor();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Booking failed.");
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        Loading tutor profile...
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <p className="text-red-600">{errorMessage || "Tutor not found."}</p>
      </main>
    );
  }

  const imageUrl = getImageUrl(tutor.profile_photo_url);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {imageUrl ? (
              <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={imageUrl}
                  alt={tutor.full_name}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                No profile photo
              </div>
            )}

            <h1 className="mt-6 text-3xl font-bold">{tutor.full_name}</h1>

            <p className="mt-2 text-slate-600">
              {tutor.city || "Available online"}
            </p>

            <p className="mt-4 text-sm text-slate-600">
              Rates vary by subject and curriculum.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Approved Educator
            </p>

            <h2 className="mt-3 text-4xl font-bold">Book a Lesson</h2>

            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              {tutor.bio || "Approved Alkebula School educator."}
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 p-5">
              <p className="font-semibold">Available Subject Packages</p>

              {subjectRateOptions.length === 0 ? (
                <p className="mt-2 text-slate-600">No subject rates listed.</p>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {subjectRateOptions.map((item, index) => (
                    <button
                      key={`${item.curriculum_level}-${item.subject}-${index}`}
                      type="button"
                      onClick={() => setSelectedSubjectRateIndex(index)}
                      className={`rounded-xl border p-4 text-left text-sm transition ${
                        selectedSubjectRateIndex === index
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block font-semibold">{item.subject}</span>
                      <span className="mt-1 block text-xs opacity-80">
                        {item.curriculum_level}
                      </span>
                      <span className="mt-2 block font-bold">
                        USD {item.hourly_rate}/hour
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={handleBooking}
              className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-2xl font-semibold">Request Booking</h3>

              {selectedSubjectRate ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                  <p className="font-semibold">Selected Lesson</p>
                  <p className="mt-1 text-slate-600">
                    {selectedSubjectRate.subject} —{" "}
                    {selectedSubjectRate.curriculum_level}
                  </p>
                  <p className="mt-2 font-bold">
                    USD {selectedSubjectRate.hourly_rate}/hour
                  </p>
                </div>
              ) : null}

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="Parent email"
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                />

                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student name"
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                />
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold">Choose a date</p>

                {availableDates.length === 0 ? (
                  <p className="text-sm text-amber-700">
                    This tutor has not published available slots yet.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlotId("");
                        }}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          selectedDate === date
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="block font-semibold">{formatDate(date)}</span>
                        <span className="text-xs opacity-80">
                          {slots.filter((slot) => slot.date === date).length} slots
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedDate && slotsForSelectedDate.length > 0 ? (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold">Choose a time</p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {slotsForSelectedDate.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          selectedSlotId === slot.id
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={booking || slots.length === 0 || !selectedSubjectRate}
                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {booking ? "Booking..." : "Book Lesson"}
              </button>

              {message ? <p className="mt-4 text-green-600">{message}</p> : null}
              {errorMessage ? <p className="mt-4 text-red-600">{errorMessage}</p> : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}