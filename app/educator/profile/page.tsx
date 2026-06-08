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

  if (path.startsWith("http")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/educator-profile-images/${path}`;
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

  async function getSessionToken() {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

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
        error instanceof Error
          ? error.message
          : "Failed to load educator profile."
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
      if (!profile) {
        throw new Error("Profile not loaded.");
      }

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

      const token = await getSessionToken();

      if (!token) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/educator/profile-photo/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile picture.");
      }

      setMessage(
        data.message ||
          "Profile picture updated successfully. Your public tutor profile will now display the new image."
      );

      await loadProfile();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Profile photo update failed."
      );
    } finally {
      setUploading(false);
    }
  }

  const imageUrl = getImageUrl(profile?.profile_photo_url);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          Educator Profile Picture
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Upload and manage your professional educator profile picture. Your
          profile image appears publicly on tutor listings and booking pages
          viewed by parents and students.
        </p>

        <div className="mt-6 rounded-2xl border border-[#379CD6]/20 bg-[#F7FCFF] p-5 text-sm leading-7 text-slate-700">
          Profile pictures are uploaded securely through The Alkebula School
          server and linked to your approved educator profile.
        </div>

        {loading ? <p className="mt-8">Loading profile...</p> : null}

        {message ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
            {message}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!loading && profile ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-[#F7FCFF] p-6 shadow-sm">
              <div className="overflow-hidden rounded-2xl bg-white">
                {imageUrl ? (
                  <div className="flex h-80 items-center justify-center bg-white">
                    <img
                      src={imageUrl}
                      alt={profile.full_name}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                ) : (
                  <div className="flex h-80 items-center justify-center bg-slate-100 text-sm text-slate-500">
                    No profile photo uploaded
                  </div>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-semibold">
                {profile.full_name}
              </h2>

              <p className="mt-2 text-sm text-slate-600">{profile.email}</p>

              {profile.profile_photo_updated_at ? (
                <p className="mt-4 text-xs text-slate-500">
                  Last updated:{" "}
                  {new Date(profile.profile_photo_updated_at).toLocaleString()}
                </p>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold">
                Upload New Profile Picture
              </h3>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-semibold text-amber-900">
                  Professional Photo Guidelines
                </p>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-800">
                  <li>• Use a clear professional headshot.</li>
                  <li>• Face the camera directly with good lighting.</li>
                  <li>• Use a plain or clean background.</li>
                  <li>• Wear professional or smart-casual clothing.</li>
                  <li>
                    • Avoid selfies, passport/photo-me booth photos, filters,
                    screenshots, sunglasses, group photos, cropped social media
                    images, or inappropriate content.
                  </li>
                  <li>
                    • The Alkebula School may reject or remove images that do
                    not meet educator professionalism standards.
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F7FCFF] p-5">
                <p className="font-medium">
                  JPG or PNG only. Maximum file size: 5MB.
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Profile pictures may only be updated once per calendar month.
                </p>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      uploadPhoto(file);
                    }
                  }}
                  className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                />

                <button
                  type="button"
                  disabled
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white opacity-70"
                >
                  {uploading ? "Uploading..." : "Choose a file to upload"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
