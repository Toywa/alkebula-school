import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing tutor id" }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { data: tutor, error } = await supabase
    .from("educator_directory")
    .select("id, profile_photo_url")
    .eq("id", id)
    .eq("approval_status", "approved")
    .eq("is_public", true)
    .single();

  if (error || !tutor?.profile_photo_url) {
    return NextResponse.json(
      { error: "No profile photo found for this tutor" },
      { status: 404 }
    );
  }

  const path = tutor.profile_photo_url;

  if (path.startsWith("http")) {
    return NextResponse.redirect(path);
  }

  const buckets = ["educator-profile-images", "educator-documents"];

  for (const bucket of buckets) {
    const { data, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60);

    if (!signedError && data?.signedUrl) {
      return NextResponse.redirect(data.signedUrl);
    }
  }

  return NextResponse.json(
    {
      error: "Photo exists in database but could not be loaded from storage.",
      profile_photo_url: path,
    },
    { status: 404 }
  );
}