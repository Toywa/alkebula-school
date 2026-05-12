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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = getAdminClient();

  const { data: tutor, error } = await supabase
    .from("educator_directory")
    .select("id, profile_photo_url, approval_status, is_public")
    .eq("id", params.id)
    .eq("approval_status", "approved")
    .eq("is_public", true)
    .single();

  if (error || !tutor?.profile_photo_url) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const path = tutor.profile_photo_url;

  if (path.startsWith("http")) {
    return NextResponse.redirect(path);
  }

  const bucketsToTry = ["educator-profile-images", "educator-documents"];

  for (const bucket of bucketsToTry) {
    const { data, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60);

    if (!signedError && data?.signedUrl) {
      return NextResponse.redirect(data.signedUrl);
    }
  }

  return NextResponse.json({ error: "Photo unavailable" }, { status: 404 });
}