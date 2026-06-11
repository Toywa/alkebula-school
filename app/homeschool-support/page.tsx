import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Homeschool Support | Cambridge & Edexcel | The Alkebula School",
  description:
    "A structured, measurable homeschool programme for Cambridge and Edexcel IGCSE pathways from Year 1 to Year 13, with full syllabus coverage, parent visibility, professional reporting, and exam-centre guidance.",
  alternates: {
    canonical: "/homeschool-support",
  },
};

const rules = [
  "Cambridge",
  "Edexcel IGCSE",
  "Year 1 to Year 13",
  "No IB under homeschool support",
];

const parentPromises = [
  {
    title: "You set the pace. We keep the momentum.",
    description:
      "Learning days and hours are flexible, but the programme remains structured, followed up, and academically accountable.",
    more:
      "This means the learner’s timetable can be built around family routines, travel, sports, health, performing arts, or school-transition needs. Flexibility does not mean drifting. Alkebula keeps the learner moving through planned lessons, topic targets, practice work, assessments, check-ins, and progress reports.",
  },
  {
    title: "See exactly what your child covered this week.",
    description:
      "Parents can follow syllabus coverage by subject and topic through clear progress tracking.",
    more:
      "Instead of being told vaguely that the learner is 'doing well', parents can see the actual academic ground covered. Each subject is broken into syllabus topics, and each topic has a status. This helps parents know whether the programme is moving at the right pace and whether the learner is building enough coverage before exams.",
  },
  {
    title: "No more last-minute panic before mocks.",
    description:
      "Learning gaps are identified early through practice, assessment, and continuous academic review.",
    more:
      "Many homeschool and private-candidate families discover gaps too late, often shortly before mocks or final exams. Alkebula’s model is designed to identify weak areas early through topic assessments, tutor comments, syllabus tracking, and reporting. The aim is to fix gaps while there is still enough time to act.",
  },
  {
    title: "Weekly check-ins and termly reports you can rely on.",
    description:
      "Parents receive regular academic updates and formal reports whenever assessments are administered.",
    more:
      "Weekly check-ins keep the family aware of lesson consistency, attendance, work completion, and immediate concerns. Formal academic reports give a deeper picture of performance, strengths, weak areas, syllabus coverage, assessment outcomes, and recommended next steps.",
  },
  {
    title: "Know whether your child is exam-ready — months before exams.",
    description:
      "Assessment results and syllabus coverage give parents a clearer picture of readiness before final pressure builds.",
    more:
      "Exam readiness is not judged by confidence alone. It is judged by syllabus coverage, assessment performance, topic mastery, past-paper readiness, exam technique, and consistency. Parents should know early whether the learner is on track, behind, or in need of more support.",
  },
];

const syllabusCompletion = [
  {
    title: "Taught",
    description: "The topic is taught clearly by the assigned tutor.",
    more:
      "The tutor introduces the concept, explains the required syllabus content, works through examples, and records that the topic has been taught. Teaching alone does not mean the topic is complete.",
  },
  {
    title: "Practised",
    description:
      "The learner completes guided practice and independent work to build confidence.",
    more:
      "Practice may include exercises, worksheets, problem sets, written tasks, revision questions, past-paper style questions, or oral discussion depending on the subject and level.",
  },
  {
    title: "Assessed",
    description:
      "The learner completes an assessment, quiz, test, or checkpoint for that topic.",
    more:
      "Assessment confirms whether the learner has understood the topic well enough to move forward. If the learner struggles, the topic remains open for review, reteaching, and further practice.",
  },
  {
    title: "Marked Green",
    description:
      "The topic is marked complete in the parent dashboard only after the learner passes.",
    more:
      "Completed topics are marked green in the parent dashboard. This gives parents a visible record of progress and reduces uncertainty about what has actually been mastered.",
  },
];

