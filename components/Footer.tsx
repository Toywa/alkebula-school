import Link from "next/link";

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

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-200/20 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-amber-300">
            The Alkebula School
          </h3>

          <p className="mt-4 text-sm text-slate-300">
            Extraordinary Learning. Proven Results.
          </p>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            Premium global tutoring, academic support, and structured learning
            for ambitious families following Cambridge IGCSE, Edexcel IGCSE,
            A Levels, and IB pathways.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
            Programmes
          </h4>

          <ul className="space-y-3 text-sm text-slate-300">
            {programmeLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-amber-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
            Explore
          </h4>

          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <Link href="/about" className="hover:text-amber-200">
                About
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-amber-200">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/educators" className="hover:text-amber-200">
                Find Tutors
              </Link>
            </li>
            <li>
              <Link href="/tutors/apply" className="hover:text-amber-200">
                Apply as Tutor
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
            Platform
          </h4>

          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <Link href="/auth/sign-in" className="hover:text-amber-200">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/auth/sign-up" className="hover:text-amber-200">
                Parent Sign Up
              </Link>
            </li>
            <li>
              <Link href="/admin/resolutions" className="hover:text-amber-200">
                Admin Login
              </Link>
            </li>
            <li>
              <Link href="/admin/tutor-applications" className="hover:text-amber-200">
                Tutor Applications
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-200/15 bg-white/5 p-5 shadow-xl shadow-black/20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
                Legal
              </h4>

              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <Link href="/legal/terms" className="hover:text-amber-200">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/legal/refund-policy" className="hover:text-amber-200">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy-policy" className="hover:text-amber-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/code-of-conduct" className="hover:text-amber-200">
                    Code of Conduct
                  </Link>
                </li>
                <li>
                  <Link href="/legal/tutor-terms" className="hover:text-amber-200">
                    Tutor Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
                Social
              </h4>

              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <a
                    href="https://www.facebook.com/AlkebulaSchool/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-amber-200"
                  >
                    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M9 8h2.5l.5-2H9V4.5c0-.6.2-1 1-1h1V1.1C10.8 1 10 1 9.3 1 7.6 1 6.5 2 6.5 4v2H4v2h2.5v6H9V8z" />
                    </svg>
                    Facebook
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.linkedin.com/company/alkebulaschool"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-amber-200"
                  >
                    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M2 2h3v12H2zM3.5 0C2.7 0 2 .7 2 1.5S2.7 3 3.5 3 5 2.3 5 1.5 4.3 0 3.5 0zM6 5h3v1.5c.4-.8 1.5-1.5 3-1.5 2.5 0 3 1.5 3 3.5V14h-3v-4.5c0-1-.2-2-1.5-2S9 8.5 9 9.5V14H6z" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <li>
  <a
    href="https://x.com/alkebulaschool"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:text-amber-200"
  >
    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M9.6 6.8 15.5 0h-1.4L9 5.9 4.9 0H0l6.2 8.9L0 16h1.4l5.4-6.2L11.1 16H16L9.6 6.8Zm-1.9 2.2-.6-.9-5-7h2.1l4 5.7.6.9 5.2 7.4h-2.1L7.7 9Z" />
    </svg>
    Twitter / X
  </a>
</li>
<li>
  <a
    href="https://www.tiktok.com/@alkebulaschool"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:text-amber-200"
  >
    <svg width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12.7 3.2A4.5 4.5 0 0 1 10 1.8 4.5 4.5 0 0 1 8.9 0H6.4v10.3a2.3 2.3 0 1 1-1.6-2.2V5.5A4.9 4.9 0 1 0 9 10.3V5.1a7 7 0 0 0 3.7 1.1V3.2Z" />
    </svg>
    TikTok
  </a>
</li>

      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} The Alkebula School. All rights reserved.
      </div>
    </footer>
  );
}
