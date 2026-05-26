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
    description: "New or under-review applications awaiting admin screening.",
    statuses: ["submitted", "under_review"],
    badgeClass: "bg-amber-100 text-amber-800",
  },
  {
    key: "shortlisted",
    title: "Shortlisted for Interview",
    description: "Applicants shortlisted or already scheduled for interview.",
    statuses: ["shortlisted", "interview_scheduled"],
    badgeClass: "bg-blue-100 text-blue-800",
  },
  {
    key: "approved",
    title: "Approved",
    description: "Educators approved for The Alkebula School platform.",
    statuses: ["approved"],
    badgeClass: "bg-green-100 text-green-800",
  },
  {
    key: "rejected",
    title: "Rejected",
    description: "Applications not accepted at this stage.",
    statuses: ["rejected"],
    badgeClass: "bg-red-100 text-red-800",
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
  if (value === "under_review") return "Under Review";
  if (value === "shortlisted") return "Shortlisted";
  if (value === "interview_scheduled") return "Interview Scheduled";
  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";

  return "Submitted";
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function groupForStatus(status?: string | null) {
  const value = normalizeStatus(status);

  const group = STATUS_GROUPS.find((item) =>
    item.statuses.includes(value)
  );

  return group || STATUS_GROUPS[0];
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
        (app) => groupForStatus(app.status).key === group.key
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
              Review tutor applicants by stage: pending review, shortlisted for
              interview, approved, and rejected.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Admin Dashboard
          </Link>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          {groupedApplications.map((group) => (
            <a
              key={group.key}
              href={`#${group.key}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100"
            >
              <p className="text-sm text-slate-500">{group.title}</p>
              <p className="mt-2 text-3xl font-bold">
                {group.applications.length}
              </p>
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {groupedApplications.map((group) => (
            <section
              id={group.key}
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