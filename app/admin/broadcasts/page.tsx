"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Audience = "tutors" | "parents" | "both";

export default function AdminBroadcastsPage() {
  const [audience, setAudience] = useState<Audience>("tutors");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function getAccessToken() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error("Admin session not found. Please sign in again.");
    }

    return session.access_token;
  }

  async function sendBroadcast(e: React.FormEvent) {
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

      const response = await fetch("/api/admin/broadcast-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          audience,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send broadcast.");
      }

      setSubject("");
      setMessage("");

      setSuccessMessage(
        `Broadcast sent successfully to ${data.sent_count} recipient(s). Tutors: ${data.tutor_count}, Parents: ${data.parent_count}.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send broadcast."
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

            <h1 className="mt-4 text-4xl font-bold">Admin Broadcasts</h1>

            <p className="mt-4 max-w-3xl text-slate-600">
              Send internal platform announcements to approved tutors,
              signed-up parents, or both groups. Broadcasts appear inside each
              recipient&apos;s messaging inbox.
            </p>
          </div>

          <Link
            href="/admin/resolutions"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Admin
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

        <form onSubmit={sendBroadcast} className="mt-10 rounded-3xl border p-6">
          <h2 className="text-2xl font-semibold">Create Broadcast</h2>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">Audience</label>

            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="tutors">Approved Tutors</option>
              <option value="parents">Signed-up Parents</option>
              <option value="both">Tutors and Parents</option>
            </select>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">Subject</label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Platform update, scheduling notice, payment reminder..."
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">Message</label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Write the announcement..."
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <p className="font-semibold">Broadcast safety note</p>
            <p className="mt-1">
              This creates one internal unread message per recipient. Parent-to-tutor
              direct messaging remains disabled.
            </p>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {sending ? "Sending Broadcast..." : "Send Broadcast"}
          </button>
        </form>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <InfoCard
            title="Approved Tutors"
            description="Use this for scheduling rules, onboarding reminders, platform standards, payout notices, and academic operations."
          />

          <InfoCard
            title="Signed-up Parents"
            description="Use this for parent support, payment reminders, academic updates, platform announcements, and service notices."
          />

          <InfoCard
            title="Both Groups"
            description="Use this carefully for general platform-wide announcements that affect the whole community."
          />
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}