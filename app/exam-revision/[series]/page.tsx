import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { examSeries, getExamSeries } from "@/lib/exam-series";

type PageProps = {
  params: Promise<{
    series: string;
  }>;
};

export function generateStaticParams() {
  return examSeries.map((series) => ({
    series: series.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { series: seriesSlug } = await params;
  const series = getExamSeries(seriesSlug);

  if (!series) {
    return {
      title: "Exam Revision | The Alkebula School",
      description:
        "Exam revision support for Cambridge, Edexcel, IB and international curriculum learners.",
    };
  }

  return {
    title: `${series.title} | The Alkebula School`,
    description: series.description,
  };
}

function urgencyClass(urgency: string) {
  if (urgency === "Immediate") {
    return "bg-[#FFF5F7] text-[#8F1F36] ring-[#8F1F36]/15";
  }

  if (urgency === "Next") {
    return "bg-[#F7FCFF] text-[#156B96] ring-[#379CD6]/20";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default async function ExamSeriesRevisionPage({ params }: PageProps) {
  const { series: seriesSlug } = await params;
  const series = getExamSeries(seriesSlug);

  if (!series) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#071A2F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,31,54,0.56),transparent_30%),radial-gradient(circle_at_top_right,rgba(55,156,214,0.42),transparent_34%),linear-gradient(135deg,#071A2F,#0F2744_50%,#071A2F)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Link
                href="/exam-revision"
                className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#BFEAFF] backdrop-blur transition hover:bg-white/15"
              >
                Exam Revision Series
              </Link>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[3.15rem]">
                {series.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
                {series.heroLine}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/get-matched"
                  className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#6F1729]"
                >
                  Get Matched With a Tutor
                </Link>

                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-6 py-3 text-sm font-bold text-[#071A2F] shadow-sm transition hover:bg-[#EEF9FF]"
                >
                  Request Revision Support
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BFEAFF]">
                    Board
                  </p>
                  <p className="mt-2 text-lg font-bold">{series.board}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BFEAFF]">
                    Exam series
                  </p>
                  <p className="mt-2 text-lg font-bold">{series.session}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 sm:col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BFEAFF]">
                    Best for
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-100">
                    {series.ctaNote}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${urgencyClass(
                    series.urgency
                  )}`}
                >
                  {series.urgency} priority
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/15">
                  Online revision
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/15">
                  Tutor-led support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FCFF] py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#379CD6]">
              Who This Helps
            </p>

            <ul className="mt-5 space-y-3">
              {series.audience.map((item) => (
                <li key={item} className="text-sm leading-7 text-slate-700">
                  <span className="font-bold text-[#8F1F36]">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#379CD6]">
              Popular Subjects
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {series.subjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#379CD6]">
              Revision Focus
            </p>

            <ul className="mt-5 space-y-3">
              {series.revisionFocus.map((item) => (
                <li key={item} className="text-sm leading-7 text-slate-700">
                  <span className="font-bold text-[#8F1F36]">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
              Revision Plan
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A structured pathway to exam readiness.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Every learner begins with a quick academic diagnosis. The tutor
              then focuses on the highest-value topics, paper technique, timing,
              and confidence before the exam series.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {series.weeklyPlan.map((item, index) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-[#F7FCFF] p-6 shadow-sm"
              >
                <p className="text-sm font-black text-[#8F1F36]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="enquiry"
        className="bg-[#071A2F] px-6 py-12 text-white lg:py-16"
      >
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#BFEAFF]">
              Share This Page
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Need revision support for {series.shortTitle}?
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              Send this page to a student, parent or school, then use the tutor
              matching form to request focused online revision support.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/get-matched"
              className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
            >
              Get Matched With a Tutor
            </Link>

            <Link
              href="/educators"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-6 py-3 text-sm font-bold text-[#071A2F] shadow-sm transition hover:bg-[#EEF9FF]"
            >
              Browse Approved Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}