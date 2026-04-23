import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        <div>
          <h3 className="font-bold text-lg mb-4">The Alkebula School</h3>
          <p className="text-slate-400 text-sm">
            Extraordinary Learning. Proven Results.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <input
            className="w-full p-2 rounded text-black mb-2"
            placeholder="Your email"
          />
          <button className="bg-white text-black px-4 py-2 rounded">
            Subscribe
          </button>
        </div>

      </div>

      <div className="text-center text-slate-500 text-sm pb-6">
        © {new Date().getFullYear()} The Alkebula School
      </div>
    </footer>
  );
}