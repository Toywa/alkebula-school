"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type SubjectRate = {
  curriculum_level: string;
  class_level: string;
  subject: string;
  hourly_rate: number;
};

type EditLimit = {
  monthlyLimit: number;
  editsUsed: number;
  editsRemaining: number;
  canEdit: boolean;
  resetNote: string;
};

type EducatorProfile = {
  id: string;
  email: string;
  full_name: string;
  bio: string | null;
  city: string | null;
  qualification: string | null;
  years_of_experience: number | null;
  timezone: string | null;
  subjects: string[] | null;
  curricula: string[] | null;
  class_levels: string[] | null;
  subject_rates: SubjectRate[] | null;
};

const emptyRate: SubjectRate = {
  curriculum_level: "",
  class_level: "",
  subject: "",
  hourly_rate: 0,
};

export default function EducatorPublicProfilePage() {
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [editLimit, setEditLimit] = useState<EditLimit | null>(null);

  const [qualification, setQualification] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("Africa/Nairobi");
  const [bio, setBio] = useState("");
  const [subjectRates, setSubjectRates] = useState<SubjectRate[]>([
    { ...emptyRate },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function getSessionToken() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

  async function loadEditLimit(token: string) {
    const response = await fetch("/api/tutor-profile/edit-limit", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not load profile edit limit.");
    }

    setEditLimit(data);
  }

  async function loadProfile() {
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const token = await getSessionToken();

      if (!token) {
        window.location.href = "/auth/sign-in";
        return;
      }

      await loadEditLimit(token);

      const { data, error } = await supabase
        .from("educator_directory")
        .select("*")
        .eq("email", user.email.toLowerCase())
        .eq("approval_status", "approved")
        .single();

      if (error || !data) {
        throw new Error("Approved tutor profile not found.");
      }

      setProfile(data);

      setQualification(data.qualification || "");
      setYearsOfExperience(
        data.years_of_experience ? String(data.years_of_experience) : ""
      );
      setCity(data.city || "");
      setTimezone(data.timezone || "Africa/Nairobi");
      setBio(data.bio || "");

      if (Array.isArray(data.subject_rates) && data.subject_rates.length > 0) {
        setSubjectRates(
          data.subject_rates.map((item: any) => ({
            curriculum_level: item.curriculum_level || "",
            class_level:
              item.class_level || item.student_level || item.level || "",
            subject: item.subject || "",
            hourly_rate: Number(item.hourly_rate || 0),
          }))
        );
      } else {
        setSubjectRates([{ ...emptyRate }]);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateRate(index: number, field: keyof SubjectRate, value: string) {
    setSubjectRates((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "hourly_rate" ? Number(value) : value,
            }
          : item
      )
    );
  }

  function addRate() {
    setSubjectRates((prev) => [...prev, { ...emptyRate }]);
  }

  function removeRate(index: number) {
    setSubjectRates((prev) => {
      const next = prev.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ ...emptyRate }];
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const token = await getSessionToken();

      if (!token) {
        window.location.href = "/auth/sign-in";
        return;
      }

      if (bio.length > 200) {
        throw new Error("Bio must be 200 characters or fewer.");
      }

      const cleanRates = subjectRates
        .map((item) => ({
          curriculum_level: item.curriculum_level.trim(),
          class_level: item.class_level.trim(),
          subject: item.subject.trim(),
          hourly_rate: Number(item.hourly_rate || 0),
        }))
        .filter(
          (item) =>
            item.curriculum_level ||
            item.class_level ||
            item.subject ||
            item.hourly_rate
        );

      if (cleanRates.length < 1) {
        throw new Error("Please add at least one subject package.");
      }

      const invalidRate = cleanRates.find(
        (item) =>
          !item.curriculum_level ||
          !item.class_level ||
          !item.subject ||
          !item.hourly_rate ||
          item.hourly_rate <= 0
      );

      if (invalidRate) {
        throw new Error(
          "Each subject package must include curriculum, class/level, subject, and hourly rate."
        );
      }

      const response = await fetch("/api/tutor-profile/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qualification,
          years_of_experience: Number(yearsOfExperience || 0),
          city,
          timezone,
          bio,
          subject_rates: cleanRates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Profile update failed.");
      }

      setMessage(data.message || "Profile updated successfully.");
      await loadProfile();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  }

  const canEdit = Boolean(editLimit?.canEdit);
  const disabled = saving || !canEdit;

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        Loading public profile editor...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-20">
        <Link
          href="/educator/dashboard"
          className="text-sm font-semibold text-[#8F1F36] hover:underline"
        >
          ← Back to Educator Dashboard
        </Link>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Public Tutor Profile
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Edit your public profile
          </h1>

          <p className="mt-4 max-w-3xl leading-8 text-slate-600">
            Keep your profile clear and parent-friendly. You may edit your public
            profile a maximum of 3 times per calendar month.
          </p>

          {profile ? (
            <p className="mt-4 text-sm text-slate-600">
              Editing profile for:{" "}
              <strong className="text-slate-950">{profile.full_name}</strong>
            </p>
          ) : null}
        </div>

        {editLimit ? (
          <div
            className={`mt-6 rounded-2xl border p-5 ${
              editLimit.canEdit
                ? "border-[#379CD6]/20 bg-[#F7FCFF]"
                : "border-red-200 bg-red-50"
            }`}
          >
            <p className="font-bold text-slate-950">
              Monthly profile edits: {editLimit.editsUsed} of{" "}
              {editLimit.monthlyLimit} used
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Edits remaining this month:{" "}
              <strong>{editLimit.editsRemaining}</strong>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {editLimit.resetNote}
            </p>
          </div>
        ) : null}

        {message ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Qualification
              </label>
              <input
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Example: BSc Mathematics"
                disabled={disabled}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Years of experience
              </label>
              <input
                type="number"
                min="0"
                max="80"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="Example: 8"
                disabled={disabled}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Example: Nairobi"
                disabled={disabled}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Timezone
              </label>
              <input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Example: Africa/Nairobi"
                disabled={disabled}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm font-semibold">
                Public bio
              </label>
              <span
                className={`text-xs font-semibold ${
                  bio.length > 200 ? "text-red-600" : "text-slate-500"
                }`}
              >
                {bio.length}/200
              </span>
            </div>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={4}
              placeholder="Brief parent-friendly bio, maximum 200 characters."
              disabled={disabled}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
              required
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[#F7FCFF] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  Subjects, classes and hourly rates
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  These packages appear on your public tutor profile.
                </p>
              </div>

              <button
                type="button"
                onClick={addRate}
                disabled={disabled}
                className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                Add Package
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {subjectRates.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    <input
                      value={item.curriculum_level}
                      onChange={(e) =>
                        updateRate(index, "curriculum_level", e.target.value)
                      }
                      placeholder="Curriculum"
                      disabled={disabled}
                      className="rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                      required
                    />

                    <input
                      value={item.class_level}
                      onChange={(e) =>
                        updateRate(index, "class_level", e.target.value)
                      }
                      placeholder="Class / Level"
                      disabled={disabled}
                      className="rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                      required
                    />

                    <input
                      value={item.subject}
                      onChange={(e) =>
                        updateRate(index, "subject", e.target.value)
                      }
                      placeholder="Subject"
                      disabled={disabled}
                      className="rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                      required
                    />

                    <input
                      type="number"
                      min="1"
                      value={item.hourly_rate || ""}
                      onChange={(e) =>
                        updateRate(index, "hourly_rate", e.target.value)
                      }
                      placeholder="USD/hour"
                      disabled={disabled}
                      className="rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRate(index)}
                    disabled={disabled}
                    className="mt-3 text-sm font-semibold text-red-600 disabled:opacity-40"
                  >
                    Remove package
                  </button>
                </div>
              ))}
            </div>
          </div>

          {!canEdit ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              You have reached your maximum of 3 public profile edits for this
              calendar month. You can edit again next month.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={disabled}
            className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Public Profile"}
          </button>
        </form>
      </section>
    </main>
  );
}