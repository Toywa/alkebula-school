import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      city,
      proposed_public_bio,
      subjects,
      curricula,

      referee_1_name,
      referee_1_email,
      referee_1_phone,

      referee_2_name,
      referee_2_email,
      referee_2_phone,

      profile_photo_url,
      cv_url,
      degree_certificate_url,
      high_school_certificate_url,

      declaration_no_criminal_past,
      declaration_internet_15mbps,
      declaration_has_i5_laptop,
      declaration_information_true,
    } = body;

    // ✅ BASIC VALIDATION
    if (
      !full_name ||
      !email ||
      !phone ||
      !city ||
      !referee_1_name ||
      !referee_1_email ||
      !referee_1_phone ||
      !referee_2_name ||
      !referee_2_email ||
      !referee_2_phone ||
      !profile_photo_url ||
      !cv_url ||
      !degree_certificate_url ||
      !high_school_certificate_url
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (proposed_public_bio && proposed_public_bio.length > 100) {
      return NextResponse.json(
        { error: "Proposed bio must not exceed 100 characters." },
        { status: 400 }
      );
    }

    if (!subjects || subjects.length < 1 || subjects.length > 2) {
      return NextResponse.json(
        { error: "Please select 1–2 subjects." },
        { status: 400 }
      );
    }

    if (!curricula || curricula.length < 1) {
      return NextResponse.json(
        { error: "Please select at least one curriculum." },
        { status: 400 }
      );
    }

    if (
      !declaration_no_criminal_past ||
      !declaration_internet_15mbps ||
      !declaration_has_i5_laptop ||
      !declaration_information_true
    ) {
      return NextResponse.json(
        { error: "All declarations must be accepted." },
        { status: 400 }
      );
    }

    // ✅ SAVE TO DATABASE (UNCHANGED WORKFLOW)
    const { data, error } = await supabase
      .from("educator_applications")
      .insert({
        full_name,
        email,
        phone,
        city,
        proposed_public_bio,
        subjects,
        curricula,

        referee_1_name,
        referee_1_email,
        referee_1_phone,

        referee_2_name,
        referee_2_email,
        referee_2_phone,

        profile_photo_url,
        cv_url,
        degree_certificate_url,
        high_school_certificate_url,

        declaration_no_criminal_past,
        declaration_internet_15mbps,
        declaration_has_i5_laptop,
        declaration_information_true,

        status: "pending_review", // 🔥 CRITICAL — keeps your workflow intact
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      application: data,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Application failed.",
      },
      { status: 500 }
    );
  }
}