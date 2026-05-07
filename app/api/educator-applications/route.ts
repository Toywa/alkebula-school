import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
          } catch {}
        },
      },
    }
  );
}

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
        { error: "Proposed public bio must not exceed 100 characters." },
        { status: 400 }
      );
    }

    if (!subjects || subjects.length < 1 || subjects.length > 2) {
      return NextResponse.json(
        { error: "Please select 1 or 2 subjects." },
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

    const { data, error } = await supabase
      .from("educator_applications")
      .insert({
        full_name,
        email,
        phone,
        city,
hourly_rate,
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
        error:
          error instanceof Error ? error.message : "Application failed.",
      },
      { status: 500 }
    );
  }
}