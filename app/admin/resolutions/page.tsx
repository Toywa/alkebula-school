"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

type RescheduleRequest = {
  id: string;
  lesson_id: string;
  tutor_email: string;
  parent_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  current_lesson_date: string | null;
  current_start_time: string | null;
  current_end_time: string | null;
  reason: string;
  preferred_date: string | null;
  preferred_start_time: string | null;
  preferred_end_time: string | null;
  status: string;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string | null;
};

export default function AdminResolutionsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [actingId, setActingId] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      await loadUnreadMessageCount();
      await loadRescheduleRequests();
    }

    checkAdmin();
  }, []);

  async function loadUnreadMessageCount() {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const response = await fetch("/api/messages/unread-count", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUnreadMessageCount(data.unread_count || 0);
      }
    } catch {
      setUnreadMessageCount(0);
    }
  }

  async function loadRescheduleRequests() {
    try {
      setLoadingRequests(true);
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("tutor_reschedule_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      const requestData = (data || []) as RescheduleRequest[];

      setRequests(requestData);

      const notes: Record<string, string> = {};

      requestData.forEach((requestItem) => {
        notes[requestItem.id] = requestItem.admin_notes || "";
      });

      setAdminNotes(notes);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load reschedule requests."
      );
    } finally {
      setLoadingRequests(false);
    }
  }

  async function updateRequestStatus(
    requestItem: RescheduleRequest,
    status: "resolved" | "rejected"
  ) {
    try {
      setActingId(requestItem.id);
      setMessage("");
      setErrorMessage("");

      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session expired.");
      }

      const response = await fetch("/api/admin/reschedule/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          requestId: requestItem.id,
          lessonId: requestItem.lesson_id,
          status,
          newDate: requestItem.preferred_date,
          newStartTime: requestItem.preferred_start_time,
          newEndTime: requestItem.preferred_end_time,
          adminNotes: adminNotes[requestItem.id] || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resolve request.");
      }

      setMessage(
        status === "resolved"
          ? "Lesson updated successfully."
          : "Request rejected successfully."
      );

      await loadRescheduleRequests();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update request."
      );
    } finally {
      setActingId("");
    }
  }

  const pendingRequests = requests.filter(
    (requestItem) => requestItem.status === "pending"
  );

  const resolvedRequests = requests.filter(
    (requestItem) => requestItem.status !== "pending"
  );

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        Checking admin access...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-3xl font-bold text-red-800">
            Access denied
          </h1>

          <p className="mt-4 text-red-700">
            This page is restricted to approved platform administrators only.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">
                Admin Resolution Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-slate-600">
                Resolve scheduling conflicts, monitor classrooms, supervise
                live lessons, and maintain platform operational integrity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/classrooms"
                className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Live Classrooms
              </Link>

              <Link
                href="/admin/messages"
                className="relative rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Messages

                {unreadMessageCount > 0 ? (
                  <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    {unreadMessageCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/admin/broadcasts"
                className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Broadcasts
              </Link>
            </div>
          </div>

          {message ? (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
              {message}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          <DashboardCard
            title="Classrooms"
            subtitle="Live Lesson Monitor"
            href="/admin/classrooms"
            green
          />

          <DashboardCard
            title="Messages"
            subtitle="Internal Communication"
            href="/admin/messages"
          />

          <DashboardCard
            title="Broadcasts"
            subtitle="Announcements"
            href="/admin/broadcasts"
            amber
          />

          <DashboardCard
            title="Finance"
            subtitle="Finance Operations"
            href="/admin/finance"
          />

          <DashboardCard
            title="Applications"
            subtitle="Full Tutor Review"
            href="/admin/tutor-applications"
          />

          <DashboardCard
            title="Educator Applications"
            subtitle="Categorized Pipeline"
            href="/admin/applications"
            blue
          />
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Pending Reschedule Requests
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Apply new lesson dates/times directly to the active lesson record.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRescheduleRequests}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {loadingRequests ? (
            <p className="mt-6 text-slate-600">
              Loading reschedule requests...
            </p>
          ) : pendingRequests.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium">
                No pending reschedule requests.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {pendingRequests.map((requestItem) => (
                <RequestCard
                  key={requestItem.id}
                  item={requestItem}
                  adminNotes={adminNotes}
                  setAdminNotes={setAdminNotes}
                  actingId={actingId}
                  updateRequestStatus={updateRequestStatus}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold">
            Resolved / Closed Requests
          </h2>

          {resolvedRequests.length === 0 ? (
            <p className="mt-4 text-slate-600">
              No resolved requests yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {resolvedRequests.map((requestItem) => (
                <div
                  key={requestItem.id}
                  className="rounded-2xl border bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {requestItem.subject || "Lesson"}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Tutor: {requestItem.tutor_email}
                      </p>

                      <p className="text-sm text-slate-600">
                        Parent: {requestItem.parent_email || "—"}
                      </p>

                      <p className="text-sm text-slate-600">
                        Updated Time:{" "}
                        {requestItem.preferred_date || "—"} ·{" "}
                        {requestItem.preferred_start_time || "—"} -{" "}
                        {requestItem.preferred_end_time || "—"}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      {requestItem.status}
                    </span>
                  </div>

                  {requestItem.admin_notes ? (
                    <p className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-700">
                      Admin notes: {requestItem.admin_notes}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  subtitle,
  href,
  amber,
  green,
  blue,
}: {
  title: string;
  subtitle: string;
  href: string;
  amber?: boolean;
  green?: boolean;
  blue?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-6 shadow-sm hover:shadow-md ${
        amber
          ? "border-amber-200 bg-amber-50"
          : green
          ? "border-green-200 bg-green-50"
          : blue
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={
          amber
            ? "text-sm text-amber-700"
            : green
            ? "text-sm text-green-700"
            : blue
            ? "text-sm text-blue-700"
            : "text-sm text-slate-500"
        }
      >
        {subtitle}
      </p>

      <h2 className="mt-2 text-2xl font-bold">{title}</h2>
    </Link>
  );
}

function RequestCard({
  item,
  adminNotes,
  setAdminNotes,
  actingId,
  updateRequestStatus,
}: {
  item: RescheduleRequest;
  adminNotes: Record<string, string>;
  setAdminNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  actingId: string;
  updateRequestStatus: (
    requestItem: RescheduleRequest,
    status: "resolved" | "rejected"
  ) => Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold">
            {item.subject || "Lesson"}
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {item.curriculum || "—"} · Student:{" "}
            {item.student_name || "—"}
          </p>

          <p className="text-sm text-slate-700">
            Tutor: {item.tutor_email}
          </p>

          <p className="text-sm text-slate-700">
            Parent: {item.parent_email || "—"}
          </p>
        </div>

        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          Pending
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 text-sm">
          <p className="font-semibold">Current Lesson</p>

          <p className="mt-1 text-slate-600">
            {item.current_lesson_date || "—"} ·{" "}
            {item.current_start_time || "—"} -{" "}
            {item.current_end_time || "—"}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 text-sm">
          <p className="font-semibold">New Lesson Time</p>

          <p className="mt-1 text-slate-600">
            {item.preferred_date || "Not provided"} ·{" "}
            {item.preferred_start_time || "—"} -{" "}
            {item.preferred_end_time || "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white p-4 text-sm">
        <p className="font-semibold">Tutor Reason</p>

        <p className="mt-2 whitespace-pre-wrap text-slate-700">
          {item.reason}
        </p>
      </div>

      <textarea
        value={adminNotes[item.id] || ""}
        onChange={(e) =>
          setAdminNotes((prev) => ({
            ...prev,
            [item.id]: e.target.value,
          }))
        }
        rows={4}
        placeholder="Admin notes..."
        className="mt-4 w-full rounded-xl border bg-white p-3 text-sm"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={actingId === item.id}
          onClick={() => updateRequestStatus(item, "resolved")}
          className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          Apply New Time & Resolve
        </button>

        <button
          type="button"
          disabled={actingId === item.id}
          onClick={() => updateRequestStatus(item, "rejected")}
          className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          Reject Request
        </button>
      </div>
    </div>
  );
}