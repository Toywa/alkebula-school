import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const educatorId = body.educatorId as string | undefined;

    if (!educatorId || !educatorId.trim()) {
      return NextResponse.json(
        { ok: false, error: "Educator ID is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: submissions, error } = await supabase
      .from("homework_submissions")
      .select("*")
      .eq("educator_id", educatorId)
      .order("submitted_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to load homework." },
        { status: 500 }
      );
    }

    const submissionsWithUrls = await Promise.all(
      (submissions ?? []).map(async (submission) => {
        if (!submission.file_url) {
          return { ...submission, signed_url: null };
        }

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("homework-submissions")
          .createSignedUrl(submission.file_url, 60 * 30);

        return {
          ...submission,
          signed_url: signedUrlError ? null : signedUrlData?.signedUrl ?? null,
        };
      })
    );

    return NextResponse.json({
      ok: true,
      submissions: submissionsWithUrls,
    });
  } catch (error) {
    console.error("Educator homework route error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}