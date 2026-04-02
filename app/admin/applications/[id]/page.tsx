"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  primary_subject: string;
  curriculum_expertise: string;
  years_experience: number;
  teaching_mode: string;
  availability: string;
  hourly_rate: number;
  tsc_number: string;
  reference_name: string;
  reference_contact: string;
  chief_name: string;
  chief_contact: string;
  bio: string;
  status: string;
};

type DocumentRecord = {
  id: string;
  application_id: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
  signed_url: string | null;
};

type InterviewRecord = {
  id: string;
  application_id: string;
  scheduled_at: string;
  mode: string;
  interviewer: string;
  notes: string | null;
  outcome: string | null;
};

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

  useEffect(() => {
    async function loadApplication() {
      try {
        const response = await fetch(`/api/admin-application/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load application.");
        }

        setApp(result.application);
        setDocuments(result.documents || []);
        setInterviews(result.interviews || []);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load application.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [params.id]);

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
        prev ? { ...prev, status: result.application.status } : prev
      );
      setMessage(`Status updated to ${result.application.status}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setError(msg);
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
      setApp((prev) =>
        prev ? { ...prev, status: "interview_scheduled" } : prev
      );
      setMessage("Interview scheduled successfully.");

      setScheduledAt("");
      setMode("online");
      setInterviewer("");
      setNotes("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Interview scheduling failed.";
      setError(msg);
    } finally {
      setInterviewLoading(false);
    }
  }

  if (loading) {
    return <div className="p-10">Loading application...</div>;
  }

  if (error && !app) {
    return <div className="p-10 text-red-600">{error}</div>;
  }

  if (!app) {
    return <div className="p-10 text-red-600">Application not found.</div>;
  }

  return (
    <main className="p-10">
      <a href="/admin/applications" className="text-blue-600 hover:underline">
        ← Back to applications
      </a>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{app.full_name}</h1>
          <p className="mt-2 text-gray-600 capitalize">Status: {app.status}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateStatus("under_review")}
            disabled={statusLoading}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-60"
          >
            Under Review
          </button>
          <button
            onClick={() => updateStatus("shortlisted")}
            disabled={statusLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Shortlist
          </button>
          <button
            onClick={() => updateStatus("approved")}
            disabled={statusLoading}
            className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Approve
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            disabled={statusLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl bg-green-50 p-3 text-green-700">
          {message}
        </div>
      ) : null}

      {error && app ? (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4"><strong>Email:</strong> {app.email}</div>
        <div className="rounded-xl border p-4"><strong>Phone:</strong> {app.phone}</div>
        <div className="rounded-xl border p-4"><strong>Location:</strong> {app.location}</div>
        <div className="rounded-xl border p-4"><strong>Primary Subject:</strong> {app.primary_subject}</div>
        <div className="rounded-xl border p-4"><strong>Curriculum Expertise:</strong> {app.curriculum_expertise}</div>
        <div className="rounded-xl border p-4"><strong>Years Experience:</strong> {app.years_experience}</div>
        <div className="rounded-xl border p-4"><strong>Teaching Mode:</strong> {app.teaching_mode}</div>
        <div className="rounded-xl border p-4"><strong>Availability:</strong> {app.availability}</div>
        <div className="rounded-xl border p-4"><strong>Hourly Rate:</strong> KES {app.hourly_rate}</div>
        <div className="rounded-xl border p-4"><strong>TSC Number:</strong> {app.tsc_number}</div>
        <div className="rounded-xl border p-4"><strong>Reference Name:</strong> {app.reference_name}</div>
        <div className="rounded-xl border p-4"><strong>Reference Contact:</strong> {app.reference_contact}</div>
        <div className="rounded-xl border p-4"><strong>Chief Name:</strong> {app.chief_name}</div>
        <div className="rounded-xl border p-4"><strong>Chief Contact:</strong> {app.chief_contact}</div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <strong>Professional Bio:</strong>
        <p className="mt-2 text-gray-700">{app.bio}</p>
      </div>

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-2xl font-semibold">Uploaded Documents</h2>

        {documents.length === 0 ? (
          <p className="mt-3 text-gray-600">No documents uploaded yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100">
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
                      {doc.document_type.replaceAll("_", " ")}
                    </td>
                    <td className="p-3 break-all text-sm text-gray-700">
                      {doc.file_url}
                    </td>
                    <td className="p-3">
                      {doc.uploaded_at
                        ? new Date(doc.uploaded_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {doc.signed_url ? (
                        <a
                          href={doc.signed_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
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
      </div>

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-2xl font-semibold">Schedule Interview</h2>

        <form onSubmit={scheduleInterview} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="online">Online</option>
              <option value="physical">Physical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Interviewer</label>
            <input
              type="text"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="Interviewer name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] w-full rounded-xl border p-3"
              placeholder="Interview notes or instructions"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={interviewLoading}
              className="rounded-xl bg-[#C6A75E] px-5 py-3 font-medium text-[#1A1A1A] disabled:opacity-60"
            >
              {interviewLoading ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-xl border p-4">
        <h2 className="text-2xl font-semibold">Interview History</h2>

        {interviews.length === 0 ? (
          <p className="mt-3 text-gray-600">No interviews scheduled yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100">
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
                    <td className="p-3">
                      {interview.scheduled_at
                        ? new Date(interview.scheduled_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3 capitalize">{interview.mode}</td>
                    <td className="p-3">{interview.interviewer}</td>
                    <td className="p-3 capitalize">{interview.outcome || "-"}</td>
                    <td className="p-3">{interview.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}