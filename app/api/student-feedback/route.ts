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

    const { data: submissions, error } = await supabase
      .from("homework_submissions")
      .select("*")
      .eq("student_name", studentName)
      .order("submitted_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to load feedback." },
        { status: 500 }
      );
    }

    const submissionIds = (submissions ?? []).map((s) => s.id);

    let reviews: any[] = [];
    if (submissionIds.length > 0) {
      const { data: reviewData, error: reviewsError } = await supabase
        .from("homework_reviews")
        .select("*")
        .in("submission_id", submissionIds);

      if (reviewsError) {
        return NextResponse.json(
          { ok: false, error: reviewsError.message || "Failed to load reviews." },
          { status: 500 }
        );
      }

      reviews = reviewData ?? [];
    }

    return NextResponse.json({
      ok: true,
      submissions: submissions ?? [],
      reviews,
    });
  } catch (error) {
    console.error("Student feedback route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}