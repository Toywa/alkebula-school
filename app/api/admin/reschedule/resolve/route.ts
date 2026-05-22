import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
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

    if (userError || user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const body = await req.json();

    const requestId = body.requestId;
    const lessonId = body.lessonId;
    const newDate = body.newDate;
    const newStartTime = body.newStartTime;
    const newEndTime = body.newEndTime;
    const adminNotes = body.adminNotes || null;
    const status = body.status;

    if (!requestId || !lessonId || !status) {
      return NextResponse.json(
        { error: "Missing required resolution details." },
        { status: 400 }
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

    return NextResponse.json({ success: true });
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