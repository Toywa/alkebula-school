export default function FAQPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Frequently Asked Questions</h1>

      <div className="space-y-8">

        <div>
          <h2 className="font-semibold text-xl">What curriculum do you offer?</h2>
          <p className="text-slate-600">Cambridge, Edexcel, A-Level and IB.</p>
        </div>

        <div>
          <h2 className="font-semibold text-xl">How are tutors selected?</h2>
          <p className="text-slate-600">
            Tutors go through a strict verification process including CV review,
            interviews, and qualification checks.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl">Can I choose my tutor?</h2>
          <p className="text-slate-600">
            Yes. You can browse tutors and select based on subject, experience, and availability.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl">How are lessons booked?</h2>
          <p className="text-slate-600">
            Simply select a tutor, choose an available slot, and confirm your booking online.
          </p>
        </div>

      </div>
    </main>
  );
}