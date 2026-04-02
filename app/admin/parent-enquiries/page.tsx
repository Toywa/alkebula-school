import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminParentEnquiriesPage() {
  const supabase = createAdminSupabaseClient();

  const { data: enquiries, error } = await supabase
    .from("parent_enquiries")
    .select(`
      *,
      educators (
        id,
        display_name,
        primary_subject,
        location
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-10">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-red-600">
            Failed to load parent enquiries
          </h1>
          <p className="mt-3 text-slate-600">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
          Parent Enquiries
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Review incoming parent interest and match leads to approved educators.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-full text-left">
          <thead className="bg-[#F7F5F2]">
            <tr>
              <th className="p-4">Parent</th>
              <th className="p-4">Student</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Preferred Mode</th>
              <th className="p-4">Educator</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {!enquiries || enquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-slate-500">
                  No parent enquiries yet.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <a
                      href={`/admin/parent-enquiries/${enquiry.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {enquiry.parent_name}
                    </a>
                    <div className="text-sm text-slate-600">
                      {enquiry.parent_email}
                    </div>
                    <div className="text-sm text-slate-600">
                      {enquiry.parent_phone || "-"}
                    </div>
                  </td>

                  <td className="p-4">{enquiry.student_name}</td>
                  <td className="p-4">{enquiry.subject}</td>
                  <td className="p-4 capitalize">
                    {enquiry.preferred_mode || "-"}
                  </td>

                  <td className="p-4">
                    {enquiry.educators ? (
                      <div>
                        <div className="font-medium">
                          {enquiry.educators.display_name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {enquiry.educators.primary_subject || "-"}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-4 capitalize">{enquiry.status}</td>

                  <td className="p-4">
                    {enquiry.created_at
                      ? new Date(enquiry.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}