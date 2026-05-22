import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      lessonId,
      tutorEmail,
      parentEmail,
      studentName,
      subject,
      curriculum,
      currentLessonDate,
      currentStartTime,
      currentEndTime,
      preferredDate,
      preferredStartTime,
      preferredEndTime,
      reason,
    } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required." },
        { status: 400 }
      );
    }

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "Reschedule reason is required." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { error } = await supabase
      .from("tutor_reschedule_requests")
      .insert({
        lesson_id: lessonId,
        tutor_email: tutorEmail,
        parent_email: parentEmail,
        student_name: studentName,
        subject,
        curriculum,

        current_lesson_date: currentLessonDate,
        current_start_time: currentStartTime,
        current_end_time: currentEndTime,

        preferred_date: preferredDate || null,
        preferred_start_time: preferredStartTime || null,
        preferred_end_time: preferredEndTime || null,

        reason,

        status: "pending",
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
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