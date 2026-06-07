import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingEmails } from "@/lib/email";

type SubjectRate = {
  curriculum_level?: string | null;
  curriculum?: string | null;
  class_level?: string | null;
  subject?: string | null;
  hourly_rate?: number | string | null;
};

type BookingRequestBody = {
  tutorEmail?: string;
  studentName?: string;
  subject?: string;
  curriculum?: string;
  classLevel?: string;
  slotId?: string;
  parentTimezone?: string;
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
  return (email || "").trim().toLowerCase();
}

function normalizeText(value?: string | null) {
  return (value || "").trim();
}

function normalizeComparable(value?: string | null) {
  return normalizeText(value).toLowerCase();
}

function money(value: unknown) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function isValidTimeZone(timeZone: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function cleanTimeZone(value?: string | null, fallback = "UTC") {
  const candidate = normalizeText(value);

  if (candidate && isValidTimeZone(candidate)) {
    return candidate;
  }

  return fallback;
}

function getPackageCurriculumLabel(item: SubjectRate) {
  return item.curriculum_level || item.curriculum || "";
}

function getPackageClassLevel(item: SubjectRate) {
  return item.class_level || "";
}

function findMatchingSubjectPackage(
  subjectRates: SubjectRate[],
  selectedSubject: string,
  selectedCurriculum: string
) {
  const subject = normalizeComparable(selectedSubject);
  const curriculum = normalizeComparable(selectedCurriculum);

  return subjectRates.find((item) => {
    const packageSubject = normalizeComparable(item.subject);
    const packageCurriculum = normalizeComparable(getPackageCurriculumLabel(item));

    return packageSubject === subject && packageCurriculum === curriculum;
  });
}

function extractRpcMessage(errorMessage: string) {
  if (!errorMessage) return "Booking failed.";

  if (errorMessage.includes("already been booked")) {
    return "This time slot has already been booked. Please choose another available time.";
  }

  if (errorMessage.includes("overlapping")) {
    return "This tutor already has a lesson overlapping this time. Please choose another available time.";
  }

  if (errorMessage.includes("missing UTC")) {
    return "This slot is missing timezone-safe UTC data. Please choose another slot or ask the tutor to recreate availability.";
  }

  return errorMessage;
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

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in before booking a lesson." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Session expired. Please sign in again." },
        { status: 401 }
      );
    }

    const parentEmail = normalizeEmail(user.email);
    const body = (await req.json()) as BookingRequestBody;

    const tutorEmail = normalizeEmail(body.tutorEmail);
    const studentName = normalizeText(body.studentName);
    const subject = normalizeText(body.subject);
    const curriculum = normalizeText(body.curriculum);
    const classLevel = normalizeText(body.classLevel);
    const slotId = normalizeText(body.slotId);
    const parentTimezone = cleanTimeZone(body.parentTimezone, "UTC");

    if (
      !tutorEmail ||
      !studentName ||
      !subject ||
      !curriculum ||
      !classLevel ||
      !slotId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required booking details. Please select tutor, subject, curriculum, class/level, student name, and time slot.",
        },
        { status: 400 }
      );
    }

    if (parentEmail === tutorEmail) {
      return NextResponse.json(
        { error: "A tutor cannot book a lesson with themselves." },
        { status: 400 }
      );
    }

    const { data: tutorProfile, error: tutorError } = await supabase
      .from("educator_directory")
      .select("id,email,full_name,hourly_rate,subject_rates,approval_status,is_public,profile_status,timezone")
      .eq("email", tutorEmail)
      .eq("approval_status", "approved")
      .eq("is_public", true)
      .or("profile_status.is.null,profile_status.eq.active")
      .single();

    if (tutorError || !tutorProfile) {
      return NextResponse.json(
        {
          error:
            "Tutor is not approved, is hidden, suspended, removed, or is not publicly available.",
        },
        { status: 400 }
      );
    }

    const subjectRates = Array.isArray(tutorProfile.subject_rates)
      ? (tutorProfile.subject_rates as SubjectRate[])
      : [];

    const matchingPackage = findMatchingSubjectPackage(
      subjectRates,
      subject,
      curriculum
    );

    if (!matchingPackage) {
      return NextResponse.json(
        {
          error:
            "The selected subject and curriculum are not offered by this tutor. Please refresh the tutor profile and choose an available subject package.",
        },
        { status: 400 }
      );
    }

    const finalClassLevel = classLevel || getPackageClassLevel(matchingPackage);
    const finalHourlyRate = money(matchingPackage.hourly_rate);

    if (finalHourlyRate <= 0) {
      return NextResponse.json(
        {
          error:
            "This tutor subject package has no valid hourly rate. Please contact admin.",
        },
        { status: 400 }
      );
    }

    const lessonAmount = finalHourlyRate;
    const platformCommission = lessonAmount * 0.3;
    const tutorPayoutAmount = lessonAmount * 0.7;

    const { data: created, error: rpcError } = await supabase.rpc(
      "create_booking_atomic",
      {
        p_parent_email: parentEmail,
        p_tutor_email: tutorEmail,
        p_student_name: studentName,
        p_subject: subject,
        p_curriculum: curriculum,
        p_class_level: finalClassLevel,
        p_slot_id: slotId,
        p_parent_timezone: parentTimezone,
        p_hourly_rate: finalHourlyRate,
        p_lesson_amount: lessonAmount,
        p_platform_commission: platformCommission,
        p_tutor_payout_amount: tutorPayoutAmount,
      }
    );

    if (rpcError || !created) {
      console.error("Atomic booking error:", rpcError);

      return NextResponse.json(
        {
          error: extractRpcMessage(
            rpcError?.message || "Booking failed. Please choose another available time."
          ),
        },
        { status: 409 }
      );
    }

    const result = created as {
      booking: any;
      lesson: any;
      slot: any;
      pricing: {
        hourlyRate: number;
        lessonAmount: number;
        platformCommission: number;
        tutorPayoutAmount: number;
      };
    };

    const slot = result.slot || {};
    const lesson = result.lesson || {};
    const date = lesson.lesson_date || slot.date || slot.slot_date || "";
    const time =
      lesson.start_time && lesson.end_time
        ? `${String(lesson.start_time).slice(0, 5)} - ${String(
            lesson.end_time
          ).slice(0, 5)}`
        : result.booking?.time || "";

    const emailResult = await sendBookingEmails({
      parentEmail,
      tutorEmail,
      studentName,
      subject,
      curriculum,
      classLevel: finalClassLevel,
      date,
      time,
      hourlyRate: finalHourlyRate,
      lessonAmount,
      platformCommission,
      tutorPayoutAmount,
    });

    return NextResponse.json({
      success: true,
      booking: result.booking,
      lesson: result.lesson,
      pricing: result.pricing,
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
