import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInterviewScheduledEmail, sendTutorApprovedEmail } from "@/lib/email";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getAdminClient();
  const body = await request.json();

  const { data: application, error: fetchError } = await supabase
    .from("educator_applications")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  if (body.action === "approve") {
    const { error: upsertError } = await supabase
      .from("educator_directory")
      .upsert({
        email: application.email,
        full_name: application.full_name,
        profile_photo_url: application.profile_photo_url,
        bio: application.proposed_public_bio,
        city: application.city,
        subjects: application.subjects,
        curricula: application.curricula,
        hourly_rate: application.hourly_rate,
        approval_status: "approved",
        is_public: true,
      });

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("educator_applications")
      .update({ status: "approved" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const emailResult = await sendTutorApprovedEmail({
      tutorEmail: application.email,
      tutorName: application.full_name,
    });

    return NextResponse.json({
      success: true,
      emailResult,
    });
  }

  if (body.action === "reject") {
    const { error: updateError } = await supabase
      .from("educator_applications")
      .update({
        status: "rejected",
        rejection_reason: body.rejection_reason || null,
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  }

  if (body.action === "schedule_interview") {
    const { error: updateError } = await supabase
      .from("educator_applications")
      .update({
        status: "interview_scheduled",
        interview_at: body.interview_at,
        interview_notes: body.interview_notes || null,
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const emailResult = await sendInterviewScheduledEmail({
      applicantEmail: application.email,
      applicantName: application.full_name,
      interviewAt: body.interview_at,
      interviewNotes: body.interview_notes || "",
    });

    return NextResponse.json({
      success: true,
      emailResult,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}