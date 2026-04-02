import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { EducatorApplicationInput } from "@/lib/validations/application";

function validateInput(body: Partial<EducatorApplicationInput>) {
  const requiredStrings: Array<keyof Omit<EducatorApplicationInput, "yearsExperience" | "hourlyRate">> = [
    "fullName",
    "email",
    "phone",
    "location",
    "primarySubject",
    "curriculumExpertise",
    "teachingMode",
    "availability",
    "tscNumber",
    "referenceName",
    "referenceContact",
    "chiefName",
    "chiefContact",
    "bio",
  ];

  for (const field of requiredStrings) {
    if (!body[field] || typeof body[field] !== "string" || !body[field]?.trim()) {
      return `Missing or invalid field: ${field}`;
    }
  }

  if (
    typeof body.yearsExperience !== "number" ||
    Number.isNaN(body.yearsExperience) ||
    body.yearsExperience < 0
  ) {
    return "Missing or invalid field: yearsExperience";
  }

  if (
    typeof body.hourlyRate !== "number" ||
    Number.isNaN(body.hourlyRate) ||
    body.hourlyRate < 0
  ) {
    return "Missing or invalid field: hourlyRate";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<EducatorApplicationInput>;

    const validationError = validateInput(body);
    if (validationError) {
      return NextResponse.json(
        { ok: false, error: validationError },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("educator_applications")
      .insert([
        {
          full_name: body.fullName,
          email: body.email,
          phone: body.phone,
          location: body.location,
          primary_subject: body.primarySubject,
          curriculum_expertise: body.curriculumExpertise,
          years_experience: body.yearsExperience,
          teaching_mode: body.teachingMode,
          availability: body.availability,
          hourly_rate: body.hourlyRate,
          tsc_number: body.tscNumber,
          reference_name: body.referenceName,
          reference_contact: body.referenceContact,
          chief_name: body.chiefName,
          chief_contact: body.chiefContact,
          bio: body.bio,
          status: "submitted",
        },
      ])
      .select("id, full_name, email, status, submitted_at")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to save application." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Application submitted successfully.",
      application: data,
    });
  } catch (error) {
    console.error("Application route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}