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
    const filePath = `tutor-applications/${Date.now()}-${label}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("educator-documents")
      .upload(filePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      throw new Error(`Could not upload ${label}: ${error.message}`);
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
      validateFileSize(degreeCertificate, "Degree / Diploma certificate", DOCUMENT_MAX_FILE_SIZE);
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

      const profilePhotoUrl = await uploadDirect(profilePhoto, "profile-photo");
      const cvUrl = await uploadDirect(cvFile, "cv");
      const degreeCertificateUrl = await uploadDirect(degreeCertificate, "degree-certificate");
      const highSchoolCertificateUrl = await uploadDirect(
        highSchoolCertificate,
        "high-school-certificate"
      );

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
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-4xl font-bold">Tutor Application</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Apply to join The Alkebula School. Only approved tutors will be listed
          publicly and allowed to publish bookable availability.
        </p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Upload guidance</p>
          <p className="mt-1">
            Profile photo should be below <strong>5MB</strong>. CV and
            certificates should each be below <strong>10MB</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <input name="full_name" placeholder="Full name" className="rounded-xl border border-slate-300 px-4 py-3" required />
            <input name="email" type="email" placeholder="Email" className="rounded-xl border border-slate-300 px-4 py-3" required />
            <input name="phone" placeholder="Phone number" className="rounded-xl border border-slate-300 px-4 py-3" required />
            <input name="city" placeholder="City" className="rounded-xl border border-slate-300 px-4 py-3" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Proposed public bio (max 100 characters)
            </label>
            <input
              name="proposed_public_bio"
              maxLength={100}
              placeholder="Short public bio"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-medium">Choose 1 or 2 subjects</p>
              <div className="space-y-2">
                {[
                  "Mathematics",
                  "English",
                  "Biology",
                  "Chemistry",
                  "Physics",
                  "Geography",
                  "History",
                  "Economics",
                  "Business Studies",
                  "Computer Science",
                ].map((subject) => (
                  <label key={subject} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={subjects.includes(subject)}
                      onChange={() => toggleValue(subject, subjects, setSubjects, 2)}
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">Curriculum / curricula</p>
              <div className="space-y-2">
                {["Cambridge", "Edexcel", "A Levels", "IB"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={curricula.includes(item)}
                      onChange={() => toggleValue(item, curricula, setCurricula)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Profile picture (JPG or PNG only, max 5MB)
              </label>
              <input
                name="profile_photo"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                CV (PDF, DOC or DOCX only, max 10MB)
              </label>
              <input
                name="cv_file"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Degree / Diploma certificate (PDF/JPG/PNG, max 10MB)
              </label>
              <input
                name="degree_certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                High school certificate (PDF/JPG/PNG, max 10MB)
              </label>
              <input
                name="high_school_certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold">Professional Referee 1</h2>
              <div className="mt-4 space-y-3">
                <input name="referee_1_name" placeholder="Name" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
                <input name="referee_1_email" type="email" placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
                <input name="referee_1_phone" placeholder="Phone" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold">Professional Referee 2</h2>
              <div className="mt-4 space-y-3">
                <input name="referee_2_name" placeholder="Name" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
                <input name="referee_2_email" type="email" placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
                <input name="referee_2_phone" placeholder="Phone" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 p-5">
            <label className="flex items-center gap-3 text-sm">
              <input name="declaration_no_criminal_past" type="checkbox" />
              I declare that I have no criminal past.
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input name="declaration_internet_15mbps" type="checkbox" />
              I declare that I have at least 15 mbps internet connection.
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input name="declaration_has_i5_laptop" type="checkbox" />
              I declare that I have at least an i5 laptop.
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input name="declaration_information_true" type="checkbox" />
              I commit that all submitted information is correct and true.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          {message ? <p className="text-green-600">{message}</p> : null}
          {errorMessage ? <p className="text-red-600">{errorMessage}</p> : null}
        </form>
      </section>
    </main>
  );
}