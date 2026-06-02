import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function cleanStoragePath(bucket: string, path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  let cleanPath = path.replace(/^\/+/, "");

  if (cleanPath.startsWith(`${bucket}/`)) {
    cleanPath = cleanPath.replace(`${bucket}/`, "");
  }

  return cleanPath;
}

async function createSignedUrl(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  bucket: string,
  path?: string | null
) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const cleanPath = cleanStoragePath(bucket, path);

  if (!cleanPath) return null;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(cleanPath, 60 * 30);

  if (error) {
    console.error(`Signed URL error for ${bucket}/${cleanPath}:`, error.message);
    return null;
  }

  return data?.signedUrl ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createAdminSupabaseClient();

    const { data: application, error: applicationError } = await supabase
      .from("educator_applications")
      .select("*")
      .eq("id", id)
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
      .eq("application_id", id)
      .order("uploaded_at", { ascending: false });

    if (documentsError) {
      return NextResponse.json(
        { ok: false, error: "Failed to load application documents." },
        { status: 500 }
      );
    }

    const docsWithUrls = await Promise.all(
      (documents ?? []).map(async (doc) => ({
        ...doc,
        signed_url: await createSignedUrl(
          supabase,
          "educator-documents",
          doc.file_url
        ),
      }))
    );

    const { data: interviews, error: interviewsError } = await supabase
      .from("interviews")
      .select("*")
      .eq("application_id", id)
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