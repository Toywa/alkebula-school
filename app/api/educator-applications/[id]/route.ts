import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  sendInterviewScheduledEmail,
  sendTutorApprovedEmail,
  sendTutorRejectedEmail,
} from "@/lib/email";

const ADMIN_EMAIL = "admin@alkebulaschool.com";

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

function normalizeEmail(email?: string | null) {
  return String(email || "").trim().toLowerCase();
}

async function verifyAdmin(request: NextRequest) {
  const supabase = getAdminClient();

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return {
      ok: false,
      supabase,
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || normalizeEmail(user?.email) !== ADMIN_EMAIL) {
    return {
      ok: false,
      supabase,
      error: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }

  return {
    ok: true,
    supabase,
    error: null,
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await verifyAdmin(request);

    if (!adminCheck.ok) {
      return adminCheck.error;
    }

    const supabase = adminCheck.supabase;
    const body = await request.json();

    const action = String(body.action || "").trim();

    const { data: application, error: fetchError } = await supabase
      .from("educator_applications")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    if (action === "approve") {
      const { error: upsertError } = await supabase
        .from("educator_directory")
        .upsert(
          {
            email: application.email,
            full_name: application.full_name,
            profile_photo_url: application.profile_photo_url,
            bio: application.proposed_public_bio,
            city: application.city,
            subjects: application.subjects || [],
            curricula: application.curricula || [],
            subject_rates: application.subject_rates || [],
            hourly_rate: application.hourly_rate,
            approval_status: "approved",
            is_public: true,
          },
          {
            onConflict: "email",
          }
        );

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

      let emailResult = null;

      if (application.email) {
        emailResult = await sendTutorApprovedEmail({
          tutorEmail: application.email,
          tutorName: application.full_name || "Educator",
        });
      }

      return NextResponse.json({
        success: true,
        action: "approved",
        emailResult,
      });
    }

    if (action === "reject") {
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

      let emailResult = null;

      if (application.email) {
        emailResult = await sendTutorRejectedEmail({
          tutorEmail: application.email,
          tutorName: application.full_name || "Educator",
        });
      }

      return NextResponse.json({
        success: true,
        action: "rejected",
        emailResult,
      });
    }

    if (action === "schedule_interview") {
      if (!body.interview_at) {
        return NextResponse.json(
          { error: "Interview date and time is required." },
          { status: 400 }
        );
      }

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

      let emailResult = null;

      if (application.email) {
        emailResult = await sendInterviewScheduledEmail({
          applicantEmail: application.email,
          applicantName: application.full_name || "Applicant",
          interviewAt: body.interview_at,
          interviewNotes: body.interview_notes || "",
        });
      }

      return NextResponse.json({
        success: true,
        action: "interview_scheduled",
        emailResult,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Educator application admin route error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}