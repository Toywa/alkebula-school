"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";

import "@livekit/components-styles";

export default function ClassroomPage() {
  const params = useParams();

  const roomId =
    typeof params.roomId === "string" ? params.roomId : "alkebula-room";

  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  async function joinRoom() {
    if (!username.trim()) return;

    try {
      setLoading(true);

      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomId,
          username,
          role: "participant",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join room.");
      }

      setToken(data.token);
      setServerUrl(data.url);
      setJoined(true);
    } catch (error) {
      console.error(error);
      alert("Failed to join classroom.");
    } finally {
      setLoading(false);
    }
  }

  if (!joined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-400">
            The Alkebula School
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Join Classroom Session
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Secure live lesson powered by Alkebula Classroom.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">
              Your Name
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={joinRoom}
            disabled={loading || !username.trim()}
            className="mt-6 w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connecting..." : "Join Classroom"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Room ID: {roomId}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-black">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        video={true}
        audio={true}
        data-lk-theme="default"
        className="h-screen"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </main>
  );
}