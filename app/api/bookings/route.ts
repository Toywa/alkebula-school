import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmails } from "@/lib/email";

type BookingPayload = {
  parent_name: string;
  parent_email?: string;
  parent_phone?: string;
  student_name: string;
  curriculum?: string;
  subject?: string;
  class_level?: string;
  educator_id: string;
  slot_id: string;
  date: string;
  start_time: string;
  end_time: string;
  timezone?: string;
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Bookings route is alive",
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingPayload;

    if (
      !body.parent_name?.trim() ||
      !body.student_name?.trim() ||
      !body.educator_id?.trim() ||
      !body.slot_id?.trim() ||
      !body.date?.trim() ||
      !body.start_time?.trim() ||
      !body.end_time?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // ✅ 1. Validate slot
    const { data: slot, error: slotError } = await supabase
      .from("availability_slots")
      .select("id, status")
      .eq("id", body.slot_id)
      .single();

    if (slotError || !slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.status !== "available") {
      return NextResponse.json(
        { error: "This slot is no longer available" },
        { status: 409 }
      );
    }

    // ✅ 2. Validate educator + APPROVAL LOCK
    const { data: educator, error: educatorError } = await supabase
      .from("educator_directory")
      .select(
        "id, full_name, hourly_rate, email, approval_status, is_public"
      )
      .eq("id", body.educator_id)
      .single();

    if (educatorError || !educator) {
      return NextResponse.json(
        { error: "Educator not found" },
        { status: 404 }
      );
    }

    // 🔒 CRITICAL PROTECTION LAYER
    if (
      educator.approval_status !== "approved" ||
      educator.is_public !== true
    ) {
      return NextResponse.json(
        {
          error:
            "This tutor is not approved for bookings yet.",
        },
        { status: 403 }
      );
    }

    const hourlyRateUsd = Number(educator.hourly_rate || 0);

    // ✅ 3. Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("lesson_bookings")
      .insert({
        educator_id: body.educator_id.trim(),
        slot_id: body.slot_id.trim(),
        parent_name: body.parent_name.trim(),
        parent_email: body.parent_email?.trim() || null,
        parent_phone: body.parent_phone?.trim() || null,
        student_name: body.student_name.trim(),
        curriculum: body.curriculum?.trim() || null,
        subject: body.subject?.trim() || null,
        class_level: body.class_level?.trim() || null,
        booking_date: body.date.trim(),
        start_time: body.start_time.trim(),
        end_time: body.end_time.trim(),
        timezone: body.timezone || "Africa/Nairobi",
        status: "pending",
        tutor_confirmation_status: "awaiting_confirmation",
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // ✅ 4. Lock slot
    await supabase
      .from("availability_slots")
      .update({ status: "booked" })
      .eq("id", body.slot_id);

    // ✅ 5. Create invoice
    const dueDate = `${body.date.trim()}T${body.start_time.trim()}`;

    await supabase.from("lesson_invoices").insert({
      booking_id: booking.id,
      educator_id: body.educator_id.trim(),
      parent_name: body.parent_name.trim(),
      parent_email: body.parent_email?.trim() || null,
      amount_usd: hourlyRateUsd,
      status: "pending",
      due_date: dueDate,
      timezone: body.timezone || "Africa/Nairobi",
    });

    // ✅ 6. Send emails
    const emailResult = await sendBookingEmails({
      parentEmail: body.parent_email?.trim() || "",
      tutorEmail: educator.email?.trim() || "",
      parentName: body.parent_name.trim(),
      tutorName: educator.full_name || "Tutor",
      studentName: body.student_name.trim(),
      subject: body.subject?.trim() || "General Lesson",
      curriculum: body.curriculum?.trim() || "",
      classLevel: body.class_level?.trim() || "",
      date: body.date.trim(),
      time: `${body.start_time.trim()} - ${body.end_time.trim()}`,
    });

    if (!emailResult.success) {
      console.error("Booking email failed:", emailResult);
    }

    // ✅ 7. Notification
    const tutorIdentifier = educator.full_name || body.educator_id.trim();

    await supabase.from("notifications").insert({
      user_type: "educator",
      user_identifier: tutorIdentifier,
      notification_type: "booking_created",
      title: "New booking received",
      message: `${body.parent_name.trim()} booked a lesson for ${body.student_name.trim()} on ${body.date.trim()} from ${body.start_time.trim()} to ${body.end_time.trim()}.`,
      status: "pending",
      related_booking_id: booking.id,
      timezone: body.timezone || "Africa/Nairobi",
    });

    return NextResponse.json({
      success: true,
      booking,
      invoice_amount_usd: hourlyRateUsd,
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    );
  }
}