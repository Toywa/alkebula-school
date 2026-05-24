"use client";

import { useEffect, useRef, useState } from "react";
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

type Mode = "video" | "whiteboard" | "annotate";

export default function ClassroomPage() {
  const params = useParams();
  const roomId = String(params.roomId || "");

  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const [mode, setMode] = useState<Mode>("video");

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

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
        error instanceof Error
          ? error.message
          : "Failed to join classroom."
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

          <h1 className="mt-4 text-4xl font-bold">
            Join Classroom Session
          </h1>

          <p className="mt-4 text-slate-300">
            Secure live lesson powered by Alkebula Classroom.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">
              Your Name
            </label>

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
    <main className="flex h-screen flex-col bg-slate-950 text-white overflow-hidden">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            The Alkebula School
          </p>

          <p className="text-sm text-slate-300">
            Classroom: {roomId}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("video")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "video"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            Video
          </button>

          <button
            onClick={() => setMode("whiteboard")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "whiteboard"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            Whiteboard
          </button>

          <button
            onClick={() => setMode("annotate")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "annotate"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            Annotate Screen
          </button>
        </div>
      </div>

      {/* LIVEKIT MOUNTED ONLY ONCE */}
      <div className="flex-1 overflow-hidden">
        <LiveKitRoom
          video
          audio
          token={token}
          serverUrl={serverUrl}
          data-lk-theme="default"
          className="h-full"
        >
          {/* VIDEO MODE */}
          <div
            className={`absolute inset-0 ${
              mode === "video" ? "block" : "hidden"
            }`}
          >
            <VideoConference />
            <RoomAudioRenderer />
          </div>

          {/* WHITEBOARD MODE */}
          <div
            className={`absolute inset-0 bg-white ${
              mode === "whiteboard" ? "block" : "hidden"
            }`}
          >
            <div className="h-full w-full">
              <Tldraw
                persistenceKey={`whiteboard-${roomId}`}
              />
            </div>
          </div>

          {/* ANNOTATION MODE */}
          <div
            className={`absolute inset-0 ${
              mode === "annotate" ? "block" : "hidden"
            }`}
          >
            {/* LIVE VIDEO IN BACKGROUND */}
            <div className="absolute inset-0">
              <VideoConference />
            </div>

            {/* TRANSPARENT DRAWING LAYER */}
            <div className="absolute inset-0 bg-transparent">
              <Tldraw
                persistenceKey={`annotation-${roomId}`}
              />
            </div>

            <RoomAudioRenderer />
          </div>
        </LiveKitRoom>
      </div>
    </main>
  );
}