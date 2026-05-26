import Link from "next/link";

const tutorTermsSections = [
  {
    title: `1. Purpose`,
    body: [
      `These Tutor Terms and Conditions set out the professional, operational, safeguarding, payment, and conduct expectations for educators approved to teach through The Alkebula School.`,
    ],
  },
  {
    title: `2. Tutor Status`,
    body: [
      `Approved tutors operate as independent educators engaged through The Alkebula School platform. Approval does not create employment, partnership, agency, or guaranteed lesson allocation unless expressly agreed in writing.`,
    ],
  },
  {
    title: `3. Professional Standards`,
    body: [
      `Tutors must deliver lessons professionally, punctually, respectfully, and in line with the curriculum, subject, and learner needs agreed during booking. Tutors must prepare adequately, maintain high teaching standards, and communicate clearly with learners, parents, and the school.`,
    ],
  },
  {
    title: `4. Safeguarding and Learner Welfare`,
    body: [
      `Tutors must always maintain appropriate boundaries with learners. Any safeguarding concern, inappropriate communication, unusual learner behavior, or welfare risk must be reported to The Alkebula School immediately. Tutors must not request private personal information from learners beyond what is required for teaching.`,
    ],
  },
  {
    title: `5. Platform Use`,
    body: [
      `Lessons should be conducted through approved Alkebula systems, including the Alkebula classroom or any approved teaching platform provided by the school. Tutors must not move lessons outside the platform without written permission.`,
    ],
  },
  {
    title: `6. Attendance and Lesson Timing`,
    body: [
      `Tutors must attend scheduled lessons on time. Classroom access and lesson activity may be controlled by the school's timing rules. Tutors should not attempt to start lessons outside the approved access window. Lesson notes, attendance records, and end-of-lesson summaries must be completed accurately.`,
    ],
  },
  {
    title: `7. Rescheduling by Tutors`,
    body: [
      `If a tutor cannot attend a scheduled lesson, the tutor must submit a reschedule request through the platform as early as possible and, except in genuine emergencies, not less than 24 hours before the scheduled lesson time. Admin approval is required before a lesson time is changed. Tutors must not privately agree a new time with parents without updating the platform.`,
      `Repeated late reschedule requests, missed lessons, or unreliable attendance may lead to reduced visibility, restriction, suspension, or removal from the platform.`,
    ],
  },
  {
    title: `8. Parent or Student Missed Lessons and Late Rescheduling`,
    body: [
      `Where a parent or student misses a lesson, or requests to reschedule less than 24 hours before the scheduled lesson time, The Alkebula School will review the circumstances with the parent and the tutor. The school will seek an amicable and fair decision, which may include paying the tutor for the lesson, rescheduling the lesson, or applying another reasonable solution depending on the facts.`,
      `The final decision will consider fairness to the tutor, the parent's circumstances, the learner's welfare, notice given, any emergency involved, and the school's quality standards.`,
    ],
  },
  {
    title: `9. Cancellations`,
    body: [
      `Tutors should not cancel lessons directly except where the platform or school expressly allows it. Any urgent inability to attend must be reported to admin immediately. Repeated lateness, missed lessons, or unreliable attendance may lead to restriction, suspension, or removal.`,
    ],
  },
  {
    title: `10. Homework and Learner Reports`,
    body: [
      `Where appropriate, tutors should issue meaningful homework, revision tasks, or learning recommendations. Tutors must provide clear lesson notes and progress updates to support parent visibility and school quality assurance.`,
    ],
  },
  {
    title: `11. Payments, Commission, and Payouts`,
    body: [
      `The standard revenue sharing formula is 70/30: 70% of the approved lesson fee is payable to the tutor, and 30% is retained by The Alkebula School as the platform commission, unless a different written agreement applies.`,
      `Tutor payouts are calculated from the approved lesson fee recorded on the platform. Payments from parents must be processed through The Alkebula School's approved payment systems. Tutors must not request or accept direct payments from parents or students for lessons connected to The Alkebula School.`,
    ],
  },
  {
    title: `12. No Poaching or Circumvention`,
    body: [
      `Tutors must not solicit parents or students introduced through The Alkebula School for private lessons outside the platform. Tutors must not share private payment details, private booking links, or personal arrangements intended to bypass the school.`,
    ],
  },
  {
    title: `13. Confidentiality`,
    body: [
      `Tutors must treat learner information, parent information, school materials, internal systems, documents, and communications as confidential. Such information must not be shared with third parties without written permission.`,
    ],
  },
  {
    title: `14. Communication Standards and Prohibited Conduct`,
    body: [
      `All communication with parents, learners, and admin must be respectful, professional, and appropriate. Tutors must not use abusive, demeaning, humiliating, discriminatory, threatening, sexually inappropriate, exploitative, or intimidating language during lessons or in any school-related communication.`,
      `Tutors must not teach, communicate with learners, attend lessons, or represent The Alkebula School while drunk, intoxicated, high on drugs, impaired by substances, or otherwise unfit to teach. Any such conduct may result in immediate suspension, investigation, non-payment for the affected lesson where appropriate, and possible removal from the platform.`,
    ],
  },
  {
    title: `15. Materials and Intellectual Property`,
    body: [
      `Tutors may use appropriate teaching resources during lessons. Any school-provided materials, templates, recordings, lesson systems, brand assets, or documents remain the property of The Alkebula School unless otherwise agreed.`,
    ],
  },
  {
    title: `16. Reviews, Quality Assurance, and Monitoring`,
    body: [
      `The Alkebula School may review lesson quality, attendance, learner feedback, parent feedback, lesson notes, and platform activity to maintain standards. Poor performance or repeated complaints may result in additional training, restricted visibility, suspension, or removal.`,
    ],
  },
  {
    title: `17. Approval, Suspension, and Removal`,
    body: [
      `Approval as a tutor may be reviewed at any time. The Alkebula School may suspend or remove a tutor for safeguarding concerns, misconduct, dishonesty, poor performance, repeated missed lessons, late or improper rescheduling, direct payment requests, poaching, intoxication, abusive language, or breach of these terms.`,
    ],
  },
  {
    title: `18. Accuracy of Information`,
    body: [
      `Tutors must provide accurate application details, qualifications, documents, references, experience, location, and subject expertise. False, misleading, or incomplete information may lead to rejection, suspension, or removal.`,
    ],
  },
  {
    title: `19. Changes to Terms`,
    body: [
      `The Alkebula School may update these Tutor Terms and Conditions from time to time. Continued use of the platform after notice of changes means the tutor accepts the updated terms.`,
    ],
  },
  {
    title: `20. Acceptance`,
    body: [
      `By accepting approval, accessing the educator dashboard, appearing publicly as a tutor, or delivering lessons through The Alkebula School, the tutor agrees to these Tutor Terms and Conditions.`,
    ],
  },
  {
    title: `Contact`,
    body: [
      `Britam Tower, 24th Floor, Kenya Road, Upperhill, Nairobi, Kenya`,
      `admin@alkebulaschool.com`,
      `https://www.alkebulaschool.com`,
    ],
  }
];

export default function TutorTermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to The Alkebula School
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            The Alkebula School
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Tutor Terms and Conditions
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            These terms apply to educators approved to teach through The Alkebula School. They set out professional standards, safeguarding expectations, lesson responsibilities, payment rules, rescheduling rules, and platform conduct requirements.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/legal/tutor-terms.pdf"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Download PDF
            </a>

            <Link
              href="/auth/sign-in"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              Educator Sign In
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-500">Effective Date: May 2026</p>
        </div>

        <div className="mt-10 space-y-5">
          {tutorTermsSections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-950">
          <p className="font-semibold">Tutor acceptance note</p>
          <p className="mt-2">
            By accepting approval, accessing the educator dashboard, appearing publicly as a tutor, or delivering lessons through The Alkebula School, the tutor agrees to these Tutor Terms and Conditions, including the 70/30 revenue sharing formula and the lesson rescheduling rules.
          </p>
        </div>
      </section>
    </main>
  );
}
