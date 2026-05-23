"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ClassroomPage() {
  const params = useParams();
  const roomId = String(params.roomId || "");

  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"video" | "whiteboard" | "split">(
    "split"
  );

  useEffect(() => {
    loadSignedInUser();
  }, []);

  async function loadSignedInUser() {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const defaultName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Participant";

      setUsername(defaultName);
    } catch {
      setError("Failed to load signed-in user.");
    } finally {
      setLoading(false);
    }
  }

  async function joinRoom() {
    try {
      setJoining(true);
      setError("");

      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          room: roomId,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join classroom.");
      }

      setToken(data.token);
      setServerUrl(data.url);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to join classroom."
      );
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading classroom...
      </main>
    );
  }

  if (!token || !serverUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            The Alkebula School
          </p>

          <h1 className="mt-4 text-4xl font-bold">Join Classroom Session</h1>

          <p className="mt-4 text-slate-300">
            Secure live lesson powered by Alkebula Classroom.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">Your Name</label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none"
              placeholder="Enter your name"
            />
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-800 bg-red-950 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={joinRoom}
            disabled={joining}
            className="mt-8 w-full rounded-2xl bg-amber-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
          >
            {joining ? "Connecting..." : "Join Secure Classroom"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Room ID: {roomId}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-slate-950 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            The Alkebula School
          </p>
          <p className="text-sm text-slate-300">Room: {roomId}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "video"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white"
            }`}
          >
            Video
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("whiteboard")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "whiteboard"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white"
            }`}
          >
            Whiteboard
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              activeTab === "split"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white"
            }`}
          >
            Split View
          </button>
        </div>
      </div>

      <LiveKitRoom
        video
        audio
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        className="min-h-0 flex-1"
      >
        <div
          className={`grid h-full min-h-0 gap-0 ${
            activeTab === "split" ? "lg:grid-cols-[42%_58%]" : "grid-cols-1"
          }`}
        >
          {(activeTab === "video" || activeTab === "split") && (
            <section className="min-h-0 border-r border-slate-800 bg-black">
              <VideoConference />
              <RoomAudioRenderer />
            </section>
          )}

          {(activeTab === "whiteboard" || activeTab === "split") && (
            <section className="min-h-0 bg-white text-slate-900">
              <div className="h-full min-h-0">
                <Tldraw />
              </div>
            </section>
          )}
        </div>
      </LiveKitRoom>
    </main>
  );
}