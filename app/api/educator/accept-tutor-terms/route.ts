import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TUTOR_TERMS_VERSION = "2026-05";

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

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    const email = normalizeEmail(user?.email);

    if (userError || !email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { data: educator, error: educatorError } = await supabase
      .from("educator_directory")
      .select("id,email,approval_status")
      .eq("email", email)
      .maybeSingle();

    if (educatorError) {
      return NextResponse.json(
        { error: educatorError.message },
        { status: 500 }
      );
    }

    if (!educator) {
      return NextResponse.json(
        { error: "Approved educator profile not found." },
        { status: 404 }
      );
    }

    if (educator.approval_status !== "approved") {
      return NextResponse.json(
        { error: "Only approved educators can accept tutor terms." },
        { status: 403 }
      );
    }

    const { data, error: updateError } = await supabase
      .from("educator_directory")
      .update({
        tutor_terms_accepted: true,
        tutor_terms_accepted_at: new Date().toISOString(),
        tutor_terms_version: TUTOR_TERMS_VERSION,
      })
      .eq("email", email)
      .select(
        "id,email,tutor_terms_accepted,tutor_terms_accepted_at,tutor_terms_version"
      )
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tutor terms accepted successfully.",
      educator: data,
    });
  } catch (error) {
    console.error("Accept tutor terms error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}