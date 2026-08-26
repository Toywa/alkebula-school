"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import VisitorDisplayWidget from "@/components/VisitorDisplayWidget";

const examWindows = [
  {
    label: "Edexcel International A Levels",
    date: "October 2026",
    priority: "Immediate revision",
    note: "Urgent support for Pearson Edexcel IAL students preparing for the October 2026 exam series.",
    href: "/exam-revision/edexcel-ial-october-2026",
  },
  {
    label: "Cambridge IGCSE",
    date: "October/November 2026",
    priority: "Immediate revision",
    note: "Syllabus gap closure, past-paper practice and exam technique for Cambridge IGCSE candidates.",
    href: "/exam-revision/cambridge-igcse-november-2026",
  },
  {
    label: "Cambridge AS & A Levels",
    date: "October/November 2026",
    priority: "Immediate revision",
    note: "High-level tutor support for Cambridge International AS & A Level candidates sitting the November series.",
    href: "/exam-revision/cambridge-a-level-november-2026",
  },
  {
    label: "Edexcel International GCSE",
    date: "November 2026",
    priority: "Immediate revision",
    note: "Focused revision for Pearson Edexcel International GCSE learners preparing for November papers.",
    href: "/exam-revision/edexcel-igcse-november-2026",
  },
  {
    label: "IB Diploma Programme",
    date: "November 2026",
    priority: "Immediate revision",
    note: "IB subject mastery, final revision, essay support and examination-readiness coaching.",
    href: "/exam-revision/ib-diploma-november-2026",
  },
  {
    label: "Cambridge Checkpoint",
    date: "October 2026",
    priority: "Immediate revision",
    note: "Primary and Lower Secondary preparation for Maths, English, Science and Global Perspectives.",
    href: "/exam-revision/cambridge-checkpoint-october-2026",
  },
  {
    label: "Edexcel International A Levels",
    date: "January 2027",
    priority: "Next window",
    note: "Early preparation and resit support for Pearson Edexcel IAL students targeting January 2027.",
    href: "/exam-revision/edexcel-ial-january-2027",
  },
  {
    label: "May/June 2027 Exams",
    date: "May/June 2027",
    priority: "Planning ahead",
    note: "Longer-term preparation for Cambridge, Edexcel, A Level, IB and homeschool learners.",
    href: "/exam-revision/may-june-2027",
  },
];

const curriculumCards = [
  {
    title: "Cambridge IGCSE",
    href: "/exam-revision/cambridge-igcse-november-2026",
    image: "/cambridge.png",
    eyebrow: "Oct/Nov revision",
    description:
      "Structured revision for Cambridge IGCSE learners preparing for syllabus completion, past papers and final exam confidence.",
  },
  {
    title: "Edexcel IGCSE",
    href: "/exam-revision/edexcel-igcse-november-2026",
    image: "/edexcel.png",
    eyebrow: "November revision",
    description:
      "Focused online tutoring for Pearson Edexcel International GCSE learners who need clarity, structure and exam technique.",
  },
  {
    title: "Cambridge A Levels",
    href: "/exam-revision/cambridge-a-level-november-2026",
    image: "/cambridge-a-level.png",
    eyebrow: "AS & A Level",
    description:
      "Advanced support for Cambridge International AS & A Level students preparing for demanding subject papers.",
  },
  {
    title: "Edexcel International A Levels",
    href: "/exam-revision/edexcel-ial-october-2026",
    image: "/edexcel-ial.png",
    eyebrow: "October 2026",
    description:
      "Immediate revision support for Pearson Edexcel IAL candidates preparing for October 2026 and January 2027 exam windows.",
  },
  {
    title: "IB Diploma Programme",
    href: "/exam-revision/ib-diploma-november-2026",
    image: "/ib.png",
    eyebrow: "November session",
    description:
      "Conceptual support for IB Diploma learners across HL, SL, essays, internal assessments and exam preparation.",
  },
  {
    title: "Cambridge Checkpoint",
    href: "/exam-revision/cambridge-checkpoint-october-2026",
    image: "/cambridge.png",
    eyebrow: "October 2026",
    description:
      "Support for Cambridge Primary and Lower Secondary learners preparing for Checkpoint-style assessment.",
  },
  {
    title: "Common Entrance",
    href: "/get-matched",
    image: "/common-entrance.jpg",
    eyebrow: "11+ and 13+",
    description:
      "Targeted English, Mathematics and Science support for learners preparing for independent-school entrance pathways.",
  },
  {
    title: "Homeschool Support",
    href: "/homeschool-support",
    image: "/homeschool-support.png",
    eyebrow: "Structure at home",
    description:
      "Academic rhythm, accountability and tutor-led support for families following international curricula from home.",
  },
];

