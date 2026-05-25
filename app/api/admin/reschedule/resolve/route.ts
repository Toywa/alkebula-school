import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendRescheduleResolutionEmails } from "@/lib/reschedule-email";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

type ResolutionStatus = "resolved" | "rejected";

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

export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || normalizeEmail(user?.email) !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();

    const requestId = body.requestId as string | undefined;
    const lessonId = body.lessonId as string | undefined;
    const newDate = body.newDate as string | undefined;
    const newStartTime = body.newStartTime as string | undefined;
    const newEndTime = body.newEndTime as string | undefined;
    const adminNotes = (body.adminNotes as string | undefined) || null;
    const status = body.status as ResolutionStatus | undefined;

    if (!requestId || !lessonId || !status) {
      return NextResponse.json(
        { error: "Missing required resolution details." },
        { status: 400 }
      );
    }

    if (!["resolved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid resolution status." },
        { status: 400 }
      );
    }

    const { data: existingLesson, error: lessonLoadError } = await supabase
      .from("tutor_lessons")
      .select(
        "id,tutor_email,parent_email,student_name,subject,curriculum,lesson_date,start_time,end_time,status"
      )
      .eq("id", lessonId)
      .single();

    if (lessonLoadError || !existingLesson) {
      return NextResponse.json(
        {
          error:
            lessonLoadError?.message ||
            "The lesson linked to this request was not found.",
        },
        { status: 404 }
      );
    }

    if (status === "resolved") {
      if (!newDate || !newStartTime || !newEndTime) {
        return NextResponse.json(
          { error: "New lesson date, start time, and end time are required." },
          { status: 400 }
        );
      }

      const { error: lessonError } = await supabase
        .from("tutor_lessons")
        .update({
          lesson_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
          status: "scheduled",
        })
        .eq("id", lessonId);

      if (lessonError) {
        return NextResponse.json(
          { error: lessonError.message },
          { status: 500 }
        );
      }
    }

    const { error: requestError } = await supabase
      .from("tutor_reschedule_requests")
      .update({
        status,
        admin_notes: adminNotes,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (requestError) {
      return NextResponse.json(
        { error: requestError.message },
        { status: 500 }
      );
    }

    const emailResults = await sendRescheduleResolutionEmails({
      tutorEmail: existingLesson.tutor_email,
      parentEmail: existingLesson.parent_email,
      studentName: existingLesson.student_name,
      subject: existingLesson.subject,
      curriculum: existingLesson.curriculum,
      oldDate: existingLesson.lesson_date,
      oldStartTime: existingLesson.start_time,
      oldEndTime: existingLesson.end_time,
      newDate:
        status === "resolved" ? newDate : existingLesson.lesson_date,
      newStartTime:
        status === "resolved" ? newStartTime : existingLesson.start_time,
      newEndTime:
        status === "resolved" ? newEndTime : existingLesson.end_time,
      adminNotes,
      lessonId,
      status,
    });

    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected"
    );

    return NextResponse.json({
      success: true,
      emailNotificationsSent: failedEmails.length === 0,
      failedEmailCount: failedEmails.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to resolve request.",
      },
      { status: 500 }
    );
  }
}