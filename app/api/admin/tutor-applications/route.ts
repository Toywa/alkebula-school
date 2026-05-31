import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const ADMIN_ALLOWED_EMAILS = ["admin@alkebulaschool.com"];

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

async function createSignedUrl(
  supabaseAdmin: ReturnType<typeof getAdminClient>,
  bucket: string,
  path?: string | null
) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/^\/+/, "");

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(cleanPath, 60 * 60);

  if (error) {
    console.error(`Signed URL error for ${bucket}/${cleanPath}:`, error.message);
    return null;
  }

  return data.signedUrl;
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

    const adminEmail = user.email.toLowerCase();

    if (!ADMIN_ALLOWED_EMAILS.includes(adminEmail)) {
      return NextResponse.json(
        { error: "Admin access denied." },
        { status: 403 }
      );
    }

    const { data: applications, error } = await supabaseAdmin
      .from("educator_applications")
      .select(
        `
        id,
        full_name,
        email,
        phone,
        city,
        qualification,
        years_of_experience,
        hourly_rate,
        proposed_public_bio,
        subjects,
        curricula,
        subject_rates,
        status,
        created_at,
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
        declaration_information_true
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const enrichedApplications = await Promise.all(
      (applications || []).map(async (app) => {
        const signedProfilePhotoUrl = await createSignedUrl(
          supabaseAdmin,
          "educator-profile-images",
          app.profile_photo_url
        );

        const signedCvUrl = await createSignedUrl(
          supabaseAdmin,
          "educator-documents",
          app.cv_url
        );

        const signedDegreeCertificateUrl = await createSignedUrl(
          supabaseAdmin,
          "educator-documents",
          app.degree_certificate_url
        );

        const signedHighSchoolCertificateUrl = await createSignedUrl(
          supabaseAdmin,
          "educator-documents",
          app.high_school_certificate_url
        );

        return {
          ...app,
          subjects: Array.isArray(app.subjects) ? app.subjects : [],
          curricula: Array.isArray(app.curricula) ? app.curricula : [],
          subject_rates: Array.isArray(app.subject_rates)
            ? app.subject_rates
            : [],
          signed_profile_photo_url: signedProfilePhotoUrl,
          signed_cv_url: signedCvUrl,
          signed_degree_certificate_url: signedDegreeCertificateUrl,
          signed_high_school_certificate_url: signedHighSchoolCertificateUrl,
        };
      })
    );

    return NextResponse.json({
      ok: true,
      data: enrichedApplications,
    });
  } catch (error) {
    console.error("Admin tutor applications error:", error);

    return NextResponse.json(
      { error: "Could not load tutor applications." },
      { status: 500 }
    );
  }
}