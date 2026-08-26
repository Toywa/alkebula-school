import Link from "next/link";
import type { ReactNode } from "react";
import LiveActivityTicker from "@/components/LiveActivityTicker";

const programmeLinks = [
  {
    href: "/exam-revision",
    label: "Exam Revision Hub",
  },
  {
    href: "/exam-revision/cambridge-igcse-november-2026",
    label: "Cambridge IGCSE Revision",
  },
  {
    href: "/exam-revision/edexcel-igcse-november-2026",
    label: "Edexcel IGCSE Revision",
  },
  {
    href: "/exam-revision/cambridge-a-level-november-2026",
    label: "Cambridge A Level Revision",
  },
  {
    href: "/exam-revision/edexcel-ial-october-2026",
    label: "Edexcel IAL Revision",
  },
  {
    href: "/exam-revision/ib-diploma-november-2026",
    label: "IB Diploma Revision",
  },
  {
    href: "/exam-revision/cambridge-checkpoint-october-2026",
    label: "Cambridge Checkpoint",
  },
  {
    href: "/homeschool-support",
    label: "Homeschool Support",
  },
];

const exploreLinks = [
  {
    href: "/about",
    label: "About Alkebula",
  },
  {
    href: "/educators",
    label: "Find Tutors",
  },
  {
    href: "/get-matched",
    label: "Get Matched",
  },
  {
    href: "/testimonials",
    label: "Parent Testimonials",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/tutors/apply",
    label: "Apply as Tutor",
  },
];

const parentLinks = [
  {
    href: "/auth/sign-up",
    label: "Parent Sign Up",
  },
  {
    href: "/auth/sign-in",
    label: "Parent Sign In",
  },
  {
    href: "/get-matched",
    label: "Request Tutor Matching",
  },
  {
    href: "/exam-revision",
    label: "View Revision Pages",
  },
  {
    href: "/homeschool-support",
    label: "Homeschool Support",
  },
];

const platformLinks = [
  {
    href: "/auth/sign-in",
    label: "Sign In",
  },
  {
    href: "/admin/resolutions",
    label: "Admin Login",
  },
  {
    href: "/admin/tutor-applications",
    label: "Tutor Applications",
  },
  {
    href: "/educator/dashboard",
    label: "Educator Dashboard",
  },
];

const legalLinks = [
  {
    href: "/terms",
    label: "Terms & Conditions",
  },
  {
    href: "/refund-policy",
    label: "Refund Policy",
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
  },
  {
    href: "/legal/code-of-conduct",
    label: "Code of Conduct",
  },
  {
    href: "/legal/tutor-terms",
    label: "Tutor Terms",
  },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/AlkebulaSchool/",
    label: "Facebook",
    icon: (
      <svg width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M9 8h2.5l.5-2H9V4.5c0-.6.2-1 1-1h1V1.1C10.8 1 10 1 9.3 1 7.6 1 6.5 2 6.5 4v2H4v2h2.5v6H9V8z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/alkebulaschool",
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M2 2h3v12H2zM3.5 0C2.7 0 2 .7 2 1.5S2.7 3 3.5 3 5 2.3 5 1.5 4.3 0 3.5 0zM6 5h3v1.5c.4-.8 1.5-1.5 3-1.5 2.5 0 3 1.5 3 3.5V14h-3v-4.5c0-1-.2-2-1.5-2S9 8.5 9 9.5V14H6z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/alkebulaschool",
    label: "X",
    icon: (
      <svg width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M9.6 6.8 15.5 0h-1.4L9 5.9 4.9 0H0l6.2 8.9L0 16h1.4l5.4-6.2L11.1 16H16L9.6 6.8Zm-1.9 2.2-.6-.9-5-7h2.1l4 5.7.6.9 5.2 7.4h-2.1L7.7 9Z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@alkebulaschool",
    label: "TikTok",
    icon: (
      <svg width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M12.7 3.2A4.5 4.5 0 0 1 10 1.8 4.5 4.5 0 0 1 8.9 0H6.4v10.3a2.3 2.3 0 1 1-1.6-2.2V5.5A4.9 4.9 0 1 0 9 10.3V5.1a7 7 0 0 0 3.7 1.1V3.2Z" />
      </svg>
    ),
  },
];

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#8F1F36]">
      {children}
    </h4>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-600 transition hover:text-[#8F1F36]"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-[#FFFDFB] text-slate-900">
      <LiveActivityTicker />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8F1F36]">
              The Alkebula School
            </p>

            <h2 className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Premium tutoring for international-curriculum learners.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Structured online academic support for Cambridge, Edexcel, A
              Level, IB, Checkpoint, Common Entrance and homeschool pathways —
              with guided tutor matching available for parents who need help
              choosing.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/get-matched"
                className="inline-flex justify-center rounded-xl bg-[#8F1F36] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]"
              >
                Get Matched With a Tutor
              </Link>

              <Link
                href="/exam-revision"
                className="inline-flex justify-center rounded-xl border border-[#8F1F36]/15 bg-[#FFF5F7] px-6 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-white"
              >
                View Revision Pages
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF5F7] p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8F1F36]">
              Current Focus
            </p>

            <p className="mt-3 text-lg font-bold text-slate-950">
              October/November 2026 revision support
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Focused support for learners preparing for Cambridge, Edexcel,
              A Level, IB and Checkpoint exam windows, with longer-term planning
              available for January and May/June sessions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <FooterHeading>Social</FooterHeading>

          <ul className="space-y-3">
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-medium text-slate-600 transition hover:text-[#8F1F36]"
                >
                  <span className="text-[#8F1F36]">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Programmes</FooterHeading>

          <ul className="space-y-3">
            {programmeLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Explore</FooterHeading>

          <ul className="space-y-3">
            {exploreLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Parents</FooterHeading>

          <ul className="space-y-3">
            {parentLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Platform & Legal</FooterHeading>

          <ul className="space-y-3">
            {platformLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}

            {legalLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} The Alkebula School. All rights
            reserved.
          </p>

          <p>
            International curriculum support for learners in school, homeschool
            and private-candidate pathways.
          </p>
        </div>
      </section>
    </footer>
  );
}