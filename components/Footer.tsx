import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-200/20 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-amber-300">
            The Alkebula School
          </h3>
          <p className="mt-4 text-sm text-slate-300">
            Extraordinary Learning. Proven Results.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Premium global tutoring, academic support, and structured learning
            for ambitious families.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
            Explore
          </h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link href="/about" className="hover:text-amber-200">About</Link></li>
            <li><Link href="/faq" className="hover:text-amber-200">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-amber-200">Contact</Link></li>
            <li><Link href="/tutors" className="hover:text-amber-200">Tutors</Link></li>
            <li><Link href="/tutors/may-availability" className="hover:text-amber-200">May Availability</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
            Platform
          </h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><Link href="/admin/resolutions" className="hover:text-amber-200">Admin Login</Link></li>
            <li><Link href="/admin/tutor-applications" className="hover:text-amber-200">Tutor Applications</Link></li>
          </ul>
        </div>

        {/* Premium Legal + Social Card */}
        <div className="rounded-2xl border border-amber-200/15 bg-white/5 p-5 shadow-xl shadow-black/20">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            
            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link href="/terms" className="hover:text-amber-200">Terms & Conditions</Link></li>
                <li><Link href="/refund-policy" className="hover:text-amber-200">Refund Policy</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-amber-200">Privacy Policy</Link></li>
                <li><Link href="/code-of-conduct" className="hover:text-amber-200">Code of Conduct</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-200">
                Social
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">

                {/* Facebook */}
                <li>
                  <a
                    href="https://www.facebook.com/AlkebulaSchool/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-amber-200"
                  >
                    <svg width="16" height="16" fill="currentColor">
                      <path d="M9 8h2.5l.5-2H9V4.5c0-.6.2-1 1-1h1V1.1C10.8 1 10 1 9.3 1 7.6 1 6.5 2 6.5 4v2H4v2h2.5v6H9V8z"/>
                    </svg>
                    Facebook
                  </a>
                </li>

                {/* LinkedIn */}
                <li>
                  <a
                    href="https://www.linkedin.com/company/alkebulaschool"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-amber-200"
                  >
                    <svg width="16" height="16" fill="currentColor">
                      <path d="M2 2h3v12H2zM3.5 0C2.7 0 2 .7 2 1.5S2.7 3 3.5 3 5 2.3 5 1.5 4.3 0 3.5 0zM6 5h3v1.5c.4-.8 1.5-1.5 3-1.5 2.5 0 3 1.5 3 3.5V14h-3v-4.5c0-1-.2-2-1.5-2S9 8.5 9 9.5V14H6z"/>
                    </svg>
                    LinkedIn
                  </a>
                </li>

                {/* Twitter */}
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-amber-200"
                  >
                    <svg width="16" height="16" fill="currentColor">
                      <path d="M16 3c-.6.3-1.2.5-1.8.6.6-.4 1-1 1.2-1.8-.6.4-1.3.7-2 .9C12.8 2 12 1.5 11 1.5c-2 0-3.3 2-2.8 3.9-2.4-.1-4.5-1.3-6-3.1-.8 1.4-.4 3.2 1 4.1-.5 0-1-.2-1.4-.4 0 1.5 1 2.9 2.5 3.2-.5.1-1 .2-1.5.1.4 1.3 1.7 2.3 3.2 2.3-1.2 1-2.7 1.5-4.3 1.3C2.2 14 3.8 14.5 5.5 14.5c6.6 0 10.3-5.5 10-10.5.7-.5 1.2-1.1 1.5-2z"/>
                    </svg>
                    Twitter / X
                  </a>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} The Alkebula School. All rights reserved.
      </div>
    </footer>
  );
}