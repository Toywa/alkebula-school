"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type SubjectRate = {
  curriculum_level: string;
  subject: string;
  hourly_rate: number;
};

const SUBJECT_CATEGORIES = [
  {
    label: "KEY STAGE 3 (KS3)",
    subjects: [
      "English Language",
      "English Literature",
      "French",
      "Spanish",
      "German",
      "Mandarin Chinese",
      "Arabic",
      "Swahili",
      "Mathematics",
      "Further Mathematics",
      "Computer Science",
      "ICT",
      "Digital Literacy",
      "General Science",
      "Biology",
      "Chemistry",
      "Physics",
      "Environmental Science",
      "Geography",
      "History",
      "Religious Studies",
      "Global Perspectives",
      "Citizenship",
      "Philosophy",
      "Economics",
      "Business Studies",
    ],
  },
  {
    label: "CAMBRIDGE IGCSE",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Combined Science",
      "Environmental Management",
      "Mathematics",
      "Additional Mathematics",
      "Computer Science",
      "ICT",
      "Statistics",
      "Accounting",
      "Business Studies",
      "Economics",
      "Geography",
      "History",
      "Psychology",
      "Sociology",
      "English First Language",
      "English Literature",
      "French",
      "Spanish",
      "German",
      "Arabic",
      "Swahili",
      "Chinese",
      "Art & Design",
      "Drama",
      "Music",
      "Physical Education",
    ],
  },
  {
    label: "EDEXCEL INTERNATIONAL GCSE",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Human Biology",
      "Mathematics A",
      "Mathematics B",
      "Further Pure Mathematics",
      "Computer Science",
      "ICT",
      "Accounting",
      "Business",
      "Economics",
      "Geography",
      "History",
      "English Language A",
      "English Literature",
      "French",
      "Spanish",
      "German",
      "Arabic",
      "Chinese",
      "Swahili",
    ],
  },
  {
    label: "CAMBRIDGE INTERNATIONAL A LEVELS",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Marine Science",
      "Mathematics",
      "Further Mathematics",
      "Computer Science",
      "Information Technology",
      "Accounting",
      "Business",
      "Economics",
      "Geography",
      "History",
      "Law",
      "Psychology",
      "Sociology",
      "English Language",
      "English Literature",
      "French",
      "German",
      "Spanish",
      "Arabic",
      "Art & Design",
      "Drama",
      "Music",
    ],
  },
  {
    label: "EDEXCEL INTERNATIONAL A LEVELS",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Mathematics",
      "Further Mathematics",
      "Information Technology",
      "Computer Science",
      "Accounting",
      "Business",
      "Economics",
      "Geography",
      "History",
      "Law",
      "Psychology",
      "English Language",
      "English Literature",
      "French",
      "German",
      "Spanish",
      "Arabic",
    ],
  },
  {
    label: "IB MIDDLE YEARS PROGRAMME (IB MYP)",
    subjects: [
      "English Language & Literature",
      "Arabic Language & Literature",
      "French Language & Literature",
      "English Acquisition",
      "French Acquisition",
      "Spanish Acquisition",
      "Mathematics",
      "Extended Mathematics",
      "Integrated Sciences",
      "Biology",
      "Chemistry",
      "Physics",
      "History",
      "Geography",
      "Economics",
      "Global Politics",
      "Visual Arts",
      "Music",
      "Drama",
      "Film Studies",
    ],
  },
  {
    label: "IB DIPLOMA — STANDARD LEVEL (IB SL)",
    subjects: [
      "Language A: Literature",
      "Language A: Language & Literature",
      "Business Management",
      "Economics",
      "Geography",
      "History",
      "Psychology",
      "Biology",
      "Chemistry",
      "Physics",
      "Computer Science",
      "Mathematics: Analysis & Approaches",
      "Mathematics: Applications & Interpretation",
    ],
  },
  {
    label: "IB DIPLOMA — HIGHER LEVEL (IB HL)",
    subjects: [
      "Language A: Literature",
      "Language A: Language & Literature",
      "Business Management",
      "Economics",
      "Geography",
      "History",
      "Psychology",
      "Biology",
      "Chemistry",
      "Physics",
      "Computer Science",
      "Mathematics: Analysis & Approaches",
      "Mathematics: Applications & Interpretation",
    ],
  },
];

function sameCalendarMonth(dateA: Date, dateB: Date) {
  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth()
  );
}

