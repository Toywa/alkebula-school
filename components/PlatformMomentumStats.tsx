"use client";

import { useEffect, useState } from "react";

type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  note: string;
};

const BASE_PLATFORM_VISITS = 100456;

const staticStats: StatItem[] = [
  {
    label: "Approved Tutors",
    value: 35,
    suffix: "+",
    note: "Verified educators",
  },
  {
    label: "Parent Enquiries",
    value: 1720,
    suffix: "+",
    note: "Families seeking support",
  },
  {
    label: "Lessons Taught",
    value: 700,
    suffix: "+",
    note: "Online learning sessions",
  },
  {
    label: "Students Taught",
    value: 120,
    suffix: "+",
    note: "Learners supported",
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function PlatformMomentumStats() {
  const [platformVisits, setPlatformVisits] = useState(BASE_PLATFORM_VISITS);

  useEffect(() => {
    let cancelled = false;

    async function loadPlatformVisits() {
      try {
        const response = await fetch("/api/platform-visits", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!cancelled && response.ok && typeof data.total === "number") {
          setPlatformVisits(data.total);
        }
      } catch {
        if (!cancelled) {
          setPlatformVisits(BASE_PLATFORM_VISITS);
        }
      }
    }

    loadPlatformVisits();

    const timer = window.setInterval(loadPlatformVisits, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const stats: StatItem[] = [
    ...staticStats,
    {
      label: "Platform Visits",
      value: platformVisits,
      suffix: "+",
      note: "Real site visit counter",
    },
  ];

  return (
    <section
      aria-label="Alkebula platform momentum"
      className="border-y border-[#379CD6]/20 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#379CD6]">
            Platform Momentum
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Trusted support for global learners.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            Alkebula connects families with approved online tutors for
            Cambridge, Edexcel, A Level, IB and homeschool support.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-[#F7FCFF] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-3xl font-extrabold tracking-tight text-[#8F1F36]">
                {formatNumber(item.value)}
                {item.suffix || ""}
              </p>

              <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-900">
                {item.label}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-500">
          Figures are presented as platform momentum indicators. Platform visits
          are pulled from the live visit counter; other figures are
          admin-controlled and should be updated as June lessons are completed.
        </p>
      </div>
    </section>
  );
}
