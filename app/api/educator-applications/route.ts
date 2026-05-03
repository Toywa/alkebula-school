import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function validateFileSize(file: File, label: string) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${label} must be less than 10MB.`);
  }
}

async function uploadFile(
  supabase: ReturnType<typeof getAdminClient>,
  label: string,
  file: File
) {
  validateFileSize(file, label);

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileName = `${label}-${crypto.randomUUID()}`;

  const { error } = await supabase.storage
    .from("educator-documents")
    .upload(fileName, buffer, {
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    console.error("❌ Upload error:", error.message);
    throw new Error(`Upload failed for ${label}: ${error.message}`);
  }

  return fileName;
}

export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const formData = await req.formData();

    const fullName = String(formData.get("full_name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");

    const cvFile = formData.get("cv_file") as File;
    const degreeCertificate = formData.get("degree_certificate") as File;
    const highSchoolCertificate = formData.get("high_school_certificate") as File;

    if (!cvFile || !degreeCertificate || !highSchoolCertificate) {
      return NextResponse.json(
        { error: "Missing required files" },
        { status: 400 }
      );
    }

    // 🚨 PROFILE PHOTO TEMPORARILY SKIPPED
    const profilePhotoUrl = "skipped-for-diagnosis";

    const cvUrl = await uploadFile(supabase, "cv", cvFile);
    const degreeUrl = await uploadFile(supabase, "degree", degreeCertificate);
    const highSchoolUrl = await uploadFile(supabase, "high-school", highSchoolCertificate);

    const { error } = await supabase
      .from("educator_applications")
      .insert({
        full_name: fullName,
        email,
        phone,
        profile_photo_url: profilePhotoUrl,
        cv_url: cvUrl,
        degree_certificate_url: degreeUrl,
        high_school_certificate_url: highSchoolUrl,
        status: "pending_review",
      });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Application failed",
      },
      { status: 500 }
    );
  }
}