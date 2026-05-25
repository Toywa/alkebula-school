import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmails } from "@/lib/email";

type SubjectRate = {
  curriculum_level?: string;
  curriculum?: string;
  subject?: string;
  hourly_rate?: number;
};

type TutorProfile = {
  email: string;
  hourly_rate: number | null;
  subject_rates: SubjectRate[] | null;
  subjects?: string[] | null;
  curricula?: string[] | null;
};

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

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function money(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
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

function resolveTutorRate({
  tutorProfile,
  requestedSubject,
  requestedCurriculum,
}: {
  tutorProfile: TutorProfile;
  requestedSubject: string;
  requestedCurriculum?: string | null;
}) {
  const subjectRates = Array.isArray(tutorProfile.subject_rates)
    ? tutorProfile.subject_rates
    : [];

  const normalizedSubject = requestedSubject.toLowerCase();
  const normalizedCurriculum = String(requestedCurriculum || "").toLowerCase();

  const exactRate = subjectRates.find((rate) => {
    const rateSubject = String(rate.subject || "").toLowerCase();
    const rateCurriculum = String(
      rate.curriculum_level || rate.curriculum || ""
    ).toLowerCase();

    return (
      rateSubject === normalizedSubject &&
      (!normalizedCurriculum || rateCurriculum === normalizedCurriculum)
    );
  });

  if (exactRate && money(exactRate.hourly_rate) > 0) {
    return money(exactRate.hourly_rate);
  }

  const subjectOnlyRate = subjectRates.find((rate) => {
    const rateSubject = String(rate.subject || "").toLowerCase();
    return rateSubject === normalizedSubject;
  });

  if (subjectOnlyRate && money(subjectOnlyRate.hourly_rate) > 0) {
    return money(subjectOnlyRate.hourly_rate);
  }

  const fallbackRate = money(tutorProfile.hourly_rate);

  if (fallbackRate > 0) {
    return fallbackRate;
  }

  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      message: "Booking route is alive.",
    });
  } catch {
    return NextResponse.json(
      { error: "Booking route health check failed." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "You must be signed in to book a lesson." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Invalid session. Please sign in again." },
        { status: 401 }
      );
    }

    const parentEmail = normalizeEmail(user.email);
    const body = await req.json();

    const tutorEmail = normalizeEmail(body.tutorEmail);
    const studentName = cleanText(body.studentName);
    const subject = cleanText(body.subject);
    const curriculum = cleanText(body.curriculum);
    const slotId = cleanText(body.slotId);

    if (!tutorEmail || !studentName || !subject || !slotId) {
      return NextResponse.json(
        { error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const { data: tutorProfile, error: tutorError } = await supabase
      .from("educator_directory")
      .select("email,hourly_rate,subject_rates,subjects,curricula")
      .eq("email", tutorEmail)
      .eq("approval_status", "approved")
      .eq("is_public", true)
      .single();

    if (tutorError || !tutorProfile) {
      return NextResponse.json(
        { error: "Tutor is not approved or is not publicly available." },
        { status: 400 }
      );
    }

    const { data: slot, error: slotError } = await supabase
      .from("tutor_availability_slots")
      .select("id,tutor_email,date,slot_date,start_time,end_time,is_booked,status")
      .eq("id", slotId)
      .eq("tutor_email", tutorEmail)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: "Selected availability slot was not found for this tutor." },
        { status: 400 }
      );
    }

    if (slot.is_booked || slot.status === "booked") {
      return NextResponse.json(
        { error: "This lesson slot has already been booked." },
        { status: 409 }
      );
    }

    const lessonDate = slot.date || slot.slot_date;
    const startTime = slot.start_time;
    const endTime = slot.end_time;

    if (!lessonDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Selected slot has invalid date or time details." },
        { status: 400 }
      );
    }

    const finalHourlyRate = resolveTutorRate({
      tutorProfile: tutorProfile as TutorProfile,
      requestedSubject: subject,
      requestedCurriculum: curriculum,
    });

    if (finalHourlyRate <= 0) {
      return NextResponse.json(
        { error: "A valid tutor hourly rate is required for this booking." },
        { status: 400 }
      );
    }

    const lessonAmount = finalHourlyRate;
    const platformCommission = Number((lessonAmount * 0.3).toFixed(2));
    const tutorPayoutAmount = Number((lessonAmount * 0.7).toFixed(2));
    const time = `${startTime}-${endTime}`;
    const parsedTime = parseTimeRange(time);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          parent_email: parentEmail,
          tutor_email: tutorEmail,
          student_name: studentName,
          subject,
          curriculum: curriculum || null,
          date: lessonDate,
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
          tutor_email: tutorEmail,
          student_name: studentName,
          parent_email: parentEmail,
          subject,
          curriculum: curriculum || null,
          lesson_date: lessonDate,
          start_time: parsedTime.startTime,
          end_time: parsedTime.endTime,
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

    const { error: slotUpdateError } = await supabase
      .from("tutor_availability_slots")
      .update({
        is_booked: true,
        status: "booked",
      })
      .eq("id", slotId)
      .eq("tutor_email", tutorEmail);

    if (slotUpdateError) {
      console.error("Slot update error:", slotUpdateError);
    }

    const emailResult = await sendBookingEmails({
      parentEmail,
      tutorEmail,
      studentName,
      subject,
      curriculum,
      date: lessonDate,
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