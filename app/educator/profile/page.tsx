"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CROPPED_IMAGE_SIZE = 900;

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

async function createCroppedImageFile({
  file,
  zoom,
  offsetX,
  offsetY,
}: {
  file: File;
  zoom: number;
  offsetX: number;
  offsetY: number;
}) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load selected image."));
      img.src = imageUrl;
    });

    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    const baseCropSize = Math.min(sourceWidth, sourceHeight);
    const cropSize = Math.max(1, baseCropSize / zoom);

    const maxX = (sourceWidth - cropSize) / 2;
    const maxY = (sourceHeight - cropSize) / 2;

    const centerX = sourceWidth / 2 + (offsetX / 100) * maxX;
    const centerY = sourceHeight / 2 + (offsetY / 100) * maxY;

    const sx = Math.min(
      Math.max(0, centerX - cropSize / 2),
      sourceWidth - cropSize
    );

    const sy = Math.min(
      Math.max(0, centerY - cropSize / 2),
      sourceHeight - cropSize
    );

    const canvas = document.createElement("canvas");
    canvas.width = CROPPED_IMAGE_SIZE;
    canvas.height = CROPPED_IMAGE_SIZE;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not prepare image crop.");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CROPPED_IMAGE_SIZE, CROPPED_IMAGE_SIZE);
    ctx.drawImage(
      image,
      sx,
      sy,
      cropSize,
      cropSize,
      0,
      0,
      CROPPED_IMAGE_SIZE,
      CROPPED_IMAGE_SIZE
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Could not create cropped image."));
        },
        "image/jpeg",
        0.9
      );
    });

    return new File([blob], "alkebula-profile-photo.jpg", {
      type: "image/jpeg",
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function EducatorProfilePage() {
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState("");
  const [zoom, setZoom] = useState(1.15);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadProfile();

    return () => {
      if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function resetSelectedImage() {
    if (selectedPreviewUrl) {
      URL.revokeObjectURL(selectedPreviewUrl);
    }

    setSelectedFile(null);
    setSelectedPreviewUrl("");
    setZoom(1.15);
    setOffsetX(0);
    setOffsetY(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileSelection(file: File) {
    setMessage("");
    setErrorMessage("");

    try {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new Error("Only JPG and PNG images are allowed.");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Profile photo must be below 5MB.");
      }

      if (selectedPreviewUrl) {
        URL.revokeObjectURL(selectedPreviewUrl);
      }

      setSelectedFile(file);
      setSelectedPreviewUrl(URL.createObjectURL(file));
      setZoom(1.15);
      setOffsetX(0);
      setOffsetY(0);
    } catch (error) {
      resetSelectedImage();
      setErrorMessage(
        error instanceof Error ? error.message : "Could not select image."
      );
    }
  }

  async function uploadPhoto() {
    setUploading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (!profile) {
        throw new Error("Profile not loaded.");
      }

      if (!selectedFile) {
        throw new Error("Please choose an image first.");
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

      const croppedFile = await createCroppedImageFile({
        file: selectedFile,
        zoom,
        offsetX,
        offsetY,
      });

      const formData = new FormData();
      formData.append("file", croppedFile);

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

      resetSelectedImage();
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
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
          The Alkebula School
        </p>

        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          Educator Profile Picture
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Upload, crop, and manage your professional educator profile picture.
          Your profile image appears publicly on tutor listings and booking
          pages viewed by parents and students.
        </p>

        <div className="mt-6 rounded-2xl border border-[#379CD6]/20 bg-[#F7FCFF] p-5 text-sm leading-7 text-slate-700">
          Choose a clear professional image, crop it carefully, then confirm the
          final upload. The cropped image is uploaded securely through The
          Alkebula School server.
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
          <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-[#F7FCFF] p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#156B96]">
                Current Public Photo
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl bg-white">
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
                  Last updated: {" "}
                  {new Date(profile.profile_photo_updated_at).toLocaleString()}
                </p>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8F1F36]">
                    Upload and Crop
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    Prepare New Profile Picture
                  </h3>
                </div>

                {selectedFile ? (
                  <button
                    type="button"
                    onClick={resetSelectedImage}
                    disabled={uploading}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Clear Image
                  </button>
                ) : null}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-semibold text-amber-900">
                  Professional Photo Guidelines
                </p>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-amber-800">
                  <li>• Use a clear professional headshot.</li>
                  <li>• Face the camera directly with good lighting.</li>
                  <li>• Crop so the face and upper chest are visible.</li>
                  <li>• Use a plain or clean background where possible.</li>
                  <li>
                    • Avoid selfies, filters, sunglasses, group photos, or
                    inappropriate content.
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
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      handleFileSelection(file);
                    }
                  }}
                  className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                />
              </div>

              {selectedPreviewUrl ? (
                <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#156B96]">
                    Crop Preview
                  </p>

                  <div className="mt-4 grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div className="mx-auto w-full max-w-[320px]">
                      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100">
                        <img
                          src={selectedPreviewUrl}
                          alt="Selected profile crop preview"
                          className="h-full w-full object-cover"
                          style={{
                            transform: `scale(${zoom}) translate(${offsetX / 8}%, ${
                              offsetY / 8
                            }%)`,
                            transformOrigin: "center",
                          }}
                        />

                        <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border-2 border-white/90 shadow-[0_0_0_999px_rgba(15,23,42,0.18)]" />
                      </div>

                      <p className="mt-3 text-center text-xs text-slate-500">
                        This square crop will be used as the uploaded image.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Zoom
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          disabled={uploading}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Move left / right
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="1"
                          value={offsetX}
                          onChange={(e) => setOffsetX(Number(e.target.value))}
                          disabled={uploading}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Move up / down
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="1"
                          value={offsetY}
                          onChange={(e) => setOffsetY(Number(e.target.value))}
                          disabled={uploading}
                          className="w-full"
                        />
                      </div>

                      <div className="rounded-2xl border border-[#379CD6]/20 bg-[#F7FCFF] p-4 text-sm leading-7 text-slate-600">
                        Adjust the sliders until the face is well centred and
                        the photo looks professional. Then click the final
                        upload button below.
                      </div>

                      <button
                        type="button"
                        onClick={uploadPhoto}
                        disabled={uploading}
                        className="w-full rounded-xl bg-[#8F1F36] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#6F1729] disabled:opacity-60"
                      >
                        {uploading
                          ? "Cropping and Uploading..."
                          : "Upload Cropped Profile Picture"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
