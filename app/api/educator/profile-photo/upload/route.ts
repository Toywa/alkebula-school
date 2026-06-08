import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET = "educator-profile-images";

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

function getExtension(file: File) {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "jpg" : "jpg";
}

function sameCalendarMonth(dateA: Date, dateB: Date) {
  return (
    dateA.getUTCFullYear() === dateB.getUTCFullYear() &&
    dateA.getUTCMonth() === dateB.getUTCMonth()
  );
}

export async function POST(request: Request) {
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

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("educator_directory")
      .select("id,email,full_name,profile_photo_updated_at,approval_status")
      .eq("email", tutorEmail)
      .eq("approval_status", "approved")
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Approved educator profile not found." },
        { status: 404 }
      );
    }

    if (profile.profile_photo_updated_at) {
      const lastUpdate = new Date(profile.profile_photo_updated_at);
      const now = new Date();

      if (sameCalendarMonth(lastUpdate, now)) {
        return NextResponse.json(
          {
            error:
              "You can update your profile picture only once per calendar month.",
          },
          { status: 429 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a valid image file." },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG and PNG images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Profile photo must be below 5MB." },
        { status: 400 }
      );
    }

    const extension = getExtension(file);
    const safeEmail = tutorEmail.replace(/[^a-zA-Z0-9]/g, "-");
    const path = `educator-${safeEmail}-${Date.now()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload profile photo." },
        { status: 500 }
      );
    }

    const updatedAt = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("educator_directory")
      .update({
        profile_photo_url: path,
        profile_photo_updated_at: updatedAt,
      })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update profile photo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Profile picture updated successfully.",
      profile_photo_url: path,
      profile_photo_updated_at: updatedAt,
    });
  } catch (error) {
    console.error("Educator profile photo upload error:", error);

    return NextResponse.json(
      { error: "Profile photo upload failed." },
      { status: 500 }
    );
  }
}
