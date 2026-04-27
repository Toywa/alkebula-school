import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendInterviewScheduledEmail } from "@/lib/email";

const ADMIN_ALLOWED_EMAILS = [
  "sunscapecars@gmail.com",
  "davidmusilah@gmail.com",
];

async function getAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // safe to ignore
          }
        },
      },
    }
  );
}

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

async function requireAdmin() {
  const supabase = await getAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const email = user.email?.toLowerCase() || "";

  if (!ADMIN_ALLOWED_EMAILS.includes(email)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true };
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    return adminCheck.response;
  }

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

    return NextResponse.json({ success: true });
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