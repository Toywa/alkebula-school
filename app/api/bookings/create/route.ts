import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = createAdminSupabaseClient();

    const {
      enquiryId,
      educatorId,
      parentName,
      parentEmail,
      parentPhone,
      studentName,
      subject,
      lessonMode,
      scheduledAt,
      durationMinutes,
      amountUsd,
    } = body;

    // 1. CREATE BOOKING
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          enquiry_id: enquiryId,
          educator_id: educatorId,
          parent_name: parentName,
          parent_email: parentEmail,
          parent_phone: parentPhone || null,
          student_name: studentName,
          subject,
          lesson_mode: lessonMode,
          scheduled_at: scheduledAt,
          duration_minutes: durationMinutes,
          status: "scheduled",
        },
      ])
      .select("*")
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { ok: false, error: bookingError?.message || "Booking failed" },
        { status: 500 }
      );
    }

    // 2. CREATE INVOICE
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert([
        {
          booking_id: booking.id,
          parent_email: parentEmail,
          amount_usd: amountUsd,
          status: "pending",
          due_date: dueDate.toISOString(),
        },
      ])
      .select("*")
      .single();

    // 🚨 IMPORTANT: FORCE ERROR TO SHOW
    if (invoiceError || !invoice) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVOICE FAILED: " + (invoiceError?.message || "Unknown error"),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      booking,
      invoice,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}