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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference." },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecret) {
      return NextResponse.json(
        { error: "Missing PAYSTACK_SECRET_KEY." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error: data.message || "Failed to verify payment.",
        },
        { status: 400 }
      );
    }

    const payment = data.data;

    if (payment.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          payment_status: payment.status,
        },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: lesson } = await supabase
      .from("tutor_lessons")
      .select("*")
      .eq("paystack_reference", reference)
      .single();

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found for payment reference." },
        { status: 404 }
      );
    }

    await supabase
      .from("tutor_lessons")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", lesson.id);

    await supabase
      .from("bookings")
      .update({
        paid_at: new Date().toISOString(),
      })
      .eq("id", lesson.booking_id || "");

    return NextResponse.json({
      success: true,
      payment_status: payment.status,
      reference,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Payment verification failed.",
      },
      { status: 500 }
    );
  }
}