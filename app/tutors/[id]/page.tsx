"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Tutor = {
  id: string;
  email: string;
  full_name: string;
  bio: string | null;
  city: string | null;
  subjects: string[] | null;
  curricula: string[] | null;
  hourly_rate: number | null;
  profile_photo_url: string | null;
};

type Slot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export default function TutorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [parentEmail, setParentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  useEffect(() => {
    loadTutor();
  }, []);

  function getImageUrl(path?: string | null) {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/educator-profile-images/${path}`;
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
      setSubject(tutorData.subjects?.[0] || "");
      setCurriculum(tutorData.curricula?.[0] || "");

      const { data: slotData } = await supabase
        .from("tutor_availability_slots")
        .select("*")
        .eq("tutor_email", tutorData.email)
        .eq("is_booked", false)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      setSlots(slotData || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load tutor."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBooking(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!tutor) throw new Error("Tutor profile missing.");

      const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

      if (!selectedSlot) {
        throw new Error("Please select an available slot.");
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
          subject,
          curriculum,
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
      setErrorMessage(
        error instanceof Error ? error.message : "Booking failed."
      );
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
              <img
                src={imageUrl}
                alt={tutor.full_name}
                className="h-80 w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                No profile photo
              </div>
            )}

            <h1 className="mt-6 text-3xl font-bold">{tutor.full_name}</h1>

            <p className="mt-2 text-slate-600">
              {tutor.city || "Available online"}
            </p>

            {tutor.hourly_rate ? (
              <p className="mt-4 text-lg font-semibold">
                USD {tutor.hourly_rate}/hour
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Approved Educator
            </p>

            <h2 className="mt-3 text-4xl font-bold">Book a Lesson</h2>

            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              {tutor.bio || "Approved Alkebula School educator."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="font-semibold">Subjects</p>
                <p className="mt-2 text-slate-600">
                  {tutor.subjects?.join(", ") || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="font-semibold">Curricula</p>
                <p className="mt-2 text-slate-600">
                  {tutor.curricula?.join(", ") || "—"}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleBooking}
              className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-2xl font-semibold">Request Booking</h3>

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

                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                >
                  {(tutor.subjects || []).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                >
                  {(tutor.curricula || []).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3"
                  required
                >
                  <option value="">Select available slot</option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.date} — {slot.start_time} to {slot.end_time}
                    </option>
                  ))}
                </select>
              </div>

              {slots.length === 0 ? (
                <p className="mt-4 text-sm text-amber-700">
                  This tutor has not published available slots yet.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={booking || slots.length === 0}
                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {booking ? "Booking..." : "Book Lesson"}
              </button>

              {message ? <p className="mt-4 text-green-600">{message}</p> : null}
              {errorMessage ? (
                <p className="mt-4 text-red-600">{errorMessage}</p>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}