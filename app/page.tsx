"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [form, setForm] = useState({
    parent_name: "",
    student_name: "",
    email: "",
    phone: "",
    curriculum: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/parent-enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setForm({
        parent_name: "",
        student_name: "",
        email: "",
        phone: "",
        curriculum: "",
        message: "",
      });
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Alkebula School"
            width={140}
            height={140}
          />
        </div>

        <h1 className="mt-6 text-5xl font-bold">
          The Alkebula School
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Extraordinary Learning. Proven Results.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/educators"
            className="rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold"
          >
            Find a Tutor
          </Link>

          <a
            href="#enquiry"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
          >
            Make Enquiry
          </a>
        </div>
      </section>

      {/* CURRICULA */}
      <section className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold">
          International Curricula
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <Image src="/cambridge.png" alt="Cambridge" width={180} height={80} />
          <Image src="/edexcel.png" alt="Edexcel" width={180} height={80} />
          <Image src="/ib.png" alt="IB" width={180} height={80} />
        </div>
      </section>

      {/* CTA FORM */}
      <section
        id="enquiry"
        className="mx-auto max-w-3xl px-6 py-16"
      >
        <h2 className="text-3xl font-semibold text-center">
          Start Your Child’s Learning Journey
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">

          <input
            placeholder="Parent Name"
            value={form.parent_name}
            onChange={(e) =>
              setForm({ ...form, parent_name: e.target.value })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            placeholder="Student Name"
            value={form.student_name}
            onChange={(e) =>
              setForm({ ...form, student_name: e.target.value })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            placeholder="Phone (+254...)"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            value={form.curriculum}
            onChange={(e) =>
              setForm({ ...form, curriculum: e.target.value })
            }
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Curriculum</option>
            <option>Cambridge</option>
            <option>Edexcel</option>
            <option>IB</option>
          </select>

          <textarea
            placeholder="Tell us what you need..."
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-lg py-3 font-semibold"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>

          {success && (
            <p className="text-green-600 text-center">
              Enquiry submitted successfully.
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Or WhatsApp us directly:{" "}
          <a
            href="https://wa.me/254728866097"
            className="text-green-600 font-semibold"
          >
            +254 728 866 097
          </a>
        </div>
      </section>
    </main>
  );
}