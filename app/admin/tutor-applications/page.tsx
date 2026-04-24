"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  proposed_public_bio: string;
  subjects: string[];
  curricula: string[];
  status: string;
  created_at: string;
};

type InterviewFormState = {
  interview_at: string;
  interview_notes: string;
};

export default function TutorApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState("");
  const [interviewForms, setInterviewForms] = useState<
    Record<string, InterviewFormState>
  >({});

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

    const loadedApplications = data.data || [];
    setApplications(loadedApplications);

    const initialForms: Record<string, InterviewFormState> = {};
    loadedApplications.forEach((app: Application) => {
      initialForms[app.id] = {
        interview_at: "",
        interview_notes: "",
      };
    });

    setInterviewForms(initialForms);
    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

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

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

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

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-4xl font-bold">Tutor Applications</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Review tutor applications, schedule interviews, reject unsuitable
          candidates, or approve educators for public listing.
        </p>

        {message ? <p className="mt-4 text-green-600">{message}</p> : null}
        {errorMessage ? <p className="mt-4 text-red-600">{errorMessage}</p> : null}

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
                  <div>
                    <h2 className="text-2xl font-semibold">{app.full_name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{app.email}</p>
                    <p className="text-sm text-slate-600">{app.phone}</p>
                    <p className="text-sm text-slate-600">City: {app.city}</p>
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
                    <span className="font-medium">Subjects:</span>{" "}
                    {app.subjects?.join(", ") || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Curricula:</span>{" "}
                    {app.curricula?.join(", ") || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Applied:</span>{" "}
                    {app.created_at
                      ? new Date(app.created_at).toLocaleString()
                      : "—"}
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