const someshaFeatures = [
  {
    title: "Online lessons",
    more:
      "Learners outside Nairobi study online through Somesha. Nairobi learners may also use Somesha for online or hybrid lessons.",
  },
  {
    title: "Subject syllabus maps",
    more:
      "Each subject is organised into syllabus topics so the learner follows a clear pathway rather than random lessons.",
  },
  {
    title: "Topic completion tracking",
    more:
      "Topics move from taught, to practised, to assessed, to completed. Completed topics are marked green after the learner passes.",
  },
  {
    title: "Assessment records",
    more:
      "Assessment results help parents and tutors know what has been mastered and what requires further support.",
  },
  {
    title: "Parent progress visibility",
    more:
      "Parents can follow syllabus coverage and learner progress without waiting until the end of term.",
  },
  {
    title: "Tutor lesson notes",
    more:
      "Tutor notes help document what happened in lessons, what was assigned, and what should happen next.",
  },
  {
    title: "Academic reports",
    more:
      "Reports provide a more formal view of academic progress, strengths, weak areas, and recommendations.",
  },
  {
    title: "Structured learner support",
    more:
      "Somesha supports a school-like academic rhythm while preserving the flexibility of homeschool and online learning.",
  },
];

const reportItems = [
  "Topics covered",
  "Assessment scores",
  "Strengths",
  "Weak areas",
  "Tutor comments",
  "Recommended next steps",
  "Attendance and lesson consistency",
  "Syllabus coverage progress",
];

const feeFactors = [
  "Learner’s level",
  "Subjects selected",
  "Learning hours",
  "Lesson frequency",
  "Physical or online delivery",
  "Practical lesson requirements",
  "Transport costs where applicable",
  "Special educational support needs",
];

const audiences = [
  {
    title: "Homeschooling families",
    description:
      "Families who want a structured academic programme without enrolling in a traditional full-time school setting.",
  },
  {
    title: "Internationally mobile families",
    description:
      "Families who move between countries or cities and need continuity in Cambridge or Edexcel learning.",
  },
  {
    title:
      "Expatriate children waiting to join mainstream international schools",
    description:
      "Children waiting to join schools such as ISK, Braeburn, Hillcrest, Brookhouse, and similar international schools can continue structured learning while waiting for placement.",
  },
  {
    title: "Students transitioning between schools",
    description:
      "Learners changing schools, curricula, countries, or academic systems who need a bridge programme.",
  },
  {
    title: "Students needing learning-gap recovery",
    description:
      "Learners who have fallen behind and need organised support to rebuild foundations and catch up.",
  },
  {
    title: "Athletes and sports students",
    description:
      "Students whose training and competition schedules require flexible learning days and hours.",
  },
  {
    title: "Performing arts students",
    description:
      "Learners involved in music, theatre, dance, production, or creative disciplines who need academic flexibility.",
  },
  {
    title: "Students with special educational needs",
    description:
      "Learners who benefit from personalised pacing, careful support, and structured academic follow-up.",
  },
  {
    title: "Private Cambridge or Edexcel exam candidates",
    description:
      "Students preparing privately for Cambridge or Edexcel exams who need syllabus coverage, assessment, and exam readiness support.",
  },
  {
    title: "Families seeking flexible but structured education",
    description:
      "Families who want the flexibility of homeschool but the structure and accountability of a managed academic programme.",
  },
  {
    title: "Students who need personalised pacing",
    description:
      "Learners who need to move faster, slower, or differently from a standard classroom timetable.",
  },
];

const pathwaySteps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We understand the learner’s level, subjects, learning history, family schedule, and academic goals.",
  },
  {
    number: "02",
    title: "Custom Plan",
    description:
      "We design a programme around curriculum, learning hours, lesson frequency, delivery mode, assessments, and reporting.",
  },
  {
    number: "03",
    title: "Teaching Begins",
    description:
      "Lessons begin physically in Nairobi or online through Somesha, depending on location and programme design.",
  },
  {
    number: "04",
    title: "Track and Report",
    description:
      "Topics are tracked, assessments are recorded, progress is reported, and exam-centre guidance is provided where needed.",
  },
];

