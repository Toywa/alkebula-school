import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

function cleanText(value?: string | null) {
  return (value || "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "You must be signed in to request a reschedule." },
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

    const tutorEmail = normalizeEmail(user.email);

    const body = await request.json();

    const lessonId = cleanText(body.lessonId);
    const preferredDate = cleanText(body.preferredDate) || null;
    const preferredStartTime = cleanText(body.preferredStartTime) || null;
    const preferredEndTime = cleanText(body.preferredEndTime) || null;
    const reason = cleanText(body.reason);

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required." },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Reschedule reason is required." },
        { status: 400 }
      );
    }

    if (
      (preferredDate || preferredStartTime || preferredEndTime) &&
      (!preferredDate || !preferredStartTime || !preferredEndTime)
    ) {
      return NextResponse.json(
        {
          error:
            "If suggesting a preferred time, provide preferred date, start time, and end time.",
        },
        { status: 400 }
      );
    }

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .select(
        "id,tutor_email,parent_email,student_name,subject,curriculum,lesson_date,start_time,end_time,status"
      )
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json(
        {
          error:
            lessonError?.message ||
            "Lesson not found. Please refresh and try again.",
        },
        { status: 404 }
      );
    }

    if (normalizeEmail(lesson.tutor_email) !== tutorEmail) {
      return NextResponse.json(
        { error: "You can only request reschedules for your own lessons." },
        { status: 403 }
      );
    }

    if (lesson.status === "completed" || lesson.status === "cancelled") {
      return NextResponse.json(
        {
          error:
            "This lesson can no longer be rescheduled because it is already completed or cancelled.",
        },
        { status: 400 }
      );
    }

    const { data: existingPending } = await supabase
      .from("tutor_reschedule_requests")
      .select("id,status")
      .eq("lesson_id", lessonId)
      .eq("status", "pending")
      .maybeSingle();

    if (existingPending) {
      return NextResponse.json(
        {
          error:
            "There is already a pending reschedule request for this lesson.",
        },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("tutor_reschedule_requests").insert({
      lesson_id: lessonId,
      tutor_email: lesson.tutor_email,
      parent_email: lesson.parent_email,
      student_name: lesson.student_name,
      subject: lesson.subject,
      curriculum: lesson.curriculum,

      current_lesson_date: lesson.lesson_date,
      current_start_time: lesson.start_time,
      current_end_time: lesson.end_time,

      preferred_date: preferredDate,
      preferred_start_time: preferredStartTime,
      preferred_end_time: preferredEndTime,

      reason,
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Reschedule request submitted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create reschedule request.",
      },
      { status: 500 }
    );
  }
}