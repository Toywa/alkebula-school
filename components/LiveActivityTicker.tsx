"use client";

import { useEffect, useMemo, useState } from "react";

type ActivityItem = {
  role: "Parent" | "Tutor" | "Student" | "Family";
  action: string;
  location: string;
};

const activityItems: ActivityItem[] = [
  { role: "Parent", action: "viewing tutors", location: "Nairobi" },
  { role: "Tutor", action: "online", location: "London" },
  { role: "Family", action: "exploring lesson options", location: "Dubai" },
  { role: "Parent", action: "booking support", location: "Johannesburg" },
  { role: "Tutor", action: "preparing a lesson", location: "Mombasa" },
  { role: "Student", action: "learning online", location: "Kigali" },
  { role: "Parent", action: "viewing Cambridge support", location: "Doha" },
  { role: "Tutor", action: "updating availability", location: "Nairobi" },
  { role: "Family", action: "comparing tutors", location: "Dar es Salaam" },
  { role: "Parent", action: "viewing IB support", location: "Kampala" },
  { role: "Student", action: "joining learning support", location: "Lagos" },
  { role: "Tutor", action: "online", location: "Cape Town" },
];

function buildMessage(item: ActivityItem) {
  return `${item.role} ${item.action} from ${item.location}`;
}

export default function LiveActivityTicker() {
  const [activeIndex, setActiveIndex] = useState(0);

  const messages = useMemo(
    () => activityItems.map((item) => buildMessage(item)),
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % messages.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [messages.length]);

  const currentMessage = messages[activeIndex];

  return (
    <section
      aria-label="Privacy-safe live learning activity"
      className="border-y border-[#379CD6]/20 bg-[#F7FCFF]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 text-sm text-slate-700 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-600" />
          </span>

          <span className="font-bold text-[#156B96]">Live learning activity</span>

          <span className="hidden text-slate-400 sm:inline">•</span>

          <span className="font-semibold text-slate-900">{currentMessage}</span>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Privacy-safe: broad city/country only. No names, IP addresses, or exact
          locations are shown.
        </p>
      </div>
    </section>
  );
}
