import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();

    const { data: application, error: applicationError } = await supabase
      .from("educator_applications")
      .select("*")
      .eq("id", params.id)
      .single();

    if (applicationError || !application) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const { data: documents, error: documentsError } = await supabase
      .from("educator_documents")
      .select("*")
      .eq("application_id", params.id)
      .order("uploaded_at", { ascending: false });

    if (documentsError) {
      return NextResponse.json(
        { ok: false, error: "Failed to load application documents." },
        { status: 500 }
      );
    }

    const docsWithUrls = await Promise.all(
      (documents ?? []).map(async (doc) => {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("educator-documents")
          .createSignedUrl(doc.file_url, 60 * 30);

        return {
          ...doc,
          signed_url: signedUrlError ? null : signedUrlData?.signedUrl ?? null,
        };
      })
    );

    const { data: interviews, error: interviewsError } = await supabase
      .from("interviews")
      .select("*")
      .eq("application_id", params.id)
      .order("scheduled_at", { ascending: false });

    if (interviewsError) {
      return NextResponse.json(
        { ok: false, error: "Failed to load interviews." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      application,
      documents: docsWithUrls,
      interviews: interviews ?? [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}