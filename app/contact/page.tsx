export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <p className="text-slate-600 mb-8">
        We’re here to help. Reach out to us for admissions, tutor applications, or support.
      </p>

      <div className="space-y-4 text-lg">
        <p><strong>Email:</strong> admissions@alkebulaschool.com</p>
        <p><strong>Support:</strong> support@alkebulaschool.com</p>
        <p><strong>Tutors:</strong> tutors@alkebulaschool.com</p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>

        <form className="space-y-4">
          <input className="w-full border p-3 rounded-lg" placeholder="Your Name" />
          <input className="w-full border p-3 rounded-lg" placeholder="Email" />
          <textarea className="w-full border p-3 rounded-lg" placeholder="Message" rows={5}></textarea>
          <button className="bg-black text-white px-6 py-3 rounded-lg">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}