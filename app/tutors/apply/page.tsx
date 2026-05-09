"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const PROFILE_MAX_FILE_SIZE = 5 * 1024 * 1024;
const DOCUMENT_MAX_FILE_SIZE = 10 * 1024 * 1024;

type SubjectRate = {
  curriculum_level: string;
  subject: string;
  hourly_rate: number;
};

const SUBJECT_CATEGORIES = [
  {
    label: "KEY STAGE 3 (KS3)",
    subjects: [
      "English Language",
      "English Literature",
      "French",
      "Spanish",
      "German",
      "Mandarin Chinese",
      "Arabic",
      "Swahili",
      "Mathematics",
      "Further Mathematics",
      "Computer Science",
      "ICT",
      "Digital Literacy",
      "General Science",
      "Biology",
      "Chemistry",
      "Physics",
      "Environmental Science",
      "Geography",
      "History",
      "Religious Studies",
      "Global Perspectives",
      "Citizenship",
      "Philosophy",
      "Economics",
      "Business Studies",
    ],
  },
  {
    label: "CAMBRIDGE IGCSE",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Combined Science",
      "Environmental Management",
      "Mathematics",
      "Additional Mathematics",
      "Computer Science",
      "ICT",
      "Statistics",
      "Accounting",
      "Business Studies",
      "Economics",
      "Geography",
      "History",
      "Psychology",
      "Sociology",
      "English First Language",
      "English Literature",
      "French",
      "Spanish",
      "German",
      "Arabic",
      "Swahili",
      "Chinese",
      "Art & Design",
      "Drama",
      "Music",
      "Physical Education",
    ],
  },
  {
    label: "EDEXCEL INTERNATIONAL GCSE",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Human Biology",
      "Mathematics A",
      "Mathematics B",
      "Further Pure Mathematics",
      "Computer Science",
      "ICT",
      "Accounting",
      "Business",
      "Economics",
      "Geography",
      "History",
      "English Language A",
      "English Literature",
      "French",
      "Spanish",
      "German",
      "Arabic",
      "Chinese",
      "Swahili",
    ],
  },
  {
    label: "CAMBRIDGE INTERNATIONAL A LEVELS",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Marine Science",
      "Mathematics",
      "Further Mathematics",
      "Computer Science",
      "Information Technology",
      "Accounting",
      "Business",
      "Economics",
      "Geography",
      "History",
      "Law",
      "Psychology",
      "Sociology",
      "English Language",
      "English Literature",
      "French",
      "German",
      "Spanish",
      "Arabic",
      "Art & Design",
      "Drama",
      "Music",
    ],
  },
  {
    label: "EDEXCEL INTERNATIONAL A LEVELS",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Mathematics",
      "Further Mathematics",
      "Information Technology",
      "Computer Science",
      "Accounting",
      "Business",
      "Economics",
      "Geography",
      "History",
      "Law",
      "Psychology",
      "English Language",
      "English Literature",
      "French",
      "German",
      "Spanish",
      "Arabic",
    ],
  },
  {
    label: "IB MIDDLE YEARS PROGRAMME (IB MYP)",
    subjects: [
      "English Language & Literature",
      "Arabic Language & Literature",
      "French Language & Literature",
      "English Acquisition",
      "French Acquisition",
      "Spanish Acquisition",
      "Mathematics",
      "Extended Mathematics",
      "Integrated Sciences",
      "Biology",
      "Chemistry",
      "Physics",
      "History",
      "Geography",
      "Economics",
      "Global Politics",
      "Visual Arts",
      "Music",
      "Drama",
      "Film Studies",
    ],
  },
  {
    label: "IB DIPLOMA — STANDARD LEVEL (IB SL)",
    subjects: [
      "Language A: Literature",
      "Language A: Language & Literature",
      "Business Management",
      "Economics",
      "Geography",
      "History",
      "Psychology",
      "Biology",
      "Chemistry",
      "Physics",
      "Computer Science",
      "Mathematics: Analysis & Approaches",
      "Mathematics: Applications & Interpretation",
    ],
  },
  {
    label: "IB DIPLOMA — HIGHER LEVEL (IB HL)",
    subjects: [
      "Language A: Literature",
      "Language A: Language & Literature",
      "Business Management",
      "Economics",
      "Geography",
      "History",
      "Psychology",
      "Biology",
      "Chemistry",
      "Physics",
      "Computer Science",
      "Mathematics: Analysis & Approaches",
      "Mathematics: Applications & Interpretation",
    ],
  },
];

