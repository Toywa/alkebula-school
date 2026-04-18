import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-800"
        >
          The Alkebula School
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Sign In
          </Link>

          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Create Account
          </Link>
        </nav>
      </div>
    </header>
  );
}