function ReadMore({ children }: { children: React.ReactNode }) {
  return (
    <details className="group mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <summary className="cursor-pointer list-none text-sm font-bold text-[#156B96] outline-none transition hover:text-[#8F1F36]">
        <span className="inline group-open:hidden">Read more</span>
        <span className="hidden group-open:inline">Show less</span>
      </summary>
      <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
    </details>
  );
}

export default function HomeschoolSupportPage() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      <section className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_26%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-10 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Alkebula Homeschool Support
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                You set the pace.
                <span className="block text-[#8F1F36]">
                  We keep the momentum.
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Alkebula Homeschool Support is a structured, measurable learning
                programme for Cambridge and Edexcel IGCSE pathways from Year 1
                to Year 13. It combines flexible learning schedules, full
                syllabus coverage, continuous assessment, parent visibility,
                professional reporting, and final examination guidance through
                recognised exam-centre partnerships.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/get-matched"
                  className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
                >
                  Request Homeschool Consultation
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
                >
                  Speak to Admissions
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-slate-600">
                {rules.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/homeschool-support.png"
                alt="Student receiving structured online homeschool support with online tutor, syllabus tracking, and parent progress visibility"
                width={1672}
                height={941}
                priority
                className="w-full rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
              />

              <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#379CD6]">
                  Parent visibility
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                  Syllabus progress, assessment records, lesson notes, and
                  reporting are built into the homeschool support journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Rules */}
      <section className="border-b border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Key Rules
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
                Cambridge and Edexcel only.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                The homeschool programme is deliberately focused so that
                teaching, syllabus mapping, assessment, reporting, and exam
                guidance remain consistent and specialised.
              </p>

              <ReadMore>
                IB can remain under ordinary subject tutoring, but it is not
                offered under the structured homeschool programme. This avoids
                mixing very different academic models inside one homeschool
                pathway and keeps the programme clearer for parents.
              </ReadMore>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {rules.map((rule) => (
                <div
                  key={rule}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-950 shadow-sm"
                >
                  {rule}
                </div>
              ))}

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-7 text-amber-800 sm:col-span-2">
                IB can remain under ordinary subject tutoring, but it is not
                offered under the structured homeschool programme.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Promises */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Not Vague Tutoring
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
            A professionally managed school-at-home pathway.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            This is for families who want flexibility without losing structure.
            It is not a loose collection of lessons. It is a planned academic
            pathway with syllabus tracking, continuous assessment, parent
            visibility, and professional reports.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {parentPromises.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
              <ReadMore>{item.more}</ReadMore>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Model */}
      <section className="border-y border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Learning Model
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
                Online or physical, depending on location.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Learning days and hours are flexible, but individualised. Each
                learner follows a designed programme rather than a generic
                timetable.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-950">
                  Nairobi students
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Online or physical lessons are available, depending on the
                  learner’s location, tutor availability, transport requirements,
                  practical needs, and programme structure.
                </p>
                <ReadMore>
                  Physical lessons are especially useful for younger learners,
                  learners who need close supervision, learners requiring
                  practical support, or families who prefer face-to-face academic
                  structure. Online learning remains available where it provides
                  better continuity or flexibility.
                </ReadMore>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-950">
                  Students outside Nairobi
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Lessons are delivered online through Somesha, Alkebula’s
                  internal learning system.
                </p>
                <ReadMore>
                  Online learners still follow the same structured academic
                  model: syllabus maps, lesson notes, assessment records, parent
                  visibility, and formal reports. The programme remains
                  measurable even when the learner is studying from another city
                  or country.
                </ReadMore>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Tracking */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
            Headline Feature
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
            See exactly what your child covered this week.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            Every learner follows a structured syllabus map. Each subject is
            broken into topics, and every topic moves through teaching, practice,
            assessment, and completion.
          </p>

          <ReadMore>
            This is the difference between ordinary tutoring and a structured
            homeschool programme. Parents do not have to wait until mocks or end
            of term to realise that important topics were missed. Coverage is
            tracked throughout the programme, making it easier to identify gaps,
            slow progress, repeated weaknesses, or exam-readiness concerns.
          </ReadMore>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {syllabusCompletion.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-black text-[#8F1F36]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
              <ReadMore>{step.more}</ReadMore>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-green-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-700">
            Parent Dashboard Example
          </p>

          <h3 className="mt-3 text-2xl font-bold text-slate-950">
            Completed topics are marked green in the parent dashboard.
          </h3>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ["Algebraic Expressions", "Completed"],
              ["Forces and Motion", "Completed"],
              ["Trigonometry", "In Progress"],
              ["Essay Structure", "Completed"],
              ["Organic Chemistry", "Assessment Pending"],
              ["Map Skills", "Completed"],
            ].map(([topic, status]) => {
              const complete = status === "Completed";

              return (
                <div
                  key={topic}
                  className={`rounded-xl border p-4 text-sm font-semibold ${
                    complete
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <p>{topic}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em]">
                    {status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Somesha */}
      <section className="border-y border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Somesha System
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
                The internal system behind structured learning.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Somesha is Alkebula’s internal learning system. It supports
                online lessons, syllabus tracking, assessment records, tutor
                notes, parent visibility, academic reports, and structured
                learner support.
              </p>

              <ReadMore>
                Somesha gives the homeschool programme its academic backbone. It
                is where lessons, records, assessments, and reporting come
                together so that parents can see progress and tutors can teach
                with a clear plan.
              </ReadMore>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {someshaFeatures.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#379CD6]/15 bg-white p-4 text-sm font-semibold text-[#156B96] shadow-sm"
                >
                  {item.title}
                  <ReadMore>{item.more}</ReadMore>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Reporting
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Formal academic reports twice per term.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Formal academic reports are issued twice per term whenever
              assessments are administered. Parents receive clear evidence of
              what has been covered, how the learner performed, and what should
              happen next.
            </p>

            <ReadMore>
              Reports are not intended to be decorative. They help parents make
              informed decisions about pace, subject load, additional support,
              exam readiness, revision priorities, and whether the learner needs
              more time, more practice, or a different academic strategy.
            </ReadMore>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {reportItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees and Exams */}
      <section className="border-y border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Custom Fees
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Monthly fees are customised.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Fees are customised based on the learner’s level, subjects,
                learning hours, lesson frequency, physical or online delivery,
                practical lesson requirements, and transport where applicable.
              </p>

              <ReadMore>
                A younger learner taking several subjects with physical lessons
                in Nairobi will not have the same fee structure as an older
                learner taking two online IGCSE subjects. Fees are therefore
                quoted after understanding the learner’s programme, subject
                load, learning hours, practical needs, and support requirements.
              </ReadMore>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {feeFactors.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Exams and Uniform
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Exam-centre guidance without uniform requirements.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Learners are guided toward final examinations through
                partnerships and coordination with exam centres.
              </p>

              <ReadMore>
                Alkebula supports academic preparation and guidance toward
                examination-centre options. Final registration depends on the
                rules, deadlines, availability, fees, subject options, practical
                arrangements, and requirements of the relevant exam centre.
              </ReadMore>

              <div className="mt-6 rounded-2xl border border-[#379CD6]/15 bg-[#F7FCFF] p-5 text-sm font-semibold leading-7 text-[#156B96]">
                Final registration depends on the rules, deadlines,
                availability, and requirements of the relevant exam centre.
              </div>

              <div className="mt-4 rounded-2xl border border-[#8F1F36]/15 bg-[#FFF5F7] p-5 text-sm font-bold leading-7 text-[#8F1F36]">
                No school uniform is required.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It Is For */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Who It Is For
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              Flexible education with professional structure.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              The programme is suitable for families who need a serious academic
              system outside the traditional full-time classroom model.
            </p>
          </div>

          <div className="grid gap-3">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-7 text-slate-700 shadow-sm"
              >
                <h3 className="font-bold text-slate-950">{item.title}</h3>
                <ReadMore>{item.description}</ReadMore>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment */}
      <section className="border-y border-slate-200 bg-[#F7FCFF]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              How Enrollment Works
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-5xl">
              A careful process before learning begins.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pathwaySteps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-black text-[#8F1F36]">
                  {step.number}
                </p>

                <h3 className="mt-4 text-xl font-bold text-slate-950">
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

      <section className="bg-[#8F1F36] text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <h2 className="max-w-4xl text-3xl font-bold md:text-5xl">
            Build a complete school-at-home pathway with Alkebula.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/75">
            Request a homeschool consultation and let us design a structured,
            measurable learning programme around your child’s curriculum, level,
            subjects, schedule, and long-term academic goals.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/get-matched"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-[#EEF9FF]"
            >
              Request Homeschool Consultation
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
