import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function getLevel(score: number | null) {
  if (score === null) return "unknown";
  if (score >= 70) return "green";
  if (score >= 50) return "amber";
  return "red";
}

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

    // get submissions
    const { data: submissions, error: subError } = await supabase
      .from("homework_submissions")
      .select("*")
      .eq("student_name", studentName);

    if (subError) {
      return NextResponse.json(
        { ok: false, error: subError.message },
        { status: 500 }
      );
    }

    const submissionIds = (submissions ?? []).map((s) => s.id);

    // get reviews
    const { data: reviews } = await supabase
      .from("homework_reviews")
      .select("*")
      .in("submission_id", submissionIds);

    // map reviews by submission
    const reviewMap = new Map(
      (reviews ?? []).map((r) => [r.submission_id, r])
    );

    const mastery: Record<string, any> = {};

    for (const sub of submissions ?? []) {
      const review = reviewMap.get(sub.id);
      const score = review?.score ?? null;
      const level = getLevel(score);

      if (!mastery[sub.subject]) {
        mastery[sub.subject] = {};
      }

      if (!mastery[sub.subject][sub.topic]) {
        mastery[sub.subject][sub.topic] = {};
      }

      mastery[sub.subject][sub.topic][sub.subtopic] = {
        score,
        level,
      };
    }

    return NextResponse.json({
      ok: true,
      mastery,
    });
  } catch (error) {
    console.error("Mastery route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error." },
      { status: 500 }
    );
  }
}