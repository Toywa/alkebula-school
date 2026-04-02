import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const submissionId = body.submissionId as string | undefined;
    const educatorId = body.educatorId as string | undefined;
    const score = Number(body.score);
    const feedback = body.feedback as string | undefined;

    if (!submissionId) {
      return NextResponse.json(
        { ok: false, error: "Submission ID is required." },
        { status: 400 }
      );
    }

    if (!educatorId) {
      return NextResponse.json(
        { ok: false, error: "Educator ID is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(score) || score < 0 || score > 100) {
      return NextResponse.json(
        { ok: false, error: "Score must be a number between 0 and 100." },
        { status: 400 }
      );
    }

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { ok: false, error: "Feedback is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: review, error: reviewError } = await supabase
      .from("homework_reviews")
      .insert([
        {
          submission_id: submissionId,
          educator_id: educatorId,
          score,
          feedback,
        },
      ])
      .select("*")
      .single();

    if (reviewError) {
      return NextResponse.json(
        { ok: false, error: reviewError.message || "Failed to save review." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("homework_submissions")
      .update({ status: "reviewed" })
      .eq("id", submissionId);

    if (updateError) {
      return NextResponse.json(
        {
          ok: false,
          error: updateError.message || "Review saved but failed to update submission status.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Homework reviewed successfully.",
      review,
    });
  } catch (error) {
    console.error("Homework review route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}