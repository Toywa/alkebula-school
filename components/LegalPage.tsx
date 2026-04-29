import Link from "next/link";
import { companyInfo, type LegalDocument } from "@/lib/legal-content";

type LegalPageProps = {
  document: LegalDocument;
};

export function LegalPage({ document }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
            {companyInfo.name}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            {document.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {document.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={document.pdfHref}
              download
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Download PDF
            </a>
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500"
            >
              Back to home
            </Link>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div>
              <span className="font-semibold text-slate-900">Effective date:</span>{" "}
              {document.effectiveDate}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Governing law:</span>{" "}
              {companyInfo.governingLaw}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Contact:</span>{" "}
              <a className="underline underline-offset-4" href={`mailto:${companyInfo.email}`}>
                {companyInfo.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Legal pages
          </p>
          <nav className="mt-4 grid gap-2 text-sm">
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-100" href="/terms">
              Terms and Conditions
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-100" href="/refund-policy">
              Refund Policy
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-100" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="rounded-2xl px-3 py-2 hover:bg-slate-100" href="/code-of-conduct">
              Code of Conduct
            </Link>
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Follow us</p>
            <div className="mt-2 flex flex-col gap-1">
              <a className="underline underline-offset-4" href={companyInfo.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a className="underline underline-offset-4" href={companyInfo.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="space-y-10">
            {document.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  {index + 1}. {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-slate-950 p-6 text-white">
            <h2 className="text-xl font-bold">Contact The Alkebula School</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              {companyInfo.address}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-200">
              <a href={`mailto:${companyInfo.email}`} className="underline underline-offset-4">
                {companyInfo.email}
              </a>
              <a href={`mailto:${companyInfo.accountsEmail}`} className="underline underline-offset-4">
                {companyInfo.accountsEmail}
              </a>
              <a href={`tel:${companyInfo.phone.replaceAll(" ", "")}`} className="underline underline-offset-4">
                {companyInfo.phone}
              </a>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
