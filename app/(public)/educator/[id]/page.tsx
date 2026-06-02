import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function EducatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createAdminSupabaseClient();

  const { data: educator, error } = await supabase
    .from("educators")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .eq("is_verified", true)
    .single();

  if (error || !educator) {
    return (
      <main className="min-h-screen bg-white p-6 text-slate-900 md:p-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-red-700">
            Educator not found
          </h1>

          <p className="mt-3 text-red-700">
            This educator profile is unavailable or no longer active.
          </p>

          <a
            href="/educators"
            className="mt-6 inline-block rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
          >
            Back to Educators
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <a
            href="/educators"
            className="mb-6 inline-block text-sm font-semibold text-[#8F1F36] hover:underline"
          >
            ← Back to Educators
          </a>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#379CD6]">
                  Verified Educator
                </p>

                <h1 className="mt-3 text-4xl font-bold text-slate-950">
                  {educator.display_name}
                </h1>

                <p className="mt-4 max-w-2xl leading-8 text-slate-600">
                  {educator.bio || "No educator biography available yet."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                  Verified
                </span>

                <span className="rounded-full border border-[#379CD6]/20 bg-[#F7FCFF] px-3 py-1 text-sm font-semibold text-[#156B96]">
                  Active
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <strong className="text-slate-950">Primary Subject:</strong>
                <p className="mt-2 text-slate-700">
                  {educator.primary_subject || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <strong className="text-slate-950">
                  Curriculum Expertise:
                </strong>
                <p className="mt-2 text-slate-700">
                  {educator.curriculum_expertise || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <strong className="text-slate-950">Location:</strong>
                <p className="mt-2 text-slate-700">
                  {educator.location || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <strong className="text-slate-950">Teaching Mode:</strong>
                <p className="mt-2 text-slate-700">
                  {educator.teaching_mode || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <strong className="text-slate-950">Rate per Hour:</strong>
                <p className="mt-2 text-slate-700">
                  {educator.hourly_rate ? `KES ${educator.hourly_rate}` : "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <strong className="text-slate-950">
                  Years of Experience:
                </strong>
                <p className="mt-2 text-slate-700">
                  {educator.years_experience ?? "—"}{" "}
                  {educator.years_experience ? "years" : ""}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Why parents may choose this educator
              </h2>

              <ul className="mt-4 space-y-3 text-slate-700">
                <li>
                  • Verified through our application, document review, and
                  interview process
                </li>
                <li>• Approved for active listing on The Alkebula School</li>
                <li>
                  • Available for structured learning support within the listed
                  curriculum area
                </li>
                <li>• Professionally reviewed before publication</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`/enquire/${educator.id}`}
                className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6F1729]"
              >
                Enquire About This Educator
              </a>

              <a
                href="/educators"
                className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-5 py-3 text-sm font-semibold text-[#156B96] transition hover:bg-[#EEF9FF]"
              >
                Browse More Educators
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}