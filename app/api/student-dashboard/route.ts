import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentName = body.studentName as string | undefined;

    if (!studentName || !studentName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Student name is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("student_name", studentName)
      .order("scheduled_at", { ascending: true });

    if (bookingsError) {
      return NextResponse.json(
        { ok: false, error: bookingsError.message || "Failed to load bookings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      studentName,
      bookings: bookings ?? [],
    });
  } catch (error) {
    console.error("Student dashboard route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}