import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminBookingsPage() {
  const supabase = createAdminSupabaseClient();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-10">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-red-600">
            Failed to load bookings
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
          Bookings
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          View and manage all scheduled lessons across the platform.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="min-w-full text-left">
          <thead className="bg-[#F7F5F2]">
            <tr>
              <th className="p-4">Parent</th>
              <th className="p-4">Student</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Mode</th>
              <th className="p-4">Scheduled At</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {!bookings || bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-slate-500">
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <a
                      href={`/admin/bookings/${booking.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {booking.parent_name}
                    </a>
                    <div className="text-sm text-slate-600">
                      {booking.parent_email}
                    </div>
                  </td>

                  <td className="p-4">{booking.student_name}</td>
                  <td className="p-4">{booking.subject}</td>
                  <td className="p-4 capitalize">{booking.lesson_mode || "-"}</td>
                  <td className="p-4">
                    {booking.scheduled_at
                      ? new Date(booking.scheduled_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-4 capitalize">{booking.status}</td>
                  <td className="p-4">
                    {booking.created_at
                      ? new Date(booking.created_at).toLocaleString()
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