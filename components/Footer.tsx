import Link from "next/link";
import type { ReactNode } from "react";
import LiveActivityTicker from "@/components/LiveActivityTicker";

const programmeLinks = [
  {
    href: "/online-cambridge-igcse-tutors",
    label: "Cambridge IGCSE Tutors",
  },
  {
    href: "/edexcel-igcse-tutors",
    label: "Edexcel IGCSE Tutors",
  },
  {
    href: "/a-level-online-tutors",
    label: "A Level Online Tutors",
  },
  {
    href: "/ib-online-tutors",
    label: "IB Online Tutors",
  },
  {
    href: "/homeschool-support",
    label: "Homeschool Support",
  },
];

const exploreLinks = [
  {
    href: "/about",
    label: "About",
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
    href: "/educators",
    label: "Find Tutors",
  },
  {
    href: "/tutors/apply",
    label: "Apply as Tutor",
  },
];

const platformLinks = [
  {
    href: "/auth/sign-in",
    label: "Sign In",
  },
  {
    href: "/auth/sign-up",
    label: "Parent Sign Up",
  },
  {
    href: "/admin/resolutions",
    label: "Admin Login",
  },
  {
    href: "/admin/tutor-applications",
    label: "Tutor Applications",
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
    label: "Twitter / X",
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
    <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white">
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
      className="text-sm text-white/75 transition hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#8F1F36] text-white">
      <LiveActivityTicker />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <FooterHeading>Social</FooterHeading>

          <ul className="space-y-3">
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/75 transition hover:text-white"
                >
                  <span className="text-white">{item.icon}</span>
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
          <FooterHeading>Platform</FooterHeading>

          <ul className="space-y-3">
            {platformLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Legal</FooterHeading>

          <ul className="space-y-3">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 px-6 py-5 text-center text-xs text-white/65">
        © {new Date().getFullYear()} The Alkebula School. All rights reserved.
      </div>
    </footer>
  );
}
