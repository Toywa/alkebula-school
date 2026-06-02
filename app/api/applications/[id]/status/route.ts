import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  sendTutorApprovedEmail,
  sendTutorRejectedEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

const allowedStatuses = [
  "submitted",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "approved",
  "rejected",
] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const status = body.status as string;

    if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
      return NextResponse.json(
        { ok: false, error: "Invalid status." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: application, error: applicationError } = await supabase
      .from("educator_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (applicationError || !application) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const previousStatus = application.status;

    const { error: updateError } = await supabase
      .from("educator_applications")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message || "Failed to update status." },
        { status: 500 }
      );
    }

    let publishedEducator = null;

    if (status === "approved") {
      const { data: existingEducator } = await supabase
        .from("educators")
        .select("id")
        .eq("application_id", id)
        .maybeSingle();

      if (!existingEducator) {
        const { data: documents } = await supabase
          .from("educator_documents")
          .select("*")
          .eq("application_id", id)
          .eq("document_type", "profile_photo")
          .limit(1);

        const profilePhotoPath =
          documents && documents.length > 0 ? documents[0].file_url : null;

        const { data: educator, error: educatorError } = await supabase
          .from("educators")
          .insert([
            {
              application_id: application.id,
              display_name: application.full_name,
              email: application.email,
              phone: application.phone,
              profile_photo_url: profilePhotoPath,
              bio: application.bio,
              location: application.location,
              hourly_rate: application.hourly_rate,
              teaching_mode: application.teaching_mode,
              primary_subject: application.primary_subject,
              curriculum_expertise: application.curriculum_expertise,
              years_experience: application.years_experience,
              is_verified: true,
              is_active: true,
              commission_rate: 30,
            },
          ])
          .select("*")
          .single();

        if (educatorError) {
          return NextResponse.json(
            {
              ok: false,
              error:
                educatorError.message ||
                "Application approved but educator publishing failed.",
            },
            { status: 500 }
          );
        }

        publishedEducator = educator;
      }
    }

    let emailResult: unknown = null;

    if (status !== previousStatus && application.email) {
      if (status === "approved") {
        emailResult = await sendTutorApprovedEmail({
          tutorEmail: application.email,
          tutorName: application.full_name || "Educator",
        });
      }

      if (status === "rejected") {
        emailResult = await sendTutorRejectedEmail({
          tutorEmail: application.email,
          tutorName: application.full_name || "Educator",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      application: {
        id: application.id,
        full_name: application.full_name,
        email: application.email,
        status,
      },
      educator: publishedEducator,
      email: emailResult,
    });
  } catch (error) {
    console.error("Status route error:", error);

    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}