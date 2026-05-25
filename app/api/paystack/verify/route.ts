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

function money(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function normalizeReference(value: unknown) {
  return String(value || "").trim();
}

function formatBookingTime(startTime?: string | null, endTime?: string | null) {
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  if (startTime) return startTime;
  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reference = normalizeReference(body.reference);

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
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
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

    if (!payment || payment.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          payment_status: payment?.status || "failed",
          reference,
        },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .select("*")
      .eq("paystack_reference", reference)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        {
          error:
            lessonError?.message ||
            "Lesson not found for this payment reference.",
        },
        { status: 404 }
      );
    }

    const officialAmount = money(lesson.lesson_amount || lesson.hourly_rate);
    const expectedPaystackAmount = Math.round(officialAmount * 100);
    const actualPaystackAmount = Number(payment.amount || 0);

    if (officialAmount <= 0) {
      return NextResponse.json(
        {
          error:
            "The linked lesson does not have a valid payable amount. Please contact admin.",
        },
        { status: 400 }
      );
    }

    if (actualPaystackAmount !== expectedPaystackAmount) {
      return NextResponse.json(
        {
          error:
            "Payment amount mismatch. The paid amount does not match the official lesson invoice amount.",
          expected: expectedPaystackAmount,
          received: actualPaystackAmount,
        },
        { status: 400 }
      );
    }

    if (lesson.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        payment_status: "paid",
        reference,
        lessonId: lesson.id,
        message: "Payment was already verified.",
      });
    }

    const paidAt = new Date().toISOString();

    const { error: lessonUpdateError } = await supabase
      .from("tutor_lessons")
      .update({
        payment_status: "paid",
        paid_at: paidAt,
      })
      .eq("id", lesson.id)
      .eq("paystack_reference", reference);

    if (lessonUpdateError) {
      return NextResponse.json(
        { error: lessonUpdateError.message },
        { status: 500 }
      );
    }

    const bookingTime = formatBookingTime(lesson.start_time, lesson.end_time);

    if (lesson.booking_id) {
      const { error: bookingUpdateError } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          paid_at: paidAt,
        })
        .eq("id", lesson.booking_id);

      if (bookingUpdateError) {
        console.error("Booking payment update error:", bookingUpdateError);
      }
    } else {
      const { error: bookingUpdateError } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          paid_at: paidAt,
        })
        .eq("parent_email", lesson.parent_email)
        .eq("tutor_email", lesson.tutor_email)
        .eq("student_name", lesson.student_name)
        .eq("subject", lesson.subject)
        .eq("date", lesson.lesson_date)
        .eq("time", bookingTime);

      if (bookingUpdateError) {
        console.error("Booking payment update error:", bookingUpdateError);
      }
    }

    return NextResponse.json({
      success: true,
      payment_status: payment.status,
      reference,
      lessonId: lesson.id,
      amount: officialAmount,
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