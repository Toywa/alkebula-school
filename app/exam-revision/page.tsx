import type { Metadata } from "next";
import Link from "next/link";
import { examSeries } from "@/lib/exam-series";

export const metadata: Metadata = {
  title: "Exam Revision Series | The Alkebula School",
  description:
    "Shareable revision pages for Cambridge, Edexcel, IB, Checkpoint and international exam series.",
};

function urgencyClass(urgency: string) {
  if (urgency === "Immediate") {
    return "bg-[#FFF5F7] text-[#8F1F36] ring-[#8F1F36]/15";
  }

  if (urgency === "Next") {
    return "bg-[#F7FCFF] text-[#156B96] ring-[#379CD6]/20";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function ExamRevisionHubPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#071A2F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,31,54,0.56),transparent_30%),radial-gradient(circle_at_top_right,rgba(55,156,214,0.42),transparent_34%),linear-gradient(135deg,#071A2F,#0F2744_50%,#071A2F)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#BFEAFF] backdrop-blur">
            Exam Revision Series
          </p>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[3.15rem]">
            Shareable revision pages for upcoming international exam series.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Use these pages for students, parents, schools and homeschool
            families preparing for October/November 2026, January 2027 and
            May/June 2027 examination windows.
          </p>
        </div>
      </section>

      <section className="bg-[#F7FCFF] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {examSeries.map((series) => (
              <Link
                key={series.slug}
                href={`/exam-revision/${series.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#379CD6]/40 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-950">
                    {series.shortTitle}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${urgencyClass(
                      series.urgency
                    )}`}
                  >
                    {series.urgency}
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#156B96]">
                  {series.board} · {series.session}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {series.description}
                </p>

                <p className="mt-5 text-sm font-bold text-[#8F1F36]">
                  Open revision page →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}