export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-700">
            Contact The Alkebula School
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Speak to us about tutoring, admissions, or academic support.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Whether you are a parent, student, tutor, or education partner, our
            team is ready to help you find the right learning pathway.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl lg:col-span-1">
            <h2 className="text-2xl font-bold text-amber-300">
              Contact Details
            </h2>

            <div className="mt-8 space-y-6 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-white">Admissions</p>
                <a
                  href="mailto:admissions@alkebulaschool.com"
                  className="hover:text-amber-200"
                >
                  admissions@alkebulaschool.com
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">Support</p>
                <a
                  href="mailto:support@alkebulaschool.com"
                  className="hover:text-amber-200"
                >
                  support@alkebulaschool.com
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">Tutor Applications</p>
                <a
                  href="mailto:tutors@alkebulaschool.com"
                  className="hover:text-amber-200"
                >
                  tutors@alkebulaschool.com
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">WhatsApp / Phone</p>
                <a
                  href="https://wa.me/254728866097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200"
                >
                  +254 728 866 097
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">Office Location</p>
                <p>
                  Britam Tower, 24th Floor,
                  <br />
                  Upperhill, Nairobi, Kenya
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/254728866097"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200"
              >
                Chat on WhatsApp
              </a>

              <a
                href="https://www.facebook.com/AlkebulaSchool/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:border-amber-200 hover:text-amber-200"
              >
                Facebook
              </a>

              <a
                href="https://www.linkedin.com/company/alkebulaschool"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold hover:border-amber-200 hover:text-amber-200"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-950">
              Send us a message
            </h2>
            <p className="mt-3 text-slate-600">
              Tell us what you need help with, and we will guide you to the
              right team.
            </p>

            <form className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                  placeholder="Full name"
                />
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                  placeholder="Email address"
                  type="email"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                  placeholder="Phone / WhatsApp"
                />
                <select className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500">
                  <option>Reason for enquiry</option>
                  <option>Admissions</option>
                  <option>Parent enquiry</option>
                  <option>Student support</option>
                  <option>Tutor application</option>
                  <option>Partnership</option>
                  <option>Technical support</option>
                </select>
              </div>

              <textarea
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
                placeholder="How can we help?"
                rows={6}
              />

              <button className="w-fit rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white hover:bg-amber-400 hover:text-slate-950">
                Send Message
              </button>
            </form>

            <p className="mt-5 text-xs text-slate-500">
              By submitting this form, you agree that The Alkebula School may
              contact you regarding your enquiry.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}