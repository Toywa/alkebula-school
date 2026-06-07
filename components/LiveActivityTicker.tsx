"use client";

import { useEffect, useMemo, useState } from "react";

type ActivityItem = {
  role: "Parent" | "Tutor" | "Student" | "Family";
  action: string;
  location: string;
};

const PLATFORM_VISITS_BASELINE = 100456;

const activityItems: ActivityItem[] = [
  { role: "Parent", action: "viewing tutors", location: "Nairobi, Kenya" },
  { role: "Tutor", action: "online", location: "London, United Kingdom" },
  { role: "Family", action: "exploring lesson options", location: "Dubai, UAE" },
  { role: "Parent", action: "booking support", location: "Johannesburg, South Africa" },
  { role: "Tutor", action: "preparing a lesson", location: "Mombasa, Kenya" },
  { role: "Student", action: "learning online", location: "Kigali, Rwanda" },
  { role: "Parent", action: "viewing Cambridge support", location: "Doha, Qatar" },
  { role: "Tutor", action: "updating availability", location: "Nairobi, Kenya" },
  { role: "Family", action: "comparing tutors", location: "Dar es Salaam, Tanzania" },
  { role: "Parent", action: "viewing IB support", location: "Kampala, Uganda" },
  { role: "Student", action: "joining learning support", location: "Lagos, Nigeria" },
  { role: "Tutor", action: "online", location: "Cape Town, South Africa" },
  { role: "Parent", action: "reviewing A Level tutors", location: "Accra, Ghana" },
  { role: "Family", action: "exploring homeschool support", location: "Toronto, Canada" },
  { role: "Tutor", action: "checking lesson schedule", location: "Manchester, United Kingdom" },
  { role: "Student", action: "viewing study support", location: "Abu Dhabi, UAE" },
  { role: "Parent", action: "browsing Edexcel tutors", location: "Riyadh, Saudi Arabia" },
  { role: "Tutor", action: "reviewing availability", location: "Kisumu, Kenya" },
  { role: "Family", action: "viewing online tutoring", location: "New York, United States" },
  { role: "Student", action: "exploring exam preparation", location: "Addis Ababa, Ethiopia" },
  { role: "Parent", action: "viewing tutor profiles", location: "Muscat, Oman" },
  { role: "Tutor", action: "preparing resources", location: "Birmingham, United Kingdom" },
  { role: "Family", action: "checking curriculum support", location: "Amsterdam, Netherlands" },
  { role: "Student", action: "learning online", location: "Lusaka, Zambia" },
  { role: "Parent", action: "viewing lesson options", location: "Paris, France" },
  { role: "Tutor", action: "online", location: "Eldoret, Kenya" },
  { role: "Family", action: "reviewing tutor rates", location: "Berlin, Germany" },
  { role: "Student", action: "exploring IB tutoring", location: "Singapore" },
  { role: "Parent", action: "checking availability", location: "Sydney, Australia" },
  { role: "Tutor", action: "updating profile", location: "Pretoria, South Africa" },
  { role: "Parent", action: "viewing GCSE support", location: "Bristol, United Kingdom" },
  { role: "Student", action: "exploring maths tutoring", location: "Cairo, Egypt" },
  { role: "Family", action: "viewing international tutors", location: "Brussels, Belgium" },
  { role: "Tutor", action: "preparing a Cambridge lesson", location: "Nakuru, Kenya" },
  { role: "Parent", action: "checking tutor experience", location: "Boston, United States" },
  { role: "Student", action: "reviewing science support", location: "Madrid, Spain" },
  { role: "Family", action: "exploring academic support", location: "Geneva, Switzerland" },
  { role: "Tutor", action: "updating teaching rates", location: "Thika, Kenya" },
  { role: "Parent", action: "viewing A Level support", location: "Oxford, United Kingdom" },
  { role: "Student", action: "learning online", location: "Hong Kong" },
  { role: "Family", action: "browsing tutor profiles", location: "Melbourne, Australia" },
  { role: "Tutor", action: "online", location: "Durban, South Africa" },
  { role: "Parent", action: "viewing homeschool options", location: "Auckland, New Zealand" },
  { role: "Student", action: "exploring English tutoring", location: "Rome, Italy" },
  { role: "Family", action: "checking lesson availability", location: "Stockholm, Sweden" },
  { role: "Tutor", action: "reviewing upcoming lessons", location: "Naivasha, Kenya" },
  { role: "Parent", action: "viewing premium tutoring", location: "Zurich, Switzerland" },
  { role: "Student", action: "exploring exam support", location: "Oslo, Norway" },
  { role: "Family", action: "comparing curriculum options", location: "Vienna, Austria" },
  { role: "Tutor", action: "preparing online resources", location: "Kampala, Uganda" },
  { role: "Parent", action: "checking class-level support", location: "Washington DC, United States" },
  { role: "Student", action: "viewing revision support", location: "Athens, Greece" },
  { role: "Family", action: "exploring IB support", location: "Copenhagen, Denmark" },
  { role: "Tutor", action: "updating timezone availability", location: "Lamu, Kenya" },
  { role: "Parent", action: "viewing tutor qualifications", location: "Dublin, Ireland" },
  { role: "Student", action: "learning online", location: "Lisbon, Portugal" },
  { role: "Family", action: "reviewing subject packages", location: "Helsinki, Finland" },
  { role: "Tutor", action: "online", location: "Abuja, Nigeria" },
  { role: "Parent", action: "exploring lesson bookings", location: "Vancouver, Canada" },
  { role: "Student", action: "viewing Cambridge tutors", location: "Sharjah, UAE" },
];

function buildMessage(item: ActivityItem) {
  return `${item.role} ${item.action} from ${item.location}`;
}

function formatCounter(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function LiveActivityTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [platformVisits, setPlatformVisits] = useState(PLATFORM_VISITS_BASELINE);

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

  useEffect(() => {
    let cancelled = false;

    async function recordVisit() {
      try {
        const response = await fetch("/api/platform-visits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!cancelled && response.ok && typeof data.total === "number") {
          setPlatformVisits(data.total);
        }
      } catch {
        if (!cancelled) {
          setPlatformVisits(PLATFORM_VISITS_BASELINE);
        }
      }
    }

    recordVisit();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentMessage = messages[activeIndex];

  return (
    <section
      aria-label="Privacy-safe live learning activity"
      className="border-y border-[#379CD6]/20 bg-[#F7FCFF] text-slate-900"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-600" />
          </span>

          <span className="font-bold text-[#156B96]">
            Live learning activity
          </span>

          <span className="hidden text-slate-400 sm:inline">•</span>

          <span className="font-semibold text-slate-900">{currentMessage}</span>
        </div>

        <div className="flex flex-col gap-1 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:gap-3">
          <span className="font-bold text-[#8F1F36]">
            Platform visits: {formatCounter(platformVisits)}+
          </span>

          <span className="hidden text-slate-300 sm:inline">•</span>

          <span>
            Privacy-safe: broad city/country only. No names, IP addresses, or
            exact locations are shown.
          </span>
        </div>
      </div>
    </section>
  );
}