export default function TutorApplyPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [subjectRates, setSubjectRates] = useState<SubjectRate[]>([]);

  function isSelected(curriculumLevel: string, subject: string) {
    return subjectRates.some(
      (item) =>
        item.curriculum_level === curriculumLevel && item.subject === subject
    );
  }

  function selectedCountForCategory(curriculumLevel: string) {
    return subjectRates.filter(
      (item) => item.curriculum_level === curriculumLevel
    ).length;
  }

  function toggleSubject(curriculumLevel: string, subject: string) {
    const alreadySelected = isSelected(curriculumLevel, subject);

    if (alreadySelected) {
      setSubjectRates((prev) =>
        prev.filter(
          (item) =>
            !(
              item.curriculum_level === curriculumLevel &&
              item.subject === subject
            )
        )
      );
      return;
    }

    if (selectedCountForCategory(curriculumLevel) >= 2) {
      setErrorMessage(
        `You can select a maximum of 2 subjects under ${curriculumLevel}.`
      );
      return;
    }

    setErrorMessage("");
    setSubjectRates((prev) => [
      ...prev,
      {
        curriculum_level: curriculumLevel,
        subject,
        hourly_rate: 0,
      },
    ]);
  }

  function updateSubjectRate(
    curriculumLevel: string,
    subject: string,
    hourlyRate: number
  ) {
    setSubjectRates((prev) =>
      prev.map((item) =>
        item.curriculum_level === curriculumLevel && item.subject === subject
          ? { ...item, hourly_rate: hourlyRate }
          : item
      )
    );
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

  function validateFileType(file: File, allowedTypes: string[], label: string) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`${label} has an unsupported file type.`);
    }
  }

  function getExtension(file: File) {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "file" : "file";
  }

  async function uploadDirect(file: File, label: string, bucket: string) {
    const supabase = getSupabaseBrowserClient();
    const extension = getExtension(file);
    const filePath = `${label}-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
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

      if (subjectRates.length < 1) {
        throw new Error(
          "Please select at least one subject and provide its hourly rate."
        );
      }

      const invalidRate = subjectRates.find(
        (item) => !item.hourly_rate || Number(item.hourly_rate) <= 0
      );

      if (invalidRate) {
        throw new Error(
          `Please enter a valid USD hourly rate for ${invalidRate.subject} under ${invalidRate.curriculum_level}.`
        );
      }

      const profilePhoto = getFile(formData, "profile_photo");
      const cvFile = getFile(formData, "cv_file");
      const degreeCertificate = getFile(formData, "degree_certificate");
      const highSchoolCertificate = getFile(formData, "high_school_certificate");

      validateFileSize(profilePhoto, "Profile photo", PROFILE_MAX_FILE_SIZE);
      validateFileSize(cvFile, "CV", DOCUMENT_MAX_FILE_SIZE);
      validateFileSize(
        degreeCertificate,
        "Degree / Diploma certificate",
        DOCUMENT_MAX_FILE_SIZE
      );
      validateFileSize(
        highSchoolCertificate,
        "High school certificate",
        DOCUMENT_MAX_FILE_SIZE
      );

      validateFileType(profilePhoto, ["image/jpeg", "image/png"], "Profile photo");

      validateFileType(
        cvFile,
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        "CV"
      );

      validateFileType(
        degreeCertificate,
        ["application/pdf", "image/jpeg", "image/png"],
        "Degree / Diploma certificate"
      );

      validateFileType(
        highSchoolCertificate,
        ["application/pdf", "image/jpeg", "image/png"],
        "High school certificate"
      );

      const declarationNoCriminalPast =
        (form.elements.namedItem("declaration_no_criminal_past") as HTMLInputElement)
          .checked;

      const declarationInternet15mbps =
        (form.elements.namedItem("declaration_internet_15mbps") as HTMLInputElement)
          .checked;

      const declarationHasI5Laptop =
        (form.elements.namedItem("declaration_has_i5_laptop") as HTMLInputElement)
          .checked;

      const declarationInformationTrue =
        (form.elements.namedItem("declaration_information_true") as HTMLInputElement)
          .checked;

      if (
        !declarationNoCriminalPast ||
        !declarationInternet15mbps ||
        !declarationHasI5Laptop ||
        !declarationInformationTrue
      ) {
        throw new Error("All declarations must be accepted.");
      }

      setMessage("Uploading documents. Please wait...");

      const profilePhotoUrl = await uploadDirect(
        profilePhoto,
        "profile-photo",
        "educator-profile-images"
      );

      const cvUrl = await uploadDirect(cvFile, "cv", "educator-documents");

      const degreeCertificateUrl = await uploadDirect(
        degreeCertificate,
        "degree-certificate",
        "educator-documents"
      );

      const highSchoolCertificateUrl = await uploadDirect(
        highSchoolCertificate,
        "high-school-certificate",
        "educator-documents"
      );

      const derivedSubjects = Array.from(
        new Set(subjectRates.map((item) => item.subject))
      );

      const derivedCurricula = Array.from(
        new Set(subjectRates.map((item) => item.curriculum_level))
      );

      const lowestHourlyRate = Math.min(
        ...subjectRates.map((item) => Number(item.hourly_rate))
      );

      const payload = {
        full_name: String(formData.get("full_name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        city: String(formData.get("city") || "").trim(),
        hourly_rate: lowestHourlyRate,
        proposed_public_bio: String(
          formData.get("proposed_public_bio") || ""
        ).trim(),

        subjects: derivedSubjects,
        curricula: derivedCurricula,
        subject_rates: subjectRates,

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
      setSubmitted(true);
      form.reset();
      setSubjectRates([]);
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
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <h1 className="text-4xl font-bold">Tutor Application</h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Apply to join The Alkebula School. Only approved tutors will be listed
          publicly and allowed to publish bookable availability.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-8">
            <h2 className="text-2xl font-bold text-green-800">
              Application Submitted Successfully
            </h2>

            <p className="mt-4 leading-7 text-green-700">
              Thank you for applying to join The Alkebula School educator
              network. Our academic team will review your application and contact
              you if your profile is shortlisted for the next stage.
            </p>

            <p className="mt-4 text-sm text-green-700">
              You may now safely close this page.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Application guidance</p>
              <p className="mt-1">
                Select up to <strong>2 subjects per curriculum category</strong>.
                Enter a separate <strong>USD hourly rate</strong> for each subject.
                Profile photo should be below <strong>5MB</strong>. CV and
                certificates should each be below <strong>10MB</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <input
                  name="full_name"
                  placeholder="Full name"
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone number"
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                />

                <input
                  name="city"
                  placeholder="City"
                  className="rounded-xl border border-slate-300 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Proposed public bio (max 150 characters)
                </label>
                <input
                  name="proposed_public_bio"
                  maxLength={150}
                  placeholder="Short public bio"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  required
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-semibold">
                  Subjects & Hourly Rates
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Select up to 2 subjects in each curriculum category. Each
                  selected subject must have its own USD hourly rate.
                </p>

                <div className="mt-6 space-y-6">
                  {SUBJECT_CATEGORIES.map((category) => (
                    <div
                      key={category.label}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold">
                          {category.label}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {selectedCountForCategory(category.label)}/2 selected
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {category.subjects.map((subject) => {
                          const selected = isSelected(category.label, subject);
                          const selectedItem = subjectRates.find(
                            (item) =>
                              item.curriculum_level === category.label &&
                              item.subject === subject
                          );

                          return (
                            <div
                              key={`${category.label}-${subject}`}
                              className={`rounded-xl border p-4 ${
                                selected
                                  ? "border-slate-900 bg-slate-50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <label className="flex items-start gap-3 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() =>
                                    toggleSubject(category.label, subject)
                                  }
                                  className="mt-1"
                                />
                                <span className="font-medium">{subject}</span>
                              </label>

                              {selected ? (
                                <div className="mt-3">
                                  <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Hourly rate for this subject (USD)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={selectedItem?.hourly_rate || ""}
                                    onChange={(e) =>
                                      updateSubjectRate(
                                        category.label,
                                        subject,
                                        Number(e.target.value)
                                      )
                                    }
                                    placeholder="Example: 25"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Profile Picture
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    JPG or PNG only. Maximum file size: 5MB.
                  </p>
                  <input
                    name="profile_photo"
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">CV</label>
                  <p className="mb-2 text-xs text-slate-500">
                    PDF, DOC, or DOCX only. Maximum file size: 10MB.
                  </p>
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
                    University Degree / Diploma Certificate
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    PDF, JPG, or PNG only. Maximum file size: 10MB.
                  </p>
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
                    High School Certificate
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    PDF, JPG, or PNG only. Maximum file size: 10MB.
                  </p>
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
                    <input
                      name="referee_1_name"
                      placeholder="Name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      required
                    />
                    <input
                      name="referee_1_email"
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      required
                    />
                    <input
                      name="referee_1_phone"
                      placeholder="Phone"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h2 className="font-semibold">Professional Referee 2</h2>
                  <div className="mt-4 space-y-3">
                    <input
                      name="referee_2_name"
                      placeholder="Name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      required
                    />
                    <input
                      name="referee_2_email"
                      type="email"
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      required
                    />
                    <input
                      name="referee_2_phone"
                      placeholder="Phone"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 p-5">
                <label className="flex items-center gap-3 text-sm">
                  <input name="declaration_no_criminal_past" type="checkbox" />I
                  declare that I have no criminal past.
                </label>

                <label className="flex items-center gap-3 text-sm">
                  <input name="declaration_internet_15mbps" type="checkbox" />I
                  declare that I have at least 15 mbps internet connection.
                </label>

                <label className="flex items-center gap-3 text-sm">
                  <input name="declaration_has_i5_laptop" type="checkbox" />I
                  declare that I have at least an i5 laptop.
                </label>

                <label className="flex items-center gap-3 text-sm">
                  <input name="declaration_information_true" type="checkbox" />I
                  commit that all submitted information is correct and true.
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
          </>
        )}
      </section>
    </main>
  );
}