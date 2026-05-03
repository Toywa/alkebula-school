"use client";

import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

  function validateFileSize(file: FormDataEntryValue | null, label: string) {
    if (file instanceof File && file.size > MAX_FILE_SIZE) {
      throw new Error(`${label} must be less than 5MB.`);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      subjects.forEach((subject) => formData.append("subjects", subject));
      curricula.forEach((item) => formData.append("curricula", item));

      validateFileSize(formData.get("profile_photo"), "Profile photo");
      validateFileSize(formData.get("cv_file"), "CV");
      validateFileSize(formData.get("degree_certificate"), "Degree / Diploma certificate");
      validateFileSize(formData.get("high_school_certificate"), "High school certificate");

      formData.set(
        "declaration_no_criminal_past",
        String(
          (form.elements.namedItem("declaration_no_criminal_past") as HTMLInputElement)
            .checked
        )
      );
      formData.set(
        "declaration_internet_15mbps",
        String(
          (form.elements.namedItem("declaration_internet_15mbps") as HTMLInputElement)
            .checked
        )
      );
      formData.set(
        "declaration_has_i5_laptop",
        String(
          (form.elements.namedItem("declaration_has_i5_laptop") as HTMLInputElement)
            .checked
        )
      );
      formData.set(
        "declaration_information_true",
        String(
          (form.elements.namedItem("declaration_information_true") as HTMLInputElement)
            .checked
        )
      );

      const res = await fetch("/api/educator-applications", {
        method: "POST",
        body: formData,
      });

      let data: { error?: string; message?: string };

      try {
        data = await res.json();
      } catch {
        throw new Error(
          "Upload failed because the files may be too large. Please reduce each file to below 5MB and try again."
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Application failed. Please try again.");
      }

      setMessage("Application submitted successfully. Admin will review it.");
      form.reset();
      setSubjects([]);
      setCurricula([]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Application failed"
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
            Please keep each uploaded file below <strong>5MB</strong>. Accepted
            formats: profile photo JPG/PNG, CV PDF/DOC/DOCX, certificates
            PDF/JPG/PNG.
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
              Proposed public bio (max 20 characters)
            </label>
            <input
              name="proposed_public_bio"
              maxLength={20}
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
              <input name="profile_photo" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                CV (PDF, DOC or DOCX only, max 5MB)
              </label>
              <input name="cv_file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Degree / Diploma certificate (max 5MB)
              </label>
              <input name="degree_certificate" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                High school certificate (max 5MB)
              </label>
              <input name="high_school_certificate" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
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