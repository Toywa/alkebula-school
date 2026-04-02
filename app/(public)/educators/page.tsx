import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function EducatorsPage() {
  const supabase = createAdminSupabaseClient();

  const { data: educators, error } = await supabase
    .from("educators")
    .select("*")
    .eq("is_active", true)
    .eq("is_verified", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-10">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-red-600">
            Failed to load educators
          </h1>
          <p className="mt-3 text-slate-600">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
            The Alkebula School
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
            Approved Educators
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Browse verified educators approved through our review, document
            screening, and interview pipeline.
          </p>
        </div>

        {!educators || educators.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow">
            <p className="text-slate-600">No approved educators available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {educators.map((educator) => (
              <div
                key={educator.id}
                className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    Verified
                  </span>
                  <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-sm text-slate-600">
                    Active
                  </span>
                </div>

                <a
                  href={`/educator/${educator.id}`}
                  className="block text-2xl font-semibold text-[#1A1A1A] hover:text-[#1F3D2B]"
                >
                  {educator.display_name}
                </a>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <strong>Subject:</strong> {educator.primary_subject || "-"}
                  </p>
                  <p>
                    <strong>Curriculum:</strong>{" "}
                    {educator.curriculum_expertise || "-"}
                  </p>
                  <p>
                    <strong>Location:</strong> {educator.location || "-"}
                  </p>
                  <p>
                    <strong>Teaching Mode:</strong>{" "}
                    {educator.teaching_mode || "-"}
                  </p>
                  <p>
                    <strong>Rate:</strong>{" "}
                    {educator.hourly_rate ? `KES ${educator.hourly_rate}` : "-"}
                  </p>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {educator.years_experience ?? "-"} years
                  </p>
                </div>

                <div className="mt-5 rounded-xl bg-[#F7F5F2] p-4 text-sm text-slate-700">
                  <strong>Bio:</strong>
                  <p className="mt-2">{educator.bio || "No bio available."}</p>
                </div>

                <div className="mt-5">
                  <a
                    href={`/educator/${educator.id}`}
                    className="inline-block rounded-xl bg-[#1F3D2B] px-4 py-3 text-sm font-medium text-white"
                  >
                    View Full Profile
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}