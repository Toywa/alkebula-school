export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-ivory p-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-gold">The Alkebula School</p>
        <h1 className="mt-4 text-5xl font-bold text-brand-charcoal">Supabase-ready platform scaffold</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          This starter organizes the public site, dashboards, auth guards, schema, and backend placeholders
          for the full education platform.
        </p>
      </div>
    </main>
  );
}