export default function EducatorSubjectsPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [subjectRates, setSubjectRates] = useState<SubjectRate[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const userEmail = user.email.toLowerCase();
      setEmail(userEmail);

      const { data, error } = await supabase
        .from("educator_directory")
        .select("email,full_name,subject_rates,subject_rates_updated_at,approval_status")
        .eq("email", userEmail)
        .eq("approval_status", "approved")
        .single();

      if (error || !data) {
        throw new Error("Approved educator profile not found.");
      }

      setFullName(data.full_name || "");
      setSubjectRates(Array.isArray(data.subject_rates) ? data.subject_rates : []);
      setLastUpdatedAt(data.subject_rates_updated_at || null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load subjects."
      );
    } finally {
      setLoading(false);
    }
  }

  function isSelected(curriculumLevel: string, subject: string) {
    return subjectRates.some(
      (item) =>
        item.curriculum_level === curriculumLevel && item.subject === subject
    );
  }

  function selectedCountForCategory(curriculumLevel: string) {
    return subjectRates.filter(
      (item) => item.curriculum_level === curriculumLevel
    ).length;
  }

  function toggleSubject(curriculumLevel: string, subject: string) {
    const selected = isSelected(curriculumLevel, subject);

    if (selected) {
      setSubjectRates((prev) =>
        prev.filter(
          (item) =>
            !(
              item.curriculum_level === curriculumLevel &&
              item.subject === subject
            )
        )
      );
      return;
    }

    if (selectedCountForCategory(curriculumLevel) >= 2) {
      setErrorMessage(
        `You can select a maximum of 2 subjects under ${curriculumLevel}.`
      );
      return;
    }

    setErrorMessage("");

    setSubjectRates((prev) => [
      ...prev,
      {
        curriculum_level: curriculumLevel,
        subject,
        hourly_rate: 0,
      },
    ]);
  }

  function updateSubjectRate(
    curriculumLevel: string,
    subject: string,
    hourlyRate: number
  ) {
    setSubjectRates((prev) =>
      prev.map((item) =>
        item.curriculum_level === curriculumLevel && item.subject === subject
          ? { ...item, hourly_rate: hourlyRate }
          : item
      )
    );
  }

  async function saveSubjectRates() {
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (subjectRates.length < 1) {
        throw new Error("Please select at least one subject and hourly rate.");
      }

      const invalid = subjectRates.find(
        (item) => !item.hourly_rate || Number(item.hourly_rate) <= 0
      );

      if (invalid) {
        throw new Error(
          `Please enter a valid USD hourly rate for ${invalid.subject} under ${invalid.curriculum_level}.`
        );
      }

      if (lastUpdatedAt) {
        const last = new Date(lastUpdatedAt);
        const now = new Date();

        if (sameCalendarMonth(last, now)) {
          throw new Error(
            "You can update subjects and rates only once per calendar month."
          );
        }
      }

      const res = await fetch("/api/educator/subject-rates", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject_rates: subjectRates,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save subject rates.");
      }

      setMessage(
        "Subjects and rates updated successfully. Your public profile will now reflect the new subject packages."
      );

      await loadProfile();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save subject rates."
      );
    } finally {
      setSaving(false);
    }
  }

  const canUpdateThisMonth = !lastUpdatedAt
    ? true
    : !sameCalendarMonth(new Date(lastUpdatedAt), new Date());

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">Subjects & Rates</h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          Select the subjects and curriculum levels you teach, then set a
          separate USD hourly rate for each subject. You may select up to two
          subjects per curriculum category.
        </p>

        {email ? (
          <p className="mt-3 text-sm text-slate-500">
            Signed in as {fullName || email}
          </p>
        ) : null}

        {loading ? <p className="mt-8">Loading subjects...</p> : null}

        {message ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
            {message}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!loading ? (
          <>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              <p className="font-semibold">Important</p>
              <p className="mt-2 leading-7">
                Subject and rate changes affect what parents see on your public
                profile and what they pay when booking. To protect parents and
                platform trust, this page can only be updated once per calendar
                month.
              </p>

              {lastUpdatedAt ? (
                <p className="mt-3">
                  Last updated:{" "}
                  <strong>{new Date(lastUpdatedAt).toLocaleString()}</strong>
                </p>
              ) : null}

              {!canUpdateThisMonth ? (
                <p className="mt-3 font-semibold text-red-700">
                  You have already updated your subjects and rates this month.
                </p>
              ) : null}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Selected Subject Packages
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {subjectRates.length} subject package(s) selected.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={saveSubjectRates}
                  disabled={saving || !canUpdateThisMonth}
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Subjects & Rates"}
                </button>
              </div>

              {subjectRates.length > 0 ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {subjectRates.map((item, index) => (
                    <div
                      key={`${item.curriculum_level}-${item.subject}-${index}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 text-sm"
                    >
                      <p className="font-semibold">{item.subject}</p>
                      <p className="mt-1 text-slate-600">
                        {item.curriculum_level}
                      </p>
                      <p className="mt-2 font-semibold">
                        USD {Number(item.hourly_rate || 0).toFixed(2)}/hour
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-600">
                  No subject packages selected yet.
                </p>
              )}
            </div>

            <div className="mt-8 space-y-6">
              {SUBJECT_CATEGORIES.map((category) => (
                <div
                  key={category.label}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {category.label}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Select up to 2 subjects in this category.
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {selectedCountForCategory(category.label)}/2 selected
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {category.subjects.map((subject) => {
                      const selected = isSelected(category.label, subject);
                      const selectedItem = subjectRates.find(
                        (item) =>
                          item.curriculum_level === category.label &&
                          item.subject === subject
                      );

                      return (
                        <div
                          key={`${category.label}-${subject}`}
                          className={`rounded-xl border p-4 ${
                            selected
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <label className="flex items-start gap-3 text-sm">
                            <input
                              type="checkbox"
                              checked={selected}
                              disabled={!canUpdateThisMonth}
                              onChange={() =>
                                toggleSubject(category.label, subject)
                              }
                              className="mt-1"
                            />
                            <span className="font-medium">{subject}</span>
                          </label>

                          {selected ? (
                            <div className="mt-3">
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Hourly rate for this subject (USD)
                              </label>

                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={selectedItem?.hourly_rate || ""}
                                disabled={!canUpdateThisMonth}
                                onChange={(e) =>
                                  updateSubjectRate(
                                    category.label,
                                    subject,
                                    Number(e.target.value)
                                  )
                                }
                                placeholder="Example: 25"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}