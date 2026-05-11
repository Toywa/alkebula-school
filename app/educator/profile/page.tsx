"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type EducatorProfile = {
  email: string;
  full_name: string;
  profile_photo_url: string | null;
  profile_photo_updated_at: string | null;
};

function getImageUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/educator-profile-images/${path}`;
}

function getExtension(file: File) {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "jpg" : "jpg";
}

function sameCalendarMonth(dateA: Date, dateB: Date) {
  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth()
  );
}

export default function EducatorProfilePage() {
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const { data, error } = await supabase
        .from("educator_directory")
        .select("email,full_name,profile_photo_url,profile_photo_updated_at")
        .eq("email", user.email.toLowerCase())
        .eq("approval_status", "approved")
        .single();

      if (error || !data) {
        throw new Error("Approved educator profile not found.");
      }

      setProfile(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!profile) throw new Error("Profile not loaded.");

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new Error("Only JPG and PNG images are allowed.");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Profile photo must be below 5MB.");
      }

      if (profile.profile_photo_updated_at) {
        const lastUpdate = new Date(profile.profile_photo_updated_at);
        const now = new Date();

        if (sameCalendarMonth(lastUpdate, now)) {
          throw new Error(
            "You can update your profile picture only once per calendar month."
          );
        }
      }

      const supabase = getSupabaseBrowserClient();
      const extension = getExtension(file);
      const safeEmail = profile.email.replace(/[^a-zA-Z0-9]/g, "-");
      const path = `educator-${safeEmail}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("educator-profile-images")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const res = await fetch("/api/educator/profile-photo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_photo_url: path,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Profile photo update failed.");
      }

      setMessage("Profile picture updated successfully.");
      await loadProfile();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Profile photo update failed."
      );
    } finally {
      setUploading(false);
    }
  }

  const imageUrl = getImageUrl(profile?.profile_photo_url);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold">Educator Profile</h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Manage your educator profile picture. Profile photos may be updated
          once per calendar month.
        </p>

        {loading ? <p className="mt-8">Loading profile...</p> : null}

        {message ? <p className="mt-6 text-green-600">{message}</p> : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!loading && profile ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={profile.full_name}
                    className="h-60 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center rounded-2xl bg-white text-sm text-slate-500">
                    No profile photo
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold">{profile.full_name}</h2>
                <p className="mt-2 text-sm text-slate-600">{profile.email}</p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="font-semibold">Upload New Profile Picture</p>

                  <p className="mt-2 text-sm text-slate-600">
                    JPG or PNG only. Maximum 5MB. You may update once per
                    calendar month.
                  </p>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPhoto(file);
                    }}
                    className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  />

                  {profile.profile_photo_updated_at ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Last updated:{" "}
                      {new Date(
                        profile.profile_photo_updated_at
                      ).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}