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

type SubjectRate = {
  curriculum_level: string;
  subject: string;
  hourly_rate: number;
};

function normalizeSubjectRates(value: unknown): SubjectRate[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;

      const curriculumLevel = String(record.curriculum_level || "").trim();
      const subject = String(record.subject || "").trim();
      const hourlyRate = Number(record.hourly_rate || 0);

      if (!curriculumLevel || !subject || hourlyRate <= 0) return null;

      return {
        curriculum_level: curriculumLevel,
        subject,
        hourly_rate: hourlyRate,
      };
    })
    .filter(Boolean) as SubjectRate[];
}

export async function GET() {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("educator_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
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
      hourly_rate,
      proposed_public_bio,

      subjects,
      curricula,
      subject_rates,

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

    const cleanedSubjectRates = normalizeSubjectRates(subject_rates);

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

    if (proposed_public_bio && proposed_public_bio.length > 150) {
      return NextResponse.json(
        { error: "Proposed public bio must not exceed 150 characters." },
        { status: 400 }
      );
    }

    if (cleanedSubjectRates.length < 1) {
      return NextResponse.json(
        {
          error:
            "Please select at least one subject and provide its hourly rate.",
        },
        { status: 400 }
      );
    }

    const categoryCounts = cleanedSubjectRates.reduce<Record<string, number>>(
      (counts, item) => {
        counts[item.curriculum_level] =
          (counts[item.curriculum_level] || 0) + 1;
        return counts;
      },
      {}
    );

    const categoryOverLimit = Object.entries(categoryCounts).find(
      ([, count]) => count > 2
    );

    if (categoryOverLimit) {
      return NextResponse.json(
        {
          error:
            "Please select a maximum of 2 subjects per curriculum category.",
        },
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

    const derivedSubjects = Array.from(
      new Set(cleanedSubjectRates.map((item) => item.subject))
    );

    const derivedCurricula = Array.from(
      new Set(cleanedSubjectRates.map((item) => item.curriculum_level))
    );

    const lowestHourlyRate = Math.min(
      ...cleanedSubjectRates.map((item) => Number(item.hourly_rate))
    );

    const { data, error } = await supabase
      .from("educator_applications")
      .insert({
        full_name,
        email,
        phone,
        city,

        hourly_rate: Number(hourly_rate || lowestHourlyRate || 0),
        proposed_public_bio,

        subjects: Array.isArray(subjects) && subjects.length > 0 ? subjects : derivedSubjects,
        curricula:
          Array.isArray(curricula) && curricula.length > 0
            ? curricula
            : derivedCurricula,

        subject_rates: cleanedSubjectRates,

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

        status: "pending_review",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      application: data,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Application failed.",
      },
      { status: 500 }
    );
  }
}