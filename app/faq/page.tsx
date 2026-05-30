import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | The Alkebula School",
  description:
    "Answers to common questions about The Alkebula School, online tutoring, Cambridge IGCSE, Edexcel IGCSE, A Levels, IB, homeschool support, bookings, tutor quality, payments, refunds, and parent support.",
  alternates: {
    canonical: "/faq",
  },
};

const faqSections = [
  {
    title: "About The Alkebula School",
    items: [
      {
        question: "What is The Alkebula School?",
        answer:
          "The Alkebula School is a premium online academic support platform for families following international curricula. We support learners in Cambridge IGCSE, Edexcel IGCSE, A Levels, IB, and structured homeschool pathways.",
      },
      {
        question: "Is Alkebula a normal tuition marketplace?",
        answer:
          "No. Alkebula is designed as a structured education support system rather than a casual tutoring marketplace. Our focus is on academic clarity, learning gaps, mastery, consistency, and measurable learner progress.",
      },
      {
        question: "Which curricula does Alkebula support?",
        answer:
          "We currently focus on Cambridge IGCSE, Edexcel IGCSE, A Levels, IB, and homeschool support for families using these international education pathways.",
      },
      {
        question: "Does Alkebula offer CBC tutoring?",
        answer:
          "No. The Alkebula School does not offer CBC tutoring. Our academic focus is international curricula only.",
      },
      {
        question: "Is Alkebula only for learners in Kenya?",
        answer:
          "No. Alkebula operates online and supports families globally. Learners can access approved tutors and structured academic support from different locations, subject to tutor availability and suitable time zones.",
      },
    ],
  },
  {
    title: "Tutoring and Academic Support",
    items: [
      {
        question: "How does online tutoring work?",
        answer:
          "Parents create an account, choose the relevant academic pathway, review available tutors, and book lessons based on the learner’s needs. Lessons are designed to be focused, structured, and aligned with the learner’s curriculum.",
      },
      {
        question: "Can Alkebula help a learner who is behind?",
        answer:
          "Yes. One of Alkebula’s main goals is to help learners close learning gaps. Tutors can support weaker areas, rebuild foundations, and help learners gain confidence through consistent guided practice.",
      },
      {
        question: "Can Alkebula support high-performing learners?",
        answer:
          "Yes. Alkebula is also suitable for learners who are already doing well but need stronger exam preparation, deeper subject mastery, better academic discipline, or higher-level challenge.",
      },
      {
        question: "Do you support homeschool families?",
        answer:
          "Yes. Alkebula offers structured homeschool support for families following international curricula. This includes subject tutoring, academic rhythm, accountability, and support for learners preparing for external examinations.",
      },
      {
        question: "Can parents book more than one lesson?",
        answer:
          "Yes. Parents can book lessons according to tutor availability and the learner’s academic needs. Where regular support is needed, families may arrange ongoing lessons.",
      },
    ],
  },
  {
    title: "Tutors and Quality",
    items: [
      {
        question: "Who are the tutors on Alkebula?",
        answer:
          "Tutors on Alkebula are educators who apply to join the platform and go through an onboarding and approval process before appearing publicly.",
      },
      {
        question: "Are tutors verified?",
        answer:
          "Tutor profiles are reviewed before approval. Alkebula may request professional details, curriculum experience, qualifications, teaching background, profile information, and supporting documents during the onboarding process.",
      },
      {
        question: "Can I choose a specific tutor?",
        answer:
          "Yes. Parents can review available tutor profiles and choose a tutor based on subject, curriculum experience, availability, and suitability for the learner.",
      },
      {
        question: "What happens if a tutor is unavailable?",
        answer:
          "If a tutor is unavailable, parents may select another suitable tutor or wait for available lesson slots. Where a booking needs adjustment, the platform may support rescheduling.",
      },
      {
        question: "Can tutors apply to join Alkebula?",
        answer:
          "Yes. Qualified educators with experience in supported international curricula may apply through the tutor application page.",
      },
    ],
  },
  {
    title: "Bookings, Lessons and Rescheduling",
    items: [
      {
        question: "How do parents book a lesson?",
        answer:
          "Parents sign up, find a suitable tutor, select available lesson times where provided, and submit the booking details through the platform.",
      },
      {
        question: "Can a lesson be rescheduled?",
        answer:
          "Where rescheduling is necessary, parents or tutors may request a change. Rescheduling depends on tutor availability and platform policies.",
      },
      {
        question: "What happens if a tutor cannot attend a booked lesson?",
        answer:
          "If a tutor is unable to attend, the lesson should be rescheduled where possible. Alkebula’s aim is to protect learner continuity and maintain trust between parents, tutors, and the platform.",
      },
      {
        question: "Are lessons online or in-person?",
        answer:
          "Alkebula is primarily built for online academic support. If any in-person arrangement is available in future, it will depend on location, tutor availability, and platform approval.",
      },
      {
        question: "Can parents track lesson history?",
        answer:
          "The platform is designed to support parent visibility over bookings and lesson activity, helping families manage learning support more clearly.",
      },
    ],
  },
  {
    title: "Payments, Refunds and Policies",
    items: [
      {
        question: "How are payments handled?",
        answer:
          "Payment handling may depend on the booking flow available at the time of booking. Parents should follow the payment instructions provided on the platform or by Alkebula’s official communication channels.",
      },
      {
        question: "Does Alkebula have a refund policy?",
        answer:
          "Yes. Refund terms are guided by the refund policy published on the website. Parents should review the Refund Policy page before making payments or bookings.",
      },
      {
        question: "Where can I find the Terms and Conditions?",
        answer:
          "The Terms and Conditions are available through the Legal section of the website footer.",
      },
      {
        question: "Where can I find the Privacy Policy?",
        answer:
          "The Privacy Policy is available through the Legal section of the website footer. It explains how user information is handled.",
      },
      {
        question: "Are tutor terms separate from parent terms?",
        answer:
          "Yes. Tutors may be subject to specific tutor terms, expectations, and professional conduct requirements in addition to general platform policies.",
      },
    ],
  },
  {
    title: "Parent Support and Communication",
    items: [
      {
        question: "How can parents contact Alkebula?",
        answer:
          "Parents can contact Alkebula through the Contact page, official email addresses, or available support channels provided on the website.",
      },
      {
        question: "Can I speak to someone before signing up?",
        answer:
          "Yes. Parents may submit an enquiry through the Contact page to discuss their learner’s needs before proceeding.",
      },
      {
        question: "What information should I provide when enquiring?",
        answer:
          "It helps to share the learner’s curriculum, subject needs, current level, areas of difficulty, preferred schedule, and whether the support is for catching up, exam preparation, or ongoing academic structure.",
      },
      {
        question: "Can Alkebula help me decide the right pathway?",
        answer:
          "Alkebula can guide parents toward the right support option based on curriculum, learner needs, and tutor availability.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Frequently Asked Questions
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Clear answers for parents, learners, and tutors.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Find answers about Alkebula’s international curriculum focus,
              online tutoring, homeschool support, tutor quality, bookings,
              payments, refunds, and parent support.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/sign-up"
                className="rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                Parent Sign Up
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-[#379CD6]/30 bg-[#F7FCFF] px-6 py-3 text-sm font-semibold text-[#156B96] shadow-sm transition hover:bg-[#EEF9FF]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="h-fit rounded-[2rem] border border-[#379CD6]/15 bg-[#F7FCFF] p-6 lg:sticky lg:top-32">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#156B96]">
              FAQ Topics
            </p>

            <div className="mt-5 grid gap-2">
              {faqSections.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title
                    .toLowerCase()
                    .replaceAll(" ", "-")
                    .replaceAll(",", "")
                    .replaceAll("&", "and")}`}
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:text-[#8F1F36]"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-10">
            {faqSections.map((section) => (
              <section
                key={section.title}
                id={section.title
                  .toLowerCase()
                  .replaceAll(" ", "-")
                  .replaceAll(",", "")
                  .replaceAll("&", "and")}
                className="scroll-mt-32"
              >
                <div className="mb-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                    {section.title}
                  </p>
                </div>

                <div className="grid gap-4">
                  {section.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#379CD6]/25"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                        <h2 className="text-lg font-bold text-slate-950">
                          {item.question}
                        </h2>

                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7FCFF] text-sm font-bold text-[#156B96] transition group-open:rotate-45">
                          +
                        </span>
                      </summary>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#8F1F36] p-8 text-white shadow-xl shadow-slate-200/70 lg:p-12">
          <h2 className="max-w-3xl text-3xl font-bold sm:text-5xl">
            Still have a question?
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">
            Send us a message and we will guide you to the right academic
            support option for your learner.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-[#EEF9FF]"
            >
              Contact Alkebula
            </Link>

            <Link
              href="/educators"
              className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}