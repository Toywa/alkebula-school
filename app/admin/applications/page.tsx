import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type SubjectRate = {
  curriculum_level?: string | null;
  class_level?: string | null;
  student_level?: string | null;
  level?: string | null;
  subject?: string | null;
  hourly_rate?: number | null;
};

type EducatorApplication = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  city?: string | null;
  location?: string | null;

  qualification?: string | null;
  years_of_experience?: number | null;

  primary_subject?: string | null;
  hourly_rate?: number | null;
  proposed_public_bio?: string | null;

  subjects?: string[] | null;
  curricula?: string[] | null;
  subject_rates?: SubjectRate[] | null;

  status: string | null;
  submitted_at?: string | null;
  created_at?: string | null;

  referee_1_name?: string | null;
  referee_1_email?: string | null;
  referee_1_phone?: string | null;
  referee_2_name?: string | null;
  referee_2_email?: string | null;
  referee_2_phone?: string | null;

  profile_photo_url?: string | null;
  cv_url?: string | null;
  degree_certificate_url?: string | null;
  high_school_certificate_url?: string | null;

  declaration_no_criminal_past?: boolean | null;
  declaration_internet_15mbps?: boolean | null;
  declaration_has_i5_laptop?: boolean | null;
  declaration_information_true?: boolean | null;

  signed_profile_photo_url?: string | null;
  signed_cv_url?: string | null;
  signed_degree_certificate_url?: string | null;
  signed_high_school_certificate_url?: string | null;
};

const STATUS_GROUPS = [
  {
    key: "pending_review",
    title: "Pending Review",
    description: "New or under-review applications awaiting admin screening.",
    statuses: ["submitted", "pending", "pending_review", "under_review"],
    badgeClass: "bg-[#FFF5F7] text-[#8F1F36] border border-[#8F1F36]/20",
  },
  {
    key: "shortlisted",
    title: "Shortlisted for Interview",
    description: "Applicants shortlisted or already scheduled for interview.",
    statuses: ["shortlisted", "interview_scheduled"],
    badgeClass: "bg-[#F7FCFF] text-[#156B96] border border-[#379CD6]/20",
  },
  {
    key: "approved",
    title: "Approved",
    description: "Educators approved for The Alkebula School platform.",
    statuses: ["approved"],
    badgeClass: "bg-green-50 text-green-700 border border-green-200",
  },
  {
    key: "rejected",
    title: "Rejected",
    description: "Applications not accepted at this stage.",
    statuses: ["rejected"],
    badgeClass: "bg-red-50 text-red-700 border border-red-200",
  },
];

function normalizeStatus(status?: string | null) {
  return String(status || "submitted")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

function displayStatus(status?: string | null) {
  const value = normalizeStatus(status);

  if (value === "submitted") return "Submitted";
  if (value === "pending") return "Pending";
  if (value === "pending_review") return "Pending Review";
  if (value === "under_review") return "Under Review";
  if (value === "shortlisted") return "Shortlisted";
  if (value === "interview_scheduled") return "Interview Scheduled";
  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";

  return status || "Submitted";
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function groupForStatus(status?: string | null) {
  const value = normalizeStatus(status);

  const group = STATUS_GROUPS.find((item) => item.statuses.includes(value));

  return group || STATUS_GROUPS[0];
}

function getRateLevel(item: SubjectRate) {
  return (
    item.class_level ||
    item.student_level ||
    item.level ||
    "Level not specified"
  );
}

function yesNo(value?: boolean | null) {
  return value ? "Yes" : "No";
}

function cleanStoragePath(bucket: string, path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  let cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith(`${bucket}/`)) {
    cleanPath = cleanPath.replace(`${bucket}/`, "");
  }

  return cleanPath;
}

async function createSignedUrl(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  bucket: string,
  path?: string | null
) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const cleanPath = cleanStoragePath(bucket, path);

  if (!cleanPath) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(cleanPath, 60 * 60);

  if (error) {
    console.error(`Signed URL error for ${bucket}/${cleanPath}:`, error.message);
    return null;
  }

  return data.signedUrl;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <p className="text-sm text-slate-600">
      <span className="font-semibold text-slate-950">{label}:</span>{" "}
      {value || "—"}
    </p>
  );
}

