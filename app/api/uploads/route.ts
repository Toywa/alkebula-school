import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedTypes = [
  "cv",
  "certificate",
  "good_conduct",
  "id_copy",
  "profile_photo",
] as const;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const applicationId = formData.get("applicationId") as string | null;
    const documentType = formData.get("documentType") as string | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file provided." },
        { status: 400 }
      );
    }

    if (!applicationId) {
      return NextResponse.json(
        { ok: false, error: "Missing applicationId." },
        { status: 400 }
      );
    }

    if (!documentType || !allowedTypes.includes(documentType as (typeof allowedTypes)[number])) {
      return NextResponse.json(
        { ok: false, error: "Invalid document type." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFileName = file.name.replace(/\s+/g, "_");
    const filePath = `${applicationId}/${documentType}-${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("educator-documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { ok: false, error: "Failed to upload file." },
        { status: 500 }
      );
    }

    const { data: dbRecord, error: dbError } = await supabase
      .from("educator_documents")
      .insert([
        {
          application_id: applicationId,
          document_type: documentType,
          file_url: filePath,
        },
      ])
      .select("*")
      .single();

    if (dbError) {
      console.error("Document record error:", dbError);
      return NextResponse.json(
        { ok: false, error: "File uploaded but failed to save document record." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "File uploaded successfully.",
      document: dbRecord,
    });
  } catch (error) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected upload error." },
      { status: 500 }
    );
  }
}