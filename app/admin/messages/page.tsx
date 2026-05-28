"use client";

import { useEffect, useMemo, useState } from "react";
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

type MessageRecipient = {
  email: string;
  name: string;
  role: "educator" | "parent" | "applicant";
  status?: string | null;
  source: string;
};

function roleBadgeClass(role: MessageRole) {
  if (role === "admin") return "bg-slate-900 text-white";
  if (role === "educator") return "bg-blue-100 text-blue-800";
  if (role === "applicant") return "bg-purple-100 text-purple-800";
  return "bg-emerald-100 text-emerald-800";
}

function displayRole(role: MessageRole) {
  if (role === "admin") return "Admin";
  if (role === "educator") return "Approved Tutor";
  if (role === "applicant") return "Tutor Applicant";
  return "Parent";
}

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [sendingId, setSendingId] = useState("");
  const [sendingNewMessage, setSendingNewMessage] = useState(false);
  const [actingId, setActingId] = useState("");

  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [recipients, setRecipients] = useState<MessageRecipient[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const [recipientRole, setRecipientRole] =
    useState<MessageRecipient["role"]>("educator");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadMessages();
    loadRecipients();
  }, []);

  const filteredRecipients = useMemo(
    () => recipients.filter((item) => item.role === recipientRole),
    [recipients, recipientRole]
  );

  useEffect(() => {
    const selectedStillExists = filteredRecipients.some(
      (item) => item.email === recipientEmail
    );

    if (!selectedStillExists) {
      setRecipientEmail(filteredRecipients[0]?.email || "");
    }
  }, [filteredRecipients, recipientEmail]);

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

  async function loadRecipients() {
    try {
      setLoadingRecipients(true);
      setErrorMessage("");

      const token = await getAccessToken();

      const response = await fetch("/api/messages?mode=recipients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load recipients.");
      }

      const loadedRecipients = (data.recipients || []) as MessageRecipient[];
      setRecipients(loadedRecipients);

      const firstTutor =
        loadedRecipients.find((item) => item.role === "educator") ||
        loadedRecipients[0];

      if (firstTutor) {
        setRecipientRole(firstTutor.role);
        setRecipientEmail(firstTutor.email);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load recipients."
      );
    } finally {
      setLoadingRecipients(false);
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

  async function sendNewMessage() {
    try {
      setSendingNewMessage(true);
      setSuccessMessage("");
      setErrorMessage("");

      const subject = newSubject.trim();
      const message = newMessage.trim();

      if (!recipientEmail) {
        throw new Error("Please choose a recipient.");
      }

      if (!subject || !message) {
        throw new Error("Subject and message are required.");
      }

      const token = await getAccessToken();

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderRole: "admin",
          recipientRole,
          recipientEmail,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message.");
      }

      setNewSubject("");
      setNewMessage("");
      setSuccessMessage("Message sent successfully.");

      await loadMessages();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message."
      );
    } finally {
      setSendingNewMessage(false);
    }
  }

  async function replyToMessage(item: InternalMessage) {
    try {
      setSendingId(item.id);
      setSuccessMessage("");
      setErrorMessage("");

      const text = (replyText[item.id] || "").trim();

      if (!text) {
        throw new Error("Reply message is required.");
      }

      const token = await getAccessToken();

      const recipientRole: MessageRole =
        item.sender_role === "parent"
          ? "parent"
          : item.sender_role === "applicant"
          ? "applicant"
          : "educator";

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderRole: "admin",
          recipientRole,
          recipientEmail: item.sender_email,
          subject: `Re: ${item.subject}`,
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send reply.");
      }

      setReplyText((prev) => ({ ...prev, [item.id]: "" }));
      setSuccessMessage("Reply sent successfully.");

      await updateStatus(item.id, "read");
      await loadMessages();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send reply."
      );
    } finally {
      setSendingId("");
    }
  }

  const unreadCount = messages.filter((item) => item.status === "unread").length;
  const archivedCount = messages.filter(
    (item) => item.status === "archived"
  ).length;

  const tutorCount = recipients.filter((item) => item.role === "educator").length;
  const applicantCount = recipients.filter(
    (item) => item.role === "applicant"
  ).length;
  const parentCount = recipients.filter((item) => item.role === "parent").length;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              The Alkebula School
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-bold">Admin Messages</h1>

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

            <p className="mt-4 max-w-3xl text-slate-600">
              Read, reply, and send direct internal messages to approved tutors,
              tutor applicants, and parents. Parent-to-tutor direct messaging
              remains disabled.
            </p>
          </div>

          <Link
            href="/admin/resolutions"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Admin
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-6">
          <MetricCard title="Total Messages" value={String(messages.length)} />
          <MetricCard title="Unread" value={String(unreadCount)} alert={unreadCount > 0} />
          <MetricCard title="Archived" value={String(archivedCount)} />
          <MetricCard title="Tutors" value={String(tutorCount)} />
          <MetricCard title="Applicants" value={String(applicantCount)} />
          <MetricCard title="Parents" value={String(parentCount)} />
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Send New Message</h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose one approved tutor, tutor applicant, or parent and send a
                direct platform message.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRecipients}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh Recipients
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Recipient Category
              </label>
              <select
                value={recipientRole}
                onChange={(event) =>
                  setRecipientRole(event.target.value as MessageRecipient["role"])
                }
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
              >
                <option value="educator">Approved Tutors</option>
                <option value="applicant">Tutor Applicants</option>
                <option value="parent">Parents</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Recipient</label>
              <select
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
                disabled={loadingRecipients || filteredRecipients.length === 0}
              >
                {loadingRecipients ? (
                  <option>Loading recipients...</option>
                ) : filteredRecipients.length === 0 ? (
                  <option>No recipients available in this category</option>
                ) : (
                  filteredRecipients.map((recipient) => (
                    <option
                      key={`${recipient.role}-${recipient.email}`}
                      value={recipient.email}
                    >
                      {recipient.name} — {recipient.email}
                      {recipient.status ? ` (${recipient.status})` : ""}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-medium">Subject</label>
              <input
                value={newSubject}
                onChange={(event) => setNewSubject(event.target.value)}
                placeholder="Message subject"
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-medium">Message</label>
              <textarea
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                rows={6}
                placeholder="Write your message..."
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={sendNewMessage}
            disabled={sendingNewMessage || loadingRecipients || !recipientEmail}
            className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {sendingNewMessage ? "Sending..." : "Send Message"}
          </button>
        </div>

        <div className="mt-10 rounded-3xl border p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Inbox</h2>

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
            <div className="mt-6 space-y-5">
              {messages.map((item) => (
                <div key={item.id} className="rounded-2xl border bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.subject}</h3>

                      <p className="mt-1 text-sm text-slate-500">
                        From: {item.sender_email}{" "}
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadgeClass(item.sender_role)}`}>
                          {displayRole(item.sender_role)}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        To: {item.recipient_email || "—"}{" "}
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadgeClass(item.recipient_role)}`}>
                          {displayRole(item.recipient_role)}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "unread"
                          ? "bg-amber-100 text-amber-700"
                          : item.status === "read"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap rounded-xl border bg-white p-4 text-slate-700">
                    {item.message}
                  </p>

                  {item.sender_role !== "admin" ? (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium">Reply</label>

                      <textarea
                        value={replyText[item.id] || ""}
                        onChange={(event) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [item.id]: event.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Write admin reply..."
                        className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
                      />

                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={sendingId === item.id}
                          onClick={() => replyToMessage(item)}
                          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                          {sendingId === item.id ? "Sending..." : "Send Reply"}
                        </button>

                        {item.status !== "read" ? (
                          <button
                            type="button"
                            disabled={actingId === item.id}
                            onClick={() => updateStatus(item.id, "read")}
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-60"
                          >
                            Mark Read
                          </button>
                        ) : null}

                        {item.status !== "archived" ? (
                          <button
                            type="button"
                            disabled={actingId === item.id}
                            onClick={() => updateStatus(item.id, "archived")}
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-60"
                          >
                            Archive
                          </button>
                        ) : null}
                      </div>
                    </div>
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
