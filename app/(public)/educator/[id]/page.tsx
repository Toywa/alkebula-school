import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function EducatorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminSupabaseClient();

  const { data: educator, error } = await supabase
    .from("educators")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .eq("is_verified", true)
    .single();

  if (error || !educator) {
    return (
      <main className="min-h-screen bg-[#F7F5F2] p-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-red-600">Educator not found</h1>
          <p className="mt-3 text-slate-600">
            This educator profile is unavailable or no longer active.
          </p>
          <a
            href="/educators"
            className="mt-6 inline-block rounded-xl bg-[#1F3D2B] px-5 py-3 text-white"
          >
            Back to Educators
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <a
          href="/educators"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← Back to Educators
        </a>

        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#C6A75E]">
                Verified Educator
              </p>
              <h1 className="mt-3 text-4xl font-bold text-[#1A1A1A]">
                {educator.display_name}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                {educator.bio || "No educator biography available yet."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                Verified
              </span>
              <span className="rounded-full bg-[#F7F5F2] px-3 py-1 text-sm text-slate-700">
                Active
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <strong>Primary Subject:</strong>
              <p className="mt-2 text-slate-700">{educator.primary_subject || "-"}</p>
            </div>

            <div className="rounded-xl border p-4">
              <strong>Curriculum Expertise:</strong>
              <p className="mt-2 text-slate-700">{educator.curriculum_expertise || "-"}</p>
            </div>

            <div className="rounded-xl border p-4">
              <strong>Location:</strong>
              <p className="mt-2 text-slate-700">{educator.location || "-"}</p>
            </div>

            <div className="rounded-xl border p-4">
              <strong>Teaching Mode:</strong>
              <p className="mt-2 text-slate-700">{educator.teaching_mode || "-"}</p>
            </div>

            <div className="rounded-xl border p-4">
              <strong>Rate per Hour:</strong>
              <p className="mt-2 text-slate-700">
                {educator.hourly_rate ? `KES ${educator.hourly_rate}` : "-"}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <strong>Years of Experience:</strong>
              <p className="mt-2 text-slate-700">
                {educator.years_experience ?? "-"} years
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#F7F5F2] p-6">
            <h2 className="text-2xl font-semibold text-[#1A1A1A]">
              Why parents may choose this educator
            </h2>

            <ul className="mt-4 space-y-3 text-slate-700">
              <li>• Verified through our application, document review, and interview process</li>
              <li>• Approved for active listing on The Alkebula School</li>
              <li>• Available for structured learning support within the listed curriculum area</li>
              <li>• Professionally reviewed before publication</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`/enquire/${educator.id}`}
              className="rounded-xl bg-[#1F3D2B] px-5 py-3 font-medium text-white"
            >
              Enquire About This Educator
            </a>

            <a
              href="/educators"
              className="rounded-xl border border-[#1F3D2B] px-5 py-3 font-medium text-[#1F3D2B]"
            >
              Browse More Educators
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}