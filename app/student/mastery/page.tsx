"use client";

import { useState } from "react";

export default function StudentMasteryPage() {
  const [studentName, setStudentName] = useState("");
  const [mastery, setMastery] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMastery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/student-mastery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load mastery.");
      }

      setMastery(result.mastery);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load mastery.";
      setError(msg);
      setMastery(null);
    } finally {
      setLoading(false);
    }
  }

  function getColor(level: string) {
    if (level === "green") return "bg-green-100 text-green-800";
    if (level === "amber") return "bg-yellow-100 text-yellow-800";
    if (level === "red") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-600";
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold text-[#1A1A1A]">Mastery Tracker</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Load a student profile to view mastery by subject, topic, and subtopic.
          </p>

          <form onSubmit={loadMastery} className="mt-6 flex flex-col gap-4 md:flex-row">
            <input
              className="flex-1 rounded-xl border p-3"
              placeholder="Enter student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load Mastery"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        {mastery && (
          <div className="mt-8 space-y-6">
            {Object.entries(mastery).map(([subject, topics]: any) => (
              <div key={subject} className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">{subject}</h2>

                {Object.entries(topics).map(([topic, subtopics]: any) => (
                  <div key={topic} className="mt-4">
                    <h3 className="text-lg font-semibold text-slate-800">{topic}</h3>

                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {Object.entries(subtopics).map(([subtopic, data]: any) => (
                        <div
                          key={subtopic}
                          className={`rounded-xl p-4 ${getColor(data.level)}`}
                        >
                          <div className="font-medium">{subtopic}</div>
                          <div className="mt-1 text-sm">
                            Score: {data.score ?? "-"}
                          </div>
                          <div className="mt-1 text-xs uppercase">
                            {data.level}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}