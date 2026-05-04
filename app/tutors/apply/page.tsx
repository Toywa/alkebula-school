"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function TutorApplyPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function getExtension(file: File) {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "file" : "file";
  }

  async function uploadDirect(file: File, label: string) {
    const supabase = getSupabaseBrowserClient();
    const extension = getExtension(file);

    const cleanLabel = label.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const filePath = `${cleanLabel}-${Date.now()}.${extension}`;

    console.log("🚀 Upload attempt:", {
      bucket: "educator-documents",
      filePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    const { data, error } = await supabase.storage
      .from("educator-documents")
      .upload(filePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      console.error("❌ Supabase upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log("✅ Upload success:", data);

    return data.path;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const profilePhoto = formData.get("profile_photo") as File;

      if (!profilePhoto) {
        throw new Error("Please upload a profile photo.");
      }

      setMessage("Uploading... check console");

      const path = await uploadDirect(profilePhoto, "profile-photo");

      setMessage(`Upload success: ${path}`);
    } catch (error) {
      setMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="profile_photo" type="file" required />
        <button type="submit">
          {loading ? "Uploading..." : "Test Upload"}
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      </form>
    </main>
  );
}