function DocumentLink({
  href,
  label,
}: {
  href?: string | null;
  label: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
    >
      {label}
    </a>
  );
}

function ApplicationCard({
  app,
  badgeClass,
}: {
  app: EducatorApplication;
  badgeClass: string;
}) {
  const submittedDate = app.submitted_at || app.created_at;
  const location = app.city || app.location || "—";
  const subjects = Array.isArray(app.subjects) ? app.subjects : [];
  const curricula = Array.isArray(app.curricula) ? app.curricula : [];
  const subjectRates = Array.isArray(app.subject_rates) ? app.subject_rates : [];

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex flex-wrap gap-5">
          {app.signed_profile_photo_url ? (
            <img
              src={app.signed_profile_photo_url}
              alt={app.full_name || "Tutor applicant"}
              className="h-32 w-32 rounded-2xl object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-500">
              No photo
            </div>
          )}

          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              {app.full_name || "Unnamed applicant"}
            </h3>

            <div className="mt-2 space-y-1">
              <DetailRow label="Email" value={app.email} />
              <DetailRow label="Phone" value={app.phone} />
              <DetailRow label="Location" value={location} />
              <DetailRow label="Qualification" value={app.qualification} />
              <DetailRow
                label="Experience"
                value={
                  app.years_of_experience
                    ? `${app.years_of_experience} years`
                    : null
                }
              />
              <DetailRow
                label="Base / lowest rate"
                value={app.hourly_rate ? `USD ${app.hourly_rate}/hour` : null}
              />
              <DetailRow label="Submitted" value={formatDate(submittedDate)} />
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${badgeClass}`}
        >
          {displayStatus(app.status)}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-bold text-slate-950">Public Bio</p>
          <p className="mt-2 leading-7 text-slate-600">
            {app.proposed_public_bio || "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-bold text-slate-950">Subjects</p>
          <p className="mt-2 leading-7 text-slate-600">
            {subjects.length ? subjects.join(", ") : app.primary_subject || "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm md:col-span-2">
          <p className="font-bold text-slate-950">Curricula</p>
          <p className="mt-2 leading-7 text-slate-600">
            {curricula.length ? curricula.join(", ") : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F7FCFF] p-5">
        <h4 className="text-lg font-bold text-slate-950">
          Subject Rates & Levels
        </h4>

        {subjectRates.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="hidden grid-cols-4 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#156B96] md:grid">
              <span>Curriculum</span>
              <span>Class / Level</span>
              <span>Subject</span>
              <span>Rate</span>
            </div>

            <div className="divide-y divide-slate-200">
              {subjectRates.map((item, index) => (
                <div
                  key={`${item.curriculum_level}-${item.subject}-${index}`}
                  className="grid gap-3 px-4 py-4 text-sm md:grid-cols-4"
                >
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                      Curriculum
                    </span>
                    {item.curriculum_level || "—"}
                  </span>

                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                      Class / Level
                    </span>
                    {getRateLevel(item)}
                  </span>

                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                      Subject
                    </span>
                    <strong>{item.subject || "—"}</strong>
                  </span>

                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:hidden">
                      Rate
                    </span>
                    <strong className="text-[#8F1F36]">
                      USD {item.hourly_rate || 0}/hour
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            No detailed subject rates saved.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-lg font-bold text-slate-950">
          Uploaded Documents
        </h4>

        <div className="mt-4 flex flex-wrap gap-3">
          <DocumentLink
            href={app.signed_profile_photo_url}
            label="View Profile Photo"
          />
          <DocumentLink href={app.signed_cv_url} label="View CV" />
          <DocumentLink
            href={app.signed_degree_certificate_url}
            label="View University Certificate"
          />
          <DocumentLink
            href={app.signed_high_school_certificate_url}
            label="View High School Certificate"
          />
        </div>

        {!app.signed_profile_photo_url &&
        !app.signed_cv_url &&
        !app.signed_degree_certificate_url &&
        !app.signed_high_school_certificate_url ? (
          <p className="mt-3 text-sm text-red-600">
            No accessible document links found for this application.
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-bold text-slate-950">Referee 1</p>
          <p className="mt-2">Name: {app.referee_1_name || "—"}</p>
          <p>Email: {app.referee_1_email || "—"}</p>
          <p>Phone: {app.referee_1_phone || "—"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-bold text-slate-950">Referee 2</p>
          <p className="mt-2">Name: {app.referee_2_name || "—"}</p>
          <p>Email: {app.referee_2_email || "—"}</p>
          <p>Phone: {app.referee_2_phone || "—"}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-lg font-bold text-slate-950">Declarations</h4>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <p>No criminal past: {yesNo(app.declaration_no_criminal_past)}</p>
          <p>15 Mbps internet: {yesNo(app.declaration_internet_15mbps)}</p>
          <p>Has i5 laptop: {yesNo(app.declaration_has_i5_laptop)}</p>
          <p>Information true: {yesNo(app.declaration_information_true)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/tutor-applications"
          className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
        >
          Open Full Review Page
        </Link>

        <Link
          href="/admin"
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Admin Dashboard
        </Link>
      </div>
    </article>
  );
}

function ApplicationGroup({
  group,
}: {
  group: (typeof STATUS_GROUPS)[number] & {
    applications: EducatorApplication[];
  };
}) {
  return (
    <section
      id={group.key}
      className="rounded-[2rem] border border-slate-200 bg-white p-6"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">{group.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{group.description}</p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${group.badgeClass}`}
        >
          {group.applications.length} applicant
          {group.applications.length === 1 ? "" : "s"}
        </span>
      </div>

      {group.applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
          No applications in this category.
        </div>
      ) : (
        <div className="space-y-6">
          {group.applications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              badgeClass={group.badgeClass}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AdminApplicationsPage() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("educator_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return (
        <div className="p-10 text-red-600">
          Supabase error: {error.message}
        </div>
      );
    }

    const applicationsWithSignedUrls: EducatorApplication[] = await Promise.all(
      ((data || []) as EducatorApplication[]).map(async (app) => ({
        ...app,
        subjects: Array.isArray(app.subjects) ? app.subjects : [],
        curricula: Array.isArray(app.curricula) ? app.curricula : [],
        subject_rates: Array.isArray(app.subject_rates)
          ? app.subject_rates
          : [],
        signed_profile_photo_url: await createSignedUrl(
          supabase,
          "educator-profile-images",
          app.profile_photo_url
        ),
        signed_cv_url: await createSignedUrl(
          supabase,
          "educator-documents",
          app.cv_url
        ),
        signed_degree_certificate_url: await createSignedUrl(
          supabase,
          "educator-documents",
          app.degree_certificate_url
        ),
        signed_high_school_certificate_url: await createSignedUrl(
          supabase,
          "educator-documents",
          app.high_school_certificate_url
        ),
      }))
    );

    const groupedApplications = STATUS_GROUPS.map((group) => ({
      ...group,
      applications: applicationsWithSignedUrls.filter(
        (app) => groupForStatus(app.status).key === group.key
      ),
    }));

    return (
      <main className="min-h-screen bg-white p-6 text-slate-900 lg:p-10">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
                The Alkebula School
              </p>

              <h1 className="mt-3 text-4xl font-bold text-slate-950">
                Educator Applications
              </h1>

              <p className="mt-3 max-w-3xl text-slate-600">
                Review tutor applicants by stage while keeping full visibility
                of qualifications, experience, documents, subjects, curricula,
                rates, and references.
              </p>
            </div>

            <Link
              href="/admin"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {groupedApplications.map((group) => (
            <a
              key={group.key}
              href={`#${group.key}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-[#F7FCFF]"
            >
              <p className="text-sm text-slate-500">{group.title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {group.applications.length}
              </p>
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {groupedApplications.map((group) => (
            <ApplicationGroup key={group.key} group={group} />
          ))}
        </div>
      </main>
    );
  } catch (err) {
    return (
      <div className="p-10 text-red-600">
        Page crash: {err instanceof Error ? err.message : "Unknown error"}
      </div>
    );
  }
}