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
type AttendanceAction = "start" | "end" | "notes";

type ClassroomLesson = {
  id: string;
  tutor_email: string | null;
  parent_email: string | null;
  student_name: string | null;
  subject: string | null;
  curriculum: string | null;
  lesson_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  lesson_started_at: string | null;
  lesson_ended_at: string | null;
  actual_duration_minutes: number | null;
  lesson_notes: string | null;
  homework_notes: string | null;
};

const ADMIN_EMAIL = "admin@alkebulaschool.com";

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function lessonTimeLabel(lesson?: ClassroomLesson | null) {
  if (!lesson) return "—";

  return `${lesson.lesson_date || "—"} · ${lesson.start_time || "—"} - ${
    lesson.end_time || "—"
  }`;
}

export default function ClassroomPage() {
  const params = useParams();
  const roomId = String(params.roomId || "");

  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [lesson, setLesson] = useState<ClassroomLesson | null>(null);
  const [lessonNotes, setLessonNotes] = useState("");
  const [homeworkNotes, setHomeworkNotes] = useState("");
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceActionLoading, setAttendanceActionLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [attendanceMessage, setAttendanceMessage] = useState("");

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

      const email = normalizeEmail(user.email);
      setCurrentUserEmail(email);

      const defaultName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Participant";

      setUsername(defaultName);

      await loadLessonSummary(email);
    } catch {
      setError("Failed to load signed-in user.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLessonSummary(emailOverride?: string) {
    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("tutor_lessons")
        .select(
          "id,tutor_email,parent_email,student_name,subject,curriculum,lesson_date,start_time,end_time,status,lesson_started_at,lesson_ended_at,actual_duration_minutes,lesson_notes,homework_notes"
        )
        .eq("id", roomId)
        .maybeSingle();

      if (error) {
        console.warn("Lesson summary load error:", error.message);
        return;
      }

      if (data) {
        const lessonData = data as ClassroomLesson;
        setLesson(lessonData);
        setLessonNotes(lessonData.lesson_notes || "");
        setHomeworkNotes(lessonData.homework_notes || "");

        const email = normalizeEmail(emailOverride || currentUserEmail);
        const tutorEmail = normalizeEmail(lessonData.tutor_email);

        if (email && email !== tutorEmail && email !== ADMIN_EMAIL) {
          setShowAttendanceForm(false);
        }
      }
    } catch (error) {
      console.warn("Failed to load lesson summary:", error);
    }
  }

  async function joinRoom() {
    try {
      setJoining(true);
      setError("");
      setAttendanceMessage("");

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
      await loadLessonSummary(currentUserEmail);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to join classroom."
      );
    } finally {
      setJoining(false);
    }
  }

  async function updateLessonAttendance(action: AttendanceAction) {
    try {
      setAttendanceActionLoading(true);
      setError("");
      setAttendanceMessage("");

      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const response = await fetch("/api/educator/lesson-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          lessonId: roomId,
          action,
          lessonNotes,
          homeworkNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update lesson attendance.");
      }

      await loadLessonSummary(currentUserEmail);

      if (action === "start") {
        setAttendanceMessage(
          data.message || "Lesson started successfully."
        );
      }

      if (action === "notes") {
        setAttendanceMessage(data.message || "Lesson notes saved.");
        setShowAttendanceForm(false);
      }

      if (action === "end") {
        setAttendanceMessage(
          data.message || "Lesson ended and marked completed."
        );
        setShowAttendanceForm(false);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update lesson attendance."
      );
    } finally {
      setAttendanceActionLoading(false);
    }
  }

  function openAttendanceForm() {
    setLessonNotes(lesson?.lesson_notes || "");
    setHomeworkNotes(lesson?.homework_notes || "");
    setShowAttendanceForm(true);
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

  const canManageAttendance =
    normalizeEmail(currentUserEmail) === ADMIN_EMAIL ||
    normalizeEmail(currentUserEmail) === normalizeEmail(lesson?.tutor_email);

  const lessonStarted = Boolean(lesson?.lesson_started_at);
  const lessonEnded = Boolean(lesson?.lesson_ended_at);

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

          {lesson ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">
                {lesson.subject || "Lesson"}
              </p>
              <p className="mt-1">
                {lesson.curriculum || "—"} · {lessonTimeLabel(lesson)}
              </p>
              <p className="mt-1">Student: {lesson.student_name || "—"}</p>
            </div>
          ) : null}

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
          <p className="text-sm text-slate-300">
            {lesson?.subject || "Classroom"} · {lessonTimeLabel(lesson)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageAttendance ? (
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-2">
              {!lessonStarted ? (
                <button
                  type="button"
                  onClick={() => updateLessonAttendance("start")}
                  disabled={attendanceActionLoading}
                  className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                  {attendanceActionLoading ? "Starting..." : "Start Lesson"}
                </button>
              ) : null}

              {lessonStarted && !lessonEnded ? (
                <>
                  <button
                    type="button"
                    onClick={openAttendanceForm}
                    disabled={attendanceActionLoading}
                    className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
                  >
                    End Lesson + Notes
                  </button>

                  <button
                    type="button"
                    onClick={openAttendanceForm}
                    disabled={attendanceActionLoading}
                    className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Save Notes
                  </button>
                </>
              ) : null}

              {lessonEnded ? (
                <span className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300">
                  Lesson Completed
                </span>
              ) : null}
            </div>
          ) : null}

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

      {attendanceMessage ? (
        <div className="border-b border-green-800 bg-green-950 px-4 py-3 text-sm text-green-200">
          {attendanceMessage}
        </div>
      ) : null}

      {error ? (
        <div className="border-b border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {showAttendanceForm && canManageAttendance ? (
        <div className="border-b border-slate-800 bg-slate-900 px-4 py-4">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Lesson Notes
              </label>
              <textarea
                value={lessonNotes}
                onChange={(event) => setLessonNotes(event.target.value)}
                rows={4}
                placeholder="What was covered? How did the learner progress? Any areas needing support?"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Homework / Next Steps
              </label>
              <textarea
                value={homeworkNotes}
                onChange={(event) => setHomeworkNotes(event.target.value)}
                rows={4}
                placeholder="Homework, revision focus, or next steps for the learner..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateLessonAttendance("notes")}
              disabled={attendanceActionLoading}
              className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Save Notes Only
            </button>

            <button
              type="button"
              onClick={() => updateLessonAttendance("end")}
              disabled={attendanceActionLoading}
              className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {attendanceActionLoading
                ? "Ending..."
                : "End Lesson & Mark Completed"}
            </button>

            <button
              type="button"
              onClick={() => setShowAttendanceForm(false)}
              className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <LiveKitRoom
        audio={true}
        video={{
          resolution: {
            width: 426,
            height: 240,
          },
          frameRate: 10,
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
