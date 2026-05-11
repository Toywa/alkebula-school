import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
    const profilePhotoUrl = String(body.profile_photo_url || "").trim();

    if (!profilePhotoUrl) {
      return NextResponse.json(
        { error: "Profile photo URL is required." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();
    const email = user.email.toLowerCase();

    const { data: profile, error: profileError } = await supabase
      .from("educator_directory")
      .select("email,approval_status,profile_photo_updated_at")
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

    if (profile.profile_photo_updated_at) {
      const lastUpdate = new Date(profile.profile_photo_updated_at);

      if (sameCalendarMonth(lastUpdate, now)) {
        return NextResponse.json(
          {
            error:
              "You can update your profile picture only once per calendar month.",
          },
          { status: 400 }
        );
      }
    }

    const { error: updateError } = await supabase
      .from("educator_directory")
      .update({
        profile_photo_url: profilePhotoUrl,
        profile_photo_updated_at: now.toISOString(),
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
      profile_photo_url: profilePhotoUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Profile photo update failed.",
      },
      { status: 500 }
    );
  }
}