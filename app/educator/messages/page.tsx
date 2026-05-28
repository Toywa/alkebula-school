"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type MessageRole = "admin" | "educator" | "parent" | "applicant";

type InternalMessage = {
  id: string;
  sender_email: string;
  sender_role: MessageRole;
  recipient_email: string | null;
  recipient_role: MessageRole;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

function roleLabel(role: MessageRole) {
  if (role === "admin") return "Admin";
  if (role === "educator") return "Educator";
  if (role === "applicant") return "Applicant";
  return "Parent";
}

function statusClass(status: string) {
  if (status === "unread") return "bg-amber-100 text-amber-700";
  if (status === "read") return "bg-emerald-100 text-emerald-700";
  return "bg-slate-200 text-slate-700";
}

export default function EducatorMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [actingId, setActingId] = useState("");

  const [messages, setMessages] = useState<InternalMessage[]>([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function getAccessToken() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Please sign in again.");
    }

    return session.access_token;
  }

  async function loadMessages() {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = await getAccessToken();

      const response = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load messages.");
      }

      setMessages(data.messages || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSending(true);
      setSuccessMessage("");
      setErrorMessage("");

      const cleanSubject = subject.trim();
      const cleanMessage = message.trim();

      if (!cleanSubject) {
        throw new Error("Subject is required.");
      }

      if (!cleanMessage) {
        throw new Error("Message is required.");
      }

      const token = await getAccessToken();

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderRole: "educator",
          recipientRole: "admin",
          subject: cleanSubject,
          message: cleanMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSubject("");
      setMessage("");
      setSuccessMessage("Message sent to admin successfully.");

      await loadMessages();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  async function updateStatus(id: string, status: "read" | "archived") {
    try {
      setActingId(id);
      setSuccessMessage("");
      setErrorMessage("");

      const token = await getAccessToken();

      const response = await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update message.");
      }

      setSuccessMessage(`Message marked as ${status}.`);
      await loadMessages();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update message."
      );
    } finally {
      setActingId("");
    }
  }

  const unreadCount = messages.filter((item) => item.status === "unread").length;
  const archivedCount = messages.filter(
    (item) => item.status === "archived"
  ).length;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              The Alkebula School
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-bold">Educator Messages</h1>

              {unreadCount > 0 ? (
                <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                  {unreadCount} Unread
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Inbox Clear
                </span>
              )}
            </div>

            <p className="mt-4 max-w-2xl text-slate-600">
              Contact admin for support, scheduling, lesson concerns, payments,
              onboarding, or operational issues. Direct tutor-to-parent messaging
              remains disabled.
            </p>
          </div>

          <Link
            href="/educator/dashboard"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard title="Total Messages" value={String(messages.length)} />
          <MetricCard title="Unread" value={String(unreadCount)} alert={unreadCount > 0} />
          <MetricCard title="Archived" value={String(archivedCount)} />
        </div>

        {successMessage ? (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold">Send Message to Admin</h2>

          <p className="mt-2 text-sm text-slate-600">
            Your message will go directly to the school admin team.
          </p>

          <form onSubmit={sendMessage} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Subject</label>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Payment issue, lesson concern, schedule change..."
                className="w-full rounded-xl border bg-white px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Message</label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Write your message..."
                className="w-full rounded-xl border bg-white px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-3xl border p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Your Messages</h2>

            <button
              type="button"
              onClick={loadMessages}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-slate-600">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="mt-6 text-slate-600">No messages yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.subject}</h3>

                      <p className="mt-1 text-sm text-slate-500">
                        From: {item.sender_email} ({roleLabel(item.sender_role)})
                      </p>

                      <p className="text-sm text-slate-500">
                        To: {item.recipient_email || "admin@alkebulaschool.com"} (
                        {roleLabel(item.recipient_role)})
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap rounded-xl border bg-white p-4 text-slate-700">
                    {item.message}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.status !== "read" ? (
                      <button
                        type="button"
                        disabled={actingId === item.id}
                        onClick={() => updateStatus(item.id, "read")}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                      >
                        Mark Read
                      </button>
                    ) : null}

                    {item.status !== "archived" ? (
                      <button
                        type="button"
                        disabled={actingId === item.id}
                        onClick={() => updateStatus(item.id, "archived")}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                      >
                        Archive
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
        alert ? "border-red-200 bg-red-50" : "bg-slate-50"
      }`}
    >
      <p className={alert ? "text-sm text-red-700" : "text-sm text-slate-500"}>
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
