import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type SubjectRate = {
  curriculum_level: string;
  subject: string;
  hourly_rate: number;
};

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
          } catch {}
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

function sameCalendarMonth(dateA: Date, dateB: Date) {
  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth()
  );
}

export async function PATCH(req: Request) {
  try {
    const authClient = await getAuthClient();

    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const subjectRates = normalizeSubjectRates(body.subject_rates);

    if (subjectRates.length < 1) {
      return NextResponse.json(
        { error: "Please select at least one subject and hourly rate." },
        { status: 400 }
      );
    }

    const categoryCounts = subjectRates.reduce<Record<string, number>>(
      (counts, item) => {
        counts[item.curriculum_level] =
          (counts[item.curriculum_level] || 0) + 1;
        return counts;
      },
      {}
    );

    const categoryOverLimit = Object.values(categoryCounts).some(
      (count) => count > 2
    );

    if (categoryOverLimit) {
      return NextResponse.json(
        { error: "You may select a maximum of 2 subjects per category." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const email = user.email.toLowerCase();

    const { data: profile, error: profileError } = await supabase
      .from("educator_directory")
      .select("email,approval_status,subject_rates_updated_at")
      .eq("email", email)
      .eq("approval_status", "approved")
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Approved educator profile not found." },
        { status: 403 }
      );
    }

    const now = new Date();

    if (profile.subject_rates_updated_at) {
      const lastUpdate = new Date(profile.subject_rates_updated_at);

      if (sameCalendarMonth(lastUpdate, now)) {
        return NextResponse.json(
          {
            error:
              "You can update subjects and rates only once per calendar month.",
          },
          { status: 400 }
        );
      }
    }

    const subjects = Array.from(
      new Set(subjectRates.map((item) => item.subject))
    );

    const curricula = Array.from(
      new Set(subjectRates.map((item) => item.curriculum_level))
    );

    const lowestHourlyRate = Math.min(
      ...subjectRates.map((item) => Number(item.hourly_rate))
    );

    const { error: updateError } = await supabase
      .from("educator_directory")
      .update({
        subject_rates: subjectRates,
        subjects,
        curricula,
        hourly_rate: lowestHourlyRate,
        subject_rates_updated_at: now.toISOString(),
      })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subject_rates: subjectRates,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Subject rates update failed.",
      },
      { status: 500 }
    );
  }
}