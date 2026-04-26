import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">The Alkebula School</h3>
          <p className="mt-4 text-sm text-slate-400">
            Extraordinary Learning. Proven Results.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Explore</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/tutors">Tutors</Link></li>
            <li><Link href="/tutors/may-availability">May Availability</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Platform</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/admin/resolutions">Admin Login</Link></li>
            <li><Link href="/admin/tutor-applications">Tutor Applications</Link></li>
          </ul>

          <h4 className="mb-3 mt-6 font-semibold">Legal</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Newsletter</h4>
          <p className="mb-3 text-sm text-slate-400">
            Stay close to admissions, tutor openings, and booking periods.
          </p>
          <input
            className="mb-2 w-full rounded p-2 text-black"
            placeholder="Your email"
          />
          <button className="rounded bg-white px-4 py-2 text-black">
            Subscribe
          </button>

          <h4 className="mb-3 mt-6 font-semibold">Follow</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="pb-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} The Alkebula School
      </div>
    </footer>
  );
}