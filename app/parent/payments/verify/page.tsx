"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    verifyPayment();
  }, []);

  async function verifyPayment() {
    try {
      const params = new URLSearchParams(window.location.search);

      const reference = params.get("reference");

      if (!reference) {
        throw new Error("Missing payment reference.");
      }

      const response = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Payment verification failed.");
      }

      setSuccess(true);
      setMessage("Payment verified successfully.");
    } catch (err) {
      setSuccess(false);

      setMessage(
        err instanceof Error
          ? err.message
          : "Payment verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-2xl px-6 py-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            The Alkebula School
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            {loading
              ? "Verifying Payment"
              : success
              ? "Payment Successful"
              : "Payment Failed"}
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            {message}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/parent/bookings"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Return to Parent Dashboard
            </Link>

            <Link
              href="/tutors"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}