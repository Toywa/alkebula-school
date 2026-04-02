import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const enquiryId = body.enquiryId as string | undefined;
    const educatorId = body.educatorId as string | undefined;
    const parentName = body.parentName as string | undefined;
    const parentEmail = body.parentEmail as string | undefined;
    const parentPhone = body.parentPhone as string | undefined;
    const studentName = body.studentName as string | undefined;
    const subject = body.subject as string | undefined;
    const lessonMode = body.lessonMode as string | undefined;
    const scheduledAt = body.scheduledAt as string | undefined;
    const durationMinutes = Number(body.durationMinutes ?? 60);
    const amountUsd = Number(body.amountUsd ?? 0);

    if (!enquiryId) {
      return NextResponse.json(
        { ok: false, error: "Missing enquiryId." },
        { status: 400 }
      );
    }

    if (!educatorId) {
      return NextResponse.json(
        { ok: false, error: "Missing educatorId." },
        { status: 400 }
      );
    }

    if (!parentName || !parentName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Parent name is required." },
        { status: 400 }
      );
    }

    if (!parentEmail || !parentEmail.trim()) {
      return NextResponse.json(
        { ok: false, error: "Parent email is required." },
        { status: 400 }
      );
    }

    if (!studentName || !studentName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Student name is required." },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { ok: false, error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { ok: false, error: "Scheduled date/time is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(amountUsd) || amountUsd <= 0) {
      return NextResponse.json(
        { ok: false, error: "Amount in USD must be greater than 0." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

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
          lesson_mode: lessonMode || null,
          scheduled_at: scheduledAt,
          duration_minutes: durationMinutes,
          status: "scheduled",
        },
      ])
      .select("*")
      .single();

    if (bookingError) {
      return NextResponse.json(
        { ok: false, error: bookingError.message || "Failed to create booking." },
        { status: 500 }
      );
    }

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

    if (invoiceError) {
      return NextResponse.json(
        {
          ok: false,
          error: invoiceError.message || "Booking created but invoice creation failed.",
        },
        { status: 500 }
      );
    }

    const { error: enquiryStatusError } = await supabase
      .from("parent_enquiries")
      .update({ status: "booked" })
      .eq("id", enquiryId);

    if (enquiryStatusError) {
      return NextResponse.json(
        {
          ok: false,
          error:
            enquiryStatusError.message ||
            "Booking and invoice created, but failed to update enquiry status.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Booking and invoice created successfully.",
      booking,
      invoice,
    });
  } catch (error) {
    console.error("Create booking route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}