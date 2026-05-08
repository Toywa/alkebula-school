import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmails } from "@/lib/email";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function parseTimeRange(time: string) {
  if (!time) {
    return {
      startTime: null,
      endTime: null,
    };
  }

  if (time.includes("-")) {
    const [start, end] = time.split("-").map((part) => part.trim());

    return {
      startTime: start || null,
      endTime: end || null,
    };
  }

  return {
    startTime: time,
    endTime: null,
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Booking route is alive",
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasEmailFrom: !!process.env.EMAIL_FROM,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const {
      parentEmail,
      tutorEmail,
      studentName,
      subject,
      curriculum,
      date,
      time,
      slotId,
    } = body;

    if (!parentEmail || !tutorEmail || !studentName || !subject || !date || !time) {
      return NextResponse.json(
        { error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const normalizedTutorEmail = String(tutorEmail).toLowerCase().trim();

    const { data: tutorProfile, error: tutorError } = await supabase
      .from("educator_directory")
      .select("email,hourly_rate")
      .eq("email", normalizedTutorEmail)
      .eq("approval_status", "approved")
      .eq("is_public", true)
      .single();

    if (tutorError || !tutorProfile) {
      return NextResponse.json(
        { error: "Tutor is not approved or is not publicly available." },
        { status: 400 }
      );
    }

    const hourlyRate = Number(tutorProfile.hourly_rate || 0);
    const tutorAmountDue = hourlyRate * 0.7;
    const { startTime, endTime } = parseTimeRange(String(time));

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          parent_email: parentEmail,
          tutor_email: normalizedTutorEmail,
          student_name: studentName,
          subject,
          curriculum: curriculum || null,
          date,
          time,
          status: "booked",
          slot_id: slotId || null,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.error("Booking error:", bookingError);
      return NextResponse.json({ error: bookingError.message }, { status: 400 });
    }

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .insert([
        {
          tutor_email: normalizedTutorEmail,
          student_name: studentName,
          parent_email: parentEmail,
          subject,
          curriculum: curriculum || null,
          lesson_date: date,
          start_time: startTime,
          end_time: endTime,
          status: "upcoming",
          hourly_rate: hourlyRate,
          amount_due: tutorAmountDue,
          payment_status: "unpaid",
        },
      ])
      .select()
      .single();

    if (lessonError) {
      console.error("Lesson creation error:", lessonError);
      return NextResponse.json(
        {
          error:
            "Booking was created, but lesson record failed. Admin should review this booking.",
          booking,
          details: lessonError.message,
        },
        { status: 500 }
      );
    }

    if (slotId) {
      await supabase
        .from("tutor_availability_slots")
        .update({ is_booked: true })
        .eq("id", slotId);
    }

    const emailResult = await sendBookingEmails({
      parentEmail,
      tutorEmail: normalizedTutorEmail,
      studentName,
      subject,
      date,
      time,
    });

    return NextResponse.json({
      success: true,
      booking,
      lesson,
      emailResult,
    });
  } catch (err) {
    console.error("Server error:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}