import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.5-mini",
      input: [
        {
          role: "system",
          content:
            "You are The Alkebula School AI assistant. The Alkebula School is a premium global education system offering tutoring, academic support, admissions guidance, and structured learning support. Help parents, students, and tutors with questions about Cambridge IGCSE, Edexcel IGCSE, A Levels, IB, tutor applications, bookings, refunds, privacy, code of conduct, and general enquiries. Be warm, concise, professional, and reassuring. Do not promise guaranteed grades. For urgent, sensitive, payment, or account-specific issues, direct users to WhatsApp: +254728866097.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error:
          "The AI assistant is temporarily unavailable. Please contact us on WhatsApp: +254728866097.",
      },
      { status: 500 }
    );
  }
}