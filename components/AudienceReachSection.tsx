"use client";

import Link from "next/link";

const audienceGroups = [
  {
    title: "International-School Learners",
    label: "School Support",
    description:
      "For learners following international curricula who need stronger subject support, exam preparation, or a more structured academic rhythm.",
    details:
      "This includes students in established international-school environments who want access to strong tutors online, with local in-person support considered where available.",
    href: "/get-matched",
  },
  {
    title: "Regional Families",
    label: "Across Africa",
    description:
      "For families across the region who want access to experienced tutors beyond their immediate city or school network.",
    details:
      "Alkebula makes it easier for learners in different African cities to receive structured academic support across borders.",
    href: "/educators",
  },
  {
    title: "Global Students",
    label: "Worldwide Access",
    description:
      "For internationally mobile families, homeschool learners, private candidates and students preparing for demanding exam pathways.",
    details:
      "The platform is designed for flexible online learning across time zones, curricula and academic goals.",
    href: "/exam-revision",
  },
];

export default function AudienceReachSection() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#379CD6]">
            Who Alkebula Serves
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Built for international-curriculum learners wherever they are.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            The Alkebula School supports learners in international schools,
            homeschool settings and private-candidate pathways who need serious
            academic structure, tutor guidance and exam-focused progress.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {audienceGroups.map((group) => (
            <Link
              key={group.title}
              href={group.href}
              className="group rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#F7FCFF] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#379CD6]/40 hover:shadow-lg"
            >
              <span className="rounded-full bg-[#FFF5F7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8F1F36] ring-1 ring-[#8F1F36]/10">
                {group.label}
              </span>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {group.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {group.description}
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                {group.details}
              </p>

              <p className="mt-5 text-sm font-bold text-[#156B96]">
                Get support →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs leading-6 text-slate-500">
            Alkebula supports families connected to international-school
            communities in Kenya, regional learners across cities such as
            Kampala, Dar es Salaam, Addis Ababa, Kigali, Lusaka, Harare, Juba,
            Mogadishu, Kisumu and Mombasa, and global families in places such as
            London, New York and Dubai.
          </p>

          <p className="mt-3 text-xs leading-6 text-slate-500">
            School examples may include Braeburn, Hillcrest, St Andrew’s Turi,
            Peponi, ISK, Brookhouse, Woodcreek, Makini, SABIS and Brookhurst.
            These references are descriptive only and do not imply official
            partnership, endorsement or affiliation unless expressly stated.
          </p>
        </div>
      </div>
    </section>
  );
}