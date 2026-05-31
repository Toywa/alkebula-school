"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

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
  class_levels?: string[] | null;
  student_levels?: string[] | null;
  timezone?: string | null;
};

type Slot = {
  id: string;
  date: string;
  slot_date?: string | null;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

function getPublicTutorName(fullName?: string | null) {
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

function truncateBio(text?: string | null, max = 200) {
  if (!text) return "Approved Alkebula School educator.";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
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

function getRateLevel(item: SubjectRate) {
  return item.class_level || item.student_level || item.level || "Level on request";
}

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
  const [selectedSubjectRateIndex, setSelectedSubjectRateIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  useEffect(() => {
    loadTutor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setParentEmail(user.email.toLowerCase());
      }

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
      class_level: tutor?.class_levels?.[0] || tutor?.student_levels?.[0] || null,
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
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        window.location.href = "/auth/sign-in";
        return;
      }

      if (!tutor) throw new Error("Tutor profile missing.");
      if (!selectedSubjectRate) {
        throw new Error("Please select a subject package.");
      }

      const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

      if (!selectedSlot) {
        throw new Error("Please select an available time.");
      }

      if (!studentName.trim()) {
        throw new Error("Please enter the student name.");
      }

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          tutorEmail: tutor.email,
          studentName,
          subject: selectedSubjectRate.subject,
          curriculum: selectedSubjectRate.curriculum_level,
          slotId: selectedSlot.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed.");
      }

      setMessage("Booking created successfully. Confirmation emails have been sent.");
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
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-600">Loading tutor profile...</p>
        </div>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            {errorMessage || "Tutor not found."}
          </p>
        </div>
      </main>
    );
  }

  const imageUrl = `/api/tutor-photo?id=${tutor.id}`;
  const shortBio = truncateBio(tutor.bio, 200);
  const publicTutorName = getPublicTutorName(tutor.full_name);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:items-center">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
              <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <img
                  src={imageUrl}
                  alt={publicTutorName}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Approved Alkebula Tutor
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                {publicTutorName}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#379CD6]/20 bg-[#F7FCFF] px-4 py-2 text-sm font-bold text-[#156B96]">
                  {getQualification(tutor)}
                </span>

                <span className="rounded-full border border-[#379CD6]/20 bg-[#F7FCFF] px-4 py-2 text-sm font-bold text-[#156B96]">
                  {getExperience(tutor)}
                </span>

                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {tutor.city || "Available online"}
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
                {shortBio}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#booking"
                  className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
                >
                  Book Available Slot
                </a>

                <Link
                  href={`/enquire/${tutor.id}`}
                  className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
                >
                  Request This Tutor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Tutor Summary
              </p>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Qualification
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {getQualification(tutor)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Experience
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {getExperience(tutor)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Curricula
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {tutor.curricula?.join(", ") || "Available on request"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Subjects
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {tutor.subjects?.join(", ") || "Available on request"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#379CD6]/15 bg-[#F7FCFF] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#156B96]">
                Easier Parent Matching
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                If this tutor has not opened a suitable slot, you can still
                request them. Share your preferred days, time window, subject,
                and learner level so Alkebula can help coordinate the next step.
              </p>

              <Link
                href={`/enquire/${tutor.id}`}
                className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#8F1F36] shadow-sm transition hover:bg-[#EEF9FF]"
              >
                Request This Tutor
              </Link>
            </div>
          </div>

          <div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Subjects, Levels and Rates
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Available subject packages.
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Rates may vary by subject, curriculum and learner level.
              </p>

              {subjectRateOptions.length === 0 ? (
                <p className="mt-6 text-slate-600">No subject rates listed.</p>
              ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="hidden grid-cols-4 bg-[#F7FCFF] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#156B96] md:grid">
                    <span>Curriculum</span>
                    <span>Class / Level</span>
                    <span>Subject</span>
                    <span>Rate</span>
                  </div>

                  <div className="divide-y divide-slate-200 bg-white">
                    {subjectRateOptions.map((item, index) => (
                      <button
                        key={`${item.curriculum_level}-${item.subject}-${index}`}
                        type="button"
                        onClick={() => setSelectedSubjectRateIndex(index)}
                        className={`grid w-full gap-3 px-4 py-4 text-left text-sm transition md:grid-cols-4 ${
                          selectedSubjectRateIndex === index
                            ? "bg-[#FFF5F7]"
                            : "bg-white hover:bg-[#F7FCFF]"
                        }`}
                      >
                        <span>
                          <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                            Curriculum
                          </span>
                          <span className="font-semibold text-slate-900">
                            {item.curriculum_level}
                          </span>
                        </span>

                        <span>
                          <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                            Class / Level
                          </span>
                          <span className="text-slate-700">
                            {getRateLevel(item)}
                          </span>
                        </span>

                        <span>
                          <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                            Subject
                          </span>
                          <span className="font-semibold text-slate-900">
                            {item.subject}
                          </span>
                        </span>

                        <span>
                          <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                            Rate
                          </span>
                          <span className="font-bold text-[#8F1F36]">
                            USD {item.hourly_rate}/hr
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              id="booking"
              onSubmit={handleBooking}
              className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Book a Lesson
              </p>

              <h3 className="mt-3 text-3xl font-bold text-slate-950">
                Book an available slot.
              </h3>

              {selectedSubjectRate ? (
                <div className="mt-5 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-4 text-sm">
                  <p className="font-bold text-[#156B96]">Selected Lesson</p>
                  <p className="mt-1 text-slate-700">
                    {selectedSubjectRate.subject} —{" "}
                    {selectedSubjectRate.curriculum_level}
                  </p>
                  <p className="mt-2 font-bold text-[#8F1F36]">
                    USD {selectedSubjectRate.hourly_rate}/hour
                  </p>
                </div>
              ) : null}

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  value={parentEmail}
                  readOnly
                  placeholder="Parent email"
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600"
                />

                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student name"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#379CD6] focus:outline-none focus:ring-2 focus:ring-[#379CD6]/15"
                  required
                />
              </div>

              {!parentEmail ? (
                <p className="mt-3 text-sm font-semibold text-[#8F1F36]">
                  Please sign in before booking a lesson.
                </p>
              ) : null}

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Choose a date
                </p>

                {availableDates.length === 0 ? (
                  <div className="rounded-2xl border border-[#379CD6]/20 bg-[#F7FCFF] p-5">
                    <p className="text-sm font-semibold text-[#156B96]">
                      This tutor has not published available slots yet.
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      You can still request this tutor and share your preferred
                      schedule. Alkebula will help coordinate availability.
                    </p>

                    <Link
                      href={`/enquire/${tutor.id}`}
                      className="mt-4 inline-flex rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
                    >
                      Request This Tutor
                    </Link>
                  </div>
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
                            ? "border-[#8F1F36] bg-[#8F1F36] text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-[#F7FCFF]"
                        }`}
                      >
                        <span className="block font-semibold">
                          {formatDate(date)}
                        </span>
                        <span className="text-xs opacity-80">
                          {slots.filter((slot) => slot.date === date).length}{" "}
                          slots
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedDate && slotsForSelectedDate.length > 0 ? (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    Choose a time
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {slotsForSelectedDate.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          selectedSlotId === slot.id
                            ? "border-[#156B96] bg-[#156B96] text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-[#F7FCFF]"
                        }`}
                      >
                        {formatTime(slot.start_time)} -{" "}
                        {formatTime(slot.end_time)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={booking || slots.length === 0 || !selectedSubjectRate}
                className="mt-6 rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729] disabled:opacity-60"
              >
                {booking ? "Booking..." : "Book Lesson"}
              </button>

              {message ? (
                <p className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                  {message}
                </p>
              ) : null}

              {errorMessage ? (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {errorMessage}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}