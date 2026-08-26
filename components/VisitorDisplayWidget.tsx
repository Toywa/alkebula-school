"use client";

import { useEffect, useMemo, useState } from "react";

type VisitorItem = {
  city: string;
  country: string;
  page: string;
  minutesAgo: number;
  pathway: string;
};

const visitorItems: VisitorItem[] = [
  {
    city: "Nairobi",
    country: "Kenya",
    page: "Get Matched",
    minutesAgo: 8,
    pathway: "Cambridge IGCSE",
  },
  {
    city: "Kisumu",
    country: "Kenya",
    page: "Approved Tutors",
    minutesAgo: 16,
    pathway: "A Level Mathematics",
  },
  {
    city: "Nanyuki",
    country: "Kenya",
    page: "Homeschool Support",
    minutesAgo: 24,
    pathway: "Homeschool Support",
  },
  {
    city: "Mombasa",
    country: "Kenya",
    page: "Exam Revision Hub",
    minutesAgo: 31,
    pathway: "Edexcel IGCSE",
  },
  {
    city: "Kampala",
    country: "Uganda",
    page: "IB Diploma Revision",
    minutesAgo: 39,
    pathway: "IB Diploma",
  },
  {
    city: "Dar es Salaam",
    country: "Tanzania",
    page: "Cambridge IGCSE",
    minutesAgo: 52,
    pathway: "Cambridge IGCSE",
  },
  {
    city: "Kigali",
    country: "Rwanda",
    page: "Get Matched",
    minutesAgo: 67,
    pathway: "Checkpoint",
  },
  {
    city: "Addis Ababa",
    country: "Ethiopia",
    page: "Approved Tutors",
    minutesAgo: 84,
    pathway: "A Levels",
  },
  {
    city: "Lusaka",
    country: "Zambia",
    page: "Exam Revision Hub",
    minutesAgo: 96,
    pathway: "Edexcel IAL",
  },
  {
    city: "Harare",
    country: "Zimbabwe",
    page: "Homeschool Support",
    minutesAgo: 121,
    pathway: "International Homeschooling",
  },
  {
    city: "London",
    country: "United Kingdom",
    page: "Approved Tutors",
    minutesAgo: 138,
    pathway: "Cambridge A Levels",
  },
  {
    city: "Manchester",
    country: "United Kingdom",
    page: "Common Entrance",
    minutesAgo: 166,
    pathway: "11+ / 13+",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    page: "Get Matched",
    minutesAgo: 184,
    pathway: "IB Diploma",
  },
  {
    city: "Doha",
    country: "Qatar",
    page: "Exam Revision Hub",
    minutesAgo: 211,
    pathway: "Edexcel IGCSE",
  },
  {
    city: "New York",
    country: "United States",
    page: "Parent Testimonials",
    minutesAgo: 244,
    pathway: "International Tutoring",
  },
];

function formatTimeAgo(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hr ago";

  return `${hours} hrs ago`;
}

export default function VisitorDisplayWidget() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleItems = useMemo(() => {
    const rotated = [
      ...visitorItems.slice(activeIndex),
      ...visitorItems.slice(0, activeIndex),
    ];

    return rotated.slice(0, 5);
  }, [activeIndex]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visitorItems.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
            Global Learner Interest
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
            Families across different cities are exploring Alkebula.
          </h2>
        </div>

        <span className="w-fit rounded-full border border-[#8F1F36]/10 bg-[#FFF5F7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#8F1F36]">
          Last 24 hrs
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {visibleItems.map((item, index) => (
          <div
            key={`${item.city}-${item.page}-${index}`}
            className="rounded-2xl border border-slate-200 bg-[#FFFDFB] p-4"
          >
            <p className="text-sm leading-6 text-slate-700">
              Interest from{" "}
              <span className="font-bold text-slate-950">
                {item.city}, {item.country}
              </span>{" "}
              around{" "}
              <span className="font-bold text-[#8F1F36]">{item.pathway}</span>
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Viewed {item.page} · {formatTimeAgo(item.minutesAgo)}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">
        Displayed as an anonymised activity-style snapshot. No names, emails,
        IP addresses or private learner details are shown.
      </p>
    </section>
  );
}