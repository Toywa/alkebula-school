import { createAdminSupabaseClient } from "@/lib/supabase/admin";

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

    return (
      <main className="p-10">
        <h1 className="mb-6 text-3xl font-bold">Educator Applications</h1>

        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
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
              {data && data.length > 0 ? (
                data.map((app) => (
                  <tr key={app.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <a
                        href={`/admin/applications/${app.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {app.full_name}
                      </a>
                    </td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.primary_subject}</td>
                    <td className="p-3">{app.location}</td>
                    <td className="p-3 capitalize">{app.status}</td>
                    <td className="p-3">
                      {app.submitted_at
                        ? new Date(app.submitted_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={6}>
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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