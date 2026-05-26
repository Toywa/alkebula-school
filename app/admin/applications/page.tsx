import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type EducatorApplication = {
  id: string;
  full_name: string | null;
  email: string | null;
  primary_subject: string | null;
  location: string | null;
  status: string | null;
  submitted_at: string | null;
};

const STATUS_GROUPS = [
  {
    key: "pending_review",
    title: "Pending Review",
    description: "New applications waiting for admin screening.",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  {
    key: "shortlisted",
    title: "Shortlisted for Interview",
    description: "Applicants selected for interview or further vetting.",
    badgeClass: "bg-blue-100 text-blue-800",
  },
  {
    key: "approved",
    title: "Approved",
    description: "Educators approved for the platform.",
    badgeClass: "bg-green-100 text-green-800",
  },
  {
    key: "rejected",
    title: "Rejected",
    description: "Applications not accepted.",
    badgeClass: "bg-red-100 text-red-800",
  },
];

function normalizeStatus(status?: string | null) {
  const value = String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  if (
    value === "pending" ||
    value === "pending_review" ||
    value === "under_review" ||
    value === ""
  ) {
    return "pending_review";
  }

  if (
    value === "shortlisted" ||
    value === "shortlisted_for_interview" ||
    value === "interview" ||
    value === "interview_stage"
  ) {
    return "shortlisted";
  }

  if (value === "approved" || value === "accepted") {
    return "approved";
  }

  if (value === "rejected" || value === "declined") {
    return "rejected";
  }

  return "pending_review";
}

function displayStatus(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (normalized === "pending_review") return "Pending Review";
  if (normalized === "shortlisted") return "Shortlisted";
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";

  return "Pending Review";
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function ApplicationTable({
  applications,
  badgeClass,
}: {
  applications: EducatorApplication[];
  badgeClass: string;
}) {
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
        No applications in this category.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Subject</th>
            <th className="p-3">Location</th>
            <th className="p-3">Status</th>
            <th className="p-3">Submitted</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-t hover:bg-slate-50">
              <td className="p-3 font-semibold">
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="text-blue-700 hover:underline"
                >
                  {app.full_name || "Unnamed applicant"}
                </Link>
              </td>

              <td className="p-3">{app.email || "-"}</td>
              <td className="p-3">{app.primary_subject || "-"}</td>
              <td className="p-3">{app.location || "-"}</td>

              <td className="p-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                >
                  {displayStatus(app.status)}
                </span>
              </td>

              <td className="p-3">{formatDate(app.submitted_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminApplicationsPage() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("educator_applications")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      return (
        <div className="p-10 text-red-600">
          Supabase error: {error.message}
        </div>
      );
    }

    const applications = (data || []) as EducatorApplication[];

    const groupedApplications = STATUS_GROUPS.map((group) => ({
      ...group,
      applications: applications.filter(
        (app) => normalizeStatus(app.status) === group.key
      ),
    }));

    return (
      <main className="min-h-screen bg-white p-6 text-slate-900 lg:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              The Alkebula School
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Educator Applications
            </h1>

            <p className="mt-3 max-w-3xl text-slate-600">
              Review tutor applicants by application stage for easier screening,
              interviews, approvals, and rejections.
            </p>
          </div>

          <Link
            href="/admin/resolutions"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Admin Dashboard
          </Link>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {groupedApplications.map((group) => (
            <div
              key={group.key}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm text-slate-500">{group.title}</p>
              <p className="mt-2 text-3xl font-bold">
                {group.applications.length}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          {groupedApplications.map((group) => (
            <section
              key={group.key}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">{group.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {group.description}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${group.badgeClass}`}
                >
                  {group.applications.length} applicant
                  {group.applications.length === 1 ? "" : "s"}
                </span>
              </div>

              <ApplicationTable
                applications={group.applications}
                badgeClass={group.badgeClass}
              />
            </section>
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