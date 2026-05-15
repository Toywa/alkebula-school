"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type InternalMessage = {
  id: string;
  sender_email: string;
  sender_role: string;
  recipient_email: string | null;
  recipient_role: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function EducatorMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
        error instanceof Error
          ? error.message
          : "Failed to load messages."
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

      if (!subject.trim()) {
        throw new Error("Subject is required.");
      }

      if (!message.trim()) {
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
          subject,
          message,
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
        error instanceof Error
          ? error.message
          : "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              The Alkebula School
            </p>

            <h1 className="mt-4 text-4xl font-bold">
              Educator Messages
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Contact admin for support, scheduling, lesson concerns,
              payments, onboarding, or operational issues.
            </p>
          </div>

          <Link
            href="/educator/dashboard"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
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
          <h2 className="text-2xl font-semibold">
            Send Message to Admin
          </h2>

          <form onSubmit={sendMessage} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Subject
              </label>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Payment issue, lesson concern, schedule change..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Write your message..."
                className="w-full rounded-xl border px-4 py-3"
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
          <h2 className="text-2xl font-semibold">
            Your Messages
          </h2>

          {loading ? (
            <p className="mt-6 text-slate-600">
              Loading messages...
            </p>
          ) : messages.length === 0 ? (
            <p className="mt-6 text-slate-600">
              No messages yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.subject}
                      </h3>

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

                  <p className="mt-4 whitespace-pre-wrap text-slate-700">
                    {item.message}
                  </p>

                  <div className="mt-4 text-xs text-slate-500">
                    {item.sender_role} → {item.recipient_role}
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