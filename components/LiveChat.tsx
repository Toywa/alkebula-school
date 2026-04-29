"use client";

import { useState } from "react";

export default function LiveChat() {
  const [open, setOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    "Hello The Alkebula School, I would like to enquire about your tutoring and learning support services."
  );

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="w-80 rounded-2xl border border-amber-200/30 bg-slate-950 p-5 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-amber-300">
              The Alkebula School
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Need help with admissions, tutoring, bookings, or curriculum
              guidance? Choose how you would like to chat with us.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href={`https://wa.me/254728866097?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-600"
              >
                Chat on WhatsApp
              </a>

              <button
                type="button"
                className="w-full rounded-xl border border-amber-200/40 px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-amber-200 hover:text-slate-950"
                onClick={() =>
                  alert("AI chatbot integration will be connected next.")
                }
              >
                Ask AI Assistant
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-full bg-amber-300 px-5 py-4 font-bold text-slate-950 shadow-xl hover:bg-amber-200"
        >
          {open ? "Close Chat" : "Live Chat"}
        </button>
      </div>
    </>
  );
}