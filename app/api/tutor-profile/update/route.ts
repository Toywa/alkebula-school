import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
type SubjectRateInput = {
  curriculum_level: string;
  class_level: string;
  subject: string;
  hourly_rate: number;
};

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

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanSubjectRates(value: unknown): SubjectRateInput[] {
  if (!Array.isArray(value)) return [];

  return value.map((item: unknown) => {
    const record =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    return {
      curriculum_level: cleanString(record.curriculum_level),
      class_level: cleanString(record.class_level),
      subject: cleanString(record.subject),
      hourly_rate: Number(record.hourly_rate || 0),
    };
  });
}

export async function PATCH(request: Request) {
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
      .select("id, email, approval_status, is_public")
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

    if (editsUsed >= 3) {
      return NextResponse.json(
        {
          error:
            "You have reached your maximum of 3 profile edits for this calendar month.",
          editsUsed,
          editsRemaining: 0,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const bio = cleanString(body.bio);

    if (bio.length > 200) {
      return NextResponse.json(
        { error: "Bio must be 200 characters or fewer." },
        { status: 400 }
      );
    }

    const yearsOfExperience = Number(body.years_of_experience || 0);

    if (yearsOfExperience < 0 || yearsOfExperience > 80) {
      return NextResponse.json(
        { error: "Years of experience must be a valid number." },
        { status: 400 }
      );
    }

    const subjectRates = cleanSubjectRates(body.subject_rates);

    const invalidRate = subjectRates.find(
      (item: SubjectRateInput) =>
        !item.curriculum_level ||
        !item.subject ||
        !item.class_level ||
        !item.hourly_rate ||
        item.hourly_rate <= 0
    );

    if (invalidRate) {
      return NextResponse.json(
        {
          error:
            "Each subject package must include curriculum, class/level, subject, and a valid hourly rate.",
        },
        { status: 400 }
      );
    }

    const subjects = Array.from(
      new Set(subjectRates.map((item: SubjectRateInput) => item.subject))
    );

    const curricula = Array.from(
      new Set(
        subjectRates.map((item: SubjectRateInput) => item.curriculum_level)
      )
    );

    const classLevels = Array.from(
      new Set(subjectRates.map((item: SubjectRateInput) => item.class_level))
    );

    const lowestHourlyRate =
      subjectRates.length > 0
        ? Math.min(
            ...subjectRates.map((item: SubjectRateInput) =>
              Number(item.hourly_rate)
            )
          )
        : null;

    const updatePayload: Record<string, unknown> = {
      bio,
      qualification: cleanString(body.qualification),
      years_of_experience: yearsOfExperience,
      city: cleanString(body.city),
      timezone: cleanString(body.timezone),
      subjects,
      curricula,
      class_levels: classLevels,
      subject_rates: subjectRates,
      profile_last_edited_at: new Date().toISOString(),
    };

    if (lowestHourlyRate !== null) {
      updatePayload.hourly_rate = lowestHourlyRate;
    }

    const editedFields = Object.keys(updatePayload);

    const { error: updateError } = await supabaseAdmin
      .from("educator_directory")
      .update(updatePayload)
      .eq("id", tutor.id);

    if (updateError) {
      throw updateError;
    }

    const { error: logError } = await supabaseAdmin
      .from("tutor_profile_edit_logs")
      .insert({
        tutor_id: tutor.id,
        tutor_email: tutorEmail,
        edited_fields: editedFields,
      });

    if (logError) {
      throw logError;
    }

    return NextResponse.json({
      ok: true,
      message: "Profile updated successfully.",
      editsUsed: editsUsed + 1,
      editsRemaining: Math.max(0, 3 - (editsUsed + 1)),
    });
  } catch (error) {
    console.error("Tutor profile update error:", error);

    return NextResponse.json(
      { error: "Could not update tutor profile." },
      { status: 500 }
    );
  }
}