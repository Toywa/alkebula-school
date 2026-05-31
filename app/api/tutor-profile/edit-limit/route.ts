import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

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

function getMonthRange() {
  const now = new Date();

  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const supabaseAdmin = getAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const tutorEmail = user.email.toLowerCase();

    const { data: tutor, error: tutorError } = await supabaseAdmin
      .from("educator_directory")
      .select("id, email, approval_status")
      .eq("email", tutorEmail)
      .eq("approval_status", "approved")
      .single();

    if (tutorError || !tutor) {
      return NextResponse.json(
        { error: "Approved tutor profile not found." },
        { status: 404 }
      );
    }

    const { startIso, endIso } = getMonthRange();

    const { count, error: countError } = await supabaseAdmin
      .from("tutor_profile_edit_logs")
      .select("id", { count: "exact", head: true })
      .eq("tutor_id", tutor.id)
      .gte("edited_at", startIso)
      .lt("edited_at", endIso);

    if (countError) {
      throw countError;
    }

    const editsUsed = count || 0;
    const monthlyLimit = 3;
    const editsRemaining = Math.max(0, monthlyLimit - editsUsed);

    return NextResponse.json({
      ok: true,
      monthlyLimit,
      editsUsed,
      editsRemaining,
      canEdit: editsRemaining > 0,
      resetNote: "Profile edit allowance resets at the start of each calendar month.",
    });
  } catch (error) {
    console.error("Tutor edit limit error:", error);

    return NextResponse.json(
      { error: "Could not load tutor profile edit limit." },
      { status: 500 }
    );
  }
}