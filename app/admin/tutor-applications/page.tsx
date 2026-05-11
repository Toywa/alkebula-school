"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type SubjectRate = {
  curriculum_level: string;
  subject: string;
  hourly_rate: number;
};

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
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

  public_profile_photo_url?: string | null;
  signed_cv_url?: string | null;
  signed_degree_certificate_url?: string | null;
  signed_high_school_certificate_url?: string | null;
};

type InterviewFormState = {
  interview_at: string;
  interview_notes: string;
};

const ADMIN_ALLOWED_EMAILS = ["sunscapecars@gmail.com"];

function getPublicProfilePhotoUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/educator-profile-images/${path}`;
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

  async function createDocumentSignedUrl(path?: string | null) {
    if (!path) return null;

    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase.storage
      .from("educator-documents")
      .createSignedUrl(path, 60 * 60);

    if (error) {
      console.error("Signed URL error:", error.message);
      return null;
    }

    return data.signedUrl;
  }

  async function loadApplications() {
    setLoading(true);
    setErrorMessage("");

    const res = await fetch("/api/educator-applications");
    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.error || "Failed to load applications");
      setLoading(false);
      return;
    }

    const rawApplications: Application[] = data.data || [];

    const loadedApplications = await Promise.all(
      rawApplications.map(async (app) => ({
        ...app,
        public_profile_photo_url: getPublicProfilePhotoUrl(app.profile_photo_url),
        signed_cv_url: await createDocumentSignedUrl(app.cv_url),
        signed_degree_certificate_url: await createDocumentSignedUrl(
          app.degree_certificate_url
        ),
        signed_high_school_certificate_url: await createDocumentSignedUrl(
          app.high_school_certificate_url
        ),
      }))
    );

    setApplications(loadedApplications);

    const initialForms: Record<string, InterviewFormState> = {};
    loadedApplications.forEach((app) => {
      initialForms[app.id] = {
        interview_at: "",
        interview_notes: "",
      };
    });

    setInterviewForms(initialForms);
    setLoading(false);
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

      const res = await fetch(`/api/educator-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage(successMessage);
      await loadApplications();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Update failed");
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
        interview_notes:
          form.interview_notes || "Interview scheduled by admin.",
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
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-4xl font-bold">Tutor Applications</h1>

        <p className="mt-4 max-w-3xl text-slate-600">
          Review tutor applications, uploaded documents, references, subject
          rates, interview scheduling, and approval status.
        </p>

        {message ? <p className="mt-4 text-green-600">{message}</p> : null}
        {errorMessage ? (
          <p className="mt-4 text-red-600">{errorMessage}</p>
        ) : null}

        {loading ? (
          <p className="mt-8">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No tutor applications yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {app.public_profile_photo_url ? (
                      <img
                        src={app.public_profile_photo_url}
                        alt={app.full_name}
                        className="h-28 w-28 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-500">
                        No photo
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-semibold">
                        {app.full_name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {app.email}
                      </p>
                      <p className="text-sm text-slate-600">{app.phone}</p>
                      <p className="text-sm text-slate-600">
                        City: {app.city || "—"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Base / lowest rate:{" "}
                        <span className="font-semibold">
                          {app.hourly_rate ? `$${app.hourly_rate}/hour` : "—"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {app.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                  <div>
                    <span className="font-medium">Bio:</span>{" "}
                    {app.proposed_public_bio || "—"}
                  </div>

                  <div>
                    <span className="font-medium">Applied:</span>{" "}
                    {app.created_at
                      ? new Date(app.created_at).toLocaleString()
                      : "—"}
                  </div>

                  <div>
                    <span className="font-medium">Subjects:</span>{" "}
                    {app.subjects?.join(", ") || "—"}
                  </div>

                  <div>
                    <span className="font-medium">Curricula:</span>{" "}
                    {app.curricula?.join(", ") || "—"}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold">Subject Rates</h3>

                  {app.subject_rates && app.subject_rates.length > 0 ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {app.subject_rates.map((item, index) => (
                        <div
                          key={`${item.curriculum_level}-${item.subject}-${index}`}
                          className="rounded-xl border border-slate-200 bg-white p-4 text-sm"
                        >
                          <p className="font-semibold">{item.subject}</p>
                          <p className="mt-1 text-slate-600">
                            {item.curriculum_level}
                          </p>
                          <p className="mt-2 font-semibold text-slate-900">
                            USD {item.hourly_rate}/hour
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No detailed subject rates saved.
                    </p>
                  )}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold">Professional References</h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                      <p className="font-semibold">Referee 1</p>
                      <p className="mt-2">
                        Name: {app.referee_1_name || "—"}
                      </p>
                      <p>Email: {app.referee_1_email || "—"}</p>
                      <p>Phone: {app.referee_1_phone || "—"}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                      <p className="font-semibold">Referee 2</p>
                      <p className="mt-2">
                        Name: {app.referee_2_name || "—"}
                      </p>
                      <p>Email: {app.referee_2_email || "—"}</p>
                      <p>Phone: {app.referee_2_phone || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold">Uploaded Documents</h3>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {app.public_profile_photo_url ? (
                      <a
                        href={app.public_profile_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                      >
                        View Profile Photo
                      </a>
                    ) : null}

                    {app.signed_cv_url ? (
                      <a
                        href={app.signed_cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                      >
                        View CV
                      </a>
                    ) : null}

                    {app.signed_degree_certificate_url ? (
                      <a
                        href={app.signed_degree_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                      >
                        View University Certificate
                      </a>
                    ) : null}

                    {app.signed_high_school_certificate_url ? (
                      <a
                        href={app.signed_high_school_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
                      >
                        View High School Certificate
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold">Schedule Interview</h3>

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
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
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
                    className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50"
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
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
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