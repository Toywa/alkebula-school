import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret || !signature) return false;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const isValid = verifyPaystackSignature(rawBody, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Paystack signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const payment = event.data;
    const reference = payment.reference;

    if (!reference) {
      return NextResponse.json({ received: true });
    }

    const supabase = getAdminClient();

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .select("*")
      .eq("paystack_reference", reference)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ received: true });
    }

    if (lesson.payment_status === "paid") {
      return NextResponse.json({ received: true, already_paid: true });
    }

    await supabase
      .from("tutor_lessons")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", lesson.id);

    return NextResponse.json({
      received: true,
      payment_status: "paid",
      reference,
    });
  } catch (error) {
    console.error("Paystack webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}