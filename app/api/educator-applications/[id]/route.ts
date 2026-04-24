import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type UpdatePayload = {
  action: "schedule_interview" | "reject" | "approve";
  admin_notes?: string;
  interview_at?: string;
  interview_notes?: string;
  rejection_reason?: string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdatePayload;
    const supabase = getAdminClient();

    const { data: application, error: fetchError } = await supabase
      .from("educator_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (body.action === "schedule_interview") {
      const { error } = await supabase
        .from("educator_applications")
        .update({
          status: "interview_scheduled",
          admin_notes: body.admin_notes || null,
          interview_at: body.interview_at || null,
          interview_notes: body.interview_notes || null,
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (body.action === "reject") {
      const { error } = await supabase
        .from("educator_applications")
        .update({
          status: "rejected",
          admin_notes: body.admin_notes || null,
          rejection_reason: body.rejection_reason || null,
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (body.action === "approve") {
      const { error: applicationError } = await supabase
        .from("educator_applications")
        .update({
          status: "approved",
          admin_notes: body.admin_notes || null,
        })
        .eq("id", id);

      if (applicationError) {
        return NextResponse.json({ error: applicationError.message }, { status: 500 });
      }

      const { error: upsertError } = await supabase
        .from("educator_directory")
        .upsert(
          {
            email: application.email,
            phone: application.phone,
            full_name: application.full_name,
            bio: application.proposed_public_bio,
            profile_photo_url: application.profile_photo_url,
            city: application.city,
            curricula: application.curricula,
            subjects: application.subjects,
            approval_status: "approved",
            is_public: true,
          },
          { onConflict: "email" }
        );

      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}