"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type AdminTutor = {
  id: string;
  full_name: string;
  email: string;
  city?: string | null;
  qualification?: string | null;
  years_of_experience?: number | null;
  subjects?: string[] | null;
  curricula?: string[] | null;
  hourly_rate?: number | null;
  approval_status?: string | null;
  is_public?: boolean | null;
  profile_status?: string | null;
  profile_hidden_reason?: string | null;
  profile_hidden_note?: string | null;
  profile_hidden_at?: string | null;
  profile_hidden_by?: string | null;
  removed_at?: string | null;
  removed_by?: string | null;
  removal_reason?: string | null;
  removal_note?: string | null;
  timezone?: string | null;
  created_at?: string | null;
};

type TutorAction = "hide_profile" | "restore_profile" | "suspend_profile" | "remove_tutor";

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

function statusBadgeClass(status?: string | null) {
  if (status === "active") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "hidden") return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "suspended") return "bg-orange-100 text-orange-700 border-orange-200";
  if (status === "removed") return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function cleanStatus(status?: string | null) {
  return status || "active";
}

export default function AdminTutorsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState<AdminTutor[]>([]);
  const [hideReasons, setHideReasons] = useState<string[]>([]);
  const [removalReasons, setRemovalReasons] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [actingId, setActingId] = useState("");

  const [reasonByTutor, setReasonByTutor] = useState<Record<string, string>>({});
  const [noteByTutor, setNoteByTutor] = useState<Record<string, string>>({});
  const [removeConfirmByTutor, setRemoveConfirmByTutor] = useState<Record<string, string>>({});

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
    if (authorized) loadTutors();
  }, [authorized]);

  const counts = useMemo(() => {
    return tutors.reduce(
      (acc, tutor) => {
        const status = cleanStatus(tutor.profile_status);
        if (status === "active") acc.active += 1;
        if (status === "hidden") acc.hidden += 1;
        if (status === "suspended") acc.suspended += 1;
        if (status === "removed") acc.removed += 1;
        return acc;
      },
      { active: 0, hidden: 0, suspended: 0, removed: 0 }
    );
  }, [tutors]);

  async function getAccessToken() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Admin session expired. Please sign in again.");
    }

    return session.access_token;
  }

  async function loadTutors() {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = await getAccessToken();

      const response = await fetch("/api/admin/tutors/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load tutors.");
      }

      const loadedTutors = (data.tutors || []) as AdminTutor[];
      setTutors(loadedTutors);
      setHideReasons(data.hideReasons || []);
      setRemovalReasons(data.removalReasons || []);

      const initialReasons: Record<string, string> = {};
      loadedTutors.forEach((tutor) => {
        initialReasons[tutor.id] =
          data.hideReasons?.[0] || "Administrative review";
      });

      setReasonByTutor((prev) => ({ ...initialReasons, ...prev }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load tutors."
      );
    } finally {
      setLoading(false);
    }
  }

  function setReason(tutorId: string, reason: string) {
    setReasonByTutor((prev) => ({ ...prev, [tutorId]: reason }));
  }

  function setNote(tutorId: string, note: string) {
    setNoteByTutor((prev) => ({ ...prev, [tutorId]: note }));
  }

  function setRemoveConfirm(tutorId: string, value: string) {
    setRemoveConfirmByTutor((prev) => ({ ...prev, [tutorId]: value }));
  }

  async function performTutorAction(tutor: AdminTutor, action: TutorAction) {
    try {
      setActingId(tutor.id);
      setMessage("");
      setErrorMessage("");

      const token = await getAccessToken();

      const isRemoval = action === "remove_tutor";
      const reason =
        action === "restore_profile"
          ? "Profile restored by admin"
          : reasonByTutor[tutor.id] ||
            (isRemoval ? removalReasons[0] : hideReasons[0]) ||
            "Administrative review";

      const response = await fetch("/api/admin/tutors/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId: tutor.id,
          action,
          reason,
          note: noteByTutor[tutor.id] || "",
          confirmRemove: removeConfirmByTutor[tutor.id] || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Tutor status update failed.");
      }

      const warning = data.warning ? ` ${data.warning}` : "";

      if (action === "hide_profile") {
        setMessage(`Tutor profile hidden and notification processed.${warning}`);
      } else if (action === "suspend_profile") {
        setMessage(`Tutor profile suspended and notification processed.${warning}`);
      } else if (action === "remove_tutor") {
        setMessage(`Tutor removed from active participation and notification processed.${warning}`);
      } else {
        setMessage(`Tutor profile restored and notification processed.${warning}`);
      }

      setRemoveConfirm(tutor.id, "");
      await loadTutors();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Tutor status update failed."
      );
    } finally {
      setActingId("");
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-5xl">Checking admin access...</div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 p-8">
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
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Admin Control
            </p>

            <h1 className="mt-3 text-4xl font-bold text-slate-950">
              Approved Tutors
            </h1>

            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              Hide, restore, suspend or remove approved tutors while preserving
              an audit trail and sending the tutor an email notification with
              the reason.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/resolutions"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Back to Admin
            </Link>

            <button
              type="button"
              onClick={loadTutors}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard title="Active" value={String(counts.active)} />
          <MetricCard title="Hidden" value={String(counts.hidden)} />
          <MetricCard title="Suspended" value={String(counts.suspended)} />
          <MetricCard title="Removed" value={String(counts.removed)} alert />
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
          <p className="mt-8 text-slate-600">Loading tutors...</p>
        ) : tutors.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium">No approved tutors found.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {tutors.map((tutor) => {
              const status = cleanStatus(tutor.profile_status);

              return (
                <div
                  key={tutor.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950">
                        {tutor.full_name || "Unnamed Tutor"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {tutor.email}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className={`rounded-full border px-3 py-1 font-bold ${statusBadgeClass(status)}`}>
                          {status}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
                          Public: {tutor.is_public ? "Yes" : "No"}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
                          Approval: {tutor.approval_status || "—"}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
                          TZ: {tutor.timezone || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-sm text-slate-600">
                      <p>{tutor.city || "City not listed"}</p>
                      <p className="mt-1">
                        {tutor.qualification || "Qualification not listed"}
                      </p>
                      <p className="mt-1">
                        {tutor.years_of_experience
                          ? `${tutor.years_of_experience} years experience`
                          : "Experience not listed"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 text-sm md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-bold text-slate-950">Subjects</p>
                      <p className="mt-2 text-slate-600">
                        {tutor.subjects?.length ? tutor.subjects.join(", ") : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-bold text-slate-950">Curricula</p>
                      <p className="mt-2 text-slate-600">
                        {tutor.curricula?.length ? tutor.curricula.join(", ") : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-bold text-slate-950">Rate</p>
                      <p className="mt-2 text-slate-600">
                        {tutor.hourly_rate ? `USD ${tutor.hourly_rate}/hour` : "—"}
                      </p>
                    </div>
                  </div>

                  {(tutor.profile_hidden_reason || tutor.removal_reason) ? (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <p className="font-bold">Current admin record</p>
                      <p className="mt-2">
                        Reason: {tutor.removal_reason || tutor.profile_hidden_reason}
                      </p>
                      <p className="mt-1">
                        Note: {tutor.removal_note || tutor.profile_hidden_note || "—"}
                      </p>
                    </div>
                  ) : null}

                  {status !== "removed" ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-lg font-bold text-slate-950">
                        Profile Control
                      </h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Reason
                          </label>
                          <select
                            value={reasonByTutor[tutor.id] || hideReasons[0] || ""}
                            onChange={(event) =>
                              setReason(tutor.id, event.target.value)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                          >
                            {hideReasons.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Optional admin note
                          </label>
                          <input
                            value={noteByTutor[tutor.id] || ""}
                            onChange={(event) =>
                              setNote(tutor.id, event.target.value)
                            }
                            placeholder="Short explanation to include in the email"
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {status !== "active" ? (
                          <button
                            type="button"
                            disabled={actingId === tutor.id}
                            onClick={() => performTutorAction(tutor, "restore_profile")}
                            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                          >
                            {actingId === tutor.id ? "Working..." : "Restore Profile"}
                          </button>
                        ) : null}

                        {status !== "hidden" ? (
                          <button
                            type="button"
                            disabled={actingId === tutor.id}
                            onClick={() => performTutorAction(tutor, "hide_profile")}
                            className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-800 disabled:opacity-50"
                          >
                            {actingId === tutor.id ? "Working..." : "Hide Profile"}
                          </button>
                        ) : null}

                        {status !== "suspended" ? (
                          <button
                            type="button"
                            disabled={actingId === tutor.id}
                            onClick={() => performTutorAction(tutor, "suspend_profile")}
                            className="rounded-xl border border-orange-300 bg-orange-50 px-5 py-3 text-sm font-bold text-orange-800 disabled:opacity-50"
                          >
                            {actingId === tutor.id ? "Working..." : "Suspend"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <h3 className="text-lg font-bold text-red-800">
                      Removal / Termination
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-red-700">
                      Use this only for serious matters such as gross misconduct,
                      platform abuse, bypassing platform payments, misuse of
                      confidential information, conflict of interest, or
                      safeguarding concerns. This does not physically delete
                      records; it removes the tutor from active participation.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-red-900">
                          Removal reason
                        </label>
                        <select
                          value={reasonByTutor[tutor.id] || removalReasons[0] || ""}
                          onChange={(event) =>
                            setReason(tutor.id, event.target.value)
                          }
                          className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm"
                        >
                          {removalReasons.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-red-900">
                          Removal note
                        </label>
                        <input
                          value={noteByTutor[tutor.id] || ""}
                          onChange={(event) =>
                            setNote(tutor.id, event.target.value)
                          }
                          placeholder="Short explanation"
                          className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-red-900">
                          Type REMOVE to confirm
                        </label>
                        <input
                          value={removeConfirmByTutor[tutor.id] || ""}
                          onChange={(event) =>
                            setRemoveConfirm(tutor.id, event.target.value)
                          }
                          placeholder="REMOVE"
                          className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        actingId === tutor.id ||
                        removeConfirmByTutor[tutor.id] !== "REMOVE" ||
                        status === "removed"
                      }
                      onClick={() => performTutorAction(tutor, "remove_tutor")}
                      className="mt-4 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {status === "removed"
                        ? "Tutor Already Removed"
                        : actingId === tutor.id
                        ? "Working..."
                        : "Remove Tutor"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  alert,
}: {
  title: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        alert ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className={alert ? "text-sm text-red-700" : "text-sm text-slate-500"}>
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
