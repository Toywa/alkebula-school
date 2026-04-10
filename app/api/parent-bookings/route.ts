import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(request.url);
    const parentEmail = searchParams.get("parent_email");

    if (!parentEmail?.trim()) {
      return NextResponse.json(
        { error: "Missing parent_email" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("lesson_bookings")
      .select(
        "id, educator_id, parent_name, parent_email, student_name, curriculum, subject, class_level, booking_date, start_time, end_time, timezone, status, tutor_confirmation_status, admin_resolution_status, created_at"
      )
      .eq("parent_email", parentEmail.trim())
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load parent bookings",
      },
      { status: 500 }
    );
  }
}