const quickLinks = [
  ["Oct/Nov 2026 Revision", "/exam-revision"],
  ["Cambridge IGCSE", "/exam-revision/cambridge-igcse-november-2026"],
  ["Edexcel IGCSE", "/exam-revision/edexcel-igcse-november-2026"],
  ["A Levels", "/exam-revision/cambridge-a-level-november-2026"],
  ["IB November", "/exam-revision/ib-diploma-november-2026"],
  ["Get Matched", "/get-matched"],
];

const audienceGroups = [
  {
    title: "International-School Learners",
    label: "School Support",
    description:
      "For learners following international curricula who need stronger subject support, exam preparation or a more structured academic rhythm.",
    details:
      "Includes students in established international-school environments who want experienced tutor support online or local in-person support where available.",
    href: "/get-matched",
  },
  {
    title: "Regional Families",
    label: "Across Africa",
    description:
      "For families across the region who want access to strong tutors beyond their immediate city or school network.",
    details:
      "Alkebula supports learners in different African cities through structured online tutoring and parent-guided academic planning.",
    href: "/educators",
  },
  {
    title: "Global Students",
    label: "Worldwide Access",
    description:
      "For internationally mobile families, homeschool learners, private candidates and students preparing for demanding exam pathways.",
    details:
      "The platform is designed for flexible learning across time zones, curricula and academic goals.",
    href: "/exam-revision",
  },
];

const parentBenefits = [
  "Immediate Oct/Nov revision focus",
  "Approved educators",
  "Exam-readiness planning",
  "Past-paper discipline",
  "Homeschool structure",
  "Parent support",
  "Subject recovery",
  "Progress-focused tutoring",
];

const quotes = [
  {
    quote:
      "The final exam window rewards structure. Students need targeted revision, past-paper discipline and calm academic guidance.",
    author: "The Alkebula School",
  },
  {
    quote:
      "For October and November candidates, the right tutor can turn scattered revision into a focused exam-readiness plan.",
    author: "Academic Support Team",
  },
];

const steps = [
  {
    number: "01",
    title: "Share the exam series",
    description:
      "Tell us the learner’s curriculum, subjects, target exam window and current weak areas.",
  },
  {
    number: "02",
    title: "Diagnose gaps quickly",
    description:
      "The tutor identifies urgent topics, paper components and the revision areas with the highest exam value.",
  },
  {
    number: "03",
    title: "Revise with structure",
    description:
      "Lessons focus on syllabus gaps, past papers, mark schemes, timing and exam confidence.",
  },
  {
    number: "04",
    title: "Prepare for the paper",
    description:
      "Students build accuracy, speed, confidence and final exam technique before the session arrives.",
  },
];

