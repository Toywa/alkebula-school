"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Application = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  primary_subject: string | null;
  curriculum_expertise: string | null;
  years_experience: number | null;
  teaching_mode: string | null;
  availability: string | null;
  hourly_rate: number | null;
  tsc_number: string | null;
  reference_name: string | null;
  reference_contact: string | null;
  chief_name: string | null;
  chief_contact: string | null;
  bio: string | null;
  status: string | null;
};

type DocumentRecord = {
  id: string;
  application_id: string;
  document_type: string | null;
  file_url: string | null;
  uploaded_at: string | null;
  signed_url: string | null;
};

type InterviewRecord = {
  id: string;
  application_id: string;
  scheduled_at: string | null;
  mode: string | null;
  interviewer: string | null;
  notes: string | null;
  outcome: string | null;
};

const STATUS_OPTIONS = [
  {
    value: "pending_review",
    label: "Return to Pending Review",
    shortLabel: "Pending Review",
    className: "bg-slate-700 hover:bg-slate-800",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  {
    value: "shortlisted",
    label: "Shortlist for Interview",
    shortLabel: "Shortlisted",
    className: "bg-blue-600 hover:bg-blue-700",
    badgeClass: "bg-blue-100 text-blue-800",
  },
  {
    value: "approved",
    label: "Approve Educator",
    shortLabel: "Approved",
    className: "bg-green-600 hover:bg-green-700",
    badgeClass: "bg-green-100 text-green-800",
  },
  {
    value: "rejected",
    label: "Reject Application",
    shortLabel: "Rejected",
    className: "bg-red-600 hover:bg-red-700",
    badgeClass: "bg-red-100 text-red-800",
  },
];

function normalizeStatus(status?: string | null) {
  const value = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  if (
    value === "" ||
    value === "pending" ||
    value === "pending_review" ||
    value === "under_review"
  ) {
    return "pending_review";
  }

  if (
    value === "shortlisted" ||
    value === "shortlisted_for_interview" ||
    value === "interview" ||
    value === "interview_stage" ||
    value === "interview_scheduled"
  ) {
    return "shortlisted";
  }

  if (value === "approved" || value === "accepted") {
    return "approved";
  }

  if (value === "rejected" || value === "declined") {
    return "rejected";
  }

  return "pending_review";
}

function getStatusConfig(status?: string | null) {
  const normalized = normalizeStatus(status);
  return (
    STATUS_OPTIONS.find((option) => option.value === normalized) ||
    STATUS_OPTIONS[0]
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function displayValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function FieldCard({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-slate-900">
        {displayValue(value)}
      </p>
    </div>
  );
}

export default function AdminApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [app, setApp] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [scheduledAt, setScheduledAt] = useState("");
  const [mode, setMode] = useState("online");
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");

  const statusConfig = useMemo(() => getStatusConfig(app?.status), [app?.status]);

  useEffect(() => {
    loadApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadApplication() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin-application/${params.id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load application.");
      }

      setApp(result.application || null);
      setDocuments(result.documents || []);
      setInterviews(result.interviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: string) {
    setStatusLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/applications/${params.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status.");
      }

      setApp((prev) =>
        prev
          ? {
              ...prev,
              status: normalizeStatus(result.application?.status || status),
            }
          : prev
      );

      const newStatus = getStatusConfig(result.application?.status || status);
      setMessage(`Application moved to ${newStatus.shortLabel}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setStatusLoading(false);
    }
  }

  async function scheduleInterview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInterviewLoading(true);
    setMessage("");
    setError("");

    try {
      if (!scheduledAt) {
        throw new Error("Please choose the interview date and time.");
      }

      if (!interviewer.trim()) {
        throw new Error("Please enter the interviewer name.");
      }

      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: params.id,
          scheduledAt,
          mode,
          interviewer,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to schedule interview.");
      }

      setInterviews((prev) => [result.interview, ...prev]);
      await updateStatus("shortlisted");

      setMessage("Interview scheduled and applicant shortlisted successfully.");
      setScheduledAt("");
      setMode("online");
      setInterviewer("");
      setNotes("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Interview scheduling failed."
      );
    } finally {
      setInterviewLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-6 text-slate-900 lg:p-10">
        Loading application...
      </main>
    );
  }

  if (error && !app) {
    return (
      <main className="min-h-screen bg-white p-6 text-red-600 lg:p-10">
        {error}
      </main>
    );
  }

  if (!app) {
    return (
      <main className="min-h-screen bg-white p-6 text-red-600 lg:p-10">
        Application not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900 lg:p-10">
      <Link
        href="/admin/applications"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to applications
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Educator Application
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {app.full_name || "Unnamed applicant"}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${statusConfig.badgeClass}`}
              >
                {statusConfig.shortLabel}
              </span>

              <span className="text-sm text-slate-600">
                {app.email || "No email provided"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateStatus(option.value)}
                disabled={
                  statusLoading || normalizeStatus(app.status) === option.value
                }
                className={`rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${option.className}`}
              >
                {statusLoading ? "Updating..." : option.label}
              </button>
            ))}
          </div>
        </div>

        {normalizeStatus(app.status) === "approved" ? (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            This applicant is approved. Next we should confirm that the approval
            API creates or updates their public educator profile.
          </div>
        ) : null}
      </div>

      {message ? (
        <div className="mt-5 rounded-2xl bg-green-50 p-4 text-green-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Applicant Details</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FieldCard label="Email" value={app.email} />
          <FieldCard label="Phone" value={app.phone} />
          <FieldCard label="Location" value={app.location} />
          <FieldCard label="Primary Subject" value={app.primary_subject} />
          <FieldCard label="Curriculum Expertise" value={app.curriculum_expertise} />
          <FieldCard label="Years Experience" value={app.years_experience} />
          <FieldCard label="Teaching Mode" value={app.teaching_mode} />
          <FieldCard label="Availability" value={app.availability} />
          <FieldCard
            label="Hourly Rate"
            value={
              app.hourly_rate !== null && app.hourly_rate !== undefined
                ? `KES ${Number(app.hourly_rate).toLocaleString()}`
                : "-"
            }
          />
          <FieldCard label="TSC Number" value={app.tsc_number} />
          <FieldCard label="Reference Name" value={app.reference_name} />
          <FieldCard label="Reference Contact" value={app.reference_contact} />
          <FieldCard label="Chief Name" value={app.chief_name} />
          <FieldCard label="Chief Contact" value={app.chief_contact} />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Professional Bio
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {app.bio || "-"}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold">Uploaded Documents</h2>

        {documents.length === 0 ? (
          <p className="mt-4 text-slate-600">No documents uploaded yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-3">Document Type</th>
                  <th className="p-3">File Path</th>
                  <th className="p-3">Uploaded</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t">
                    <td className="p-3 capitalize">
                      {(doc.document_type || "document").replaceAll("_", " ")}
                    </td>
                    <td className="p-3 max-w-md break-all text-slate-600">
                      {doc.file_url || "-"}
                    </td>
                    <td className="p-3">{formatDate(doc.uploaded_at)}</td>
                    <td className="p-3">
                      {doc.signed_url ? (
                        <a
                          href={doc.signed_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          View Document
                        </a>
                      ) : (
                        <span className="text-sm text-red-600">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold">Schedule Interview</h2>
        <p className="mt-2 text-sm text-slate-600">
          Scheduling an interview automatically keeps the applicant in the shortlisted category.
        </p>

        <form onSubmit={scheduleInterview} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3"
            >
              <option value="online">Online</option>
              <option value="physical">Physical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Interviewer</label>
            <input
              type="text"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3"
              placeholder="Interviewer name"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-slate-300 p-3"
              placeholder="Interview notes or instructions"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={interviewLoading || statusLoading}
              className="rounded-xl bg-[#C6A75E] px-5 py-3 font-semibold text-[#1A1A1A] disabled:opacity-60"
            >
              {interviewLoading ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold">Interview History</h2>

        {interviews.length === 0 ? (
          <p className="mt-4 text-slate-600">No interviews scheduled yet.</p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-3">Scheduled At</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Interviewer</th>
                  <th className="p-3">Outcome</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id} className="border-t">
                    <td className="p-3">{formatDate(interview.scheduled_at)}</td>
                    <td className="p-3 capitalize">{interview.mode || "-"}</td>
                    <td className="p-3">{interview.interviewer || "-"}</td>
                    <td className="p-3 capitalize">{interview.outcome || "-"}</td>
                    <td className="p-3">{interview.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
