"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  ParticipantTile,
  ControlBar,
  useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Track } from "livekit-client";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Mode = "video" | "whiteboard";
type Tool = "pen" | "eraser";

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
  const [tool, setTool] = useState<Tool>("pen");
  const [lineWidth, setLineWidth] = useState(4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    loadSignedInUser();
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
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

  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const previousImage = canvas.width > 0 ? canvas.toDataURL() : null;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    if (previousImage) {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0, width, height);
      };
      image.src = previousImage;
    }
  }

  function getCanvasPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const point = getCanvasPoint(event);
    if (!point) return;

    drawingRef.current = true;
    lastPointRef.current = point;
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    const previous = lastPointRef.current;
    const point = getCanvasPoint(event);

    if (!canvas || !previous || !point) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineWidth = lineWidth;
    context.strokeStyle = tool === "pen" ? "#0f172a" : "#ffffff";
    context.globalCompositeOperation =
      tool === "pen" ? "source-over" : "destination-out";

    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();

    lastPointRef.current = point;
  }

  function stopDrawing() {
    drawingRef.current = false;
    lastPointRef.current = null;
  }

  function clearWhiteboard() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
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
    <main className="flex h-screen flex-col overflow-hidden bg-slate-950 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            The Alkebula School
          </p>
          <p className="text-sm text-slate-300">Classroom: {roomId}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("video")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === "video"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            Video / Screen Share
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("whiteboard");
              setTimeout(resizeCanvas, 50);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === "whiteboard"
                ? "bg-white text-slate-950"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            Whiteboard
          </button>
        </div>
      </div>

      <LiveKitRoom
        audio={true}
        video={{
          resolution: {
            width: 640,
            height: 360,
          },
          frameRate: 15,
        }}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        className="min-h-0 flex-1"
      >
        <div className="relative h-full min-h-0">
          <section
            className={`absolute inset-0 flex flex-col bg-black ${
              mode === "video" ? "block" : "hidden"
            }`}
          >
            <LightweightVideoLayout />
          </section>

          <section
            className={`absolute inset-0 flex flex-col bg-white text-slate-900 ${
              mode === "whiteboard" ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3">
              <button
                type="button"
                onClick={() => setTool("pen")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  tool === "pen"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Pen
              </button>

              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  tool === "eraser"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                Eraser
              </button>

              <label className="flex items-center gap-2 text-sm font-semibold">
                Size
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                />
              </label>

              <button
                type="button"
                onClick={clearWhiteboard}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Clear
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="h-full w-full touch-none bg-white"
              />
            </div>
          </section>

          <RoomAudioRenderer />
        </div>
      </LiveKitRoom>
    </main>
  );
}

function LightweightVideoLayout() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      onlySubscribed: false,
    }
  );

  const screenShareTracks = tracks.filter(
    (trackRef) => trackRef.source === Track.Source.ScreenShare
  );

  const cameraTracks = tracks.filter(
    (trackRef) => trackRef.source === Track.Source.Camera
  );

  const visibleTracks =
    screenShareTracks.length > 0 ? screenShareTracks : cameraTracks;

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      <div className="min-h-0 flex-1 overflow-hidden p-3">
        {visibleTracks.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-400">
            Waiting for participants...
          </div>
        ) : (
          <div
            className={`grid h-full gap-3 ${
              visibleTracks.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {visibleTracks.map((trackRef) => (
              <div
                key={`${trackRef.participant.identity}-${trackRef.source}`}
                className="min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"
              >
                <ParticipantTile trackRef={trackRef} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 bg-slate-900 px-3 py-2">
        <ControlBar />
      </div>
    </div>
  );
}