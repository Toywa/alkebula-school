import Link from "next/link";

const contactMethods = [
  {
    label: "Admissions",
    value: "admissions@alkebulaschool.com",
    href: "mailto:admissions@alkebulaschool.com",
  },
  {
    label: "Parent & Learner Support",
    value: "support@alkebulaschool.com",
    href: "mailto:support@alkebulaschool.com",
  },
  {
    label: "Tutor Applications",
    value: "tutors@alkebulaschool.com",
    href: "mailto:tutors@alkebulaschool.com",
  },
  {
    label: "WhatsApp / Phone",
    value: "+254 728 866 097",
    href: "https://wa.me/254728866097",
  },
];

const quickLinks = [
  {
    label: "Parent Sign Up",
    href: "/auth/sign-up",
  },
  {
    label: "Find Tutors",
    href: "/educators",
  },
  {
    label: "Apply as Tutor",
    href: "/tutors/apply",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#FFF5F7,transparent_24%),radial-gradient(circle_at_top_right,#EEF9FF,transparent_34%),#FFFFFF]">
        <div className="absolute right-0 top-16 hidden h-80 w-80 rounded-full bg-[#EEF9FF] blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-72 w-72 rounded-full bg-[#FFF5F7] blur-3xl lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
              Contact The Alkebula School
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Speak to us about tutoring, admissions, or academic support.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Whether you are a parent, learner, tutor, or education partner,
              our team will help you find the right academic pathway with calm,
              clear guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] bg-[#8F1F36] p-8 text-white shadow-xl shadow-slate-200/70 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Direct Contact
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              We are ready to help.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/75">
              Reach the right desk directly, or send us a message and we will
              guide you to the best next step.
            </p>

            <div className="mt-8 space-y-5">
              {contactMethods.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                    {item.label}
                  </p>

                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="mt-2 block text-sm font-semibold text-white transition hover:text-[#DFF3FF]"
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                Office Location
              </p>

              <p className="mt-2 text-sm leading-7 text-white/85">
                Britam Tower, 24th Floor,
                <br />
                Upper Hill, Nairobi, Kenya
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/254728866097"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#8F1F36] transition hover:bg-[#EEF9FF]"
              >
                Chat on WhatsApp
              </a>

              <a
                href="https://www.facebook.com/AlkebulaSchool/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Facebook
              </a>

              <a
                href="https://www.linkedin.com/company/alkebulaschool"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                LinkedIn
              </a>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#379CD6]">
                Send a Message
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                Tell us what you need help with.
              </h2>

              <p className="mt-3 text-base leading-8 text-slate-600">
                Share a few details and we will guide you to the right team,
                tutor pathway, or academic support option.
              </p>
            </div>

            <form className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
                  placeholder="Full name"
                />

                <input
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
                  placeholder="Email address"
                  type="email"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
                  placeholder="Phone / WhatsApp"
                />

                <select className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15">
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
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#379CD6] focus:ring-2 focus:ring-[#379CD6]/15"
                placeholder="How can we help?"
                rows={6}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button className="w-fit rounded-xl bg-[#8F1F36] px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#6F1729]">
                  Send Message
                </button>

                <p className="text-xs leading-6 text-slate-500">
                  By submitting this form, you agree that The Alkebula School
                  may contact you regarding your enquiry.
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-3xl border border-[#379CD6]/20 bg-[#F7FCFF] p-6 transition hover:-translate-y-1 hover:bg-[#EEF9FF] hover:shadow-lg"
            >
              <p className="text-sm font-bold text-[#156B96]">{item.label}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Continue directly to the right section of the Alkebula platform.
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}