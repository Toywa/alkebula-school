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

function formatTimeRange(startTime?: string | null, endTime?: string | null) {
  const start = startTime || "";
  const end = endTime || "";

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  return "";
}

function isValidTimeZone(timeZone: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return asUtc - date.getTime();
}

function zonedDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  let offset = getTimeZoneOffsetMs(utcGuess, timeZone);
  let utcDate = new Date(utcGuess.getTime() - offset);

  offset = getTimeZoneOffsetMs(utcDate, timeZone);
  utcDate = new Date(utcGuess.getTime() - offset);

  return utcDate;
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
      .select("id,email,full_name,hourly_rate,subject_rates,approval_status,is_public,timezone")
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

    const { data: selectedSlot, error: slotError } = await supabase
      .from("tutor_availability_slots")
      .select("id,tutor_email,date,slot_date,start_time,end_time,is_booked,status,timezone,tutor_timezone,start_at_utc,end_at_utc")
      .eq("id", slotId)
      .single();

    if (slotError || !selectedSlot) {
      return NextResponse.json(
        { error: "Selected time slot was not found." },
        { status: 404 }
      );
    }

    if (normalizeEmail(selectedSlot.tutor_email) !== tutorEmail) {
      return NextResponse.json(
        { error: "Selected time slot does not belong to this tutor." },
        { status: 400 }
      );
    }

    if (selectedSlot.is_booked || selectedSlot.status === "booked") {
      return NextResponse.json(
        {
          error:
            "This time slot has already been booked. Please choose another available time.",
        },
        { status: 409 }
      );
    }

    const lessonDate = selectedSlot.date || selectedSlot.slot_date;
    const startTime = selectedSlot.start_time;
    const endTime = selectedSlot.end_time;
    const time = formatTimeRange(startTime, endTime);

    const tutorTimezone = cleanTimeZone(
      selectedSlot.tutor_timezone || selectedSlot.timezone || tutorProfile.timezone,
      "Africa/Nairobi"
    );

    if (!lessonDate || !startTime) {
      return NextResponse.json(
        {
          error:
            "Selected time slot is missing date or start time. Please choose another slot.",
        },
        { status: 400 }
      );
    }

    const startAtUtc =
      selectedSlot.start_at_utc ||
      zonedDateTimeToUtc(lessonDate, startTime, tutorTimezone).toISOString();

    const endAtUtc =
      selectedSlot.end_at_utc ||
      (endTime
        ? zonedDateTimeToUtc(lessonDate, endTime, tutorTimezone).toISOString()
        : null);

    if (endAtUtc && new Date(endAtUtc) <= new Date(startAtUtc)) {
      return NextResponse.json(
        {
          error:
            "Selected time slot has an invalid timezone conversion. Please choose another slot or contact admin.",
        },
        { status: 400 }
      );
    }

    const lessonAmount = finalHourlyRate;
    const platformCommission = lessonAmount * 0.3;
    const tutorPayoutAmount = lessonAmount * 0.7;

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          parent_email: parentEmail,
          tutor_email: tutorEmail,
          student_name: studentName,
          subject,
          curriculum,
          class_level: finalClassLevel,
          date: lessonDate,
          time,
          status: "booked",
          slot_id: slotId,

          start_at_utc: startAtUtc,
          end_at_utc: endAtUtc,
          tutor_timezone: tutorTimezone,
          parent_timezone: parentTimezone,

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
          curriculum,
          class_level: finalClassLevel,
          lesson_date: lessonDate,
          start_time: startTime,
          end_time: endTime,
          start_at_utc: startAtUtc,
          end_at_utc: endAtUtc,
          tutor_timezone: tutorTimezone,
          parent_timezone: parentTimezone,
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
      .eq("tutor_email", tutorEmail)
      .eq("is_booked", false);

    if (slotUpdateError) {
      console.error("Slot update error:", slotUpdateError);
      return NextResponse.json(
        {
          error:
            "Lesson was created, but the slot could not be marked as booked. Admin should review this booking.",
          booking,
          lesson,
          details: slotUpdateError.message,
        },
        { status: 500 }
      );
    }

    const emailResult = await sendBookingEmails({
      parentEmail,
      tutorEmail,
      studentName,
      subject,
      curriculum,
      classLevel: finalClassLevel,
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