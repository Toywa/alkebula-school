"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type SubjectRate = {
  curriculum_level: string;
  class_level?: string | null;
  student_level?: string | null;
  level?: string | null;
  subject: string;
  hourly_rate: number;
};

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  qualification?: string | null;
  years_of_experience?: number | null;
  hourly_rate?: number | null;
  proposed_public_bio: string;
  subjects: string[];
  curricula: string[];
  subject_rates?: SubjectRate[] | null;
  status: string;
  created_at: string;

  referee_1_name?: string | null;
  referee_1_email?: string | null;
  referee_1_phone?: string | null;
  referee_2_name?: string | null;
  referee_2_email?: string | null;
  referee_2_phone?: string | null;

  profile_photo_url?: string | null;
  cv_url?: string | null;
  degree_certificate_url?: string | null;
  high_school_certificate_url?: string | null;

  signed_profile_photo_url?: string | null;
  signed_cv_url?: string | null;
  signed_degree_certificate_url?: string | null;
  signed_high_school_certificate_url?: string | null;

  declaration_no_criminal_past?: boolean | null;
  declaration_internet_15mbps?: boolean | null;
  declaration_has_i5_laptop?: boolean | null;
  declaration_information_true?: boolean | null;
};

type InterviewFormState = {
  interview_at: string;
  interview_notes: string;
};

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

function getRateLevel(item: SubjectRate) {
  return item.class_level || item.student_level || item.level || "Level not specified";
}

function yesNo(value?: boolean | null) {
  return value ? "Yes" : "No";
}

