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

type TutorRecipientMode = "selected" | "all";

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
  const [selectedTutorEmails, setSelectedTutorEmails] = useState<string[]>([]);
  const [tutorRecipientMode, setTutorRecipientMode] =
    useState<TutorRecipientMode>("selected");
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

  const approvedTutorRecipients = useMemo(
    () => recipients.filter((item) => item.role === "educator"),
    [recipients]
  );

  const selectedTutorRecipientDetails = useMemo(
    () =>
      approvedTutorRecipients.filter((item) =>
        selectedTutorEmails.includes(item.email)
      ),
    [approvedTutorRecipients, selectedTutorEmails]
  );

  const effectiveTutorRecipients = useMemo(() => {
    if (recipientRole !== "educator") return [];

    return tutorRecipientMode === "all"
      ? approvedTutorRecipients
      : selectedTutorRecipientDetails;
  }, [
    approvedTutorRecipients,
    recipientRole,
    selectedTutorRecipientDetails,
    tutorRecipientMode,
  ]);

  useEffect(() => {
    if (recipientRole === "educator") {
      setRecipientEmail("");

      setSelectedTutorEmails((prev) =>
        prev.filter((email) =>
          approvedTutorRecipients.some((item) => item.email === email)
        )
      );

      return;
    }

    const selectedStillExists = filteredRecipients.some(
      (item) => item.email === recipientEmail
    );

    if (!selectedStillExists) {
      setRecipientEmail(filteredRecipients[0]?.email || "");
    }
  }, [
    approvedTutorRecipients,
    filteredRecipients,
    recipientEmail,
    recipientRole,
  ]);

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

        if (firstTutor.role === "educator") {
          setSelectedTutorEmails([firstTutor.email]);
          setRecipientEmail("");
        } else {
          setRecipientEmail(firstTutor.email);
        }
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

  function toggleTutorSelection(email: string) {
    setSelectedTutorEmails((prev) =>
      prev.includes(email)
        ? prev.filter((item) => item !== email)
        : [...prev, email]
    );
  }

  function selectAllTutors() {
    setSelectedTutorEmails(approvedTutorRecipients.map((item) => item.email));
  }

  function clearTutorSelection() {
    setSelectedTutorEmails([]);
  }

  async function sendNewMessage() {
    try {
      setSendingNewMessage(true);
      setSuccessMessage("");
      setErrorMessage("");

      const subject = newSubject.trim();
      const message = newMessage.trim();

      if (!subject || !message) {
        throw new Error("Subject and message are required.");
      }

      const token = await getAccessToken();

      const targetRecipients =
        recipientRole === "educator"
          ? effectiveTutorRecipients
          : filteredRecipients.filter((item) => item.email === recipientEmail);

      if (targetRecipients.length < 1) {
        throw new Error("Please choose at least one recipient.");
      }

      let sentCount = 0;

      for (const recipient of targetRecipients) {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senderRole: "admin",
            recipientRole: recipient.role,
            recipientEmail: recipient.email,
            subject,
            message,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              `Failed to send message to ${recipient.name || recipient.email}.`
          );
        }

        sentCount += 1;
      }

      setNewSubject("");
      setNewMessage("");
      setSuccessMessage(
        sentCount === 1
          ? "Message sent successfully."
          : `Message sent successfully to ${sentCount} recipients.`
      );

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
                Choose one tutor, several tutors, all approved tutors, a tutor
                applicant, or a parent and send a direct platform message.
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
                onChange={(event) => {
                  const nextRole = event.target.value as MessageRecipient["role"];
                  setRecipientRole(nextRole);

                  if (nextRole === "educator") {
                    setTutorRecipientMode("selected");
                    setRecipientEmail("");
                  }
                }}
                className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
              >
                <option value="educator">Approved Tutors</option>
                <option value="applicant">Tutor Applicants</option>
                <option value="parent">Parents</option>
              </select>
            </div>

            {recipientRole === "educator" ? (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Tutor Recipient Mode
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTutorRecipientMode("selected")}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                      tutorRecipientMode === "selected"
                        ? "border-[#8F1F36] bg-[#FFF5F7] text-[#8F1F36]"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    Select specific tutors
                  </button>

                  <button
                    type="button"
                    onClick={() => setTutorRecipientMode("all")}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                      tutorRecipientMode === "all"
                        ? "border-[#8F1F36] bg-[#FFF5F7] text-[#8F1F36]"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    All approved tutors
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {tutorRecipientMode === "all"
                    ? `This message will be sent to all ${approvedTutorRecipients.length} approved tutors.`
                    : `${selectedTutorEmails.length} tutor(s) selected.`}
                </p>
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Recipient
                </label>
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
            )}

            {recipientRole === "educator" && tutorRecipientMode === "selected" ? (
              <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Select Approved Tutors
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose one tutor, three tutors, five tutors, or any number
                      of approved tutors.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={selectAllTutors}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Select All
                    </button>

                    <button
                      type="button"
                      onClick={clearTutorSelection}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {loadingRecipients ? (
                  <p className="mt-4 text-sm text-slate-600">
                    Loading tutors...
                  </p>
                ) : approvedTutorRecipients.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">
                    No approved tutors available.
                  </p>
                ) : (
                  <div className="mt-4 grid max-h-72 gap-3 overflow-y-auto pr-2 md:grid-cols-2">
                    {approvedTutorRecipients.map((recipient) => (
                      <label
                        key={`approved-tutor-${recipient.email}`}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                          selectedTutorEmails.includes(recipient.email)
                            ? "border-[#8F1F36] bg-[#FFF5F7]"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTutorEmails.includes(
                            recipient.email
                          )}
                          onChange={() => toggleTutorSelection(recipient.email)}
                          className="mt-1"
                        />

                        <span>
                          <span className="block font-semibold text-slate-900">
                            {recipient.name}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {recipient.email}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

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
            disabled={
              sendingNewMessage ||
              loadingRecipients ||
              (recipientRole === "educator"
                ? effectiveTutorRecipients.length < 1
                : !recipientEmail)
            }
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
