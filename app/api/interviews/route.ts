import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedModes = ["online", "physical"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const applicationId = body.applicationId as string | undefined;
    const scheduledAt = body.scheduledAt as string | undefined;
    const mode = body.mode as string | undefined;
    const interviewer = body.interviewer as string | undefined;
    const notes = body.notes as string | undefined;

    if (!applicationId) {
      return NextResponse.json(
        { ok: false, error: "Missing applicationId." },
        { status: 400 }
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { ok: false, error: "Missing scheduledAt." },
        { status: 400 }
      );
    }

    if (!mode || !allowedModes.includes(mode as (typeof allowedModes)[number])) {
      return NextResponse.json(
        { ok: false, error: "Invalid interview mode." },
        { status: 400 }
      );
    }

    if (!interviewer || !interviewer.trim()) {
      return NextResponse.json(
        { ok: false, error: "Interviewer name is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .insert([
        {
          application_id: applicationId,
          scheduled_at: scheduledAt,
          mode,
          interviewer,
          notes: notes || null,
          outcome: "pending",
        },
      ])
      .select("*")
      .single();

    if (interviewError) {
      console.error("Interview insert error:", interviewError);
      return NextResponse.json(
        { ok: false, error: interviewError.message || "Failed to schedule interview." },
        { status: 500 }
      );
    }

    const { error: statusError } = await supabase
      .from("educator_applications")
      .update({ status: "interview_scheduled" })
      .eq("id", applicationId);

    if (statusError) {
      console.error("Application status update error:", statusError);
      return NextResponse.json(
        { ok: false, error: statusError.message || "Interview saved but failed to update application status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Interview scheduled successfully.",
      interview,
    });
  } catch (error) {
    console.error("Interview route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}