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

function money(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
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
      hourlyRate,
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
      .select("email,hourly_rate,subject_rates")
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

    const requestedHourlyRate = money(hourlyRate);
    const fallbackHourlyRate = money(tutorProfile.hourly_rate);
    const finalHourlyRate =
      requestedHourlyRate > 0 ? requestedHourlyRate : fallbackHourlyRate;

    if (finalHourlyRate <= 0) {
      return NextResponse.json(
        { error: "A valid hourly rate is required for this booking." },
        { status: 400 }
      );
    }

    const lessonAmount = finalHourlyRate;
    const platformCommission = lessonAmount * 0.3;
    const tutorPayoutAmount = lessonAmount * 0.7;

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
          slot_id: null,

          hourly_rate: finalHourlyRate,
          lesson_amount: lessonAmount,
          platform_commission: platformCommission,
          tutor_payout_amount: tutorPayoutAmount,
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

          hourly_rate: finalHourlyRate,
          amount_due: tutorPayoutAmount,
          lesson_amount: lessonAmount,
          platform_commission: platformCommission,
          tutor_payout_amount: tutorPayoutAmount,

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
        .update({
          is_booked: true,
          status: "booked",
        })
        .eq("id", slotId);
    }

    const emailResult = await sendBookingEmails({
  parentEmail,
  tutorEmail: normalizedTutorEmail,
  studentName,
  subject,
  curriculum,
  date,
  time,
  hourlyRate: finalHourlyRate,
  lessonAmount,
  platformCommission,
  tutorPayoutAmount,
});

    return NextResponse.json({
      success: true,
      booking,
      lesson,
      pricing: {
        hourlyRate: finalHourlyRate,
        lessonAmount,
        platformCommission,
        tutorPayoutAmount,
      },
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