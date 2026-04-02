"use client";

import { useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  primarySubject: string;
  curriculumExpertise: string;
  yearsExperience: string;
  teachingMode: string;
  availability: string;
  hourlyRate: string;
  tscNumber: string;
  referenceName: string;
  referenceContact: string;
  chiefName: string;
  chiefContact: string;
  bio: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  primarySubject: "",
  curriculumExpertise: "",
  yearsExperience: "",
  teachingMode: "",
  availability: "",
  hourlyRate: "",
  tscNumber: "",
  referenceName: "",
  referenceContact: "",
  chiefName: "",
  chiefContact: "",
  bio: "",
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [goodConductFile, setGoodConductFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          primarySubject: form.primarySubject,
          curriculumExpertise: form.curriculumExpertise,
          yearsExperience: Number(form.yearsExperience),
          teachingMode: form.teachingMode,
          availability: form.availability,
          hourlyRate: Number(form.hourlyRate),
          tscNumber: form.tscNumber,
          referenceName: form.referenceName,
          referenceContact: form.referenceContact,
          chiefName: form.chiefName,
          chiefContact: form.chiefContact,
          bio: form.bio,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setApplicationId(result.application.id);
      setMessage("Application submitted. You can now upload your documents.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function uploadOneFile(file: File, documentType: string) {
    if (!applicationId) throw new Error("Missing application ID.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("applicationId", applicationId);
    formData.append("documentType", documentType);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `Failed to upload ${documentType}.`);
    }

    return result;
  }

  async function handleDocumentUploads() {
    if (!applicationId) {
      setError("Submit the application first before uploading documents.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const uploads: Array<Promise<unknown>> = [];

      if (cvFile) uploads.push(uploadOneFile(cvFile, "cv"));
      if (certificateFile) uploads.push(uploadOneFile(certificateFile, "certificate"));
      if (goodConductFile) uploads.push(uploadOneFile(goodConductFile, "good_conduct"));
      if (idFile) uploads.push(uploadOneFile(idFile, "id_copy"));
      if (profilePhotoFile) uploads.push(uploadOneFile(profilePhotoFile, "profile_photo"));

      if (uploads.length === 0) {
        throw new Error("Please choose at least one document to upload.");
      }

      await Promise.all(uploads);

      setMessage("Documents uploaded successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
        <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
          The Alkebula School
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
          Educator Application
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Submit your professional details, then upload your verification documents.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Physical location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Primary subject"
            value={form.primarySubject}
            onChange={(e) => updateField("primarySubject", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Curriculum expertise"
            value={form.curriculumExpertise}
            onChange={(e) => updateField("curriculumExpertise", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Years of experience"
            type="number"
            value={form.yearsExperience}
            onChange={(e) => updateField("yearsExperience", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Teaching mode (Online / In-person / Both)"
            value={form.teachingMode}
            onChange={(e) => updateField("teachingMode", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Availability"
            value={form.availability}
            onChange={(e) => updateField("availability", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Rate per hour (KES)"
            type="number"
            value={form.hourlyRate}
            onChange={(e) => updateField("hourlyRate", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="TSC number"
            value={form.tscNumber}
            onChange={(e) => updateField("tscNumber", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Reference name"
            value={form.referenceName}
            onChange={(e) => updateField("referenceName", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Reference contact"
            value={form.referenceContact}
            onChange={(e) => updateField("referenceContact", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Chief's name"
            value={form.chiefName}
            onChange={(e) => updateField("chiefName", e.target.value)}
          />
          <input
            className="rounded-xl border p-3"
            placeholder="Chief's contact"
            value={form.chiefContact}
            onChange={(e) => updateField("chiefContact", e.target.value)}
          />

          <textarea
            className="min-h-[140px] rounded-xl border p-3 md:col-span-2"
            placeholder="Short professional bio"
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>

        <div className="mt-10 rounded-2xl border p-6">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Upload Documents</h2>
          <p className="mt-2 text-slate-600">
            Upload documents after the application has been submitted.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">CV (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Certificates</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCertificateFile(e.target.files?.[0] || null)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Certificate of Good Conduct</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setGoodConductFile(e.target.files?.[0] || null)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">ID Copy</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Professional Profile Photo</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setProfilePhotoFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleDocumentUploads}
              disabled={uploading || !applicationId}
              className="rounded-xl bg-[#C6A75E] px-5 py-3 font-medium text-[#1A1A1A] disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Documents"}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-6 rounded-xl bg-green-50 p-3 text-green-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl bg-red-50 p-3 text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}