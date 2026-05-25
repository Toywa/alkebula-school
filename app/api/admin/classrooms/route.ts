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

function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

function daysAgoISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || normalizeEmail(user?.email) !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const fromDate = daysAgoISO(14);

    const { data, error } = await supabase
      .from("tutor_lessons")
      .select(
        "id,tutor_email,parent_email,student_name,subject,curriculum,lesson_date,start_time,end_time,status,payment_status,lesson_started_at,lesson_ended_at,actual_duration_minutes,lesson_notes,homework_notes,completed_by_tutor,completed_at,lesson_started_by,lesson_ended_by"
      )
      .gte("lesson_date", fromDate)
      .order("lesson_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      lessons: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load admin classrooms.",
      },
      { status: 500 }
    );
  }
}