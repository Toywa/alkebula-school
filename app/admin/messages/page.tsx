"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type InternalMessage = {
  id: string;
  sender_email: string;
  sender_role: "admin" | "educator" | "parent";
  recipient_email: string | null;
  recipient_role: "admin" | "educator" | "parent";
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState("");
  const [actingId, setActingId] = useState("");

  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

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

      const recipientRole =
        item.sender_role === "parent" ? "parent" : "educator";

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

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              The Alkebula School
            </p>

            <h1 className="mt-4 text-4xl font-bold">
              Admin Messages
            </h1>

            <p className="mt-4 max-w-3xl text-slate-600">
              Read and reply to internal tutor messages and parent support messages.
              Parent-to-tutor direct messaging remains disabled.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Admin
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Total Messages</p>
            <p className="mt-2 text-3xl font-bold">{messages.length}</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-2 text-3xl font-bold">{unreadCount}</p>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Archived</p>
            <p className="mt-2 text-3xl font-bold">
              {messages.filter((item) => item.status === "archived").length}
            </p>
          </div>
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

        <div className="mt-10 rounded-3xl border p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">
              Inbox
            </h2>

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
                <div
                  key={item.id}
                  className="rounded-2xl border bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.subject}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        From: {item.sender_email} ({item.sender_role})
                      </p>

                      <p className="text-sm text-slate-500">
                        To: {item.recipient_role}
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
                      <label className="mb-2 block text-sm font-medium">
                        Reply
                      </label>

                      <textarea
                        value={replyText[item.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
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