"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const PROFILE_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DOCUMENT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function TutorApplyPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [curricula, setCurricula] = useState<string[]>([]);

  function toggleValue(
    value: string,
    values: string[],
    setter: (values: string[]) => void,
    max?: number
  ) {
    if (values.includes(value)) {
      setter(values.filter((v) => v !== value));
      return;
    }

    if (max && values.length >= max) return;

    setter([...values, value]);
  }

  function getFile(formData: FormData, name: string) {
    const file = formData.get(name);

    if (!(file instanceof File) || file.size === 0) {
      throw new Error("Please upload all required files.");
    }

    return file;
  }

  function validateFileSize(file: File, label: string, maxSize: number) {
    if (file.size > maxSize) {
      throw new Error(
        `${label} is too large. Profile photo must be below 5MB. Documents must be below 10MB.`
      );
    }
  }

  function getExtension(file: File) {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "file" : "file";
  }

  async function uploadDirect(file: File, label: string) {
    const supabase = getSupabaseBrowserClient();

    const extension = getExtension(file);

    // ✅ FLAT PATH — NO FOLDERS
    const filePath = `${label}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("educator-documents")
      .upload(filePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed for ${label}: ${error.message}`);
    }

    return filePath;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (subjects.length < 1 || subjects.length > 2) {
        throw new Error("Please choose 1 or 2 subjects.");
      }

      if (curricula.length < 1) {
        throw new Error("Please choose at least one curriculum.");
      }

      const profilePhoto = getFile(formData, "profile_photo");
      const cvFile = getFile(formData, "cv_file");
      const degreeCertificate = getFile(formData, "degree_certificate");
      const highSchoolCertificate = getFile(formData, "high_school_certificate");

      validateFileSize(profilePhoto, "Profile photo", PROFILE_MAX_FILE_SIZE);
      validateFileSize(cvFile, "CV", DOCUMENT_MAX_FILE_SIZE);
      validateFileSize(degreeCertificate, "Degree certificate", DOCUMENT_MAX_FILE_SIZE);
      validateFileSize(highSchoolCertificate, "High school certificate", DOCUMENT_MAX_FILE_SIZE);

      const declarationNoCriminalPast =
        (form.elements.namedItem("declaration_no_criminal_past") as HTMLInputElement).checked;
      const declarationInternet15mbps =
        (form.elements.namedItem("declaration_internet_15mbps") as HTMLInputElement).checked;
      const declarationHasI5Laptop =
        (form.elements.namedItem("declaration_has_i5_laptop") as HTMLInputElement).checked;
      const declarationInformationTrue =
        (form.elements.namedItem("declaration_information_true") as HTMLInputElement).checked;

      if (
        !declarationNoCriminalPast ||
        !declarationInternet15mbps ||
        !declarationHasI5Laptop ||
        !declarationInformationTrue
      ) {
        throw new Error("All declarations must be accepted.");
      }

      setMessage("Uploading documents. Please wait...");

      // ✅ DIRECT UPLOADS
      const profilePhotoUrl = await uploadDirect(profilePhoto, "profile-photo");
      const cvUrl = await uploadDirect(cvFile, "cv");
      const degreeCertificateUrl = await uploadDirect(degreeCertificate, "degree");
      const highSchoolCertificateUrl = await uploadDirect(highSchoolCertificate, "high-school");

      const payload = {
        full_name: String(formData.get("full_name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        city: String(formData.get("city") || "").trim(),
        proposed_public_bio: String(formData.get("proposed_public_bio") || "").trim(),

        subjects,
        curricula,

        referee_1_name: String(formData.get("referee_1_name") || "").trim(),
        referee_1_email: String(formData.get("referee_1_email") || "").trim(),
        referee_1_phone: String(formData.get("referee_1_phone") || "").trim(),

        referee_2_name: String(formData.get("referee_2_name") || "").trim(),
        referee_2_email: String(formData.get("referee_2_email") || "").trim(),
        referee_2_phone: String(formData.get("referee_2_phone") || "").trim(),

        profile_photo_url: profilePhotoUrl,
        cv_url: cvUrl,
        degree_certificate_url: degreeCertificateUrl,
        high_school_certificate_url: highSchoolCertificateUrl,

        declaration_no_criminal_past: declarationNoCriminalPast,
        declaration_internet_15mbps: declarationInternet15mbps,
        declaration_has_i5_laptop: declarationHasI5Laptop,
        declaration_information_true: declarationInformationTrue,
      };

      const res = await fetch("/api/educator-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Application failed.");
      }

      setMessage("Application submitted successfully. Admin will review it.");
      form.reset();
      setSubjects([]);
      setCurricula([]);
    } catch (error) {
      setMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Application failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-bold">Tutor Application</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input name="full_name" placeholder="Full name" required />
          <input name="email" placeholder="Email" required />
          <input name="phone" placeholder="Phone" required />
          <input name="city" placeholder="City" required />

          <input name="profile_photo" type="file" required />
          <input name="cv_file" type="file" required />
          <input name="degree_certificate" type="file" required />
          <input name="high_school_certificate" type="file" required />

          <button type="submit">
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          {message && <p className="text-green-600">{message}</p>}
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </form>
      </section>
    </main>
  );
}