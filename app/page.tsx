import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock3, Globe, GraduationCap, Mail, MapPin, Menu, Phone, ShieldCheck, Star, Users } from 'lucide-react'
import SearchableEducators from '@/components/SearchableEducators'
import { curricula, testimonials } from '@/components/site-data'

const navItems = ['Home', 'About', 'Find Educator', 'Curricula', 'Become Educator', 'Contact']

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl space-y-3">
      <div className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</div>
      <h2 className="text-3xl md:text-5xl font-serif text-charcoal">{title}</h2>
      <p className="text-base leading-8 text-slate-600 md:text-lg">{text}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <main>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur">
        <div className="container-wrap flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-white shadow-soft">
              <ShieldCheck className="h-6 w-6 text-gold" />
            </div>
            <div>
              <div className="font-serif text-xl">The Alkebula School</div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Breaking Learning Barriers</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-slate-700 transition hover:text-gold">
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="#find-educator" className="rounded-2xl border border-gold/40 px-5 py-3 text-sm font-medium text-charcoal">Find an Educator</a>
            <a href="#become-educator" className="rounded-2xl bg-forest px-5 py-3 text-sm font-medium text-white">Apply as Educator</a>
          </div>

          <button className="md:hidden"><Menu className="h-6 w-6" /></button>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,167,94,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(31,61,43,0.35),transparent_25%)]" />
        <div className="container-wrap relative grid gap-12 py-20 md:grid-cols-2 md:py-28">
          <div className="space-y-8">
            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm">Premium homeschool education across Kenya</div>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-serif leading-tight md:text-7xl">Breaking Learning Barriers</h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                The Alkebula School connects families with exceptional educators for Cambridge, Edexcel, A-Level, and IB learning—delivered with structure, warmth, and academic excellence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#find-educator" className="btn-primary">Find an Educator</a>
              <a href="#become-educator" className="btn-secondary">Join as an Educator</a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Verified educators', 'Professionally curated'],
                ['International curricula', 'Cambridge, Edexcel, A-Level, IB'],
                ['Kenya-based presence', 'Upperhill, Nairobi'],
              ].map(([title, subtitle]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="text-lg font-semibold">{title}</div>
                  <div className="mt-2 text-sm text-slate-300">{subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
                <div className="flex items-center gap-3 border-b pb-5">
                  <div className="rounded-2xl bg-ivory p-3"><GraduationCap className="h-6 w-6 text-forest" /></div>
                  <div>
                    <div className="text-2xl font-serif text-charcoal">Find the right educator</div>
                    <div className="text-sm text-slate-500">Personalized homeschool support begins here</div>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  <input className="input" placeholder="Search subject, educator, or level" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select className="input"><option>Select curriculum</option><option>Cambridge</option><option>Edexcel</option><option>A-Level</option><option>IB</option></select>
                    <select className="input"><option>Select city</option><option>Nairobi</option><option>Mombasa</option><option>Kisumu</option><option>Nakuru</option></select>
                  </div>
                  <a href="#find-educator" className="flex h-12 items-center justify-center rounded-2xl bg-forest font-medium text-white">Search Educators</a>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: BookOpen, label: 'One-on-one learning' },
                    { icon: Users, label: 'Curated educators' },
                    { icon: Globe, label: 'Global-standard curricula' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl bg-slate-50 p-4 text-center">
                      <item.icon className="mx-auto h-5 w-5 text-gold" />
                      <div className="mt-2 text-sm font-medium text-slate-700">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container-wrap grid gap-6 py-8 md:grid-cols-4">
          {[
            [CheckCircle2, 'Verified Educators Only'],
            [BookOpen, 'International Curricula'],
            [Clock3, 'Flexible Learning Schedules'],
            [MapPin, 'Serving Families Across Kenya'],
          ].map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-ivory px-5 py-4">
              <Icon className="h-5 w-5 text-gold" />
              <span className="font-medium text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section-pad">
        <div className="container-wrap grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-8">
            <SectionTitle
              eyebrow="About"
              title="A premium homeschool platform built for serious learning"
              text="The Alkebula School is designed for families seeking structure, excellence, and personalized academic support. We connect students with accomplished educators across Cambridge, Edexcel, A-Level, and IB pathways."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Thoughtfully curated',
                  text: 'Every educator is selected for subject expertise, professionalism, and ability to teach with clarity and warmth.',
                },
                {
                  title: 'Built for outcomes',
                  text: 'From foundational years to advanced levels, our model supports confidence, consistency, and measurable progress.',
                },
              ].map((item) => (
                <div key={item.title} className="card p-6">
                  <h3 className="text-2xl font-serif">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ['Our mission', 'To make world-class education more accessible, personal, and effective for modern learners.'],
              ['Our approach', 'High standards, calm structure, and educators who know how to unlock student potential.'],
              ['Our location', 'Britam Tower, Junction of Kenya Road and Mara Road, Upperhill, Nairobi.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.75rem] border border-gold/20 bg-white p-6">
                <div className="text-2xl font-serif">{title}</div>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="find-educator" className="bg-white py-20">
        <div className="container-wrap">
          <SectionTitle
            eyebrow="Find Educator"
            title="Discover exceptional educators by subject, curriculum, and city"
            text="Explore our growing network of educators and match your child with the right academic guide."
          />
          <SearchableEducators />
        </div>
      </section>

      <section id="curricula" className="section-pad">
        <div className="container-wrap">
          <SectionTitle
            eyebrow="Curricula"
            title="International pathways, thoughtfully supported"
            text="Families can find specialist educators across internationally respected learning systems, with teaching aligned to each student’s stage and goals."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {curricula.map((item) => (
              <div key={item.name} className="card h-full p-8">
                <div className="inline-flex rounded-2xl bg-ivory p-3"><BookOpen className="h-6 w-6 text-gold" /></div>
                <h3 className="mt-4 text-3xl font-serif">{item.name}</h3>
                <p className="mt-4 leading-7 text-slate-600">{item.desc}</p>
                <button className="mt-4 inline-flex items-center gap-1 font-medium text-forest">Explore pathway <ChevronRight className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest py-20 text-white">
        <div className="container-wrap">
          <SectionTitle
            eyebrow="How it works"
            title="A simple path from search to success"
            text="We’ve made the process clear, direct, and parent-friendly—so families can focus on learning rather than logistics."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ['1', 'Search', 'Browse educators by curriculum, subject, and location to find the right fit.'],
              ['2', 'Choose', 'Review educator experience, specializations, and teaching style with confidence.'],
              ['3', 'Start learning', 'Book sessions and begin a structured, supportive learning journey.'],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-xl font-semibold text-charcoal">{step}</div>
                <h3 className="text-3xl font-serif">{title}</h3>
                <p className="mt-4 leading-7 text-slate-200">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="become-educator" className="bg-white py-20">
        <div className="container-wrap grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div className="space-y-6">
            <SectionTitle
              eyebrow="Become Educator"
              title="Join a premium network of exceptional educators"
              text="If you teach Cambridge, Edexcel, A-Level, or IB with excellence and intention, we’d love to hear from you."
            />
            <div className="space-y-4">
              {[
                'Set your professional rates',
                'Teach motivated students and families',
                'Build visibility through a premium academic platform',
                'Work within a trusted and carefully positioned brand',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-ivory p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-gold" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-ivory p-8">
            <h3 className="text-3xl font-serif">Educator application</h3>
            <p className="mt-3 text-slate-600">Share your background and we’ll review your application.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="input" placeholder="Full name" />
              <input className="input" placeholder="Email address" />
              <input className="input" placeholder="Primary subject" />
              <input className="input" placeholder="Years of experience" />
              <input className="input md:col-span-2" placeholder="Curriculum expertise" />
              <textarea className="textarea md:col-span-2" placeholder="Tell us about your teaching background" />
            </div>
            <button className="btn-primary mt-6 w-full bg-forest text-white">Submit Application</button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wrap">
          <SectionTitle
            eyebrow="Testimonials"
            title="What families are saying"
            text="Built on trust, calm communication, and a genuine commitment to student progress."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.author} className="card p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-lg leading-8 text-slate-700">“{item.quote}”</p>
                <div className="mt-5 font-medium text-slate-500">{item.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-ink py-20 text-white">
        <div className="container-wrap grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <SectionTitle
              eyebrow="Contact"
              title="Speak with our team"
              text="Whether you’re looking for an educator or interested in joining our network, we’d be glad to hear from you."
            />
            <div className="space-y-4 text-slate-200">
              <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-gold" /><span>Britam Tower, Junction of Kenya Road and Mara Road, Upperhill, Nairobi</span></div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-gold" /><span>info@alkebulaschool.com</span></div>
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-gold" /><span>+254 728 866 097</span></div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input md:col-span-1" placeholder="Full name" />
              <input className="input md:col-span-1" placeholder="Email address" />
              <input className="input md:col-span-2" placeholder="Subject" />
              <textarea className="textarea md:col-span-2" placeholder="Your message" />
            </div>
            <button className="btn-primary mt-6">Send Message</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0b1220] text-slate-300">
        <div className="container-wrap grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="text-2xl font-serif text-white">The Alkebula School</div>
            <p className="mt-3 max-w-md leading-7 text-slate-400">
              Premium homeschool education support for families seeking structure, academic excellence, and exceptional educators.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white">Quick Links</div>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="transition hover:text-gold">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">Contact</div>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div>info@alkebulaschool.com</div>
              <div>+254 728 866 097</div>
              <div>Upperhill, Nairobi</div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-sm text-slate-500">
          © 2026 The Alkebula School. All rights reserved.
        </div>
      </footer>

      <a href="#find-educator" className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-medium text-charcoal shadow-xl transition hover:scale-[1.02]">
        Find an Educator <ArrowRight className="h-4 w-4" />
      </a>
    </main>
  )
}
