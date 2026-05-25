import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

type AttendanceAction = "start" | "end" | "notes";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

function calculateDurationMinutes(startedAt?: string | null, endedAt?: string | null) {
  if (!startedAt || !endedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return null;

  return Math.max(0, Math.floor((end - start) / 60000));
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();

    const lessonId = body.lessonId as string | undefined;
    const action = body.action as AttendanceAction | undefined;
    const lessonNotes = (body.lessonNotes as string | undefined) || null;
    const homeworkNotes = (body.homeworkNotes as string | undefined) || null;

    if (!lessonId || !action) {
      return NextResponse.json(
        { error: "Lesson ID and action are required." },
        { status: 400 }
      );
    }

    if (!["start", "end", "notes"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid attendance action." },
        { status: 400 }
      );
    }

    const userEmail = normalizeEmail(user.email);
    const isAdmin = userEmail === ADMIN_EMAIL;

    const { data: lesson, error: lessonError } = await supabase
      .from("tutor_lessons")
      .select(
        "id,tutor_email,parent_email,lesson_started_at,lesson_ended_at,status,lesson_notes,homework_notes"
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

    const tutorEmail = normalizeEmail(lesson.tutor_email);

    if (!isAdmin && userEmail !== tutorEmail) {
      return NextResponse.json(
        { error: "Only the assigned tutor or admin can update this lesson." },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();

    if (action === "start") {
      if (lesson.lesson_started_at) {
        return NextResponse.json(
          { error: "This lesson has already been started." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("tutor_lessons")
        .update({
          lesson_started_at: now,
          lesson_started_by: userEmail,
          status: "in_progress",
        })
        .eq("id", lessonId)
        .select(
          "id,status,lesson_started_at,lesson_ended_at,actual_duration_minutes,lesson_notes,homework_notes,completed_by_tutor,completed_at"
        )
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Lesson started successfully.",
        lesson: data,
      });
    }

    if (action === "end") {
      if (!lesson.lesson_started_at) {
        return NextResponse.json(
          { error: "Start the lesson before ending it." },
          { status: 400 }
        );
      }

      if (lesson.lesson_ended_at) {
        return NextResponse.json(
          { error: "This lesson has already been ended." },
          { status: 400 }
        );
      }

      const duration = calculateDurationMinutes(lesson.lesson_started_at, now);

      const { data, error } = await supabase
        .from("tutor_lessons")
        .update({
          lesson_ended_at: now,
          lesson_ended_by: userEmail,
          actual_duration_minutes: duration,
          lesson_notes: lessonNotes,
          homework_notes: homeworkNotes,
          completed_by_tutor: true,
          completed_at: now,
          status: "completed",
        })
        .eq("id", lessonId)
        .select(
          "id,status,lesson_started_at,lesson_ended_at,actual_duration_minutes,lesson_notes,homework_notes,completed_by_tutor,completed_at"
        )
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Lesson ended successfully.",
        lesson: data,
      });
    }

    if (action === "notes") {
      const { data, error } = await supabase
        .from("tutor_lessons")
        .update({
          lesson_notes: lessonNotes,
          homework_notes: homeworkNotes,
        })
        .eq("id", lessonId)
        .select(
          "id,status,lesson_started_at,lesson_ended_at,actual_duration_minutes,lesson_notes,homework_notes,completed_by_tutor,completed_at"
        )
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Lesson notes saved successfully.",
        lesson: data,
      });
    }

    return NextResponse.json(
      { error: "Unsupported attendance action." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update lesson attendance.",
      },
      { status: 500 }
    );
  }
}