export default function TutorApplicationsAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [applications, setApplications] = useState<Application[]>([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState("");
  const [interviewForms, setInterviewForms] = useState<
    Record<string, InterviewFormState>
  >({});

  useEffect(() => {
    async function checkAdmin() {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const email = user.email?.toLowerCase() || "";

      if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
        setAuthorized(false);
        setCheckingAuth(false);
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
    }

    checkAdmin();
  }, []);

  useEffect(() => {
    if (authorized) loadApplications();
  }, [authorized]);

  async function loadApplications() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session expired. Please sign in again.");
      }

      const res = await fetch("/api/admin/tutor-applications", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load applications.");
      }

      const loadedApplications: Application[] = data.data || [];

      setApplications(loadedApplications);

      const initialForms: Record<string, InterviewFormState> = {};
      loadedApplications.forEach((app) => {
        initialForms[app.id] = {
          interview_at: "",
          interview_notes: "",
        };
      });

      setInterviewForms(initialForms);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateInterviewForm(
    id: string,
    field: keyof InterviewFormState,
    value: string
  ) {
    setInterviewForms((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { interview_at: "", interview_notes: "" }),
        [field]: value,
      },
    }));
  }

  async function updateApplication(
    id: string,
    payload: Record<string, unknown>,
    successMessage: string
  ) {
    try {
      setActingId(id);
      setMessage("");
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session expired. Please sign in again.");
      }

      const res = await fetch(`/api/educator-applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed.");
      }

      setMessage(successMessage);
      await loadApplications();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setActingId("");
    }
  }

  async function scheduleInterview(app: Application) {
    const form = interviewForms[app.id];

    if (!form?.interview_at) {
      setErrorMessage("Please choose an interview date and time first.");
      return;
    }

    await updateApplication(
      app.id,
      {
        action: "schedule_interview",
        interview_at: new Date(form.interview_at).toISOString(),
        interview_notes: form.interview_notes || "Interview scheduled by admin.",
      },
      "Interview scheduled."
    );
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl">Checking admin access...</div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">Access denied</h1>
          <p className="mt-4 text-red-700">
            This page is restricted to approved platform administrators only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Admin Review
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Tutor Applications
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-slate-600">
            Review tutor applications, uploaded documents, references, subject
            rates, interview scheduling, and approval status.
          </p>
        </div>

        {message ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <p className="mt-8">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No tutor applications yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex flex-wrap gap-5">
                    {app.signed_profile_photo_url ? (
                      <img
                        src={app.signed_profile_photo_url}
                        alt={app.full_name}
                        className="h-32 w-32 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-500">
                        No photo
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-bold text-slate-950">
                        {app.full_name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {app.email}
                      </p>

                      <p className="text-sm text-slate-600">{app.phone}</p>

                      <p className="mt-3 text-sm text-slate-600">
                        City:{" "}
                        <span className="font-semibold text-slate-900">
                          {app.city || "—"}
                        </span>
                      </p>

                      <p className="text-sm text-slate-600">
                        Qualification:{" "}
                        <span className="font-semibold text-slate-900">
                          {app.qualification || "—"}
                        </span>
                      </p>

                      <p className="text-sm text-slate-600">
                        Experience:{" "}
                        <span className="font-semibold text-slate-900">
                          {app.years_of_experience
                            ? `${app.years_of_experience} years`
                            : "—"}
                        </span>
                      </p>

                      <p className="text-sm text-slate-600">
                        Base / lowest rate:{" "}
                        <span className="font-semibold text-slate-900">
                          {app.hourly_rate ? `USD ${app.hourly_rate}/hour` : "—"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#379CD6]/20 bg-[#F7FCFF] px-4 py-2 text-sm font-bold text-[#156B96]">
                    {app.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 text-sm text-slate-700 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="font-bold text-slate-950">Bio:</span>{" "}
                    {app.proposed_public_bio || "—"}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="font-bold text-slate-950">Applied:</span>{" "}
                    {app.created_at
                      ? new Date(app.created_at).toLocaleString()
                      : "—"}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="font-bold text-slate-950">Subjects:</span>{" "}
                    {app.subjects?.length ? app.subjects.join(", ") : "—"}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="font-bold text-slate-950">Curricula:</span>{" "}
                    {app.curricula?.length ? app.curricula.join(", ") : "—"}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F7FCFF] p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    Subject Rates
                  </h3>

                  {app.subject_rates && app.subject_rates.length > 0 ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="hidden grid-cols-4 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#156B96] md:grid">
                        <span>Curriculum</span>
                        <span>Class / Level</span>
                        <span>Subject</span>
                        <span>Rate</span>
                      </div>

                      <div className="divide-y divide-slate-200">
                        {app.subject_rates.map((item, index) => (
                          <div
                            key={`${item.curriculum_level}-${item.subject}-${index}`}
                            className="grid gap-3 px-4 py-4 text-sm md:grid-cols-4"
                          >
                            <span>
                              <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                                Curriculum
                              </span>
                              {item.curriculum_level || "—"}
                            </span>

                            <span>
                              <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                                Class / Level
                              </span>
                              {getRateLevel(item)}
                            </span>

                            <span>
                              <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                                Subject
                              </span>
                              <strong>{item.subject || "—"}</strong>
                            </span>

                            <span>
                              <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                                Rate
                              </span>
                              <strong className="text-[#8F1F36]">
                                USD {item.hourly_rate}/hour
                              </strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No detailed subject rates saved.
                    </p>
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    Uploaded Documents
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {app.signed_profile_photo_url ? (
                      <a
                        href={app.signed_profile_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        View Profile Photo
                      </a>
                    ) : null}

                    {app.signed_cv_url ? (
                      <a
                        href={app.signed_cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        View CV
                      </a>
                    ) : null}

                    {app.signed_degree_certificate_url ? (
                      <a
                        href={app.signed_degree_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        View University Certificate
                      </a>
                    ) : null}

                    {app.signed_high_school_certificate_url ? (
                      <a
                        href={app.signed_high_school_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        View High School Certificate
                      </a>
                    ) : null}
                  </div>

                  {!app.signed_profile_photo_url &&
                  !app.signed_cv_url &&
                  !app.signed_degree_certificate_url &&
                  !app.signed_high_school_certificate_url ? (
                    <p className="mt-3 text-sm text-red-600">
                      No accessible document links found for this application.
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    Professional References
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                      <p className="font-bold text-slate-950">Referee 1</p>
                      <p className="mt-2">Name: {app.referee_1_name || "—"}</p>
                      <p>Email: {app.referee_1_email || "—"}</p>
                      <p>Phone: {app.referee_1_phone || "—"}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                      <p className="font-bold text-slate-950">Referee 2</p>
                      <p className="mt-2">Name: {app.referee_2_name || "—"}</p>
                      <p>Email: {app.referee_2_email || "—"}</p>
                      <p>Phone: {app.referee_2_phone || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    Declarations
                  </h3>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <p>No criminal past: {yesNo(app.declaration_no_criminal_past)}</p>
                    <p>15 Mbps internet: {yesNo(app.declaration_internet_15mbps)}</p>
                    <p>Has i5 laptop: {yesNo(app.declaration_has_i5_laptop)}</p>
                    <p>Information true: {yesNo(app.declaration_information_true)}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    Schedule Interview
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Interview date and time
                      </label>
                      <input
                        type="datetime-local"
                        value={interviewForms[app.id]?.interview_at || ""}
                        onChange={(e) =>
                          updateInterviewForm(
                            app.id,
                            "interview_at",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Interview notes
                      </label>
                      <input
                        type="text"
                        value={interviewForms[app.id]?.interview_notes || ""}
                        onChange={(e) =>
                          updateInterviewForm(
                            app.id,
                            "interview_notes",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Google Meet / phone interview / documents to verify"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    disabled={actingId === app.id}
                    onClick={() => scheduleInterview(app)}
                    className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-5 py-3 text-sm font-bold text-[#156B96] disabled:opacity-50"
                  >
                    {actingId === app.id ? "Working..." : "Schedule Interview"}
                  </button>

                  <button
                    disabled={actingId === app.id}
                    onClick={() =>
                      updateApplication(
                        app.id,
                        {
                          action: "reject",
                          rejection_reason:
                            "Application did not meet current review criteria.",
                        },
                        "Application rejected."
                      )
                    }
                    className="rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-50"
                  >
                    {actingId === app.id ? "Working..." : "Reject"}
                  </button>

                  <button
                    disabled={actingId === app.id}
                    onClick={() =>
                      updateApplication(
                        app.id,
                        { action: "approve" },
                        "Application approved and tutor added to directory."
                      )
                    }
                    className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {actingId === app.id ? "Working..." : "Approve"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}