"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "ai">("menu");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to The Alkebula School. Before we begin, may I know your name?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadStep, setLeadStep] = useState<"name" | "contact" | "done">("name");
  const [lead, setLead] = useState({
    name: "",
    contact: "",
  });

  const whatsappMessage = encodeURIComponent(
    "Hello The Alkebula School, I would like to enquire about your tutoring and learning support services."
  );

  async function saveLead(updatedLead: { name: string; contact: string }) {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedLead.name,
          email: updatedLead.contact,
          message: "Chat initiated from AI live chat widget",
        }),
      });
    } catch (error) {
      console.error("Lead capture failed:", error);
    }
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    if (leadStep === "name") {
      setLead((prev) => ({ ...prev, name: trimmed }));
      setLeadStep("contact");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you. Please share your email or WhatsApp number so our team can assist you better.",
        },
      ]);

      return;
    }

    if (leadStep === "contact") {
      const updatedLead = {
        ...lead,
        contact: trimmed,
      };

      setLead(updatedLead);
      setLeadStep("done");

      await saveLead(updatedLead);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you. How can I assist you today regarding tutoring, admissions, curriculum, or academic support?",
        },
      ]);

      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "I am unable to respond right now. Please contact us on WhatsApp.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I am unable to respond right now. Please contact us on WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function openAiChat() {
    setMode("ai");

    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome to The Alkebula School. Before we begin, may I know your name?",
        },
      ]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[22rem] overflow-hidden rounded-2xl border border-amber-200/30 bg-slate-950 text-white shadow-2xl">
          <div className="border-b border-white/10 bg-white/5 p-4">
            <h3 className="font-bold text-amber-300">The Alkebula School</h3>
            <p className="text-xs text-slate-400">
              Premium learning support, admissions and tutoring guidance.
            </p>
          </div>

          {mode === "menu" ? (
            <div className="p-5">
              <p className="text-sm text-slate-300">
                Choose how you would like to chat with us.
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
                  onClick={openAiChat}
                  className="w-full rounded-xl border border-amber-200/40 px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-amber-200 hover:text-slate-950"
                >
                  Ask AI Assistant
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="h-80 space-y-3 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl bg-amber-300 px-3 py-2 text-sm text-slate-950"
                        : "mr-auto max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-slate-100"
                    }
                  >
                    {message.content}
                  </div>
                ))}

                {loading && (
                  <div className="mr-auto max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-slate-300">
                    Typing...
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-3">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                    placeholder={
                      leadStep === "name"
                        ? "Your name..."
                        : leadStep === "contact"
                        ? "Email or WhatsApp..."
                        : "Type your question..."
                    }
                    className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2 text-sm text-slate-950 outline-none"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading}
                    className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-200 disabled:opacity-60"
                  >
                    Send
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMode("menu")}
                  className="mt-3 text-xs text-slate-400 hover:text-amber-200"
                >
                  Back to options
                </button>
              </div>
            </div>
          )}
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
  );
}