export default function HomePage() {
  const [form, setForm] = useState({
    parent_name: "",
    student_name: "",
    email: "",
    phone: "",
    curriculum: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);
      setErrorMessage("");

      const res = await fetch("/api/parent-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Unable to submit enquiry. Please try again.");
      }

      setSuccess(true);
      setForm({
        parent_name: "",
        student_name: "",
        email: "",
        phone: "",
        curriculum: "",
        message: "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDFB] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_28%),radial-gradient(circle_at_top_right,#F7EEE8,transparent_30%),#FFFDFB]">
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#FFF5F7] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#F7EEE8] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="inline-flex rounded-full border border-[#8F1F36]/15 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8F1F36] shadow-sm">
                October/November 2026 Revision Now Open
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[3.05rem]">
                Focused winter exam revision for serious international learners.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                The Alkebula School supports international-curriculum learners
                in school, homeschool and private-candidate pathways who need
                serious tutoring, structured revision and access to strong
                academic guidance.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Our current priority is October/November 2026 revision for
                Cambridge IGCSE, Edexcel IGCSE, Cambridge AS & A Levels, Edexcel
                International A Levels, IB Diploma and Cambridge Checkpoint
                learners.
              </p>

              <div className="mt-6 max-w-2xl rounded-[1.6rem] border border-[#8F1F36]/10 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8F1F36]/10 bg-[#FFF5F7]">
                    <Image
                      src="/logo.png"
                      alt="The Alkebula School logo"
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                      Premium academic guidance
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      “A serious learner does not need noise. They need
                      diagnosis, structure, calm guidance and the right tutor at
                      the right time.”
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/get-matched"
                  className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
                >
                  Get Matched With a Tutor
                </Link>

                <Link
                  href="/exam-revision"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-[#FFF5F7]"
                >
                  View Revision Pages
                </Link>

                <a
                  href="#exam-focus"
                  className="inline-flex items-center justify-center rounded-xl border border-[#8F1F36]/15 bg-[#FFF5F7] px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-white"
                >
                  Exam Windows
                </a>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ["Oct/Nov", "Immediate focus"],
                  ["41+", "Approved tutors"],
                  ["Online", "Global lessons"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-2xl font-bold text-slate-950">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                    Current Priority
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-950">
                    Winter / Oct-Nov 2026 exams
                  </p>
                </div>

                <Link
                  href="/exam-revision"
                  className="rounded-full border border-[#8F1F36]/15 bg-[#FFF5F7] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#8F1F36] hover:bg-white"
                >
                  Revision Hub
                </Link>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_28px_80px_rgba(15,23,42,0.1)]">
                <div className="relative overflow-hidden rounded-[1.5rem] bg-[#F7EEE8]">
                  <Image
                    src="/alkebula-hero.jpg"
                    alt="Premium online international tutoring"
                    width={1672}
                    height={941}
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="h-[300px] w-full object-cover object-center sm:h-[350px] lg:h-[385px]"
                  />

                  <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8F1F36] shadow-sm">
                    Online international tutoring
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                    Global online revision support
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Premium academic support for Cambridge, Edexcel, A Levels,
                    IB, Checkpoint and Common Entrance pathways.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#8F1F36]/10 bg-[#FFF5F7] px-5 py-4 text-slate-900 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8F1F36]">
                    Start with clarity
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    Tutor matching available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 lg:grid-cols-6">
            {quickLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm transition hover:border-[#8F1F36]/20 hover:bg-[#FFF5F7] hover:text-[#8F1F36]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-10 lg:py-14">
        <div className="mx-auto max-w-5xl">
          <VisitorDisplayWidget />
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              Who Alkebula Serves
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built for international-curriculum learners wherever they are.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Alkebula supports learners in international schools, homeschool
              settings and private-candidate pathways who need serious academic
              structure, tutor guidance and exam-focused progress.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {audienceGroups.map((group) => (
              <Link
                key={group.title}
                href={group.href}
                className="group rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-white to-[#FFF8F9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#8F1F36]/20 hover:shadow-lg"
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

                <p className="mt-5 text-sm font-bold text-[#8F1F36]">
                  Get support →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#FFFDFB] p-5">
            <p className="text-xs leading-6 text-slate-500">
              Alkebula supports families in Kenya, across Africa and in global
              cities abroad. School and city examples used across the site are
              descriptive only and do not imply official partnership or
              endorsement unless expressly stated.
            </p>
          </div>
        </div>
      </section>

      <section id="exam-focus" className="bg-[#FFF8F9] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
                Immediate Exam Focus
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Winter revision comes first: October and November 2026.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                We are currently prioritising learners preparing for October and
                November 2026 examinations. January 2027 and May/June 2027
                preparation remain available for families planning ahead.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-950">
                Need a shareable revision page?
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                Use our exam-series pages for individual students, parents,
                schools and homeschool families targeting specific exam windows.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/exam-revision"
                  className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
                >
                  Open Revision Hub
                </Link>

                <a
                  href="#enquiry"
                  className="rounded-xl border border-[#8F1F36]/15 bg-[#FFF5F7] px-5 py-3 text-sm font-bold text-[#8F1F36] hover:bg-white"
                >
                  Send Enquiry
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {examWindows.map((item) => (
              <Link
                key={`${item.label}-${item.date}`}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#8F1F36]/20 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-950">
                    {item.label}
                  </p>

                  <span className="rounded-full bg-[#FFF5F7] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8F1F36] ring-1 ring-[#8F1F36]/15">
                    {item.priority}
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8F1F36]">
                  {item.date}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.note}
                </p>

                <p className="mt-5 text-sm font-bold text-[#8F1F36]">
                  Open revision page →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
                Academic Pathways
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Focused support for the curricula that matter now.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Choose the route your learner is following and connect with
                structured academic support built around mastery, confidence and
                measurable progress.
              </p>
            </div>

            <Link
              href="/homeschool-support"
              className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm hover:bg-[#FFF5F7]"
            >
              Explore Homeschool Support
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {curriculumCards.map((item) => (
              <Link
                key={`${item.title}-${item.href}`}
                href={item.href}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#8F1F36]/20 hover:shadow-lg"
              >
                <div className="flex h-52 items-center justify-center border-b border-slate-100 bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF5F7] p-3 sm:h-60">
                  <Image
                    src={item.image}
                    alt={`${item.title} online tutoring`}
                    width={900}
                    height={600}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8F1F36]">
                    {item.eyebrow}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <p className="mt-5 text-sm font-bold text-[#8F1F36]">
                    Learn more →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F8] py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2 lg:px-8">
          {quotes.map((item) => (
            <div
              key={item.quote}
              className="rounded-[2rem] border border-[#8F1F36]/10 bg-white p-7 shadow-sm"
            >
              <p className="text-4xl font-black leading-none text-[#8F1F36]">
                “
              </p>

              <p className="mt-2 text-base leading-8 text-slate-700">
                {item.quote}
              </p>

              <p className="mt-5 text-sm font-bold text-slate-950">
                {item.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-white to-[#FFFDFB] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              How Alkebula Works
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A clear path from concern to exam confidence.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-black text-[#8F1F36]">
                  {step.number}
                </p>

                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF8F9] px-6 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#8F1F36]/10 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              Tutor Matching
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Not sure which tutor, subject plan or exam route is right?
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Share the learner’s curriculum, target exam session, subjects,
              current challenges and preferred schedule. We will guide you
              toward suitable approved support.
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
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-[#FFF5F7]"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              Why Parents Choose Alkebula
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built for families who want more than casual tutoring.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Alkebula is designed around calm structure, clarity and academic
              seriousness. We support parents who need better rhythm, expert
              guidance and international curriculum focus.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
              >
                Create Parent Account
              </Link>

              <Link
                href="/about"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-[#FFF5F7]"
              >
                About Alkebula
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {parentBenefits.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#FFFDFB] p-5 text-sm font-bold text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFFDFB] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm lg:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
                International Curriculum Focus
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                Focused on serious international pathways.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                The Alkebula School supports Cambridge IGCSE, Edexcel IGCSE,
                Cambridge A Levels, Edexcel International A Levels, IB Diploma,
                Common Entrance, Cambridge Checkpoint and homeschool learners.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm lg:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
                For Homeschooling Families
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                Flexibility works best with structure.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Homeschooling gives families freedom, but learners still need
                academic rhythm, expert feedback and honest support. Alkebula
                helps families bring structure and accountability into the
                learning journey.
              </p>

              <Link
                href="/homeschool-support"
                className="mt-5 inline-flex rounded-xl bg-[#8F1F36] px-5 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
              >
                Learn About Homeschool Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="enquiry" className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-7 py-10 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:px-12 lg:py-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8F1F36]">
              Parent Enquiry
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Tell us about your child and the exam support you need.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Share the learner’s curriculum, subjects, target exam session and
              current challenges. We will guide you toward the right academic
              support.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5 md:grid-cols-2"
            >
              <input
                placeholder="Parent Name"
                value={form.parent_name}
                onChange={(e) =>
                  setForm({ ...form, parent_name: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                placeholder="Student Name"
                value={form.student_name}
                onChange={(e) =>
                  setForm({ ...form, student_name: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <input
                placeholder="Phone / WhatsApp"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10"
              />

              <select
                value={form.curriculum}
                onChange={(e) =>
                  setForm({ ...form, curriculum: e.target.value })
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10 md:col-span-2"
              >
                <option value="">Select Curriculum / Pathway</option>
                <option>Cambridge IGCSE Oct/Nov 2026</option>
                <option>Edexcel IGCSE November 2026</option>
                <option>Cambridge AS & A Level Oct/Nov 2026</option>
                <option>Edexcel International A Level October 2026</option>
                <option>IB Diploma November 2026</option>
                <option>Cambridge Checkpoint October 2026</option>
                <option>Edexcel International A Level January 2027</option>
                <option>May/June 2027 Exams</option>
                <option>Common Entrance</option>
                <option>Homeschool Support</option>
              </select>

              <textarea
                placeholder="Tell us the subjects, exam session, current challenge, preferred schedule and what support you need..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#8F1F36] focus:outline-none focus:ring-2 focus:ring-[#8F1F36]/10 md:col-span-2"
                rows={5}
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#8F1F36] py-3 font-bold text-white transition hover:bg-[#6F1729] disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Parent Enquiry"}
                </button>
              </div>

              {success ? (
                <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 md:col-span-2">
                  Enquiry submitted successfully.
                </p>
              ) : null}

              {errorMessage ? (
                <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 md:col-span-2">
                  {errorMessage}
                </p>
              ) : null}
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span>Ready to start directly?</span>

              <Link
                href="/auth/sign-up"
                className="font-bold text-[#8F1F36] underline underline-offset-4"
              >
                Create a parent account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F8] px-6 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#8F1F36]/10 bg-white p-8 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
              Parent Confidence
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              See why international families trust Alkebula.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Read professional, privacy-conscious parent testimonials from
              families using The Alkebula School for structured online tutoring,
              exam preparation and homeschool support.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="inline-flex items-center justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
          >
            Read Parent Testimonials
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#8F1F36]/10 bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF5F7] p-8 text-center shadow-sm lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8F1F36]">
            Begin With Structure
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Preparing for October or November 2026?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Choose an approved tutor or let us help match your child with the
            right academic support for their curriculum, subject and exam
            session.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/get-matched"
              className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white hover:bg-[#6F1729]"
            >
              Get Matched With a Tutor
            </Link>

            <Link
              href="/exam-revision"
              className="rounded-xl border border-[#8F1F36]/15 bg-white px-6 py-3 text-sm font-bold text-[#8F1F36] hover:bg-[#FFF5F7]"
            >
              Open Revision Hub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}